import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import Select from "react-select";
import NotificationManager from "../../components/Common/NotificationManager";

const DayBookReport = () => {
  const [loading, setLoading]               = useState(false);
  const [reports, setReports]               = useState([]);
  const [summary, setSummary]               = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate]   = useState(null);
  const [selectedType, setSelectedType]     = useState(null);

  const history = useHistory();

  const voucherTypeOptions = [
    { label: "All Transactions",  value: "" },
    { label: "Sales Invoice",     value: "Sales" },
    { label: "Purchase Invoice",  value: "Purchase" },
    { label: "Journal Voucher",   value: "Journal" },
    { label: "Payment Voucher",   value: "Payment" },
    { label: "Receipt Voucher",   value: "Receipt" },
    { label: "Credit Note",       value: "CreditNote" },
    { label: "Debit Note",        value: "DebitNote" },
  ];

  const getReport = (startDate, endDate, type = "") => {
    setLoading(true);
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);

    apiAuth
      .get("/api/daybook/", {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date:   moment(endDate).format("YYYY-MM-DD"),
          type,
        },
      })
      .then((res) => {
        setReports(res.data.entries || []);
        setSummary(res.data.summary || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Day Book Error:", err);
        NotificationManager.error("Failed to load Day Book");
        setLoading(false);
      });
  };

  // ── Balance cell renderer ─────────────────────────────────────────────────
  // running_balance is signed (positive = Dr, negative = Cr)
  const BalanceCell = ({ row }) => {
    const signed = Number(row.running_balance || 0);
    const abs    = Math.abs(signed).toFixed(2);
    const side   = signed >= 0 ? "Dr" : "Cr";
    const color  = signed >= 0 ? "#1565c0" : "#c62828";   // blue Dr / red Cr
    return (
      <span style={{ color, fontWeight: 600, fontFamily: "monospace" }}>
        {abs}&nbsp;<small>{side}</small>
      </span>
    );
  };

  // ── Summary card helper ───────────────────────────────────────────────────
  const SummaryCard = ({ title, value, side, bg }) => (
    <div className={`card ${bg} text-white shadow-sm`}>
      <div className="card-body py-3">
        <h6 className="card-title mb-1">{title}</h6>
        <h4 className="mb-0">
          {Number(value || 0).toFixed(2)}
          {side && <small className="ms-2" style={{ fontSize: "0.7em" }}>{side}</small>}
        </h4>
      </div>
    </div>
  );

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      name:     "Date",
      selector: (row) => moment(row.date).format("DD-MM-YYYY"),
      sortable: true,
      width:    "110px",
    },
    {
      name:     "Voucher Type",
      selector: (row) => row.voucher_type,
      sortable: true,
      width:    "135px",
    },
    {
      name:     "Voucher No",
      selector: (row) => row.voucher_no || "-",
      sortable: true,
      width:    "125px",
    },
    {
      name:     "Account",
      selector: (row) => row.account || "-",
      sortable: true,
      wrap:     true,
      width:    "220px",
    },
    {
      name:     "Narration",
      selector: (row) => row.narration || "",
      wrap:     true,
      minWidth: "200px",
    },
    {
      name:     "Debit",
      selector: (row) => Number(row.debit  || 0).toFixed(2),
      sortable: true,
      right:    true,
      width:    "110px",
    },
    {
      name:     "Credit",
      selector: (row) => Number(row.credit || 0).toFixed(2),
      sortable: true,
      right:    true,
      width:    "110px",
    },
    {
      // ── Single Running Balance column ──────────────────────────────────────
      // Rule: running_balance += Debit - Credit  (standard Day Book / Cash Book)
      // Positive = Dr  |  Negative = Cr
      name:    "Balance",
      right:   true,
      width:   "130px",
      cell:    (row) => <BalanceCell row={row} />,
      sortable: true,
      selector: (row) => Number(row.running_balance || 0),
    },
  ];

  // ── Export PDF ────────────────────────────────────────────────────────────
  const exportToPdf = () => {
    if (!reports.length) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Day Book Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(
      `Period : ${moment(filterStartDate).format("DD-MM-YYYY")}  to  ${moment(filterEndDate).format("DD-MM-YYYY")}`,
      14, 25
    );
    doc.text(
      `Type   : ${selectedType?.label || "All Transactions"}`,
      14, 31
    );

    if (summary) {
      doc.text(`Total Debit : ${Number(summary.total_debit  || 0).toFixed(2)}`, 14,  39);
      doc.text(`Total Credit: ${Number(summary.total_credit || 0).toFixed(2)}`, 80,  39);
      doc.text(
        `Closing Bal : ${Number(summary.closing_balance || 0).toFixed(2)} ${summary.closing_balance_side || ""}`,
        150, 39
      );
    }

    doc.autoTable({
      head: [["Date", "Voucher Type", "Voucher No", "Account", "Narration", "Debit", "Credit", "Balance"]],
      body: reports.map((row) => {
        const signed = Number(row.running_balance || 0);
        return [
          moment(row.date).format("DD-MM-YYYY"),
          row.voucher_type,
          row.voucher_no   || "-",
          row.account      || "-",
          row.narration    || "",
          Number(row.debit  || 0).toFixed(2),
          Number(row.credit || 0).toFixed(2),
          `${Math.abs(signed).toFixed(2)} ${signed >= 0 ? "Dr" : "Cr"}`,
        ];
      }),
      startY: 48,
      styles:     { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 100, 180], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 28 },
        2: { cellWidth: 24 },
        3: { cellWidth: 38 },
        4: { cellWidth: "auto" },
        5: { cellWidth: 20, halign: "right" },
        6: { cellWidth: 20, halign: "right" },
        7: { cellWidth: 24, halign: "right" },
      },
      margin: { left: 10, right: 10 },
    });

    doc.save(`DayBook_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  // ── Export Excel ──────────────────────────────────────────────────────────
  const exportToExcel = () => {
    if (!reports.length) return;

    const excelData = reports.map((row) => {
      const signed = Number(row.running_balance || 0);
      return {
        Date:           moment(row.date).format("DD-MM-YYYY"),
        "Voucher Type": row.voucher_type,
        "Voucher No":   row.voucher_no   || "-",
        Account:        row.account      || "-",
        Narration:      row.narration    || "",
        Debit:          Number(row.debit  || 0).toFixed(2),
        Credit:         Number(row.credit || 0).toFixed(2),
        Balance:        `${Math.abs(signed).toFixed(2)} ${signed >= 0 ? "Dr" : "Cr"}`,
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Day Book");
    const buf  = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    FileSaver.saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `DayBook_${moment().format("YYYYMMDD_HHmm")}.xlsx`
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-content">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Day Book Report</h2>
        <button className="btn btn-secondary" onClick={() => history.goBack()}>
          Back
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <SummaryCard title="Total Debit"   value={summary?.total_debit}   bg="bg-info"    />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Total Credit"  value={summary?.total_credit}  bg="bg-warning" />
        </div>
        <div className="col-md-3">
          <SummaryCard
            title="Difference (Dr − Cr)"
            value={summary?.difference}
            bg="bg-danger"
          />
        </div>
        <div className="col-md-3">
          <SummaryCard
            title="Closing Balance"
            value={summary?.closing_balance}
            side={summary?.closing_balance_side}
            bg="bg-success"
          />
        </div>
      </div>

      {/* Filter Form */}
      <Formik
        initialValues={{
          start_date:   new Date(new Date().setMonth(new Date().getMonth() - 1)),
          end_date:     new Date(),
          voucher_type: null,
        }}
        validationSchema={Yup.object({
          start_date: Yup.date().required("Start date is required"),
          end_date:   Yup.date().required("End date is required"),
        })}
        onSubmit={(values) => {
          setSelectedType(values.voucher_type);
          getReport(values.start_date, values.end_date, values.voucher_type?.value || "");
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item lg={3} md={6} xs={12}>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={values.start_date}
                  onChange={(d) => setFieldValue("start_date", d)}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  maxDate={values.end_date}
                />
              </Grid>

              <Grid item lg={3} md={6} xs={12}>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={values.end_date}
                  onChange={(d) => setFieldValue("end_date", d)}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  minDate={values.start_date}
                />
              </Grid>

              <Grid item lg={3} md={6} xs={12}>
                <label className="form-label">Voucher Type</label>
                <Select
                  options={voucherTypeOptions}
                  value={values.voucher_type}
                  onChange={(opt) => setFieldValue("voucher_type", opt)}
                  placeholder="All Transactions"
                  isClearable
                />
              </Grid>

              <Grid item lg={3} md={6} xs={12}>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Generating...</>
                  ) : (
                    "Generate Day Book"
                  )}
                </button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Loading Day Book...</p>
          </div>
        ) : reports.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={reports}
              customStyles={customStyles}
              pagination
              paginationPerPage={25}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              highlightOnHover
              className="shadow-sm"
            />

            <div className="mt-3 d-flex gap-3">
              <button className="btn btn-primary" onClick={exportToPdf}>
                <i className="fas fa-file-pdf me-2" />Download PDF
              </button>
              <button className="btn btn-success" onClick={exportToExcel}>
                <i className="fas fa-file-excel me-2" />Download Excel
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-info text-center">
            No transactions found for the selected period and filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default DayBookReport;