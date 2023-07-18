import React, { useEffect, useState } from "react";
import { Row, Button, Label, Container } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";
import { Card } from "@mui/material";
import BreadCrumb from "../../components/Common/BreadCrumb";
import SalesInvoice from "./SalesInvoice";
import PurchaseInvoice from "./PurchaseInvoice";

const AddTicket = (props) => {
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
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Container fluid>
        <BreadCrumb
          title=""
          pageTitle="Settings"
          back_button={true}
          history={props.history}
        />
      </Container>
      <Row mb="4">
        <Colxx lg="12">
          <Card className="p-3" style={{ background: "#EDEDED" }}>
            <Formik>
              {({ values, setFieldValue }) => (
                <Form className="av-tooltip tooltip-label-bottom ">
                  <Row>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="type">Invoice Type</Label>
                        <Select
                          name="type"
                          placeholder={"Select"}
                          options={invoiceTypes?.map((type) => {
                            return {
                              label: type.label,
                              value: type.label,
                            };
                          })}
                          defaultValue={{ label: invoiceType }}
                          onChange={(event) => {
                            setInvoiceType(event.value);
                          }}
                        />
                        <ErrorMessage
                          name="type"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                  </Row>
                  {invoiceType === "Sales" ? (
                    <>
                      <SalesInvoice />
                    </>
                  ) : (
                    <PurchaseInvoice />
                  )}
                </Form>
              )}
            </Formik>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default AddTicket;
