import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
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

const AccountsPayableReport = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [drAmount, setDrAmount] = useState("0.00");
  const [crAmount, setCrAmount] = useState("0.00");
  const [partyOptions, setPartyOptions] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [filterDates, setFilterDates] = useState({ start: null, end: null });

  const history = useHistory();

  useEffect(() => {
    fetchPayableParties();
  }, []);

  const fetchPayableParties = () => {
    setLoading(true);
    apiAuth
      .get("/api/master/organization/")
      .then((response) => {
        const data = response.data || [];

        // Filter organizations that can be payable parties
        const payableParties = data.filter((org) =>
          org.type?.some((t) =>
            ["Supplier", "Broker", "Counterpart"].includes(t)
          )
        );

        const opts = payableParties.map((org) => ({
          label: `${org.name || "Unnamed"} (${org.type?.join(", ") || "?"})`,
          value: org.id,
        }));

        opts.unshift({ label: "All Payable Parties", value: "all" });

        setPartyOptions(opts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading payable parties:", err);
        NotificationManager.error("Failed to load suppliers / brokers / counterparts");
        setLoading(false);
      });
  };

  const getReport = (partyId, startDate, endDate) => {
    setLoading(true);
    setFilterDates({ start: startDate, end: endDate });
    setIsSummaryView(partyId === "all");

    apiAuth
      .get("/api/account/payable/", {
        params: {
          organization: partyId,
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        if (res.data.is_summary) {
          // Summary view - all parties
          const data = res.data.rows || [];
          setReports(data);
          setDrAmount(res.data.totals.paid_amount.toFixed(2));
          setCrAmount(res.data.totals.purchase_amount.toFixed(2));
          setTotalAmount(res.data.totals.balance.toFixed(2));
        } else {
          // Detailed view - single party
          const rows = res.data?.rows || [];
          const opening = res.data?.opening_balance || 0;
          const closing = res.data?.closing_balance || 0;

          const displayRows = [
            {
              date: moment(startDate).format("YYYY-MM-DD"),
              type: "Opening Balance",
              voucher_no: "",
              inv_no: "",
              job_no: "",
              debit: 0,
              credit: 0,
              balance: Number(opening).toFixed(2),
              narration: "Opening balance brought forward",
            },
            ...rows.map((r) => ({
              ...r,
              balance: Number(r.balance || 0).toFixed(2),
            })),
          ];

          const totalDr = rows.reduce((sum, r) => sum + Number(r.debit || 0), opening);
          const totalCr = rows.reduce((sum, r) => sum + Number(r.credit || 0), 0);

          setDrAmount(totalDr.toFixed(2));
          setCrAmount(totalCr.toFixed(2));
          setTotalAmount(Number(closing).toFixed(2));
          setReports(displayRows);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("AP report error:", err);
        NotificationManager.error("Failed to load Accounts Payable");
        setLoading(false);
      });
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Accounts Payable Statement", 105, 15, { align: "center" });

    const title = isSummaryView
      ? "All Payable Parties"
      : selectedParty?.label || "Selected Party";

    doc.setFontSize(11);
    doc.text(`Party: ${title}`, 14, 25);
    doc.text(
      `Period: ${moment(filterDates.start).format("DD-MM-YYYY")} to ${moment(
        filterDates.end
      ).format("DD-MM-YYYY")}`,
      14,
      32
    );

    doc.text(`Total Paid (Debit): ${drAmount} SAR`, 14, 40);
    doc.text(`Total Purchases (Credit): ${crAmount} SAR`, 90, 40);
    doc.text(`Net Payable (Closing): ${totalAmount} SAR`, 160, 40);

    let head, body;

    if (isSummaryView) {
      head = [["SI.No", "Party Name", "Purchase Amount", "Paid Amount", "Balance Due"]];
      body = reports.map((row) => [
        row.si_no,
        row.party_name || row.supplier_name || "Unnamed",
        Number(row.purchase_amount || 0).toFixed(2),
        Number(row.paid_amount || 0).toFixed(2),
        Number(row.balance || 0).toFixed(2),
      ]);
    } else {
      head = [["Date", "Type", "Doc No", "Inv No", "Job No", "Debit", "Credit", "Balance", "Narration"]];
      body = reports.map((row) => [
        row.date ? moment(row.date).format("DD-MM-YYYY") : "-",
        row.type || "",
        row.voucher_no || row.inv_no || "-",
        row.inv_no || "-",
        row.job_no || "-",
        Number(row.debit || 0).toFixed(2),
        Number(row.credit || 0).toFixed(2),
        Number(row.balance || 0).toFixed(2),
        row.narration || "",
      ]);
    }

    doc.autoTable({
      head,
      body,
      startY: 50,
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255] },
      margin: { top: 50, left: 14, right: 14 },
    });

    doc.save(`AP_Statement_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const exportToExcel = () => {
    let excelData = [];

    if (isSummaryView) {
      excelData = reports.map((row) => ({
        "SI No": row.si_no,
        "Party Name": row.party_name || row.supplier_name || "Unnamed",
        "Purchase Amount": Number(row.purchase_amount || 0).toFixed(2),
        "Paid Amount": Number(row.paid_amount || 0).toFixed(2),
        "Balance Due": Number(row.balance || 0).toFixed(2),
      }));
    } else {
      excelData = reports.map((row) => ({
        Date: row.date ? moment(row.date).format("DD-MM-YYYY") : "-",
        Type: row.type || "",
        "Doc No": row.voucher_no || row.inv_no || "-",
        "Inv No": row.inv_no || "-",
        "Job No": row.job_no || "-",
        Debit: Number(row.debit || 0).toFixed(2),
        Credit: Number(row.credit || 0).toFixed(2),
        "Balance Due": Number(row.balance || 0).toFixed(2),
        Narration: row.narration || "",
      }));
    }

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AP Statement");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, `AP_Statement_${moment().format("YYYYMMDD_HHmm")}.xlsx`);
  };

  const getColumns = () => {
    if (isSummaryView) {
      return [
        { name: "SI.No", selector: (row) => row.si_no, sortable: true, width: "80px" },
        {
          name: "Party Name",
          selector: (row) => row.party_name || row.supplier_name || "–",
          sortable: true,
          width: "300px",
        },
        {
          name: "Purchase Amount",
          selector: (row) => Number(row.purchase_amount || 0).toFixed(2),
          sortable: true,
          right: true,
          width: "140px",
        },
        {
          name: "Paid Amount",
          selector: (row) => Number(row.paid_amount || 0).toFixed(2),
          sortable: true,
          right: true,
          width: "140px",
        },
        {
          name: "Balance Due",
          selector: (row) => Number(row.balance || 0).toFixed(2),
          sortable: true,
          right: true,
          width: "130px",
        },
      ];
    }

    return [
      { name: "Date", selector: (row) => moment(row.date).format("DD-MM-YYYY"), sortable: true, width: "120px" },
      { name: "Type", selector: (row) => row.type, sortable: true, width: "150px" },
      { name: "Doc No", selector: (row) => row.voucher_no || row.inv_no || "-", sortable: true, width: "130px" },
      { name: "Inv No", selector: (row) => row.inv_no || "-", width: "110px" },
      { name: "Job No", selector: (row) => row.job_no || "-", width: "110px" },
      { name: "Debit", selector: (row) => Number(row.debit || 0).toFixed(2), sortable: true, right: true, width: "100px" },
      { name: "Credit", selector: (row) => Number(row.credit || 0).toFixed(2), sortable: true, right: true, width: "100px" },
      { name: "Balance Due", selector: (row) => Number(row.balance || 0).toFixed(2), sortable: true, right: true, width: "110px" },
      { name: "Narration", selector: (row) => row.narration || "", wrap: true },
    ];
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Accounts Payable Statement</h2>
        <button className="btn btn-secondary" onClick={() => history.goBack()}>
          Back
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <h5>Total Paid (Debit)</h5>
              <h3>{drAmount} SAR</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white shadow-sm">
            <div className="card-body">
              <h5>Total Purchases (Credit)</h5>
              <h3>{crAmount} SAR</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5>Net Payable (Closing Balance)</h5>
              <h3>{totalAmount} SAR</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Formik
        initialValues={{
          party: null,
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          end_date: new Date(),
        }}
        validationSchema={Yup.object({
          party: Yup.object().required("Party is required"),
          start_date: Yup.date().required("Start date is required"),
          end_date: Yup.date().required("End date is required"),
        })}
        onSubmit={(values) => {
          getReport(values.party.value, values.start_date, values.end_date);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <label className="form-label">
                  Payable Party (Supplier / Broker / Counterpart) <span className="text-danger">*</span>
                </label>
                <Select
                  options={partyOptions}
                  value={values.party}
                  onChange={(opt) => {
                    setFieldValue("party", opt);
                    setSelectedParty(opt);
                  }}
                  placeholder="Select Supplier, Broker or Counterpart..."
                  isSearchable
                  isLoading={loading}
                />
                <ErrorMessage name="party" component="div" className="text-danger small mt-1" />
              </Grid>

              <Grid item lg={4} md={6} xs={12}>
                <label className="form-label">
                  Start Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={values.start_date}
                  onChange={(date) => setFieldValue("start_date", date)}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  maxDate={values.end_date}
                />
              </Grid>

              <Grid item lg={4} md={6} xs={12}>
                <label className="form-label">
                  End Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={values.end_date}
                  onChange={(date) => setFieldValue("end_date", date)}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  minDate={values.start_date}
                />
              </Grid>

              <Grid item xs={12} className="mt-3">
                <button
                  type="submit"
                  className="btn btn-success px-5"
                  disabled={loading || !values.party}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Accounts Payable statement...</p>
        </div>
      ) : reports.length > 0 ? (
        <>
          <DataTable
            columns={getColumns()}
            data={reports}
            customStyles={customStyles}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            highlightOnHover
            pointerOnHover
            className="mt-4 shadow-sm"
          />

          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-primary" onClick={exportToPdf}>
              <i className="fas fa-file-pdf me-2" /> Download PDF
            </button>
            <button className="btn btn-success" onClick={exportToExcel}>
              <i className="fas fa-file-excel me-2" /> Download Excel
            </button>
          </div>
        </>
      ) : (
        <div className="alert alert-info mt-4 text-center">
          No transactions found for the selected period and party.
        </div>
      )}
    </div>
  );
};

export default AccountsPayableReport;