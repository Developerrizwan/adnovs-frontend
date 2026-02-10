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
  const [totalAmount, setTotalAmount] = useState(0);
  const [drAmount, setDrAmount] = useState(0.0);
  const [crAmount, setCrAmount] = useState(0.0);
  const [agingBuckets, setAgingBuckets] = useState({ '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 }); // New for aging
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [selectOrganization, setSelectedOrganization] = useState(null);
  const [selectedInvcType, setSelectedInvcType] = useState({ label: "All", value: "all" });

  const history = useHistory();

  const ledgerType = "pay"; // Hardcoded for AP

  useEffect(() => {
    getOrganization();
  }, []);

  const getOrganization = () => {
    setLoading(true);
    apiAuth
      .get(`/api/master/organization/`)
      .then((response) => {
        let data = response.data;
        let organizationOpts = data.map((account) => ({
          label: account.name,
          value: account.id,
        }));
        setOrganizationOptions(organizationOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getReport = (id, st, et, pt) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/account/statement/?organization=${id}&type=${ledgerType}&start_date=${st}&end_date=${et}${
          pt ? "&payment=" + pt : ""
        }`
      )
      .then((res) => {
        let data = res.data;
        if (data.length > 0) {
          // Correct running balance (assuming backend returns rows with dr/cr)
          let balance = 0;
          data = data.map((row) => {
            balance += Number(row.dr_amount || 0) - Number(row.cr_amount || 0);
            return { ...row, net_amount: balance.toFixed(2) };
          });

          // Calculate aging (based on due_date or date)
          const today = moment();
          let buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
          data.forEach((row) => {
            if (row.type === 'Invoice' && row.balance > 0) { // Only unpaid positives
              const age = today.diff(moment(row.due_date || row.date), 'days');
              if (age <= 30) buckets['0-30'] += Number(row.balance);
              else if (age <= 60) buckets['31-60'] += Number(row.balance);
              else if (age <= 90) buckets['61-90'] += Number(row.balance);
              else buckets['90+'] += Number(row.balance);
            }
          });
          setAgingBuckets(buckets);

          // Totals
          const dr = data.reduce((sum, row) => sum + Number(row.dr_amount || 0), 0);
          const cr = data.reduce((sum, row) => sum + Number(row.cr_amount || 0), 0);
          const total = data[data.length - 1]?.net_amount || 0;

          setTotalAmount(total);
          setDrAmount(dr.toFixed(2));
          setCrAmount(cr.toFixed(2));
          setReports(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    return parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  };

  // ---------------------- PDF Export Function ----------------------
const exportProjectToPdf = () => {
  const doc = new jsPDF();
  doc.text("Accounts " + (ledgerType === "receive" ? "Receivable" : "Payable") + " Statement", 60, 10);
  doc.text(`Account: ${selectOrganization?.label || "Selected Organization"}`, 12, 22);
  doc.text(`Total Debit: ${Number(drAmount).toFixed(2)}`, 12, 32);
  doc.text(`Total Credit: ${Number(crAmount).toFixed(2)}`, 80, 32);
  doc.text(`Balance: ${totalAmount}`, 144, 32);

  // Build table data from reports state
  const tableData = reports.map((row) => [
    moment(row.date).format("DD-MM-YYYY"),
    row.type || "",
    row.voucher_number || "",
    row.invoice_number || "",
    row.job_no || "",
    Number(row.dr_amount || 0).toFixed(2),
    Number(row.cr_amount || 0).toFixed(2),
    Number(row.net_amount || 0).toFixed(2),
  ]);

  doc.autoTable({
    head: [["Date", "Type", "Voucher Number", "Invoice Number", "Job No", "Debit", "Credit", "Balance"]],
    body: tableData,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 25 },
    },
    margin: { top: 40, left: 10, right: 10 },
  });

  // Footer totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Debit: ${drAmount}`, 10, finalY);
  doc.text(`Total Credit: ${crAmount}`, 80, finalY);
  doc.text(`Closing Balance: ${totalAmount}`, 150, finalY);

  doc.save(`account-${ledgerType === "receive" ? "receivable" : "payable"}-statement.pdf`);
};

// ---------------------- Excel Export Function ----------------------
const exportData = () => {
  const excelData = reports.map((row) => ({
    Date: moment(row.date).format("DD-MM-YYYY"),
    Type: row.type || "",
    "Voucher Number": row.voucher_number || "",
    "Invoice Number": row.invoice_number || "",
    "Job No": row.job_no || "",
    Debit: Number(row.dr_amount || 0).toFixed(2),
    Credit: Number(row.cr_amount || 0).toFixed(2),
    Balance: Number(row.net_amount || 0).toFixed(2),
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Statement");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  FileSaver.saveAs(data, `account-${ledgerType === "receive" ? "receivable" : "payable"}-statement.xlsx`);
};// ... (exportProjectToPdf, exportData functions – update to use correct dr/cr/net)

  // Correct table columns for AR (customer owes us – positive balance good)
  const columns = [
    { name: "Date", selector: row => moment(row.date).format("DD-MM-YYYY"), sortable: true },
    { name: "Type", selector: row => row.type },
    { name: "Voucher Number", selector: row => row.voucher_number },
    { name: "Invoice Number", selector: row => row.invoice_number },
    { name: "Party Account", selector: row => row.party_account },
    { name: "Job No", selector: row => row.job_no },
    { name: "Debit", selector: row => Number(row.dr_amount).toFixed(2), sortable: true },
    { name: "Credit", selector: row => Number(row.cr_amount).toFixed(2), sortable: true },
    { name: "Balance", selector: row => Number(row.net_amount).toFixed(2), sortable: true },
  ];

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between mb-4">
        <h2>Accounts Receivable Statement</h2>
        <button className="btn btn-secondary" onClick={() => history.goBack()}>Back</button>
      </div>

      {/* Summary Cards for Totals + Aging */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Debit</h5>
              <h3>{drAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>Total Credit</h5>
              <h3>{crAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Closing Balance</h5>
              <h3>{totalAmount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h5>Aging Summary</h5>
              <p>0-30: {agingBuckets['0-30'].toFixed(2)}</p>
              <p>31-60: {agingBuckets['31-60'].toFixed(2)}</p>
              <p>61-90: {agingBuckets['61-90'].toFixed(2)}</p>
              <p>90+: {agingBuckets['90+'].toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <Grid container spacing={2}>
        {/* ... your existing Formik form, but remove the ledger dropdown */}
      </Grid>

      {/* Table */}
      <DataTable
        columns={columns} // Updated with correct Debit/Credit/Balance
        data={reports}
        customStyles={customStyles}
        pagination
      />

      {/* Exports */}
      {reports.length > 0 && (
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={exportProjectToPdf}>PDF Download</button>
          <button className="btn btn-success" onClick={exportData}>Excel Download</button>
        </div>
      )}
    </div>
  );
};

export default AccountsPayableReport;