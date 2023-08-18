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

const CreateJob = (props) => {
  const etaTime = props.allJobs.eta;
  const etdTime = props.allJobs.etd;

  const etaDateObj = new Date(etaTime);
  const etdDateObj = new Date(etdTime);

  const [jobType, setJobType] = useState("Job");
  const [typevalue, setTypevalue] = useState(null);
  const [scopeType, setScopeType] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [poaValue, setPoaValue] = useState(null);
  const [branchValue, setBranchValue] = useState(null);
  const [podValue, setPodValue] = useState(null);
  const [eta, setEta] = useState(etaDateObj);
  const [etd, setEtd] = useState(etdDateObj);
  const [organization_type, setOrganization_type] = useState([]);
  const [poaOptions, setPoaOptions] = useState([]);
  const [podOptions, setPodOptions] = useState([]);
  const [consigneeNameValue, setConsigneeNameValue] = useState(null);
  const [clientNameValue, setClientNameValue] = useState(null);
  const [polValue, setPolValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  const options = [
    {
      label: "Job",
      value: "Job",
    },
  ];

  const branchOptions = [
    { label: "JEDDAH", value: "JEDDAH" },
    { label: "DUBAI", value: "DUBAI" },
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
    {
      label: "Customs Clearance",
      value: "Customs Clearance",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  const getOrganization = (val) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/get-organization/?page=${1}&search=${val || ""}&type=Consignee`
      )
      .then((response) => {
        let data = response.data;

        const ConsOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        setConsigneeOptions(ConsOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Consignee Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const getClientOrganization = (val) => {
    setLoading(true);
    apiAuth
      .get(`/api/get-organization/?page=${1}&search=${val || ""}&type=Client`)
      .then((response) => {
        let data = response.data;

        const ClientOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        setClientOptions(ClientOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Client  Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

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
  const getPoaOptions = (val) => {
    apiAuth
      .get(`/api/master/poa/?page=${1}&search=${val || ""}`)
      .then((response) => {
        let data = response.data.results;
        setPoaOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPodOptions = (val) => {
    apiAuth
      .get(`/api/master/pod/?page=${1}&search=${val || ""}`)
      .then((response) => {
        let data = response.data.results;
        setPodOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPoaOptions();
    getPodOptions();
    getOrganization();
    getClientOrganization();
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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  useEffect(
    () => {
      const jobtype = options.find(
        (item) => item.value === props.allJobs.job_type
      );
      setJobType(jobtype);
      const scopeType = scopeofworkOptions.find(
        (item) => item.value === props.allJobs.scope_of_work
      );
      setScopeType(scopeType);
      const type = typeOptions.find(
        (item) => item.value === props.allJobs.type
      );
      setTypevalue(type);
      const jobStatus = statusOptions.find(
        (item) => item.value === props.allJobs.job_status
      );
      setJobStatus(jobStatus);

      const poa = poaOptions.find((item) => item.value === props.allJobs.poa);
      setPoaValue({
        label: props.allJobs.poa,
        value: props.allJobs.poa,
      });
      const pod_Value = podOptions.find(
        (item) => item.value === props.allJobs?.pod
      );

      setPodValue({
        label: props.allJobs.pod,
        value: props.allJobs.pod,
      });
      setPolValue({
        label: props.allJobs?.pol,
        value: props.allJobs?.pol,
      });

      const consignee_name = consigneeOptions.find(
        (item) => item.value === props.allJobs?.consignee_name
      );
      setConsigneeNameValue(consignee_name);

      const client_name = clientOptions.find(
        (item) => item.value === props.allJobs?.client_name
      );
      setClientNameValue(client_name);
    },
    [
      // props.allJobs.job_type,
      // props.allJobs.scope_of_work,
      // props.allJobs.type,
      // props.allJobs.job_status,
    ]
  );

  const handleMultiSelectChange = (data) => {
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
              pol: props?.allJobs?.pol ? props?.allJobs?.pol : "",
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
              job_type:
                //  props?.allJobs?.job_type
                //   ? props?.allJobs?.job_type
                "Job",
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
              eta: props?.allJobs?.eta ? props?.allJobs?.eta : new Date(),
              etd: props?.allJobs?.etd ? props?.allJobs?.etd : new Date(),
              organization_type: props?.allJobs?.organization_type
                ? props?.allJobs?.organization_type
                : "",
              branch: "JEDDHA",
            }}
            validationSchema={Yup.object({
              bl_number: Yup.string().required("BL Number is Required"),
              branch: Yup.string().required("Branch is Required"),
              bayan_number: Yup.string().required("Bayan Number is Required"),
              pod: Yup.string().ensure().required("POD is Required"),
              poa: Yup.string().required("POA is Required"),
              por: Yup.string().required("Place Of Receipt is Required"),
              pol: Yup.string().ensure().required("POL is Required"),
              consignee_name: Yup.string()
                .ensure()
                .required("Cosignee Name is Required"),
              shipper_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Shipper Name is Required"),
              client_name: Yup.string()
                .ensure()
                .required("Client Name is Required"),
              remarks: Yup.string()
                .max(400, "Must be 400 characters or less")
                .trim()
                .required("Remarks is Required"),
              // job_type: Yup.string().required("Job Type is Required"),
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
              values["consignee_name"] = consigneeNameValue.value;
              values["client_name"] = clientNameValue.value;
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
                  props.closeAddPopup();
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

                      <Select
                        name="type"
                        placeholder={"Select"}
                        styles={customStyles}
                        value={consigneeNameValue}
                        options={consigneeOptions}
                        onChange={(data) => {
                          setConsigneeNameValue(data);
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
                        value={podValue}
                        onInputChange={(val) => {
                          getPodOptions(val);
                        }}
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
                      <Select
                        name="type"
                        placeholder={"Select"}
                        styles={customStyles}
                        value={clientNameValue}
                        options={clientOptions}
                        onInputChange={(val) => {
                          getClientOrganization(val);
                        }}
                        onChange={(data) => {
                          setClientNameValue(data);
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
                  <Grid item lg={4} xs={12}>
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
                        value={poaValue}
                        onInputChange={(val) => {
                          getPoaOptions(val);
                        }}
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

                  <Grid item lg={4} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="pol" className="form-label">
                        POL
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
                        value={polValue}
                        onInputChange={(val) => {
                          getPoaOptions(val);
                        }}
                        onChange={(data) => {
                          setPolValue(data);
                          setFieldValue("pol", data.value);
                        }}
                      />

                      <ErrorMessage
                        name="pol"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={4} xs={12}>
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
                        value={scopeType}
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

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="eta" className="form-label">
                        ETA
                        {/* <span className="text-danger">*</span> */}
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
                        {/* <span className="text-danger">*</span> */}
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
                      <Label htmlFor="organization_type" className="form-label">
                        Organization Type
                        {/* <span className="text-danger">*</span> */}
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
