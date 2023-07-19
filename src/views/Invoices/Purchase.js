import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";

const Purchase = (props) => {
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

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-5">Purchase Invoice</h2>
          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={11} style={{ margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  blNumber: "",
                  consigneeName: "",
                  date: "",
                  currency: "",
                  bayanNumber: "",
                  shipperName: "",
                  vendorName: "",
                  rate: "",
                  pod: "",
                  clientName: "",
                  fcAmount: "",
                  amount: "",
                  poa: "",
                  remarks: "",
                  refDate: "",
                  dueDate: "",
                  billAmount: "",
                  naration: "",
                }}
                validationSchema={Yup.object({
                  // blNumber: Yup.string().required("BL Number is Required"),
                  // bayanNumber: Yup.string().required("Bayan Number is Required"),
                  // pod: Yup.string().required("POD is Required"),
                  // poa: Yup.string().required("POA is Required"),
                  date: Yup.string().required("Date is Required"),
                  vendorName: Yup.string().required("vendorName is Required"),
                  // consigneeName: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Cosignee Name is Required"),
                  // shipperName: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Shipper Name is Required"),
                  // clientName: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Client Name is Required"),
                  // remarks: Yup.string()
                  //   .max(400, "Must be 400 characters or less")
                  //   .trim()
                  //   .required("Remarks is Required"),
                })}
                onSubmit={(values) => {
                  console.log("values", values);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="blNumber"> BL Number</Label>
                            <Field
                              className="form-control"
                              name="blNumber"
                              style={{ background: "#EDEDED" }}
                              // placeholder="blNumber"
                              type="text"
                            />
                          </div>
                          {errors.blNumber && touched.blNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.blNumber}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="consigneeName">
                              Consignee Name
                            </Label>
                            <Field
                              className="form-control"
                              name="consigneeName"
                              // placeholder="Consignee Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.consigneeName && touched.consigneeName && (
                            <div className="invalid-feedback d-block">
                              {errors.consigneeName}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="consigneeName">
                              <span style={{ color: "red" }}>*</span> Date
                            </Label>
                            <Field
                              className="form-control "
                              name="date"
                              // placeholder="date"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.consigneeName && touched.consigneeName && (
                            <div className="invalid-feedback d-block">
                              {errors.consigneeName}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="currency">Currency (SAR)</Label>
                            <Field
                              className="form-control "
                              name="currency"
                              // placeholder="Currency"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayanNumber && touched.bayanNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.bayanNumber}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="bayanNumber"
                              className="  w-50 pe-2"
                            >
                              Bayan Number
                            </Label>
                            <Field
                              className="form-control"
                              name="bayanNumber"
                              // placeholder="Bayan Number"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayanNumber && touched.bayanNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.bayanNumber}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="shipperName"
                              className=" w-50 p e-2"
                            >
                              Shipper Name
                            </Label>
                            <Field
                              className="form-control "
                              name="shipperName"
                              // placeholder="shipper Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.shipperName && touched.shipperName && (
                            <div className="invalid-feedback d-block">
                              {errors.shipperName}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="vendorName">
                              Vendor Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control"
                              name="vendorName"
                              value={"TEMP"}
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.vendorName && touched.vendorName && (
                            <div className="invalid-feedback d-block">
                              {errors.vendorName}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="rate">Ex. Rate</Label>
                            <Field
                              className="form-control "
                              name="rate"
                              // placeholder="EX Rate"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.rate && touched.rate && (
                            <div className="invalid-feedback d-block">
                              {errors.rate}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="pod">POD</Label>
                            <Field
                              className="form-control "
                              name="pod"
                              // placeholder="pod"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.pod && touched.pod && (
                            <div className="invalid-feedback d-block">
                              {errors.pod}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="consigneeName"
                              className=" w-50 pe-2"
                            >
                              Client Name
                            </Label>
                            <Field
                              className="form-control "
                              name="clientName"
                              // placeholder="Client Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.clientName && touched.clientName && (
                            <div className="invalid-feedback d-block">
                              {errors.clientName}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="fcAmount">FC Amount</Label>
                            <Field
                              className="form-control"
                              name="fcAmount"
                              // placeholder="FC Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.fcAmount && touched.fcAmount && (
                            <div className="invalid-feedback d-block">
                              {errors.fcAmount}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="amount"> Amount (SAR)</Label>
                            <Field
                              className="form-control"
                              name="amount"
                              // placeholder="Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.amount && touched.amount && (
                            <div className="invalid-feedback d-block">
                              {errors.amount}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="poa" className="pe-2  w-50">
                              POA
                            </Label>
                            <Field
                              className="form-control"
                              name="poa"
                              // placeholder="POA"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          <ErrorMessage
                            name="poa"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="form-group mb-3">
                          <Label htmlFor="type">Invoice Type</Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
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
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="remarks" className="form-label">
                            Remarks
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            rows="6"
                            className="form-control"
                            name="reamrks"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.remarks && touched.remarks && (
                            <div className="invalid-feedback d-block">
                              {errors.remarks}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={8} xs={12}>
                        <Grid container spacing={2}>
                          <Grid item lg={6} xs={12}>
                            <div className="form-group mb-3">
                              <div>
                                <Label htmlFor="refDate">Ref Date</Label>
                                <Field
                                  name="refDate"
                                  className="form-control"
                                  // placeholder="Remarks"
                                  type="text"
                                  style={{ background: "#EDEDED" }}
                                />
                              </div>
                              <ErrorMessage
                                name="refDate"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <div className="form-group mb-3">
                              <div>
                                <Label htmlFor="billAmount">Bill Amount</Label>
                                <Field
                                  name="billAmount"
                                  className="form-control"
                                  // placeholder="Remarks"
                                  type="text"
                                  style={{ background: "#EDEDED" }}
                                />
                              </div>
                              <ErrorMessage
                                name="billAmount"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Grid>

                          <Grid item lg={6} xs={12}>
                            <div className="form-group mb-3">
                              <div>
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Field
                                  name="dueDate"
                                  className="form-control"
                                  // placeholder="Remarks"
                                  type="text"
                                  style={{ background: "#EDEDED" }}
                                />
                              </div>
                              <ErrorMessage
                                name="dueDate"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <div className="form-group mb-3">
                              <div>
                                <Label htmlFor="naration">naration</Label>
                                <Field
                                  name="naration"
                                  className="form-control"
                                  // placeholder="Remarks"
                                  type="text"
                                  style={{ background: "#EDEDED" }}
                                />
                              </div>
                              <ErrorMessage
                                name="naration"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <div className="d-flex justify-content-between">
                      {/* <Button
                        className="btn btn-warning float-right"
                        type="reset"
                        onClick={() => props.closeAddPopup()}
                      >
                        {" "}
                        Back{" "}
                      </Button> */}
                      <Button
                        type="submit"
                        // color="primary"
                        className={`btn btn-success  ${
                          props.loading ? "show-spinner" : ""
                        }`}
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">Save</span>
                      </Button>{" "}
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Purchase;
