// src/views/Reports/TrialBalance.js

import React, { useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NotificationManager from "../../components/Common/NotificationManager";

const TYPE_ORDER = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE", "OTHER"];

const TrialBalance = () => {
  const history = useHistory();
  const [loading, setLoading]                 = useState(false);
  const [reportData, setReportData]           = useState([]);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate]     = useState(null);

  // ── Search state ─────────────────────────────────────────────
  const [searchText, setSearchText]           = useState("");
  const [filterType, setFilterType]           = useState("ALL");
  const [filterNature, setFilterNature]       = useState("ALL"); // Dr / Cr / ALL
  const [filterBalance, setFilterBalance]     = useState("ALL"); // ALL / DR_ONLY / CR_ONLY

  // ── Fetch ─────────────────────────────────────────────────────
  const getTrialBalance = (startDate, endDate) => {
    setLoading(true);
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setSearchText("");
    setFilterType("ALL");
    setFilterNature("ALL");
    setFilterBalance("ALL");
    apiAuth
      .get("/api/trial-balances/", {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date:   moment(endDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        setReportData(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        NotificationManager.error("Failed to load Trial Balance");
        setReportData([]);
        setLoading(false);
      });
  };

  // ── Filtered data (search + filters applied) ──────────────────
  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return reportData.filter((row) => {
      // Text search — matches account name or group
      if (q && !row.account_name?.toLowerCase().includes(q) && !row.group?.toLowerCase().includes(q))
        return false;
      // Type filter
      if (filterType !== "ALL" && row.type !== filterType)
        return false;
      // Nature filter (Dr / Cr account)
      if (filterNature !== "ALL" && row.nature !== filterNature)
        return false;
      // Balance side filter
      if (filterBalance === "DR_ONLY" && Number(row.total_dr_amount || 0) === 0)
        return false;
      if (filterBalance === "CR_ONLY" && Number(row.total_cr_amount || 0) === 0)
        return false;
      return true;
    });
  }, [reportData, searchText, filterType, filterNature, filterBalance]);

  // ── Derived totals (from filtered data) ───────────────────────
  const grandDebit  = filteredData.reduce((s, r) => s + Number(r.total_dr_amount || 0), 0).toFixed(2);
  const grandCredit = filteredData.reduce((s, r) => s + Number(r.total_cr_amount || 0), 0).toFixed(2);
  const difference  = (parseFloat(grandDebit) - parseFloat(grandCredit)).toFixed(2);

  // ── Group filtered rows by type ───────────────────────────────
  const groupedByType = filteredData.reduce((acc, row) => {
    const key = row.type && TYPE_ORDER.includes(row.type) ? row.type : "OTHER";
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const isFiltered =
    searchText.trim() !== "" ||
    filterType !== "ALL" ||
    filterNature !== "ALL" ||
    filterBalance !== "ALL";

  const clearFilters = () => {
    setSearchText("");
    setFilterType("ALL");
    setFilterNature("ALL");
    setFilterBalance("ALL");
  };

  // ── PDF Export (uses filteredData) ────────────────────────────
  const exportToPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(18);
    doc.text("Trial Balance", doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });
    doc.setFontSize(11);
    doc.text(
      `Period: ${moment(filterStartDate).format("DD-MM-YYYY")} to ${moment(filterEndDate).format("DD-MM-YYYY")}`,
      40, 80
    );
    if (isFiltered) {
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("* Filtered view", 40, 96);
      doc.setTextColor(0);
    }
    let y = 115;

    TYPE_ORDER.forEach((type) => {
      const rows = groupedByType[type];
      if (!rows || rows.length === 0) return;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(type, 40, y);
      y += 22;
      doc.autoTable({
        head: [["Account Name", "Group", "Debit ", "Credit "]],
        body: rows.map((r) => [
          r.account_name || "Unnamed",
          r.group        || "-",
          Number(r.total_dr_amount || 0).toFixed(2),
          Number(r.total_cr_amount || 0).toFixed(2),
        ]),
        startY: y, theme: "grid",
        styles: { fontSize: 9, cellPadding: 5 },
        headStyles: { fillColor: [66, 139, 202] },
        margin: { left: 40 },
        columnStyles: { 2: { halign: "right" }, 3: { halign: "right" } },
      });
      y = (doc.lastAutoTable?.finalY || y) + 20;
    });

    doc.setFont("helvetica", "bold");
    const pw = doc.internal.pageSize.getWidth();
    doc.text(`Grand Debit:  ${grandDebit}`,  pw - 40, y,      { align: "right" });
    doc.text(`Grand Credit: ${grandCredit}`, pw - 40, y + 18, { align: "right" });
    doc.text(`Difference:   ${difference}`,  pw - 40, y + 36, { align: "right" });
    doc.save(`Trial_Balance_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  // ── Excel Export (uses filteredData) ──────────────────────────
  const exportToExcel = () => {
    let rows = [
      ["Trial Balance"],
      [`Period: ${moment(filterStartDate).format("DD-MM-YYYY")} to ${moment(filterEndDate).format("DD-MM-YYYY")}`],
      isFiltered ? ["* Filtered view"] : [],
      [],
      ["Type", "Account Name", "Group", "Debit (SAR)", "Credit (SAR)"],
    ].filter((r) => r.length > 0 || true); // keep empties for spacing

    TYPE_ORDER.forEach((type) => {
      const typeRows = groupedByType[type];
      if (!typeRows || typeRows.length === 0) return;
      rows.push([type]);
      typeRows.forEach((r) =>
        rows.push([
          "",
          r.account_name || "Unnamed",
          r.group        || "-",
          Number(r.total_dr_amount || 0).toFixed(2),
          Number(r.total_cr_amount || 0).toFixed(2),
        ])
      );
      rows.push([]);
    });

    rows.push(
      [],
      ["Grand Total Debit",  "", "", grandDebit],
      ["Grand Total Credit", "", "", grandCredit],
      ["Difference",         "", "", difference]
    );

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [{ wch: 16 }, { wch: 42 }, { wch: 26 }, { wch: 16 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `Trial_Balance_${moment().format("YYYYMMDD_HHmm")}.xlsx`
    );
  };

  // ── Styles ────────────────────────────────────────────────────
  const S = {
    page:        { padding: "16px 20px", backgroundColor: "#f1f5f9", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },
    topBar:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    title:       { margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" },
    backBtn:     { padding: "6px 14px", fontSize: "12px", fontWeight: 600, borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", color: "#475569", cursor: "pointer" },
    cardsRow:    { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" },
    card:        (bg) => ({ background: bg, borderRadius: "10px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }),
    cardLabel:   { fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "2px" },
    cardValue:   { fontSize: "20px", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" },
    cardBadge:   { fontSize: "22px", opacity: 0.22, fontWeight: 900 },
    filterPanel: { background: "#fff", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    filterRow:   { display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" },
    fGroup:      { display: "flex", flexDirection: "column", gap: "3px" },
    fLabel:      { fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    dateIn:      { padding: "7px 10px", fontSize: "13px", border: "1.5px solid #e2e8f0", borderRadius: "6px", width: "140px", color: "#1e293b" },
    genBtn:      { padding: "8px 20px", fontSize: "13px", fontWeight: 700, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
    exportRow:   { display: "flex", gap: "8px", marginLeft: "auto" },
    pdfBtn:      { padding: "7px 14px", fontSize: "12px", fontWeight: 700, background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
    xlsBtn:      { padding: "7px 14px", fontSize: "12px", fontWeight: 700, background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },

    // ── Search bar panel ──
    searchPanel: { background: "#fff", borderRadius: "10px", padding: "10px 16px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
    searchWrap:  { position: "relative", flex: "1", minWidth: "200px" },
    searchIcon:  { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "14px", pointerEvents: "none" },
    searchIn:    { width: "100%", padding: "7px 10px 7px 32px", fontSize: "13px", border: "1.5px solid #e2e8f0", borderRadius: "6px", color: "#1e293b", boxSizing: "border-box", outline: "none" },
    select:      { padding: "7px 10px", fontSize: "13px", border: "1.5px solid #e2e8f0", borderRadius: "6px", color: "#1e293b", background: "#fff", cursor: "pointer", minWidth: "130px" },
    clearBtn:    { padding: "7px 14px", fontSize: "12px", fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" },
    resultCount: { fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap", alignSelf: "center" },

    tableWrap:   { background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" },
    table:       { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    thead:       { background: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
    th:          (right) => ({ padding: "10px 14px", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "rgba(255,255,255,0.9)", textAlign: right ? "right" : "left", borderRight: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap" }),
    typeTd:      { padding: "8px 14px", fontWeight: 800, fontSize: "13px", color: "#1e40af", background: "#eff6ff", borderTop: "2px solid #bfdbfe", borderBottom: "1px solid #bfdbfe" },
    accTd:       (e) => ({ padding: "7px 14px 7px 28px", color: "#475569", background: e ? "#fafafa" : "#fff", borderBottom: "1px solid #f1f5f9" }),
    grpTd:       (e) => ({ padding: "7px 14px", color: "#94a3b8", fontSize: "12px", background: e ? "#fafafa" : "#fff", borderBottom: "1px solid #f1f5f9" }),
    numTd:       (e) => ({ padding: "7px 14px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: "#334155", background: e ? "#fafafa" : "#fff", borderBottom: "1px solid #f1f5f9", borderLeft: "1px solid #f1f5f9" }),
    dash:        { color: "#cbd5e1" },
    highlight:   { background: "#fef08a", borderRadius: "2px", padding: "0 1px" },
    grandTr:     { background: "linear-gradient(135deg,#0f172a,#1e293b)" },
    grandTd:     { padding: "10px 14px", fontWeight: 800, fontSize: "13px", color: "#e2e8f0", borderTop: "2px solid #2563eb" },
    grandNum:    { padding: "10px 14px", textAlign: "right", fontWeight: 800, fontSize: "14px", color: "#93c5fd", fontVariantNumeric: "tabular-nums", borderTop: "2px solid #2563eb", borderLeft: "1px solid rgba(255,255,255,0.08)" },
    diffTd:      { padding: "8px 14px", fontWeight: 700, fontSize: "13px", color: "#fca5a5", background: "#1e293b" },
    diffNum:     { padding: "8px 14px", textAlign: "right", fontWeight: 700, color: "#fca5a5", background: "#1e293b", fontVariantNumeric: "tabular-nums" },
    noResult:    { textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "14px" },
    empty:       { textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    spinner:     { textAlign: "center", padding: "50px 20px" },
  };

  // ── Highlight matching text ───────────────────────────────────
  const highlight = (text) => {
    if (!searchText.trim()) return text;
    const q = searchText.trim();
    const idx = text?.toLowerCase().indexOf(q.toLowerCase());
    if (!text || idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={S.highlight}>{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  // ── Render table rows ─────────────────────────────────────────
  let ri = 0;
  const renderRows = () => {
    const allRows = TYPE_ORDER.flatMap((type) => {
      const rows = groupedByType[type];
      if (!rows || rows.length === 0) return [];

      return [
        <tr key={`type-${type}`}>
          <td style={S.typeTd} colSpan={4}>▪ {type}</td>
        </tr>,
        ...rows.map((row, ai) => {
          const e  = ri++ % 2 === 0;
          const dr = Number(row.total_dr_amount || 0);
          const cr = Number(row.total_cr_amount || 0);
          return (
            <tr
              key={`row-${type}-${ai}`}
              onMouseEnter={(ev) => Array.from(ev.currentTarget.cells).forEach((c) => (c.style.background = "#e0f2fe"))}
              onMouseLeave={(ev) => Array.from(ev.currentTarget.cells).forEach((c) => (c.style.background = e ? "#fafafa" : "#fff"))}
            >
              <td style={S.accTd(e)}>{highlight(row.account_name || "Unnamed Account")}</td>
              <td style={S.grpTd(e)}>{highlight(row.group || "-")}</td>
              <td style={S.numTd(e)}>{dr !== 0 ? fmt(dr) : <span style={S.dash}>—</span>}</td>
              <td style={S.numTd(e)}>{cr !== 0 ? fmt(cr) : <span style={S.dash}>—</span>}</td>
            </tr>
          );
        }),
      ];
    });

    if (allRows.length === 0)
      return (
        <tr>
          <td colSpan={4} style={S.noResult}>
            🔍 No accounts match your search. <span style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }} onClick={clearFilters}>Clear filters</span>
          </td>
        </tr>
      );

    return allRows;
  };

  const hasData   = reportData.length > 0;
  const diff      = parseFloat(difference);
  const typeOptions = ["ALL", ...TYPE_ORDER.filter((t) => reportData.some((r) => r.type === t))];

  return (
    <div style={S.page}>

      {/* Top Bar */}
      <div style={S.topBar}>
        <h2 style={S.title}>📊 Trial Balance</h2>
        <button style={S.backBtn} onClick={() => history.goBack()}>← Back</button>
      </div>

      {/* Summary Cards */}
      <div style={S.cardsRow}>
        <div style={S.card("linear-gradient(135deg,#2563eb,#1d4ed8)")}>
          <div><div style={S.cardLabel}>Total Debit</div><div style={S.cardValue}>{grandDebit}</div></div>
          <div style={S.cardBadge}>DR</div>
        </div>
        <div style={S.card("linear-gradient(135deg,#d97706,#b45309)")}>
          <div><div style={S.cardLabel}>Total Credit</div><div style={S.cardValue}>{grandCredit}</div></div>
          <div style={S.cardBadge}>CR</div>
        </div>
        <div style={S.card(diff === 0 ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,#dc2626,#b91c1c)")}>
          <div><div style={S.cardLabel}>{diff === 0 ? "✓ Balanced" : "⚠ Difference"}</div><div style={S.cardValue}>{difference}</div></div>
          <div style={S.cardBadge}>Δ</div>
        </div>
      </div>

      {/* Date Filter Panel */}
      <div style={S.filterPanel}>
        <Formik
          initialValues={{ start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), end_date: new Date() }}
          validationSchema={Yup.object({ start_date: Yup.date().required("Required"), end_date: Yup.date().required("Required") })}
          onSubmit={(v) => getTrialBalance(v.start_date, v.end_date)}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div style={S.filterRow}>
                <div style={S.fGroup}>
                  <label style={S.fLabel}>Start Date *</label>
                  <DatePicker selected={values.start_date} onChange={(d) => setFieldValue("start_date", d)} dateFormat="dd-MM-yyyy" customInput={<input style={S.dateIn} />} maxDate={values.end_date} />
                  <ErrorMessage name="start_date" component="div" style={{ color: "#ef4444", fontSize: "11px" }} />
                </div>
                <div style={S.fGroup}>
                  <label style={S.fLabel}>End Date *</label>
                  <DatePicker selected={values.end_date} onChange={(d) => setFieldValue("end_date", d)} dateFormat="dd-MM-yyyy" customInput={<input style={S.dateIn} />} minDate={values.start_date} />
                  <ErrorMessage name="end_date" component="div" style={{ color: "#ef4444", fontSize: "11px" }} />
                </div>
                <button type="submit" style={S.genBtn} disabled={loading}>
                  {loading ? "⏳ Generating..." : "⚡ Generate"}
                </button>
                {hasData && (
                  <div style={S.exportRow}>
                    <button type="button" style={S.pdfBtn} onClick={exportToPDF}>📄 PDF</button>
                    <button type="button" style={S.xlsBtn} onClick={exportToExcel}>📊 Excel</button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* ── Search & Filter Bar (only shown when data is loaded) ── */}
      {hasData && (
        <div style={S.searchPanel}>
          {/* Text search */}
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              style={S.searchIn}
              type="text"
              placeholder="Search account name or group..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Type dropdown */}
          <div style={S.fGroup}>
            <label style={S.fLabel}>Type</label>
            <select style={S.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t === "ALL" ? "All Types" : t}</option>
              ))}
            </select>
          </div>

          {/* Nature dropdown */}
          <div style={S.fGroup}>
            <label style={S.fLabel}>Nature</label>
            <select style={S.select} value={filterNature} onChange={(e) => setFilterNature(e.target.value)}>
              <option value="ALL">All</option>
              <option value="Dr">Debit Nature</option>
              <option value="Cr">Credit Nature</option>
            </select>
          </div>

          {/* Balance side dropdown
          <div style={S.fGroup}>
            <label style={S.fLabel}>Balance</label>
            <select style={S.select} value={filterBalance} onChange={(e) => setFilterBalance(e.target.value)}>
              <option value="ALL">All Balances</option>
              <option value="DR_ONLY">Has Debit</option>
              <option value="CR_ONLY">Has Credit</option>
            </select>
          </div> */}

          {/* Result count + clear */}
          <span style={S.resultCount}>
            {filteredData.length} of {reportData.length} accounts
          </span>
          {isFiltered && (
            <button style={S.clearBtn} onClick={clearFilters}>✕ Clear</button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={S.spinner}>
          <div className="spinner-border text-primary" role="status" />
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>Loading Trial Balance...</p>
        </div>
      ) : hasData ? (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th(false)}>Account Name</th>
                <th style={S.th(false)}>Group</th>
                <th style={{ ...S.th(true), width: "150px" }}>Debit (SAR)</th>
                <th style={{ ...S.th(true), width: "150px", borderRight: "none" }}>Credit (SAR)</th>
              </tr>
            </thead>
            <tbody>
              {renderRows()}
              <tr style={S.grandTr}>
                <td style={S.grandTd} colSpan={2}>
                  Grand Total {isFiltered && <span style={{ fontSize: "11px", opacity: 0.7 }}>(filtered)</span>}
                </td>
                <td style={S.grandNum}>{grandDebit}</td>
                <td style={S.grandNum}>{grandCredit}</td>
              </tr>
              {diff !== 0 && (
                <tr>
                  <td style={S.diffTd} colSpan={2}>⚠ Difference (Unbalanced)</td>
                  <td style={S.diffNum} colSpan={2}>{difference}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={S.empty}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            Select a date range and click <strong>Generate</strong> to view the Trial Balance.
          </div>
        </div>
      )}
    </div>
  );
};

export default TrialBalance;