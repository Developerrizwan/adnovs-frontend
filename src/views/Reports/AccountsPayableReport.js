import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const history = useHistory();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    apiAuth
      .get("/api/master/organization/?type=Supplier")
      .then((response) => {
        const data = response.data || [];
        const opts = data.map((org) => ({
          label: org.name,
          value: org.id,
        }));
        setOrganizationOptions(opts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading suppliers:", err);
        NotificationManager.error("Failed to load suppliers");
        setLoading(false);
      });
  };

  const getReport = (orgId, startDate, endDate) => {
    if (!orgId) return;

    setLoading(true);
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");

    apiAuth
      .get("/api/account/payable/", {
        params: {
          organization: orgId,
          start_date: start,
          end_date: end,
        },
      })
      .then((res) => {
        const rows = res.data?.rows || [];
        const opening = res.data?.opening_balance || 0;
        const closing = res.data?.closing_balance || 0;

        const displayRows = [
          {
            date: start,
            type: "Opening Balance",
            voucher_no: "",
            invoice_number: "",
            job_no: "",
            debit: 0,
            credit: 0,
            balance: Number(opening).toFixed(2),
            narration: "Opening balance",
          },
          ...rows,
        ];

        const totalDr = rows.reduce((sum, r) => sum + Number(r.debit || 0), 0);
        const totalCr = rows.reduce((sum, r) => sum + Number(r.credit || 0), 0);

        setDrAmount(totalDr.toFixed(2));
        setCrAmount(totalCr.toFixed(2));
        setTotalAmount(Number(closing).toFixed(2));
        setReports(displayRows);
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

    doc.setFontSize(11);
    doc.text(`Supplier: ${selectedOrg?.label || "Select Supplier"}`, 14, 25);
    doc.text(
      `Period: ${moment(reports[0]?.date).format("DD-MM-YYYY")} to ${moment(
        reports[reports.length - 1]?.date
      ).format("DD-MM-YYYY")}`,
      14,
      32
    );

    doc.text(`Total Debit: ${drAmount}`, 14, 40);
    doc.text(`Total Credit: ${crAmount}`, 90, 40);
    doc.text(`Closing Balance: ${totalAmount}`, 160, 40);

    const tableData = reports.map((row) => [
      moment(row.date).format("DD-MM-YYYY"),
      row.type || "",
      row.voucher_no || row.inv_no || "-",
      row.invoice_number || "-",
      row.job_no || "-",
      Number(row.debit || 0).toFixed(2),
      Number(row.credit || 0).toFixed(2),
      Number(row.balance || 0).toFixed(2),
      row.narration || "",
    ]);

    doc.autoTable({
      head: [["Date", "Type", "Doc No", "Inv No", "Job No", "Debit", "Credit", "Balance", "Narration"]],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 22 },
        4: { cellWidth: 20 },
        5: { cellWidth: 18 },
        6: { cellWidth: 18 },
        7: { cellWidth: 22 },
        8: { cellWidth: "auto" },
      },
      margin: { top: 50, left: 10, right: 10 },
    });

    doc.save(`AP_Statement_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const exportToExcel = () => {
    const excelData = reports.map((row) => ({
      Date: moment(row.date).format("DD-MM-YYYY"),
      Type: row.type || "",
      "Doc No": row.voucher_no || row.inv_no || "-",
      "Inv No": row.invoice_number || "-",
      "Job No": row.job_no || "-",
      Debit: Number(row.debit || 0).toFixed(2),
      Credit: Number(row.credit || 0).toFixed(2),
      Balance: Number(row.balance || 0).toFixed(2),
      Narration: row.narration || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AP Statement");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, `AP_Statement_${moment().format("YYYYMMDD_HHmm")}.xlsx`);
  };

  const tableColumns = [
    {
      name: "Date",
      selector: (row) => moment(row.date).format("DD-MM-YYYY"),
      sortable: true,
      width: "120px",           // slightly wider
      wrap: false,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: "150px",
    },
    {
      name: "Doc No",
      selector: (row) => row.voucher_no || row.inv_no || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "Inv No",
      selector: (row) => row.invoice_number || "-",
      width: "110px",
    },
    {
      name: "Job No",
      selector: (row) => row.job_no || "-",
      width: "110px",
    },
    {
      name: "Debit",
      selector: (row) => Number(row.debit || 0).toFixed(2),
      sortable: true,
      right: true,
      width: "100px",
    },
    {
      name: "Credit",
      selector: (row) => Number(row.credit || 0).toFixed(2),
      sortable: true,
      right: true,
      width: "100px",
    },
    {
      name: "Balance",
      selector: (row) => Number(row.balance || 0).toFixed(2),
      sortable: true,
      right: true,
      width: "110px",
    },
    {
      name: "Narration",
      selector: (row) => row.narration || "",
      wrap: true,
      grow: 2,                  // gives narration more space
    },
  ];

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Accounts Payable Statement</h2>
        <button className="btn btn-secondary" onClick={() => history.goBack()}>
          Back
        </button>
      </div>

      {/* Summary Cards - only 3 now */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <h5>Total Debit</h5>
              <h3>{drAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white shadow-sm">
            <div className="card-body">
              <h5>Total Credit</h5>
              <h3>{crAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5>Closing Balance</h5>
              <h3>{totalAmount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Form */}
      <Formik
        initialValues={{
          organization: null,
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          end_date: new Date(),
        }}
        validationSchema={Yup.object({
          organization: Yup.object().required("Supplier is required"),
          start_date: Yup.date().required("Start date is required"),
          end_date: Yup.date().required("End date is required"),
        })}
        onSubmit={(values) => {
          getReport(
            values.organization.value,
            values.start_date,
            values.end_date
          );
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <label className="form-label">
                  Supplier (Vendor) <span className="text-danger">*</span>
                </label>
                <Select
                  options={organizationOptions}
                  value={values.organization}
                  onChange={(opt) => {
                    setFieldValue("organization", opt);
                    setSelectedOrg(opt);
                  }}
                  placeholder="Select Supplier..."
                  isSearchable
                  isLoading={loading}
                />
                <ErrorMessage
                  name="organization"
                  component="div"
                  className="text-danger small mt-1"
                />
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
                <ErrorMessage
                  name="start_date"
                  component="div"
                  className="text-danger small mt-1"
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
                <ErrorMessage
                  name="end_date"
                  component="div"
                  className="text-danger small mt-1"
                />
              </Grid>

              <Grid item xs={12} className="mt-3">
                <button
                  type="submit"
                  className="btn btn-success px-5"
                  disabled={loading || !values.organization}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Loading...
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
            columns={tableColumns}
            data={reports}
            customStyles={customStyles}
            pagination
            paginationPerPage={15}
            paginationRowsPerPageOptions={[10, 15, 25, 50]}
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
        <div className="alert alert-info mt-5 text-center">
          Select a supplier and date range to view the statement.
        </div>
      )}
    </div>
  );
};

export default AccountsPayableReport;