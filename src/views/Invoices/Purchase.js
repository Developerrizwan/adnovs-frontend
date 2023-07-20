import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import moment from "moment";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const Purchase = (props) => {
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
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

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = () => {
    apiAuth
      .get("/api/master/job/")
      .then((res) => {
        const { data } = res;
        let opts = data.map((dd) => {
          return {
            label: dd?.job_status,
            value: dd?.id,
          };
        });
        setJobOptions(opts);
      })
      .catch((err) => console.log(err));
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
                  bl_number: "",
                  consignee_name: "",
                  date: "",
                  currency_sar: "",
                  bayan_number: "",
                  shipper_name: "",
                  vendor_name: "",
                  ex_rate: "",
                  pod: "",
                  client_name: "",
                  fc_amount: "",
                  amount_sar: "",
                  poa: "",
                  remarks: "",
                  ref_data: "",
                  due_date: "",
                  bill_amount: "",
                  naration: "",
                  invoice_type: ""
                }}
                validationSchema={Yup.object({
                  // bl_number: Yup.string().required("BL Number is Required"),
                  // bayan_number: Yup.string().required("Bayan Number is Required"),
                  // pod: Yup.string().required("POD is Required"),
                  // poa: Yup.string().required("POA is Required"),
                  // date: Yup.string().required("Date is Required"),
                  vendor_name: Yup.string().required("vendor_name is Required"),
                  // consignee_name: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Cosignee Name is Required"),
                  // shipper_name: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Shipper Name is Required"),
                  // client_name: Yup.string()
                  //   .max(20, "Must be 20 characters or less")
                  //   .trim()
                  //   .required("Client Name is Required"),
                  // remarks: Yup.string()
                  //   .max(400, "Must be 400 characters or less")
                  //   .trim()
                  //   .required("Remarks is Required"),
                })}
                onSubmit={(values, reset) => {
                  values["date"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["ref_data"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["due_date"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["job"] = selectedJob.value;
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  console.log("values", values);

                  const url = "/api/master/invoice/";
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `Invoice Created Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props?.history?.push("/invoices");
                      } else {
                        NotificationManager.error(
                          "",
                          `Invoice Create Error`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      }
                    })
                    .catch((error) => {
                      NotificationManager.error(
                        "",
                        `Invoice Create Error`,
                        3000,
                        null,
                        null,
                        ""
                      );
                    });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="bl_number"> BL Number</Label>
                            <Field
                              className="form-control"
                              name="bl_number"
                              style={{ background: "#EDEDED" }}
                              // placeholder="bl_number"
                              type="text"
                            />
                          </div>
                          {errors.bl_number && touched.bl_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bl_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="consignee_name">
                              Consignee Name
                            </Label>
                            <Field
                              className="form-control"
                              name="consignee_name"
                              // placeholder="Consignee Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.consignee_name && touched.consignee_name && (
                            <div className="invalid-feedback d-block">
                              {errors.consignee_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                      <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={date}
                              onChange={(date) => setDate(date)}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                fill: "red",
                              }}
                            >
                              <img
                                src="/calendar.svg"
                                alt="calendar"
                                width="20px"
                                height="20px"
                              />
                            </span>
                          </div>

                          {errors.date && touched.date && (
                            <div className="invalid-feedback d-block">
                              {errors.date}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="currency_sar">Currency (SAR)</Label>
                            <Field
                              className="form-control "
                              name="currency_sar"
                              // placeholder="Currency"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayan_number && touched.bayan_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bayan_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="bayan_number"
                              className="  w-50 pe-2"
                            >
                              Bayan Number
                            </Label>
                            <Field
                              className="form-control"
                              name="bayan_number"
                              // placeholder="Bayan Number"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayan_number && touched.bayan_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bayan_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="shipper_name"
                              className=" w-50 p e-2"
                            >
                              Shipper Name
                            </Label>
                            <Field
                              className="form-control "
                              name="shipper_name"
                              // placeholder="shipper Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.shipper_name && touched.shipper_name && (
                            <div className="invalid-feedback d-block">
                              {errors.shipper_name}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="vendor_name">
                              Vendor Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control"
                              name="vendor_name"
                              value={"TEMP"}
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.vendor_name && touched.vendor_name && (
                            <div className="invalid-feedback d-block">
                              {errors.vendor_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="ex_rate">Ex. Rate</Label>
                            <Field
                              className="form-control "
                              name="ex_rate"
                              // placeholder="EX Rate"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.ex_rate && touched.ex_rate && (
                            <div className="invalid-feedback d-block">
                              {errors.ex_rate}
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
                              htmlFor="consignee_name"
                              className=" w-50 pe-2"
                            >
                              Client Name
                            </Label>
                            <Field
                              className="form-control "
                              name="client_name"
                              // placeholder="Client Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.client_name && touched.client_name && (
                            <div className="invalid-feedback d-block">
                              {errors.client_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="fc_amount">FC Amount</Label>
                            <Field
                              className="form-control"
                              name="fc_amount"
                              // placeholder="FC Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.fc_amount && touched.fc_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fc_amount}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="amount_sar"> Amount (SAR)</Label>
                            <Field
                              className="form-control"
                              name="amount_sar"
                              // placeholder="Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.amount_sar && touched.amount_sar && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_sar}
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
                          <Label htmlFor="invoice_type">Invoice Type</Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={invoiceTypes}
                            // defaultValue={{ label: invoiceType }}
                            onChange={(data) => {
                              setInvoiceType(data.value);
                              setFieldValue("invoice_type", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="invoice_type"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="job_type" className="form-label">
                            Job Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onChange={(data) => {
                              setFieldValue("job", data.label);
                              setSelectedJob(data);
                            }}
                            styles={customStyles}
                          />
                          {errors.job_type && touched.job_type && (
                            <div className="invalid-feedback d-block">
                              {errors.job_type}
                            </div>
                          )}
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
                            name="remarks"
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
                          <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Ref Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={date}
                              onChange={(date) => setDate(date)}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                fill: "red",
                              }}
                            >
                              <img
                                src="/calendar.svg"
                                alt="calendar"
                                width="20px"
                                height="20px"
                              />
                            </span>
                          </div>

                          {errors.ref_data && touched.ref_data && (
                            <div className="invalid-feedback d-block">
                              {errors.ref_data}
                            </div>
                          )}
                        </div>
                          </Grid>
                          <Grid item lg={6} xs={12}>
                            <div className="form-group mb-3">
                              <div>
                                <Label htmlFor="bill_amount">Bill Amount</Label>
                                <Field
                                  name="bill_amount"
                                  className="form-control"
                                  // placeholder="Remarks"
                                  type="text"
                                  style={{ background: "#EDEDED" }}
                                />
                              </div>
                              <ErrorMessage
                                name="bill_amount"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Grid>

                          <Grid item lg={6} xs={12}>
                          <div className="mb-3">
                          <label htmlFor="due_date" className="form-label">
                            Due Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={date}
                              onChange={(date) => setDate(date)}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                fill: "red",
                              }}
                            >
                              <img
                                src="/calendar.svg"
                                alt="calendar"
                                width="20px"
                                height="20px"
                              />
                            </span>
                          </div>

                          {errors.due_date && touched.due_date && (
                            <div className="invalid-feedback d-block">
                              {errors.due_date}
                            </div>
                          )}
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
