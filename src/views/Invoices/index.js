import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";

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

const Invoices = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [invoicePagination, setInvoicePagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const [invoiceType, setInvoiceType] = useState("Sales");
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

  const getInvoices = (pgdata, val) => {
    setLoading(true);
    apiAuth
      .get(
        "/api/get-invoices/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
         (val ? val : "") 
      )

      .then((response) => {
        let data = response.data;
        console.log("invoice", data);
        setInvoicePagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setInvoices(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // const deleteInvoice = (id) => {
  //   let url = `/api/deleteinvoice/${id}`;
  //   apiAuth
  //     .delete(url)
  //     .then((response) => {
  //       const newdata = response.data;
  //       NotificationManager.success(
  //         "",
  //         "Invoice Deleted Successfully",
  //         3000,
  //         null,
  //         null,
  //         ""
  //       );
  //       getInvoices(invoicePagination);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       console.log(error.response?.data);
  //       console.log(error.response?.status);
  //       console.log(error.response?.headers);
  //     });
  // };

  useEffect(() => {
    getInvoices(invoicePagination, searchValue);
  }, []);

  const handleInvoiceChange = (e) => {
    setSelectedValue(e.value);
    getInvoices(e.value);
    console.log("handleInvoiceChange", selectedValue)
  };

  return (
    <>
      {/* <div className="page-content"> */}
      {/* <Sales /> */}
      {/* </div> */}

      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Invoices"
            pageTitle="Invoices"
            add_new={true}
            add_new_url={"/invoices/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getInvoices(invoicePagination, val);
            }}
            export_button={invoices.length > 0 ? true : false}
            exportData={() => {
              // handleExportData();
            }}
            invoiceType={invoiceType}
            invoiceTypes={invoiceTypes}
            handleInvoiceChange={handleInvoiceChange}
            add_invoices={true}
            add_invoice_select={true}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {invoices.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <InvoiceTable
                    invoices={invoices}
                    history={props.history}
                    // deleteInvoice={(val) => deleteInvoice(val)}
                    invoicePagination={{ ...invoicePagination }}
                    handlePagination={(data) => {
                      setInvoicePagination(data);
                      getInvoices(data);
                    }}
                    getInvoices={() => {
                      setInvoices([]);
                      getInvoices(invoicePagination, searchValue);
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
