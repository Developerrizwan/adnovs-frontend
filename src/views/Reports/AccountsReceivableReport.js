// src/views/Reports/AccountsReceivableReport.jsx

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

const AccountsReceivableReport = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [drAmount, setDrAmount] = useState("0.00");
  const [crAmount, setCrAmount] = useState("0.00");
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [selectOrganization, setSelectedOrganization] = useState(null);

  const history = useHistory();

  useEffect(() => {
    getOrganizations();
  }, []);

  const getOrganizations = () => {
    setLoading(true);
    apiAuth
      .get(`/api/master/organization/?type=Client`)
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
        console.error("Error fetching organizations:", err);
        NotificationManager.error("Failed to load customers");
        setLoading(false);
      });
  };

  const getReport = (orgId, startDate, endDate) => {
    setLoading(true);

    apiAuth
      .get("/api/account/receivable/", {
        params: {
          organization: orgId,
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        const data = res.data?.rows || [];

        // Calculate totals
        const totalDr = data.reduce((sum, r) => sum + Number(r.debit || 0), 0);
        const totalCr = data.reduce((sum, r) => sum + Number(r.credit || 0), 0);
        const closing = res.data?.closing_balance?.toString() || "0.00";

        setDrAmount(totalDr.toFixed(2));
        setCrAmount(totalCr.toFixed(2));
        setTotalAmount(closing);
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AR report error:", err);
        NotificationManager.error("Failed to load Accounts Receivable statement");
        setLoading(false);
      });
  };

  const exportProjectToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Accounts Receivable Statement", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Client: ${selectOrganization?.label || "Selected Client"}`, 14, 25);
    doc.text(`Period: ${moment(reports[0]?.date).format("DD-MM-YYYY")} to ${moment(reports[reports.length - 1]?.date).format("DD-MM-YYYY") || ""}`, 14, 32);

    doc.text(`Total Debit: ${drAmount}`, 14, 40);
    doc.text(`Total Credit: ${crAmount}`, 90, 40);
    doc.text(`Closing Balance: ${totalAmount}`, 160, 40);

    const tableData = reports.map((row) => [
      moment(row.date).format("DD-MM-YYYY"),
      row.inv_no || row.voucher_no || "-",
      row.job_no || "-",
      row.party_name || "-",
      Number(row.debit || 0).toFixed(2),
      Number(row.credit || 0).toFixed(2),
      Number(row.balance || 0).toFixed(2),
      row.narration || "",
    ]);

    doc.autoTable({
      head: [["Date", "Document No", "Job No", "Client", "Debit", "Credit", "Balance", "Narration"]],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [66, 139, 202], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 28 },
        2: { cellWidth: 22 },
        3: { cellWidth: 35 },
        4: { cellWidth: 18 },
        5: { cellWidth: 18 },
        6: { cellWidth: 22 },
        7: { cellWidth: "auto" },
      },
      margin: { top: 50, left: 10, right: 10 },
    });

    doc.save(`AR_Statement_${moment().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const exportData = () => {
    const excelData = reports.map((row) => ({
      Date: moment(row.date).format("DD-MM-YYYY"),
      "Document No": row.inv_no || row.voucher_no || "-",
      "Job No": row.job_no || "-",
      Client: row.party_name || "-",
      Debit: Number(row.debit || 0).toFixed(2),
      Credit: Number(row.credit || 0).toFixed(2),
      Balance: Number(row.balance || 0).toFixed(2),
      Narration: row.narration || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AR Statement");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(blob, `AR_Statement_${moment().format("YYYYMMDD_HHmm")}.xlsx`);
  };

  // Table columns
  const columns = [
    {
      name: "Date",
      selector: (row) => moment(row.date).format("DD-MM-YYYY"),
      sortable: true,
      width: "110px",
    },
    {
      name: "Document No",
      selector: (row) => row.inv_no || row.voucher_no || "-",
      sortable: true,
      width: "140px",
    },
    {
      name: "Job No",
      selector: (row) => row.job_no || "-",
      sortable: true,
      width: "110px",
    },
    {
      name: "Client",
      selector: (row) => row.party_name || "-",
      sortable: true,
      width: "180px",
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
    },
  ];

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Accounts Receivable Statement</h2>
        <button className="btn btn-secondary" onClick={() => history.goBack()}>
          Back
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Debit</h5>
              <h3>{drAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Credit</h5>
              <h3>{crAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Closing Balance</h5>
              <h3>{totalAmount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Formik
        initialValues={{
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          end_date: new Date(),
          organization: null,
        }}
        validationSchema={Yup.object({
          organization: Yup.object().required("Client is required"),
          start_date: Yup.date().required("Start date is required"),
          end_date: Yup.date().required("End date is required"),
        })}
        onSubmit={(values) => {
          getReport(values.organization.value, values.start_date, values.end_date);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <label className="form-label">
                  Client (Sundry Debtor) <span className="text-danger">*</span>
                </label>
                <Select
                  options={organizationOptions}
                  value={values.organization}
                  onChange={(opt) => {
                    setFieldValue("organization", opt);
                    setSelectedOrganization(opt);
                  }}
                  placeholder="Select Client..."
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
                  placeholderText="Select start date"
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
                  placeholderText="Select end date"
                  minDate={values.start_date}
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

      {/* Table / Loading / Empty State */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Accounts Receivable statement...</p>
        </div>
      ) : reports.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={reports}
            customStyles={customStyles}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            highlightOnHover
            pointerOnHover
            className="mt-4 shadow-sm"
          />

          {/* Export Buttons */}
          <div className="mt-4 d-flex gap-3">
            <button className="btn btn-primary" onClick={exportProjectToPdf}>
              <i className="fas fa-file-pdf me-2"></i> Download PDF
            </button>
            <button className="btn btn-success" onClick={exportData}>
              <i className="fas fa-file-excel me-2"></i> Download Excel
            </button>
          </div>
        </>
      ) : (
        <div className="alert alert-info mt-4 text-center">
          No transactions found for the selected period and client.
        </div>
      )}
    </div>
  );
};

export default AccountsReceivableReport;