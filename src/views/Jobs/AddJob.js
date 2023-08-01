import { Card, Grid, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import jobsImage from "../../assets/images/jobs-image.png";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Label } from "reactstrap";

const AddJobs = (props) => {
  const [jobType, setJobType] = useState("Enquiry");
  const [jobStatus, setJobStatus] = useState("");
  const [eta, setEta] = useState(new Date());
  const [etd, setEtd] = useState(new Date());
  const [poaOptions, setPoaOptions] = useState([]);
  const [podOptions, setPodOptions] = useState([]);

  const options = [
    // {
    //   label: "Job",
    //   value: "Job",
    // },
    {
      label: "Enquiry",
      value: "Enquiry",
    },
  ];

  const typeOptions = [
    {
      label: "Air Freight",
      value: "Air Freight",
    },
    {
      label: "Sea Freight",
      value: "Sea Freight",
    },
    {
      label: "Land Freight",
      value: "Land Freight",
    },
    {
      label: "Transportation",
      value: "Transportation",
    },
    {
      label: "Warehousing",
      value: "Warehousing",
    },
  ];
  const scopeofworkOptions = [
    {
      label: "D2D",
      value: "D2D",
    },
    {
      label: "EXW",
      value: "EXW",
    },
    {
      label: "FOB",
      value: "FOB",
    },
    {
      label: "CIF",
      value: "CIF",
    },
    {
      label: "CNF",
      value: "CNF",
    },
    {
      label: "C&F",
      value: "C&F",
    },
    {
      label: "DDP",
      value: "DDP",
    },
    {
      label: "DAP",
      value: "DAP",
    },
    {
      label: "CPT",
      value: "CPT",
    },
    {
      label: "TRANS",
      value: "TRANS",
    },
    {
      label: "D-TRANS",
      value: "D-TRANS",
    },
    {
      label: "OTHERS",
      value: "OTHERS",
    },
  ];

  const statusOptions = [
    {
      label: "Cargo Collected",
      value: "Cargo Collected",
    },
    {
      label: "Under Export Clearance",
      value: "Under Export Clearance",
    },
    {
      label: "Departed",
      value: "Departed",
    },
    {
      label: "In Transit",
      value: "In Transit",
    },
    {
      label: "Arrived",
      value: "Arrived",
    },
    {
      label: "Under Import Clearance",
      value: "Under Import Clearance",
    },
    {
      label: "Do Collected",
      value: "Do Collected",
    },
    {
      label: "Gate Pass Issued",
      value: "Gate Pass Issued",
    },
    {
      label: "Under Delivery",
      value: "Under Delivery",
    },
    {
      label: "In Warehouse Storage",
      value: "In Warehouse Storage",
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

  const getPoaOptions = () => {
    apiAuth
      .get("api/master/poa/")

      .then((response) => {
        let data = response.data.results;
        setPoaOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPodOptions = () => {
    apiAuth
      .get("api/master/pod/")

      .then((response) => {
        let data = response.data.results;
        setPodOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const consigneeOptions = [
    {
      label: "Consignee",
      value: "Consignee",
    },
  ];

  const clientOptions = [
    {
      label: "Client",
      value: "Client",
    },
  ];

  useEffect(() => {
    getPoaOptions();
    getPodOptions();
  }, []);

  const history = useHistory();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };
  const goBack = () => {
    history.goBack();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Create New Enquiry</h2>

          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={8}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  // bl_number: "",
                  // bayan_number: "",
                  pod: "",
                  poa: "",
                  poi: "",
                  consignee_name: "",
                  shipper_name: "",
                  client_name: "",
                  remarks: "",
                  job_type: "Enquiry",
                  type: "",
                  scope_of_work: "",
                  job_status: "",
                  eta: null,
                  etd: null,
                  branch: "",
                }}
                validationSchema={Yup.object({
                  // bl_number: Yup.string().required("BL Number is Required"),
                  // bayan_number: Yup.string().required(
                  //   "Bayan Number is Required"
                  // ),
                  pod: Yup.string().required("POD is Required"),
                  poa: Yup.string().required("POA is Required"),
                  poi: Yup.string().required("POI is Required"),
                  consignee_name: Yup.string().required(
                    "Cosignee Name is Required"
                  ),
                  shipper_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Shipper Name is Required"),
                  client_name: Yup.string().required("Client Name is Required"),
                  remarks: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  // job_type: Yup.string().required("Job Type is Required"),
                  type: Yup.string().required("Type is Required"),
                  scope_of_work: Yup.string().required(
                    "Scope of work is Required"
                  ),
                  job_status: Yup.string().required("Job Status is Required"),
                  // eta: Yup.string().nullable().required("ETA is required"),
                  // etd: Yup.string().nullable().required("ETD is required"),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values["eta"] = eta;
                  values["etd"] = etd;
                  const url = "/api/master/job/";
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      // if (response.status === 201) {
                      NotificationManager.success(
                        "",
                        `Enquiry Created Successfully`,
                        3000,
                        null,
                        null,
                        ""
                      );
                      props?.history?.push("/jobs");
                      // } else {
                      // NotificationManager.error(
                      //   "",
                      //   `Job Create Error`,
                      //   3000,
                      //   null,
                      //   null,
                      //   ""
                      // );
                      // }
                    })
                    .catch((error) => {
                      NotificationManager.error(
                        "",
                        `Enquiry Create Error`,
                        3000,
                        null,
                        null,
                        ""
                      );
                    });
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      {/* <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="bl_number" className="form-label">
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
                      </Grid> */}

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="consignee_name"
                            className="form-label"
                          >
                            Consignee Name
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={consigneeOptions}
                            onChange={(data) => {
                              // setJobType(data.value);
                              setFieldValue("consignee_name", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="consignee_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="shipper_name" className="form-label">
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
                    </Grid>

                    {/* <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="bayan_number" className="form-label">
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

                     
                    </Grid> */}

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="pod" className="form-label">
                            POD
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={podOptions?.map((item) => {
                              return {
                                label: item.name,
                                value: item.name,
                              };
                            })}
                            // defaultValue={{ label: jobType }}
                            // onChange={(event) => {
                            //   setJobType(event.value);
                            // }}
                            onChange={(data) => {
                              // setJobType(data.value);
                              setFieldValue("pod", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="pod"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="client_name" className="form-label">
                            Client Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={clientOptions}
                            onChange={(data) => {
                              setFieldValue("client_name", data.value);
                            }}
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="poa" className="form-label">
                            POA
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={poaOptions?.map((item) => {
                              return {
                                label: item.name,
                                value: item.name,
                              };
                            })}
                            // defaultValue={{ label: jobType }}
                            // onChange={(event) => {
                            //   setJobType(event.value);
                            // }}
                            onChange={(data) => {
                              // setJobType(data.value);
                              setFieldValue("poa", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="poa"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="poi" className="form-label">
                            POI
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={poaOptions?.map((item) => {
                              return {
                                label: item.name,
                                value: item.name,
                              };
                            })}
                            onChange={(data) => {
                              // setJobType(data.value);
                              setFieldValue("poi", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="poi"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      {/* <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="job_type" className="form-label">
                            Job Types
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={options}
                            defaultValue={{ label: jobType }}
                            // onChange={(event) => {
                            //   setJobType(event.value);
                            // }}
                            onChange={(data) => {
                              setJobType(data.value);
                              setFieldValue("job_type", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="job_type"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid> */}
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="eta" className="form-label">
                            ETA
                            <span className="text-danger">*</span>
                          </Label>
                          <DatePicker
                            selected={eta}
                            onChange={(date) => {
                              setEta(date);
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="d MMMM yyyy h:mm aa"
                          />
                          <ErrorMessage
                            name="eta"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="etd" className="form-label">
                            ETD
                            <span className="text-danger">*</span>
                          </Label>
                          <DatePicker
                            selected={etd}
                            onChange={(date) => {
                              setEtd(date);
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="d MMMM yyyy h:mm aa"
                          />
                          <ErrorMessage
                            name="etd"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="job_status" className="form-label">
                            Job Status
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={statusOptions}
                            // defaultValue={{ label: jobStatus }}
                            onChange={(data) => {
                              setJobStatus(data.value);
                              setFieldValue("job_status", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="job_status"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="scope_of_work" className="form-label">
                            Scope Of Work
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={scopeofworkOptions}
                            // defaultValue={{ label: jobType }}
                            // onChange={(event) => {
                            //   setJobType(event.value);
                            // }}
                            onChange={(data) => {
                              setJobType(data.value);
                              setFieldValue("scope_of_work", data.value);
                            }}
                          />

                          <ErrorMessage
                            name="scope_of_work"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid spacing={2} container>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="type" className="form-label">
                            Type
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={typeOptions}
                            // defaultValue={{ label: jobType }}
                            // onChange={(event) => {
                            //   setJobType(event.value);
                            // }}
                            onChange={(data) => {
                              setJobType(data.value);
                              setFieldValue("type", data.value);
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

                    <div className="mb-3">
                      <Label htmlFor="remarks" className="form-label">
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

export default AddJobs;
