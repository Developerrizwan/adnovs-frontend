import React, { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import Select from "react-select";
import { Form } from "react-formik-ui";
import { useParams } from "react-router";
import apiAuth from "../../helpers/ApiAuth";
import DataTable from "react-data-table-component";
import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Row, Container, Label, Button } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import moment from "moment";

const JobDetail = (props) => {
  const { jobId } = useParams();
  const [state, setState] = useState({});

  useEffect(() => {
    console.log("jobId", jobId);
    getJobDetail();
    getInvoices();
    getVouchers();
  }, []);

  const getJobDetail = () => {
    apiAuth
      .get(`/api/master/job/${jobId}`)
      .then((response) => {
        let { data } = response;
        // console.log("dddd", data);
        setState((prev) => ({ ...prev, job: data }));
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error("", `Job Get Error`, 3000, null, null, "");
      });
  };

  const getInvoices = () => {
    setState({ ...state, loading: true });
    apiAuth
      .get(`/api/job_invoice?job=${jobId}`)
      .then((response) => {
        let { data } = response;
        // console.log("invoices", data);
        setState((prev) => ({ ...prev, invoices: data, loading: false }));
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Vouchers Get Error`,
          3000,
          null,
          null,
          ""
        );
        setState((prev) => ({ ...prev, loading: false }));
      });
  };

  const getVouchers = () => {
    setState((prev) => ({ ...prev, loading: true }));
    apiAuth
      .get(`/api/job_voucher?job=${jobId}`)
      .then((response) => {
        let { data } = response;
        // console.log("vouchers", data);
        setState((prev) => ({ ...prev, vouchers: data, loading: false }));
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Vouchers Get Error`,
          3000,
          null,
          null,
          ""
        );
        setState((prev) => ({ ...prev, loading: false }));
      });
  };

  return (
    <>
      {/* {console.log("wwwwwwwwww", state)} */}
      <div className="page-content">
        <Container fluid>
          <Fragment>
            <>
              <Row mb="4">
                <Colxx lg="12">
                  <div className="card mt-4">
                    <div className="card-body">
                      <h4>Job Details</h4>
                      <Formik
                        enableReinitialize
                        initialValues={{
                          bl_number: state?.job?.bl_number
                            ? state?.job?.bl_number
                            : "",
                          job_number: state?.job?.job_number
                            ? state?.job?.job_number
                            : "",
                          bayan_number: state?.job?.bayan_number
                            ? state?.job?.bayan_number
                            : "",
                          pod: state?.job?.pod ? state?.job?.pod : "",
                          poa: state?.job?.poa ? state?.job?.poa : "",
                          por: state?.job?.por ? state?.job?.por : "",
                          pol: state?.job?.pol ? state?.job?.pol : "",
                          consignee_name: state?.job?.consignee_name
                            ? state?.job?.consignee_name?.name
                            : "",
                          shipper_name: state?.job?.shipper_name
                            ? state?.job?.shipper_name
                            : "",
                          client_name: state?.job?.client_name
                            ? state?.job?.client_name?.name
                            : "",
                          remarks: state?.job?.remarks
                            ? state?.job?.remarks
                            : "",
                          job_type: state?.job?.job_type
                            ? state?.job?.job_type
                            : "Job",
                          job_status: state?.job?.job_status
                            ? state?.job?.job_status
                            : "",
                          container_type: state?.job?.container_type
                            ? state?.job?.container_type
                            : "",
                          enquiry_number: state?.job?.enquiry_number
                            ? state?.job?.enquiry_number
                            : "",

                          type: state?.job?.type ? state?.job?.type : "",
                          scope_of_work: state?.job?.scope_of_work
                            ? state?.job?.scope_of_work
                            : "",
                          eta: state?.job?.eta
                            ? moment(state?.job?.eta).format("DD/MM/yyyy")
                            : new Date(),
                          etd: state?.job?.etd
                            ? moment(state?.job?.etd).format("DD/MM/yyyy")
                            : new Date(),
                          organization_type: state?.job?.organization_type
                            ? state?.job?.organization_type.toString(", ")
                            : [],
                          branch: state?.job?.branch || "",
                          parties: state?.job?.parties.toString(", ")
                            ? state?.job?.parties
                            : [],
                          notify: state?.job?.notify?.name || "",
                          client_ref: state?.job?.client_ref || "",
                          broker: state?.job?.broker?.name || "",
                          transporter: state?.job?.transporter || "",
                          commodity: state?.job?.commodity || "",
                          quantity_text: state?.job?.quantity_text || "",
                        }}
                        onSubmit={(values, { reset }) => {}}
                      >
                        {({ values, setFieldValue }) => (
                          <Form className="av-tooltip tooltip-label-bottom">
                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="job_number"
                                    className="form-label"
                                  >
                                    Job Number
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control jobs-field"
                                    name="job_number"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="job_number"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="bl_number"
                                    className="form-label"
                                  >
                                    BL Number
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control jobs-field"
                                    name="bl_number"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="bl_number"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="consignee_name"
                                    className="form-label"
                                  >
                                    Consignee Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control jobs-field"
                                    name="consignee_name"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="consignee_name"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="client_name"
                                    className="form-label"
                                  >
                                    Client Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="client_name"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="client_name"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="pod" className="form-label">
                                    POD
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="pod"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="pod"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>

                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="poa" className="form-label">
                                    POA
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="poa"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="poa"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="pol" className="form-label">
                                    POL
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="pol"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="pol"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="bayan_number"
                                    className="form-label"
                                  >
                                    Bayan Number
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="bayan_number"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="bayan_number"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="por" className="form-label">
                                    Place Of Receipt
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="por"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="por"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="type" className="form-label">
                                    Type
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="type"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="type"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="scope_of_work"
                                    className="form-label"
                                  >
                                    Scope Of Work
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="scope_of_work"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="scope_of_work"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="eta" className="form-label">
                                    ETA
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="eta"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="eta"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label htmlFor="etd" className="form-label">
                                    ETD
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="etd"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="etd"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="job_status"
                                    className="form-label"
                                  >
                                    Job Status
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="job_status"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="job_status"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="branch"
                                    className="form-label"
                                  >
                                    Branch
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="branch"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="branch"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="organization_type"
                                    className="form-label"
                                  >
                                    Organization Types
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="organization_type"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name=" organization_type"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="parties"
                                    className="form-label"
                                  >
                                    Parties
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="parties"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="parties"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="notify"
                                    className="form-label"
                                  >
                                    Notify
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="notify"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="notify"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="broker"
                                    className="form-label"
                                  >
                                    Broker
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="broker"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="broker"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="commodity"
                                    className="form-label"
                                  >
                                    Commodity
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    placeholder="Commodity"
                                    name="commodity"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="commodity"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="container"
                                    className="form-label"
                                  >
                                    Container/Consignment
                                    {/* <span className="text-danger">*</span> */}
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="container"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="container_type"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="transporter"
                                    className="form-label"
                                  >
                                    Transporter
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="transporter"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="transporter"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="quantity_text"
                                    className="form-label"
                                  >
                                    Quantity
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="quantity_text"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="quantity_text"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="client_ref"
                                    className="form-label"
                                  >
                                    Client Ref
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="client_ref"
                                    placeholder="Client Ref"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="client_ref"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="shipper_name"
                                    className="form-label"
                                  >
                                    Shipper Name
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    className="form-control"
                                    name="shipper_name"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="shipper_name"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                              <Grid item lg={3} xs={12}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="remarks"
                                    className="form-label"
                                  >
                                    Remarks
                                    <span className="text-danger">*</span>
                                  </Label>
                                  <Field
                                    disabled
                                    as="textarea"
                                    className="form-control"
                                    name="remarks"
                                    style={{ background: "#EDEDED" }}
                                  />
                                  <ErrorMessage
                                    name="remarks"
                                    render={(msg) => (
                                      <div className="text-danger">{msg}</div>
                                    )}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            {/* <div className="d-flex justify-content-between">
                              <Button
                                type="submit"
                                color="success"
                                className={`btn btn-success  ${
                                  props.loading ? "show-spinner" : ""
                                }`}
                              >
                                <span className="spinner d-inline-block">
                                  <span className="bounce1" />
                                  <span className="bounce2" />
                                  <span className="bounce3" />
                                </span>
                                <span className="label">Submit</span>
                              </Button>{" "}
                              <Button
                                colo="success"
                                className="btn  float-right"
                                type="reset"
                                onClick={() => props.closeAddPopup()}
                              >
                                {" "}
                                Cancel{" "}
                              </Button>
                            </div> */}
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="card-body">
                      <h4>Invoices</h4>
                      {console.log("invoices", state?.invoices)}
                      <DataTable
                        customStyles={customStyles}
                        columns={[
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Invoice Number
                              </span>
                            ),
                            selector: (row) => row.invoice_number,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.invoice_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.invoice_number}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Job Number
                              </span>
                            ),
                            selector: (row) => row.job?.job_number,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.job?.job_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.job?.job_number}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                BL Number
                              </span>
                            ),
                            selector: (row) => row.bl_number,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.bl_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.bl_number}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Consignee Name
                              </span>
                            ),
                            selector: (row) => row.consignee_name?.name,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.consignee_name?.name}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.consignee_name?.name}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Date
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={moment(value?.date).format(
                                    "MM/DD/YYYY"
                                  )}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {moment(value?.date).format("MM/DD/YYYY")}
                                </div>
                              );
                            },
                          },

                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Currency
                              </span>
                            ),
                            selector: (row) => row.currency_sar,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.currency_sar}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.currency_sar}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Bayan Number
                              </span>
                            ),
                            selector: (row) => row.bayan_number,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.bayan_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.bayan_number}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Shipper Name
                              </span>
                            ),
                            selector: (row) => row.shipper_name,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.shipper_name}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.shipper_name}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Branch
                              </span>
                            ),
                            selector: (row) => row.branch,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.branch}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value?.branch}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Ex Rate
                              </span>
                            ),
                            selector: (row) => row.ex_rate,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.ex_rate}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.ex_rate}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                POD
                              </span>
                            ),
                            selector: (row) => row.pod,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.pod}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.pod}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Client Name
                              </span>
                            ),
                            selector: (row) => row.client_name?.name,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.client_name?.name}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value?.client_name?.name}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                FC Amount
                              </span>
                            ),
                            selector: (row) => row.fc_amount,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.fc_amount}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.fc_amount}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Amount
                              </span>
                            ),
                            selector: (row) => row.amount_sar,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.amount_sar}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.amount_sar}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                POA
                              </span>
                            ),
                            selector: (row) => row.poa,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.poa}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.poa}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Invoice Type
                              </span>
                            ),
                            selector: (row) => row.invoice_type,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.invoice_type}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.invoice_type}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Remarks
                              </span>
                            ),
                            selector: (row) => row.remarks,
                            cell: (value) => (
                              <div
                                title={value.remarks}
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "200px",
                                }}
                              >
                                {value.remarks}
                              </div>
                            ),
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Invoice Status
                              </span>
                            ),
                            selector: (row) => row.payment_status,
                            cell: (value) => (
                              <div
                                title={value.payment_status}
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "200px",
                                }}
                              >
                                {value.payment_status}
                              </div>
                            ),
                          },
                        ]}
                        data={state?.invoices}
                        paginationPerPage={props.userPagination?.rowsPerPage}
                        onChangePage={(p, t) => {
                          props.handlePagination({
                            ...props.userPagination,
                            currentPage: p,
                          });
                        }}
                        onChangeRowsPerPage={(c, t) => {
                          props.handlePagination({
                            ...props.userPagination,
                            rowsPerPage: c,
                            currentPage: t,
                          });
                        }}
                        paginationServer
                        paginationDefaultPage={
                          props.userPagination?.currentPage
                        }
                        paginationTotalRows={props.userPagination?.totalRows}
                        pagination={state?.invoices?.length > 10}
                      />
                    </div>
                    <div className="card-body">
                      <h4>Vouchers</h4>
                      {console.log("vouchers", state?.vouchers)}
                      <DataTable
                        customStyles={customStyles}
                        columns={[
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Voucher Type
                              </span>
                            ),
                            selector: (row) => row.voucher_type,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.voucher_type}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.voucher_type}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Branch
                              </span>
                            ),
                            selector: (row) => row.branch,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.branch}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.branch}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Job ID
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.job?.job_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.job?.job_number}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Date
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={moment(value?.date).format(
                                    "MM/DD/YYYY"
                                  )}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {moment(value?.date).format("MM/DD/YYYY")}
                                </div>
                              );
                            },
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                G/L Date
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={moment(value?.gl_date).format(
                                    "MM/DD/YYYY"
                                  )}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {moment(value?.gl_date).format("MM/DD/YYYY")}
                                </div>
                              );
                            },
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                FC Amount
                              </span>
                            ),
                            selector: (row) => row.fc_amount,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.fc_amount}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.fc_amount}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Amount(SAR)
                              </span>
                            ),
                            selector: (row) => row.amount_sar,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.amount_sar}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.amount_sar}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Party A/C
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.party_account?.code}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value?.party_account_type === "organization"
                                    ? value.party_account?.name
                                    : value.party_account?.code}
                                </div>
                              );
                            },
                            sortable: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Invoice
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.invoice?.invoice_number}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.invoice?.invoice_number}
                                </div>
                              );
                            },
                            sortable: true,
                            checkHide: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Voucher For
                              </span>
                            ),
                            selector: (row) => row,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.voucher_for}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value?.voucher_for}
                                </div>
                              );
                            },
                            sortable: true,
                            checkHide: true,
                          },
                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Naration
                              </span>
                            ),
                            selector: (row) => row.naration,
                            cell: (value) => {
                              return (
                                <div
                                  title={value?.naration}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.naration}
                                </div>
                              );
                            },
                            sortable: true,
                          },

                          {
                            name: (
                              <span className="font-weight-bold fs-13">
                                Remarks
                              </span>
                            ),
                            selector: (row) => row.remarks,
                            cell: (value) => {
                              return (
                                <div
                                  title={value.remarks}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "200px",
                                  }}
                                >
                                  {value.remarks}
                                </div>
                              );
                            },

                            sortable: true,
                          },
                        ]}
                        data={state?.vouchers}
                        paginationPerPage={props.userPagination?.rowsPerPage}
                        onChangePage={(p, t) => {
                          props.handlePagination({
                            ...props.userPagination,
                            currentPage: p,
                          });
                        }}
                        onChangeRowsPerPage={(c, t) => {
                          props.handlePagination({
                            ...props.userPagination,
                            rowsPerPage: c,
                            currentPage: t,
                          });
                        }}
                        paginationServer
                        paginationDefaultPage={
                          props.userPagination?.currentPage
                        }
                        paginationTotalRows={props.userPagination?.totalRows}
                        pagination={state?.invoices?.length > 10}
                      />
                    </div>
                  </div>
                </Colxx>
              </Row>
            </>
          </Fragment>
        </Container>
      </div>
    </>
  );
};

export default JobDetail;
