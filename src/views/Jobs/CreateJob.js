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
import { Label, Button } from "reactstrap";
import zIndex from "@mui/material/styles/zIndex";

const CreateJob = (props) => {
  const [jobType, setJobType] = useState("Job");
  const [typevalue, setTypevalue] = useState(null);
  const [scopeType, setScopeType] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [eta, setEta] = useState(new Date());
  const [etd, setEtd] = useState(new Date());
  const [organization_type, setOrganization_type] = useState([]);
  const options = [
    {
      label: "Job",
      value: "Job",
    },
    // {
    //   label: "Enquiry",
    //   value: "Enquiry",
    // },
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
      label: "Hamburg",
      value: "Hamburg",
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };
  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const jobtype = options.find(
      (item) => item.value === props.allJobs.job_type
    );
    setJobType(jobtype);
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
  }, [
    props.allJobs.job_type,
    props.allJobs.scope_of_work,
    props.allJobs.type,
    props.allJobs.job_status,
  ]);

  const handleMultiSelectChange = (data) => {
    console.log(
      "Selected labels:",
      data.map((item) => item.label)
    );
    setOrganization_type(data.map((item) => item.label));
  };
  return (
    <React.Fragment>
      {props.allJobs ? (
        <Card className="p-3" style={{ background: "#EDEDED" }}>
          <Formik
            initialValues={{
              bl_number: props?.allJobs?.bl_number
                ? props?.allJobs?.bl_number
                : "",
              bayan_number: props?.allJobs?.bayan_number
                ? props?.allJobs?.bayan_number
                : "",
              pod: props?.allJobs?.pod ? props?.allJobs?.pod : "",
              poa: props?.allJobs?.poa ? props?.allJobs?.poa : "",
              por: props?.allJobs?.por ? props?.allJobs?.por : "",
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
                : "",
              job_status: props?.allJobs?.job_status
                ? props?.allJobs?.job_status
                : "",
              container_type: props?.allJobs?.container_type
                ? props?.allJobs?.container_type
                : "",
              type: props?.allJobs?.type ? props?.allJobs?.type : "",
              scope_of_work: props?.allJobs?.scope_of_work
                ? props?.allJobs?.scope_of_work
                : "",
              eta: props?.allJobs?.eta ? props?.allJobs?.eta : "",
              etd: props?.allJobs?.etd ? props?.allJobs?.etd : "",
              organization_type: props?.allJobs?.organization_type
                ? props?.allJobs?.organization_type
                : "",
              branch: "JEDDHA",
            }}
            validationSchema={Yup.object({
              bl_number: Yup.string().required("BL Number is Required"),
              branch: Yup.string().required("Branch is Required"),
              bayan_number: Yup.string().required("Bayan Number is Required"),
              pod: Yup.string().required("POD is Required"),
              poa: Yup.string().required("POA is Required"),
              por: Yup.string().required("Place Of Receipt is Required"),
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
                  // if (response.status === 200) {
                  NotificationManager.success(
                    "",
                    `Job Created Successfully`,
                    3000,
                    null,
                    null,
                    ""
                  );
                  props.closeAddPopup();
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
                        options={podOptions}
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
                        // defaultValue={{ label: jobStatus }}
                        onChange={(data) => {
                          //   setJobStatus(data.value);
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
                      <Label htmlFor="job_type" className="form-label">
                        Job Types
                        <span className="text-danger">*</span>
                      </Label>

                      <Select
                        name="type"
                        placeholder={"Select"}
                        styles={customStyles}
                        options={options}
                        value={jobType}
                        defaultValue={{ label: jobType }}
                        // onChange={(event) => {
                        //   setJobType(event.value);
                        // }}
                        onChange={(data) => {
                          setJobType(data);
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
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
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
                        // defaultValue={{ label: jobType }}
                        // onChange={(event) => {
                        //   setJobType(event.value);
                        // }}
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
                        options={scopeofworkOptions}
                        value={scopeType}
                        // defaultValue={{ label: jobType }}
                        // onChange={(event) => {
                        //   setJobType(event.value);
                        // }}
                        onChange={(data) => {
                          setScopeType(data);
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
                        value={jobStatus}
                        // defaultValue={{ label: jobStatus }}
                        onChange={(data) => {
                          setJobStatus(data);
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
                      <Label htmlFor="branch" className="form-label">
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
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="organization_type" className="form-label">
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

export default CreateJob;
