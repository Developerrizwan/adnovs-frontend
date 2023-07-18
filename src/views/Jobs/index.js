import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import jobsImage from "../../assets/images/jobs-image.png";
import Select from "react-select";

const Jobs = (props) => {
  const [jobType, setJobType] = useState("Job");
  const [jobStatus, setJobStatus] = useState("Cargo Collected");
  const options = [
    {
      label: "Job",
      value: "Job",
    },
    {
      label: "Enquiry",
      value: "Enquiry",
    },
  ];

  const statusOptions = [
    {
      label: "Cargo Collected",
      value: "Cargo_Collected",
    },
    {
      label: "Under Export Clearance",
      value: "Under_Export_Clearance",
    },
    {
      label: "Departed",
      value: "Departed",
    },
    {
      label: "In Transit",
      value: "In_Transit",
    },
    {
      label: "Arrived",
      value: "Arrived",
    },
    {
      label: "Under Import Clearance",
      value: "Under_Import_Clearance",
    },
    {
      label: "Do Collected",
      value: "Do_Collected",
    },
    {
      label: "Gate Pass Issued",
      value: "Gate_Pass_Issued",
    },
    {
      label: "Under Delivery",
      value: "Under_Delivery",
    },
    {
      label: "In Warehouse Storage",
      value: "In_Warehouse_Storage",
    },
    {
      label: "Delivered",
      value: "Delivered",
    },
    {
      label: "Invoiced",
      value: "Invoiced",
    },
    {
      label: "Finished",
      value: "Finished",
    },
    {
      label: "Cancelled",
      value: "Cancelled",
    },
  ];
  const history = useHistory();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const handleOptionChange = (selectedOption) => {
    history.push(`/${selectedOption.value}`);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <h2 className="mb-5 mt-3">Create New Job</h2>
        <Grid container spacing={2}>
          <Grid item lg={8}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  blNumber: "",
                  bayanNumber: "",
                  pod: "",
                  poa: "",
                  consigneeName: "",
                  shipperName: "",
                  clientName: "",
                  remarks: "",
                  jobType: "",
                }}
                validationSchema={Yup.object({
                  blNumber: Yup.string().required("BL Number is Required"),
                  bayanNumber: Yup.string().required(
                    "Bayan Number is Required"
                  ),
                  pod: Yup.string().required("POD is Required"),
                  poa: Yup.string().required("POA is Required"),
                  consigneeName: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Cosignee Name is Required"),
                  shipperName: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Shipper Name is Required"),
                  clientName: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Client Name is Required"),
                  remarks: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                })}
                onSubmit={(values) => {
                  values.jobType = values.jobType ? values.jobType : undefined;
                  console.log("values", values);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="blNumber" className="form-label">
                            BL Number
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control jobs-field"
                            name="blNumber"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.blNumber && touched.blNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.blNumber}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="consigneeName" className="form-label">
                            Consignee Name
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="consigneeName"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.consigneeName && touched.consigneeName && (
                            <div className="invalid-feedback d-block">
                              {errors.consigneeName}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="bayanNumber" className="form-label">
                            Bayan Number
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="bayanNumber"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.bayanNumber && touched.bayanNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.bayanNumber}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="shiperName" className="form-label">
                            Shipper Name
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="shipperName"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.shipperName && touched.shipperName && (
                            <div className="invalid-feedback d-block">
                              {errors.shipperName}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="pod" className="form-label">
                            POD
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="pod"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.pod && touched.pod && (
                            <div className="invalid-feedback d-block">
                              {errors.pod}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="clientName" className="form-label">
                            Client Name
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="clientName"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.clientName && touched.clientName && (
                            <div className="invalid-feedback d-block">
                              {errors.clientName}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="poa" className="form-label">
                            POA
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="poa"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.poa && touched.poa && (
                            <div className="invalid-feedback d-block">
                              {errors.poa}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="jobType" className="form-label">
                            Job Types
                            <span className="text-danger">*</span>
                          </label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={options?.map((type) => {
                              return {
                                label: type.label,
                                value: type.label,
                              };
                            })}
                            defaultValue={{ label: jobType }}
                            onChange={(event) => {
                              setJobType(event.value);
                            }}
                          />

                          {errors.jobType && touched.jobType && (
                            <div className="invalid-feedback d-block">
                              {errors.jobType}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="jobStatus" className="form-label">
                            Job Status
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={statusOptions?.map((type) => {
                              return {
                                label: type.label,
                                value: type.label,
                              };
                            })}
                            defaultValue={{ label: jobStatus }}
                            onChange={(event) => {
                              setJobStatus(event.value);
                            }}
                          />
                          {errors.jobStatus && touched.jobStatus && (
                            <div className="invalid-feedback d-block">
                              {errors.jobStatus}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}></Grid>
                    </Grid>

                    <div className="mb-3">
                      <label htmlFor="remarks" className="form-label">
                        Remarks
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="textarea"
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

                    <div className="mt-4 mb-3">
                      <button className="btn btn-success" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
          <Grid item lg={4} style={{ margin: "auto" }}>
            <img src={jobsImage} alt="" />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default Jobs;
