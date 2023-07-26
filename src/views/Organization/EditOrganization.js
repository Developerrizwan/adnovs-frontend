import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Label, Button } from "reactstrap";

const EditOrganization = (props) => {
  const etaTime = props.allJobs.eta;
  const etdTime = props.allJobs.etd;

  const etaDateObj = new Date(etaTime);
  const etdDateObj = new Date(etdTime);

  const [typevalue, setTypevalue] = useState(null);
  const [scopeType, setScopeType] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [poaValue, setPoaValue] = useState(null);
  const [podValue, setPodValue] = useState(null);
  const [eta, setEta] = useState(etaDateObj);
  const [etd, setEtd] = useState(etdDateObj);

  const poaOptions = [
    {
      label: "Doha Hamad",
      value: "Doha Hamad",
    },
    {
      label: "Tokyo Haneda",
      value: "Tokyo Haneda",
    },
    {
      label: "Singapore Changi",
      value: "Singapore Changi",
    },
    {
      label: "Tokyo Narita",
      value: "Tokyo Narita",
    },
    {
      label: "Seoul Incheon",
      value: "Seoul Incheon",
    },
    {
      label: "Paris CDG",
      value: "Paris CDG",
    },
    {
      label: "Istanbul",
      value: "Istanbul",
    },
    {
      label: "Munich",
      value: "Munich",
    },
    {
      label: "Zurich",
      value: "Zurich",
    },
    {
      label: "Kansai",
      value: "Kansai",
    },
    {
      label: "Centrair Nagoya",
      value: "Centrair Nagoya",
    },
    {
      label: "Helsinki Vantaa",
      value: "Helsinki Vantaa",
    },
    {
      label: "London Heathrow",
      value: "London Heathrow",
    },
    {
      label: "Dubai",
      value: "Dubai",
    },
    {
      label: "Amsterdam Schiphol",
      value: "Amsterdam Schiphols",
    },
  ];

  const podOptions = [
    {
      label: "Shanghai",
      value: "Shanghai",
    },
    {
      label: "Singapore",
      value: "Singapore",
    },
    {
      label: "Ningbo Zhoushan",
      value: "Ningbo Zhoushan",
    },
    {
      label: "Busan",
      value: "Busan",
    },
    {
      label: "Jebel Ali",
      value: "Jebel Ali",
    },
    {
      label: "Rotterdam",
      value: "Rotterdam",
    },
    {
      label: "Port of Tanjung Pelepas",
      value: "Port of Tanjung Pelepas",
    },
    {
      label: "Los Angeles",
      value: "Los Angeles",
    },
    {
      label: "South Louisiana",
      value: "South Louisiana",
    },
    {
      label: "Antwerp",
      value: "Antwerp",
    },
    {
      label: "Hamburg ",
      value: "Hamburg ",
    },
    {
      label: "Felixstowe",
      value: "Felixstowe",
    },
    {
      label: "Itaqui",
      value: "Itaqui",
    },
    {
      label: "Durban",
      value: "Durban",
    },
    {
      label: "Port Hedland",
      value: "Port Hedland",
    },
  ];

  useEffect(() => {
    const scopeType = scopeofworkOptions.find(
      (item) => item.value === props.allJobs.scope_of_work
    );
    setScopeType(scopeType);
    const type = typeOptions.find((item) => item.value === props.allJobs.type);
    setTypevalue(type);
    const jobStatus = statusOptions.find(
      (item) => item.value === props.allJobs.job_status
    );
    setJobStatus(jobStatus);

    const poa = poaOptions.find((item) => item.value === props.allJobs.poa);
    setPoaValue(poa);
    const pod_Value = podOptions.find(
      (item) => item.value === props.allJobs?.pod
    );

    setPodValue(pod_Value);
  }, []);

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
  const history = useHistory();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  return (
    <React.Fragment>
      {props.allJobs ? (
        <Card className="p-3" style={{ background: "#EDEDED" }}>
          <Formik
            initialValues={{
              pod: props?.allJobs?.pod ? props?.allJobs?.pod : "",
              poa: props?.allJobs?.poa ? props?.allJobs?.poa : "",
              consignee_name: props?.allJobs?.consignee_name
                ? props?.allJobs?.consignee_name
                : "",
              shipper_name: props?.allJobs?.shipper_name
                ? props?.allJobs?.shipper_name
                : "",
              client_name: props?.allJobs?.client_name
                ? props?.allJobs?.client_name
                : "",
              remarks: props?.allJobs?.remarks ? props?.allJobs?.remarks : "",
              job_type: props?.allJobs?.job_type
                ? props?.allJobs?.job_type
                : "Enquiry",
              job_status: props?.allJobs?.job_status
                ? props?.allJobs?.job_status
                : "",
              type: props?.allJobs?.type ? props?.allJobs?.type : "",
              scope_of_work: props?.allJobs?.scope_of_work
                ? props?.allJobs?.scope_of_work
                : "",
              eta: props?.allJobs?.eta ? props?.allJobs?.eta : "",
              etd: props?.allJobs?.etd ? props?.allJobs?.etd : "",
            }}
            validationSchema={Yup.object({
              pod: Yup.string().required("POD is Required"),
              poa: Yup.string().required("POA is Required"),
              consignee_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Cosignee Name is Required"),
              shipper_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Shipper Name is Required"),
              client_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Client Name is Required"),
              remarks: Yup.string()
                .max(400, "Must be 400 characters or less")
                .trim()
                .required("Remarks is Required"),
              job_type: Yup.string().required("Job Type is Required"),
              type: Yup.string().required("Type is Required"),
              scope_of_work: Yup.string().required("Scope of work is Required"),
              job_status: Yup.string().required("Job Status is Required"),
            })}
            onSubmit={(values, { reset }) => {
              const company = JSON.parse(
                localStorage.getItem("authUser")
              )?.company_id;
              values["company"] = company;
              if (eta) values["eta"] = eta;
              if (etd) values["etd"] = etd;

              const url = `/api/master/job/${props.allJobs.id}/`;
              apiAuth
                .patch(url, values)
                .then((response) => {
                  if (response.status === 200) {
                    NotificationManager.success(
                      "",
                      ` Enquiry Updated Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    props.closeAddPopup();
                  } else {
                    NotificationManager.error(
                      "",
                      `Enquiry Update Error`,
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
                    `Enquiry Update Error`,
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
                      <Label htmlFor="consignee_name" className="form-label">
                        Consignee Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
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
                        options={podOptions}
                        value={podValue}
                        onChange={(data) => {
                          setPodValue(data);
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
                        options={poaOptions}
                        value={poaValue}
                        onChange={(data) => {
                          setPoaValue(data);
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
                      <Label htmlFor="type" className="form-label">
                        Type
                        <span className="text-danger">*</span>
                      </Label>

                      <Select
                        name="type"
                        placeholder={"Select"}
                        styles={customStyles}
                        options={typeOptions}
                        value={typevalue}
                        onChange={(data) => {
                          setTypevalue(data);
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
                        value={scopeType}
                        options={scopeofworkOptions}
                        onChange={(data) => {
                          setScopeType(data.value);
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
                        value={jobStatus}
                        options={statusOptions}
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

                  <Grid item lg={6} xs={12}></Grid>
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
                    render={(msg) => <div className="text-danger">{msg}</div>}
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    color="success"
                    className={`btn btn-success  ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    // size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">Update</span>
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
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default EditOrganization;
