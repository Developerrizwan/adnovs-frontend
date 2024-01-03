import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import moment from "moment";
import * as Yup from "yup";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card, Grid } from "@mui/material";
import NotificationManager from "../../components/Common/NotificationManager";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import Purchase from "./Purchase";
import Sales from "./Sales";
import apiAuth from "../../helpers/ApiAuth";
import InvoiceTable from "./InvoiceTable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Invoices = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState({
    label: "Sales",
    value: "Sales",
  });
  const [invoicePagination, setInvoicePagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  // const [invoiceType, setInvoiceType] = useState("Sales");
  const invoiceTypes = [
    {
      label: "Sales",
      value: "Sales",
    },
    {
      label: "Purchase",
      value: "Purchase",
    },
  ];

  const getInvoices = (pgdata, val, type) => {
    setLoading(true);
    apiAuth
      .get(
        "/api/get-invoices/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "") +
          "&type=" +
          type
      )

      .then((response) => {
        let data = response.data;
        setInvoicePagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setInvoices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${
            error.response?.data?.Error || `${selectedValue.value} Get Error`
          }`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const deleteInvoice = (id) => {
    let url = `/api/master/invoice/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          selectedValue
            ? `${selectedValue.value} Invoice Deleted Successfully`
            : "Invoice Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getInvoices(invoicePagination, searchValue, selectedValue.value);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  useEffect(() => {
    getInvoices(invoicePagination, searchValue, selectedValue.value);
  }, []);

  const handleInvoiceChange = (e) => {
    setSelectedValue(e);
    getInvoices(invoicePagination, searchValue, e.value);
  };

  const exportData = () => {
    let apiData = invoices.map((report) => {
      let dataReport = {
        "Invoice Number": report?.invoice_number,
        "Job Number": report?.job_number,
        "BL Number": report?.bl_number,
        Supplier: report?.party_account?.name,
        "Consignee Name": report?.consignee_name?.name,
        Date: moment(report?.date).format("DD-MM-YYYY"),
        "Currency SAR": report?.currency_sar,
        "Bayan Number": report?.bayan_number,
        "Shipper Name": report?.shipper_name,
        "Supplier Invoice No": report?.supplier_inv_number,
        "Ex. Rate": report?.ex_rate,
        POD: report?.pod,
        POA: report?.poa,
        "Client Name": report?.client_name?.name,
        "FC Amount": report?.fc_amount.toFixed(2),
        Amount: report?.amount_sar.toFixed(2),
        "Invoice Type": report?.invoice_type,
        Narration: report?.narration,
        Remarks: report?.remarks,
        "Invoice Status": report?.payment_status,
      };
      return dataReport;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = selectedValue.value;
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={selectedValue.value}
            pageTitle="Invoices"
            add_new={true}
            add_new_url={`/invoices/${selectedValue.value}`}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getInvoices(invoicePagination, val, selectedValue.value);
            }}
            export_button={invoices.length > 0 ? true : false}
            exportData={() => {
              // handleExportData();
            }}
            // invoiceType={invoiceType}
            options={invoiceTypes}
            handleTypeChange={handleInvoiceChange}
            add_type={true}
            add_type_select={true}
            selectedValue={{
              label: selectedValue.value,
              value: selectedValue.value,
            }}
          />
        </Container>

        <Row>
          <Colxx lg="12" className="d-flex justify-content-end mb-2">
            <div>
              {invoices && invoices.length > 0 ? (
                <>
                  <button
                    className="btn"
                    type="button"
                    style={{
                      background: "#589662",
                      color: "white",
                    }}
                    onClick={exportData}
                  >
                    Excel Download
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </Colxx>
          <Colxx lg="12">
            {invoices.length > 0 ? (
              <>
                <Card
                  style={{
                    boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                    marginBottom: "12px",
                  }}
                >
                  <InvoiceTable
                    invoices={invoices}
                    history={props.history}
                    deleteInvoice={deleteInvoice}
                    invoicePagination={{ ...invoicePagination }}
                    handlePagination={(data) => {
                      setInvoicePagination(data);
                      getInvoices(data, searchValue, selectedValue?.value);
                    }}
                    selectedValue={selectedValue.value}
                    getInvoices={() => {
                      setInvoices([]);
                      getInvoices(
                        invoicePagination,
                        searchValue,
                        selectedValue.value
                      );
                    }}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>
    </>
  );
};

export default Invoices;
