import React, { useEffect, useState, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import Select from "react-select";

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------
const fmtAmount = (v) =>
  Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const typeBadgeClass = (type = "") => {
  const t = String(type).toLowerCase();
  if (t.includes("receipt")) return "bg-soft-success text-success";
  if (t.includes("payment")) return "bg-soft-danger text-danger";
  if (t.includes("sales")) return "bg-soft-primary text-primary";
  if (t.includes("purchase")) return "bg-soft-warning text-warning";
  if (t.includes("journal")) return "bg-soft-info text-info";
  if (t.includes("credit") || t.includes("debit")) return "bg-soft-secondary text-secondary";
  return "bg-soft-dark text-dark";
};

const ledgerTableStyles = {
  table: { style: { backgroundColor: "#fff" } },
  headRow: {
    style: {
      backgroundColor: "#f3f6f9",
      borderBottom: "1px solid #e9ebec",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "#495057",
      paddingLeft: "14px",
      paddingRight: "14px",
    },
  },
  rows: {
    style: {
      fontSize: "13px",
      color: "#212529",
      minHeight: "46px",
      borderBottom: "1px solid #eff2f7",
      "&:hover": { backgroundColor: "#f8f9fb" },
    },
    stripedStyle: { backgroundColor: "#fcfcfd" },
  },
  cells: {
    style: {
      paddingLeft: "14px",
      paddingRight: "14px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e9ebec",
      fontSize: "13px",
      color: "#495057",
    },
  },
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
    boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13,110,253,.25)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#86b7fe" : "#adb5bd" },
  }),
  menu: (base) => ({ ...base, zIndex: 20 }),
};

const LedgerStatement = () => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);
  const [coaOptions, setCoaOptions] = useState([]);
  const [selectCoa, setSelectedCoa] = useState(null);
  const [params, setParams] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [drAmount, setDrAmount] = useState(0.0);
  const [crAmount, setCrAmount] = useState(0.0);
  const [searchText, setSearchText] = useState("");
  const [period, setPeriod] = useState({ st: null, et: null });
  const [hasGenerated, setHasGenerated] = useState(false);

  // Build one searchable string per row containing every raw field value plus
  // the values as they are displayed in the table (formatted date, 2-decimal
  // amounts), so a user can type anything they see on screen or in the data.
  const rowSearchText = (row) => {
    const parts = Object.values(row || {}).map((v) =>
      v === null || v === undefined ? "" : String(v)
    );
    if (row?.date) {
      parts.push(moment(row.date).format("DD-MM-YYYY"));
      parts.push(moment(row.date).format("DD-MM-YYYY HH:mm:ss"));
    }
    ["fcy_amount", "vat_amount", "amount", "dr_amount", "cr_amount", "net_amount"].forEach((k) => {
      if (row?.[k] !== undefined && row?.[k] !== null && row?.[k] !== "") {
        parts.push(Number(row[k] || 0).toFixed(2));
        parts.push(fmtAmount(row[k]));
      }
    });
    return parts.join(" | ").toLowerCase();
  };

  // Every whitespace-separated term must appear somewhere in the row.
  const filteredReports = useMemo(() => {
    const terms = searchText.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return reports;
    return reports.filter((row) => {
      const haystack = rowSearchText(row);
      return terms.every((t) => haystack.includes(t));
    });
  }, [reports, searchText]);

  // ---------------------------------------------------------------------------
  // Table columns
  // ---------------------------------------------------------------------------
  const ellipsis = (text, max = 220) => (
    <span
      title={text || ""}
      style={{
        display: "inline-block",
        maxWidth: `${max}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {text || "-"}
    </span>
  );

  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          <div className="fw-medium">{moment(row.date).format("DD-MM-YYYY")}</div>
          <small className="text-muted">{moment(row.date).format("HH:mm")}</small>
        </div>
      ),
    },
    {
      name: "Account",
      selector: (row) => row.account,
      sortable: true,
      minWidth: "220px",
      grow: 1.5,
      cell: (row) => ellipsis(row.account, 260),
    },
    {
      name: "Type",
      selector: (row) => row?.type,
      sortable: true,
      width: "140px",
      cell: (row) =>
        row?.type ? (
          <span className={`badge ${typeBadgeClass(row.type)}`}>{row.type}</span>
        ) : (
          "-"
        ),
    },
    {
      name: "Voucher",
      selector: (row) => row?.voucher,
      sortable: true,
      width: "130px",
      cell: (row) => ellipsis(row?.voucher, 110),
    },
    {
      name: "Invoice No",
      selector: (row) => row.invoice_number,
      sortable: true,
      width: "130px",
      cell: (row) => ellipsis(row.invoice_number, 110),
    },
    {
      name: "Charge",
      selector: (row) => row?.charge,
      sortable: true,
      width: "160px",
      cell: (row) => ellipsis(row?.charge, 140),
    },
    {
      name: "Job No",
      selector: (row) => row?.job_no,
      sortable: true,
      width: "120px",
      cell: (row) => ellipsis(row?.job_no, 100),
    },
    {
      name: "Party Account",
      selector: (row) => row?.party_account,
      sortable: true,
      minWidth: "180px",
      cell: (row) => ellipsis(row?.party_account, 200),
    },
    {
      name: "Narration",
      selector: (row) => row?.narrations,
      minWidth: "240px",
      grow: 2,
      cell: (row) => ellipsis(row?.narrations, 320),
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "FCY Amount",
      selector: (row) => Number(row?.fcy_amount || 0),
      sortable: true,
      right: true,
      width: "130px",
      cell: (row) => fmtAmount(row?.fcy_amount),
    },
    {
      name: "VAT %",
      selector: (row) => row?.vat_percent,
      sortable: true,
      right: true,
      width: "90px",
      cell: (row) => (row?.vat_percent ?? "-"),
    },
    {
      name: "VAT Amount",
      selector: (row) => Number(row?.vat_amount || 0),
      sortable: true,
      right: true,
      width: "130px",
      cell: (row) => fmtAmount(row?.vat_amount),
    },
    {
      name: "Amount",
      selector: (row) => Number(row?.amount || 0),
      sortable: true,
      right: true,
      width: "130px",
      cell: (row) => fmtAmount(row?.amount),
    },
    {
      name: "Debit",
      selector: (row) => Number(row.dr_amount || 0),
      sortable: true,
      right: true,
      width: "130px",
      cell: (row) => (
        <span className={Number(row.dr_amount) ? "text-success fw-medium" : "text-muted"}>
          {fmtAmount(row.dr_amount)}
        </span>
      ),
    },
    {
      name: "Credit",
      selector: (row) => Number(row.cr_amount || 0),
      sortable: true,
      right: true,
      width: "130px",
      cell: (row) => (
        <span className={Number(row.cr_amount) ? "text-danger fw-medium" : "text-muted"}>
          {fmtAmount(row.cr_amount)}
        </span>
      ),
    },
    {
      name: "Balance",
      selector: (row) => Number(row?.net_amount || 0),
      sortable: true,
      right: true,
      width: "140px",
      cell: (row) => <span className="fw-semibold">{fmtAmount(row?.net_amount)}</span>,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
      width: "130px",
      cell: (row) => ellipsis(row.branch, 110),
    },
  ];

  const exportProjectToPdf = () => {
    const doc = new jsPDF();
    const data = reports;

    doc.text("General Ledger Statement", 70, 10);
    doc.text(`Account: ${selectCoa?.label || selectedJob?.label}`, 12, 22);
    doc.text(`Total Debit: ${Number(drAmount).toFixed(2)}`, 12, 32);
    doc.text(`Total Credit: ${Number(crAmount).toFixed(2)}`, 80, 32);
    doc.text(`Balance: ${totalAmount}`, 144, 32);
    // console.log("selecccc", selectCoa);

    const allKeys = Array.from(
      new Set(data.flatMap((obj) => Object.keys(obj)))
    );

    const customHeaderTitles = [
      // "Account",
      "Date",
      "Voucher",
      "Charge",
      // "Type",
      // "Branch",
      "Invoice",
      // "Currency",
      // "Tax Code",
      // "Fcy Amount",
      // "Vat Amount",
      "Amount",
      "Narrations",
      // "Party Account",
      // "Job No",
      "Dr Amount",
      "Cr Amount",
      "Balance",
      // "Branch",
      // "Language Name",
    ];
    const columns = allKeys.map((key, index) => ({
      header: customHeaderTitles[index],
      dataKey: key,
    }));
    doc.autoTable({
      head: [columns.map((column) => column.header)],
      body: data.map((row) => {
        return [
          // row?.account,
          moment(row?.date).format("DD-MM-YYYY"),
          // row?.type,
          row?.voucher,
          row?.charge,
          row?.invoice_number,
          // row?.currency,
          // row?.vat_percent,
          // row?.fcy_amount,
          // Number(row?.vat_amount).toFixed(2),
          Number(row?.amount).toFixed(2),
          row?.narrations,
          // row?.party_account,
          // row?.job_no,
          Number(row?.dr_amount).toFixed(2),
          Number(row?.cr_amount).toFixed(2),
          Number(row?.net_amount).toFixed(2),
          // row?.branch,
          // row?.language_name,
        ];
      }),
      startY: 35,
      styles: {
        font: "Arial",
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 16 },
        2: { cellWidth: 23, fontSize: 8 },
        3: { cellWidth: 19 },
        4: { cellWidth: 19 },
        5: { cellWidth: 33, fontSize: 8 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 },
        8: { cellWidth: 22 },
      },
      // margin: { left: 10, right: 10 },
    });

    doc.autoTable({
      head: [["Total Debit", "Total Credit", "Balance"]],
      body: [
        [Number(drAmount).toFixed(2), Number(crAmount).toFixed(2), totalAmount],
      ],
      styles: {
        font: "Arial",
        fontSize: 11,
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 24 },
        2: { cellWidth: 22 },
      },
      margin: { left: 144, right: 10 },
    });

    doc.save("ledger_statement.pdf");
  };

  const exportData = () => {
    let apiData = reports.map((report) => {
      let dataReport = {
        Account: report?.account,
        Date: moment(report?.date).format("DD-MM-YYYY"),
        Type: report?.type,
        "Voucher No": report?.voucher,
        Charge: report?.charge,
        "Invoice No": report?.invoice_number,
        Currency: report?.currency,
        "Tax Code": report?.vat_percent,
        "Fcy Amount": report?.fcy_amount.toFixed(2),
        "Vat Amount": report?.vat_amount.toFixed(2),
        Amount: report?.amount.toFixed(2),
        "Dr Amount": report?.dr_amount.toFixed(2),
        "Cr Amount": report?.cr_amount.toFixed(2),
        Balance: report?.net_amount.toFixed(2),
        "Party Account": report?.party_account,
        "Job No": report?.job_no,
        Narrations: report?.narrations,
        Branch: report?.branch,
        // "Language Name": report?.language_name,
      };
      // console.log("wwwwwwww", report?.dr_amount, report?.cr_amount);
      return dataReport;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "Ledger Statement Data";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const getReport = (id, st, et, jobId) => {
    setLoading(true);
    setSearchText("");
    setPeriod({ st, et });
    setHasGenerated(true);
    apiAuth
      .get(
        `/api/general/ledger/?start_date=${st}&end_date=${et}${
          id ? `&coa=${id}` : ""
        }${jobId ? `&job=${jobId}` : ""}`
      )
      .then((res) => {
        const { data } = res;
        let total_amount = 0;

        if (data.length > 0) {
          total_amount = data[data.length - 1]["net_amount"];
        }

        let dr_amount = data.reduce((x, y) => {
          return Number(x) + Number(y.dr_amount);
        }, 0);

        let cr_amount = data.reduce((x, y) => {
          return Number(x) + Number(y.cr_amount);
        }, 0);

        setTotalAmount(total_amount.toFixed(2));
        setDrAmount(dr_amount.toFixed(2));
        setCrAmount(cr_amount.toFixed(2));
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    const formattedDate = parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return formattedDate;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const coa = searchParams.get("coa") || null;
    const st = searchParams.get("st");
    const et = searchParams.get("et");
    const dd = {
      coa: coa,
      st: st,
      et: et,
    };
    setParams(dd);
    getAccounts(coa);
    getJobOptions();

    setTimeout(() => {
      if (coa) {
        getReport(coa, st, et);
      }
    }, 500);
  }, []);

  const getAccounts = (coa = null) => {
    apiAuth
      .get(`/api/master/coa/`)
      .then((response) => {
        let data = response.data;
        let CoaOpts = data.map((account, index) => {
          return {
            label: `${account.code}-${account.name} `,
            value: account.id,
          };
        });
        if (coa) {
          const sel = CoaOpts.find((dd) => dd?.value === Number(coa));
          setSelectedCoa(sel);
        }
        setCoaOptions(CoaOpts);
        // setAccounts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const getJobOptions = (val) => {
    apiAuth
      .get(`/api/master/job/?&type=Job`)
      .then((res) => {
        const { data } = res;
        let jobOpts = data.map((opt) => {
          return {
            label: opt?.job_number,
            value: opt?.id,
          };
        });

        setJobOptions(jobOpts);
      })
      .catch((err) => console.log(err));
  };

  // ---------------------------------------------------------------------------
  // Derived labels
  // ---------------------------------------------------------------------------
  const accountLabel = selectCoa?.label?.trim() || "All Accounts";
  const jobLabel = selectedJob?.label || null;
  const periodLabel =
    period.st && period.et
      ? `${moment(period.st).format("DD MMM YYYY")} - ${moment(period.et).format("DD MMM YYYY")}`
      : null;

  // When a search is active the cards describe only the matching rows:
  // debit/credit are summed from the filtered rows and the balance is their net.
  const isFiltered = searchText.trim() !== "";
  const filteredTotals = useMemo(() => {
    const dr = filteredReports.reduce((sum, r) => sum + Number(r.dr_amount || 0), 0);
    const cr = filteredReports.reduce((sum, r) => sum + Number(r.cr_amount || 0), 0);
    return { dr, cr, net: dr - cr };
  }, [filteredReports]);

  const displayDr = isFiltered ? filteredTotals.dr : Number(drAmount);
  const displayCr = isFiltered ? filteredTotals.cr : Number(crAmount);
  const displayClosing = isFiltered ? filteredTotals.net : Number(totalAmount);
  const closingIsDebit = displayClosing >= 0;

  const summaryCards = [
    {
      label: "Total Debit",
      value: fmtAmount(displayDr),
      icon: "ri-arrow-up-circle-line",
      tone: "success",
      hint: isFiltered ? "Debit of matching entries" : "Sum of all debit entries",
    },
    {
      label: "Total Credit",
      value: fmtAmount(displayCr),
      icon: "ri-arrow-down-circle-line",
      tone: "danger",
      hint: isFiltered ? "Credit of matching entries" : "Sum of all credit entries",
    },
    {
      label: isFiltered ? "Net Balance" : "Closing Balance",
      value: `${fmtAmount(Math.abs(displayClosing))} ${closingIsDebit ? "Dr" : "Cr"}`,
      icon: "ri-scales-3-line",
      tone: "primary",
      hint: isFiltered ? "Debit minus credit of matching entries" : "Running balance at period end",
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        {/* Page header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h4 className="mb-1 fw-semibold">Ledger Statement</h4>
            <p className="text-muted mb-0">
              General ledger entries by account, job and period
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-light border"
              onClick={() => history.goBack()}
            >
              <i className="ri-arrow-left-line align-middle me-1"></i> Back
            </button>
            {reports.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={exportProjectToPdf}
                >
                  <i className="ri-file-pdf-line align-middle me-1"></i> PDF
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={exportData}
                >
                  <i className="ri-file-excel-2-line align-middle me-1"></i> Excel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters card */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-bottom d-flex align-items-center">
            <i className="ri-filter-3-line text-primary fs-16 me-2"></i>
            <h5 className="card-title mb-0">Report Filters</h5>
          </div>
          <div className="card-body">
            <Formik
              enableReinitialize={params?.coa !== null ? true : false}
              initialValues={{
                start_time: params?.st ? new Date(params?.st) : new Date(),
                end_time: params?.et ? new Date(params?.et) : new Date(),
                coa_type: params?.coa || "",
                job: "",
              }}
              validationSchema={Yup.object({})}
              onSubmit={(values) => {
                const st = changeDateFormat(values.start_time);
                const et = changeDateFormat(values.end_time);
                getReport(
                  selectCoa ? values?.coa_type : null,
                  st,
                  et,
                  selectedJob ? values?.job : null
                );
              }}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="row g-3 align-items-end">
                    <div className="col-xl-3 col-md-6">
                      <label htmlFor="job" className="form-label fw-medium">
                        Job
                      </label>
                      <Select
                        name="job"
                        isClearable
                        styles={selectStyles}
                        value={selectedJob}
                        options={jobOptions}
                        onChange={(data) => {
                          setFieldValue("job", data?.value);
                          setSelectedJob(data);
                        }}
                        placeholder="All jobs"
                      />
                    </div>

                    <div className="col-xl-3 col-md-6">
                      <label htmlFor="coa_type" className="form-label fw-medium">
                        Account (COA)
                      </label>
                      <Select
                        name="coa_type"
                        isClearable
                        styles={selectStyles}
                        value={selectCoa}
                        options={coaOptions}
                        onChange={(data) => {
                          setFieldValue("coa_type", data?.value);
                          setSelectedCoa(data);
                        }}
                        placeholder="All accounts"
                      />
                    </div>

                    <div className="col-xl-2 col-md-6">
                      <label htmlFor="start_time" className="form-label fw-medium">
                        From <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <DatePicker
                          selected={values["start_time"]}
                          onChange={(date) => setFieldValue("start_time", date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="dd MMM yyyy HH:mm"
                          className="form-control pe-5"
                          wrapperClassName="w-100"
                          maxDate={values["end_time"]}
                        />
                        <i className="ri-calendar-line text-muted position-absolute top-50 end-0 translate-middle-y me-3"></i>
                      </div>
                    </div>

                    <div className="col-xl-2 col-md-6">
                      <label htmlFor="end_time" className="form-label fw-medium">
                        To <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <DatePicker
                          selected={values["end_time"]}
                          onChange={(date) => setFieldValue("end_time", date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="dd MMM yyyy HH:mm"
                          className="form-control pe-5"
                          wrapperClassName="w-100"
                          minDate={values["start_time"]}
                        />
                        <i className="ri-calendar-line text-muted position-absolute top-50 end-0 translate-middle-y me-3"></i>
                      </div>
                    </div>

                    <div className="col-xl-2 col-md-12 d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-play-circle-line align-middle me-1"></i> Generate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Summary cards */}
        {reports.length > 0 && (
          <div className="row g-3 mb-4">
            {summaryCards.map((c) => (
              <div className="col-xl-4 col-md-6" key={c.label}>
                <div className="card shadow-sm border-0 h-100 mb-0">
                  <div className="card-body d-flex align-items-center">
                    <div className="avatar-sm flex-shrink-0 me-3">
                      <span className={`avatar-title rounded fs-3 bg-soft-${c.tone} text-${c.tone}`}>
                        <i className={c.icon}></i>
                      </span>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted mb-1 fs-12">
                        {c.label}
                        {isFiltered && (
                          <span className="badge bg-soft-warning text-warning ms-2 text-capitalize">
                            Filtered
                          </span>
                        )}
                      </p>
                      <h4 className="mb-1 fw-semibold text-truncate">{c.value}</h4>
                      <small className="text-muted text-truncate d-block">{c.hint}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ledger table card */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5 className="card-title mb-1">Ledger Entries</h5>
                <small className="text-muted">
                  <span className="fw-medium text-dark">{accountLabel}</span>
                  {jobLabel && (
                    <>
                      {" "}&middot; Job <span className="fw-medium text-dark">{jobLabel}</span>
                    </>
                  )}
                  {periodLabel && <> &middot; {periodLabel}</>}
                </small>
              </div>

              {reports.length > 0 && (
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <small className="text-muted">
                    Showing {filteredReports.length} of {reports.length} rows
                  </small>
                  <div className="input-group" style={{ width: "360px", maxWidth: "100%" }}>
                    <span className="input-group-text bg-light">
                      <i className="ri-search-line"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search account, voucher, invoice, job, party, amount, narration..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchText("")}
                        title="Clear search"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3 mb-0">Loading ledger entries...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-5">
                <div className="avatar-md mx-auto mb-3">
                  <span className="avatar-title rounded-circle bg-soft-primary text-primary fs-2">
                    <i className="ri-book-open-line"></i>
                  </span>
                </div>
                <h6 className="mb-1">
                  {hasGenerated ? "No entries found" : "No report generated yet"}
                </h6>
                <p className="text-muted mb-0">
                  {hasGenerated
                    ? "Try a different account, job or date range."
                    : "Choose your filters above and click Generate to view the ledger."}
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredReports}
                customStyles={ledgerTableStyles}
                pagination
                paginationPerPage={25}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                highlightOnHover
                striped
                responsive
                noDataComponent={
                  <div className="p-4 text-center text-muted">
                    No rows match "{searchText}".
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LedgerStatement;
