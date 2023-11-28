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
  const [cols, setCols] = useState([
    {
      Header: "Job Number",
      accessor: (row, rowIndex) => row,
      Cell: ({ cell: { value }, row }) => <>{value?.job_number}</>,
    },
  ]);

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
        setState({ ...state, job: data });
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
        setState({ ...state, invoices: data, loading: false });
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
        setState({ ...state, loading: false });
      });
  };

  const getVouchers = () => {
    setState({ ...state, loading: true });
    apiAuth
      .get(`/api/job_voucher?job=${jobId}`)
      .then((response) => {
        let { data } = response;
        // console.log("vouchers", data);
        setState({ ...state, vouchers: data, loading: false });
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
        setState({ ...state, loading: false });
      });
  };

  return (
    <>
      {console.log("wwwwwwwwww", state)}
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
                          company: JSON.parse(localStorage.getItem("authUser"))
                            ?.company_id,
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
                          job_type:
                            //  state?.job?.job_type
                            //   ? state?.job?.job_type
                            "Job",
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
                            ? moment(state?.job?.eta).format(
                                "DD/MM/yyyy hh:mm:ss A"
                              )
                            : new Date(),
                          etd: state?.job?.etd
                            ? moment(state?.job?.etd).format(
                                "DD/MM/yyyy hh:mm:ss A"
                              )
                            : new Date(),
                          organization_type: state?.job?.organization_type
                            ? state?.job?.organization_type
                            : [],
                          branch: "JEDDHA",
                          parties: state?.job?.parties
                            ? state?.job?.parties
                            : [],
                          notify: state?.job?.notify?.name || "",
                          client_ref: state?.job?.client_ref || "",
                          broker: state?.job?.broker?.name || "",
                          transporter: state?.transporter || "",
                          commodity: state?.commodity || "",
                          quantity_text: state?.commodity || "",
                        }}
                        // validationSchema={Yup.object({
                        //   bl_number: Yup.string().required(
                        //     "BL Number is Required"
                        //   ),
                        //   branch: Yup.string().required("Branch is Required"),
                        //   bayan_number: Yup.string().required(
                        //     "Bayan Number is Required"
                        //   ),
                        //   pod: Yup.string()
                        //     .ensure()
                        //     .required("POD is Required"),
                        //   poa: Yup.string().required("POA is Required"),
                        //   por: Yup.string().required(
                        //     "Place Of Receipt is Required"
                        //   ),
                        //   pol: Yup.string()
                        //     .ensure()
                        //     .required("POL is Required"),
                        //   consignee_name: Yup.string()
                        //     .ensure()
                        //     .required("Cosignee Name is Required"),
                        //   shipper_name: Yup.string()
                        //     .max(50, "Must be 50 characters or less")
                        //     .trim()
                        //     .required("Shipper Name is Required"),
                        //   client_name: Yup.string()
                        //     .ensure()
                        //     .required("Client Name is Required"),
                        //   remarks: Yup.string()
                        //     .max(400, "Must be 400 characters or less")
                        //     .trim()
                        //     .required("Remarks is Required"),
                        //   type: Yup.string().required("Type is Required"),
                        //   scope_of_work: Yup.string().required(
                        //     "Scope of work is Required"
                        //   ),
                        //   job_status: Yup.string().required(
                        //     "Job Status is Required"
                        //   ),
                        // })}
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
                                    className="form-control"
                                    placeholder="Quantity"
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
