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

const CreateNewJob = (props) => {
  const [jobType, setJobType] = useState("Job");
  const [branchValue, setBranchValue] = useState("JEDDHA");
  const [eta, setEta] = useState(new Date());
  const [etd, setEtd] = useState(new Date());
  const [poaOptions, setPoaOptions] = useState([]);
  const [podOptions, setPodOptions] = useState([]);
  const [organization_type, setOrganization_type] = useState([]);
  const options = [
    {
      label: "Job",
      value: "Job",
    },
  ];

  const branchOptions = [{ label: "JEDDHA", value: "JEDDHA" }];

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

  const OrganizationTypeOptions = [
    {
      label: "Consignee",
      value: "Consignee",
    },
    {
      label: "Client",
      value: "Client",
    },
    {
      label: "Notify",
      value: "Notify",
    },
    {
      label: "Shipper",
      value: "Shipper",
    },
    {
      label: "Broker",
      value: "Broker",
    },
    {
      label: "Transporter",
      value: "Transporter",
    },
    {
      label: "Counterpart",
      value: "Counterpart",
    },
    {
      label: "Coloader",
      value: "Coloader",
    },
    {
      label: "Supplier",
      value: "Supplier",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

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

  const getPoaOptions = () => {
    apiAuth
      .get("api/master/poa/")

      .then((response) => {
        let data = response.data.results;
        console.log("dswdwd", data);
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
        console.log("poa", data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPoaOptions();
    getPodOptions();
  }, []);

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

  const containerTypes = [
    {
      label: "20DC",
      value: "20DC",
    },
    {
      label: "20RF",
      value: "20RF",
    },
    {
      label: "20ST",
      value: "20ST",
    },
    {
      label: "20OT",
      value: "20OT",
    },
    {
      label: "20HC",
      value: "20HC",
    },
    {
      label: "40DC",
      value: "40DC",
    },
    {
      label: "40DC",
      value: "40DC",
    },
    {
      label: "40RF",
      value: "40RF",
    },
    {
      label: "40ST",
      value: "40ST",
    },
    {
      label: "40OT",
      value: "40OT",
    },
    {
      label: "40HC",
      value: "40HC",
    },
    {
      label: "FLAT RACK",
      value: "FLAT RACK",
    },
    {
      label: "FTL",
      value: "FTL",
    },
    {
      label: "LTL",
      value: "LTL",
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

  const handleMultiSelectChange = (data) => {
    setOrganization_type(data.map((item) => item.label));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Create New Job</h2>

          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={8}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  bl_number: "",
                  bayan_number: "",
                  pod: "",
                  poa: "",
                  por: "",
                  consignee_name: "",
                  shipper_name: "",
                  client_name: "",
                  remarks: "",
                  job_type: "Job",
                  job_status: "",
                  container_type: "",
                  type: "",
                  scope_of_work: "",
                  eta: null,
                  etd: null,
                  organization_type: "",
                  branch: "JEDDHA",
                }}
                validationSchema={Yup.object({
                  bl_number: Yup.string().required("BL Number is Required"),
                  branch: Yup.string().required("Branch is Required"),
                  bayan_number: Yup.string().required(
                    "Bayan Number is Required"
                  ),
                  pod: Yup.string().required("POD is Required"),
                  poa: Yup.string().required("POA is Required"),
                  por: Yup.string().required("Place Of Receipt is Required"),
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
                  job_type: Yup.string().required("Job Type is Required"),
                  type: Yup.string().required("Type is Required"),
                  scope_of_work: Yup.string().required(
                    "Scope of work is Required"
                  ),
                  job_status: Yup.string().required("Job Status is Required"),
                  // organization_type: Yup.string().required(
                  //   "Organization Type is Required"
                  // ),
                  container_type: Yup.string().required(
                    "Container Type is Required"
                  ),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values["eta"] = eta;
                  values["etd"] = etd;
                  values["organization_type"] = organization_type;
                  const url = `/api/master/job/`;
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      NotificationManager.success(
                        "",
                        `Job Created Successfully`,
                        3000,
                        null,
                        null,
                        ""
                      );
                      props?.history?.push("/jobs");
                    })
                    .catch((error) => {
                      NotificationManager.error(
                        "",
                        `Job Create Error`,
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
                      <Grid item lg={6} xs={12}>
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
                      </Grid>

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
                    </Grid>
                    <Grid container spacing={2}>
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
                            // value={podValue}
                            onChange={(data) => {
                              //   setPodValue(data);
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
                            // value={poaValue}
                            onChange={(data) => {
                              //   setPoaValue(data);
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
                        <div className="mb-3" style={{ zIndex: "500" }}>
                          <Label htmlFor="container" className="form-label">
                            Container/Consignment
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={containerTypes}
                            onChange={(data) => {
                              setFieldValue("container_type", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="container_type"
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
                            // value={typevalue}
                            onChange={(data) => {
                              //   setTypevalue(data);
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

                    <Grid container spacing={2}>
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
                            // value={scopeType}
                            onChange={(data) => {
                              //   setScopeType(data);
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="etd" className="form-label">
                            ETD
                            <span className="text-danger">*</span>
                          </Label>
                          <DatePicker
                            // selected={moment(etd).format("YYYY-MM-DD HH:mm:ss")}
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
                            // value={jobStatus}
                            // defaultValue={{ label: jobStatus }}
                            onChange={(data) => {
                              // setJobStatus(data);
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="branch" className="form-label">
                            Branch
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            defaultValue={{
                              label: branchValue,
                              value: branchValue,
                            }}
                            onChange={(data) => {
                              setFieldValue("branch", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="branch"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="organization_type"
                            className="form-label"
                          >
                            Organization Type
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={OrganizationTypeOptions}
                            isMulti
                            value={organization_type.map((label) => ({
                              label,
                              value: label,
                            }))}
                            onChange={handleMultiSelectChange}
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

export default CreateNewJob;
