import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";

import * as Yup from "yup";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import Purchase from "./Purchase";
import Sales from "./Sales";
import apiAuth from "../../helpers/ApiAuth";
import InvoiceTable from "./InvoiceTable";

const Invoices = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceType, setInvoiceType] = useState("Sales");
  const [loading, setLoading] = useState(false);

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
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const getInvoices = () => {
    setLoading(true);
    apiAuth
      .get("/api/get-invoices/")
      .then((response) => {
        let data = response.data;
        console.log("invocie", data);
        setInvoices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getInvoices();
  }, []);

  return (
    <>
      {/* <div className="page-content"> */}
      {/* <Sales /> */}
      {/* </div> */}

      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title=""
            pageTitle="Settings"
            add_new={true}
            // add_url_popup={true}

            add_new_url={"/invoices/add"}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {invoices.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <InvoiceTable invoices={invoices} history={props.history} />
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
