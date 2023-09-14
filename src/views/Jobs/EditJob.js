import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Label, Button } from "reactstrap";
import {
  scopeofworkOptions,
  branchOptions,
  statusOptions,
  typeOptions,
  OrganizationTypeOptions,
  containerTypes,
} from "./Options";

const EditJob = (props) => {
  const [jobType, setJobType] = useState(null);
  const [selType, setSelType] = useState(null);
  const [scopeType, setScopeType] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [selPOA, setSelPOA] = useState(null);
  const [podValue, setPodValue] = useState(null);
  const [selContainerTypes, setSelContainerTypes] = useState(null);
  const [poaOptions, setPoaOptions] = useState([]);
  const [podOptions, setPodOptions] = useState([]);
  const [selBranch, setSelBranch] = useState(null);
  const [selBroker, setSelBroker] = useState(null);
  const [selNotify, setSelNotify] = useState(null);
  const [selTransporter, setSelTransporter] = useState(null);

  const [selPOL, setSelPOL] = useState(null);
  const [selClient, setSelClient] = useState(null);
  const [selConsignee, setSelConsignee] = useState(null);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState([]);
  const [partiesOptions, setPartiesOptions] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [organization_type, setOrganization_type] = useState([]);
  const [allParties, setAllParties] = useState([]);

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

  const getPoaOptions = (val) => {
    apiAuth
      .get(`/api/master/poa/`)
      .then((response) => {
        const { data } = response;
        const opts = data.map((item) => {
          return {
            label: `${item.code}-${item.name}-${item.country}`,
            value: item.name,
          };
        });
        const sel = opts.find((item) => item?.value === props?.allJobs?.poa);
        setSelPOA(sel);
        setPoaOptions(opts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOrganization = (val) => {
    setLoading(true);
    apiAuth
      .get(`/api/get-organization/?type=Consignee`)
      .then((response) => {
        let data = response.data;

        const ConsOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        const consignee_name = ConsOpts.find(
          (item) => item.value === props.allJobs?.consignee_name?.id
        );
        setSelConsignee(consignee_name);

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

  const getPartiesOptions = (data) => {
    const s_patries = data.map((item) => item?.label);
    setLoading(true);
    apiAuth
      .get(`/api/get-organization/?type=${s_patries}`)
      .then((response) => {
        let data = response.data;
        const ConsOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        const partyOpts = ConsOpts.filter((opt) =>
          props?.allJobs?.parties?.some((type) => type === opt?.value)
        );
        setSelectedParties(partyOpts);
        setPartiesOptions(ConsOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Parties Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const getAllParties = () => {
    apiAuth
      .get(`/api/get-organization/?type=all`)
      .then((response) => {
        let data = response.data;
        const ConsOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        const selBr = ConsOpts.find(
          (dd) => dd.value === props.allJobs?.broker?.id
        );
        setSelBroker(selBr);

        const selTrs = ConsOpts.find(
          (dd) => dd?.value === props.allJobs?.transporter?.id
        );
        setSelTransporter(selTrs);

        const selNtf = ConsOpts.find(
          (dd) => dd?.value === props.allJobs?.notify?.id
        );
        setSelNotify(selNtf);

        setAllParties(ConsOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Parties Get Error`}`,
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
      .get(`/api/get-organization/?type=Client`)
      .then((response) => {
        let data = response?.data;

        const ClientOpts = data?.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
        const sel = ClientOpts.find(
          (item) => item?.value === props.allJobs?.client_name?.id
        );
        setSelClient(sel);
        setClientOptions(ClientOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Client Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const getPodOptions = (val) => {
    apiAuth
      .get(`/api/master/pod/`)
      .then((response) => {
        let { data } = response;
        const opts = data?.map((item) => {
          return {
            label: `${item?.code} - ${item?.name} - ${item?.country}`,
            value: item?.name,
          };
        });
        const sel = opts.find((item) => item?.value === props.allJobs?.pod);

        setPodValue(sel);
        setPodOptions(opts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const orgsOpts = OrganizationTypeOptions.filter((opt) =>
      props?.allJobs?.organization_type?.some((type) => type === opt?.label)
    );
    setOrganization_type(orgsOpts);

    const jobtype = options.find(
      (item) => item.value === props.allJobs.job_type
    );
    setJobType(jobtype);

    const scopeType = scopeofworkOptions.find(
      (item) => item.value === props.allJobs?.scope_of_work
    );
    setScopeType(scopeType);

    const type = typeOptions.find((item) => item.value === props.allJobs.type);
    setSelType(type);

    const jobStatus = statusOptions.find(
      (item) => item.value === props.allJobs.job_status
    );
    setJobStatus(jobStatus);

    setSelContainerTypes({
      label: props.allJobs?.container_type,
      value: props.allJobs?.container_type,
    });

    setSelPOL({
      label: props.allJobs?.pol,
      value: props.allJobs?.pol,
    });

    setSelBranch({
      label: props?.allJobs?.branch,
      value: props?.allJobs?.branch,
    });

    getPoaOptions();
    // getPodOptions();
    getOrganization();
    getClientOrganization();
    getPartiesOptions(orgsOpts);
    getAllParties();
  }, []);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  return (
    <React.Fragment>
      {/* {console.log("rrrr", props.allJobs)} */}
      <span>Job Number: {props.allJobs.job_number}</span>
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
              pol: props?.allJobs?.pol ? props?.allJobs?.pol : "",
              consignee_name: props?.allJobs?.consignee_name
                ? props?.allJobs?.consignee_name?.id
                : "",
              shipper_name: props?.allJobs?.shipper_name
                ? props?.allJobs?.shipper_name
                : "",
              client_name: props?.allJobs?.client_name
                ? props?.allJobs?.client_name?.id
                : "",
              remarks: props?.allJobs?.remarks ? props?.allJobs?.remarks : "",
              job_type: props?.allJobs?.job_type
                ? props?.allJobs?.job_type
                : "",
              container_type: props?.allJobs?.container_type
                ? props?.allJobs?.container_type
                : "",
              por: props?.allJobs?.por ? props?.allJobs?.por : "",
              job_status: props?.allJobs?.job_status
                ? props?.allJobs?.job_status
                : "",
              type: props?.allJobs?.type ? props?.allJobs?.type : "",
              scope_of_work: props?.allJobs?.scope_of_work
                ? props?.allJobs?.scope_of_work
                : "",
              eta: props?.allJobs?.eta
                ? new Date(props?.allJobs?.eta)
                : new Date(),
              etd: props?.allJobs?.etd
                ? new Date(props?.allJobs?.etd)
                : new Date(),
              organization_type: props?.allJobs?.organization_type
                ? props?.allJobs?.organization_type
                : [],
              parties: props?.allJobs?.parties ? props?.allJobs?.parties : [],
              selected_organization_type: props?.allJobs?.organization_type
                ? props?.allJobs?.organization_type
                : [],
              branch: props?.allJobs?.branch ? props?.allJobs?.branch : "",
              notify: props?.allJobs?.notify ? props?.allJobs?.notify?.id : "",
              client_ref: props?.allJobs?.client_ref
                ? props?.allJobs?.client_ref
                : "",
              broker: props?.allJobs?.broker ? props?.allJobs?.broker?.id : "",
              transporter: props?.allJobs?.transporter
                ? props?.allJobs?.transporter?.id
                : "",
              commodity: props?.allJobs?.commodity
                ? props?.allJobs?.commodity
                : "",
              quantity_text: props?.allJobs?.quantity_text
                ? props?.allJobs?.quantity_text
                : "",
            }}
            validationSchema={Yup.object({
              bl_number: Yup.string().required("BL Number is Required"),
              bayan_number: Yup.string().required("Bayan Number is Required"),
              branch: Yup.string().required("Branch is Required"),
              pod: Yup.string().required("POD is Required"),
              poa: Yup.string().ensure().required("POA is Required"),
              pol: Yup.string().ensure().required("POL is Required"),
              consignee_name: Yup.string()
                .ensure()
                .required("Cosignee Name is Required"),
              shipper_name: Yup.string()
                .max(50, "Must be 50 characters or less")
                .trim()
                .required("Shipper Name is Required"),
              client_name: Yup.string()
                .ensure()
                .required("Client Name is Required"),
              remarks: Yup.string()
                .max(400, "Must be 400 characters or less")
                .trim()
                .required("Remarks is Required"),
              job_type: Yup.string().ensure().required("Job Type is Required"),
              type: Yup.string().required("Type is Required"),
              scope_of_work: Yup.string()
                .ensure()
                .required("Scope of work is Required"),
              job_status: Yup.string()
                .ensure()
                .required("Job Status is Required"),
              // organization_type: Yup.string().required(
              //   "Organization Type is Required"
              // ),
              // container_type: Yup.string()
              //   .ensure()
              //   .required("Container Type is Required"),
            })}
            onSubmit={(values, { reset }) => {
              const company = JSON.parse(
                localStorage.getItem("authUser")
              )?.company_id;
              values["company"] = company;
              values["organization_type"] = organization_type.map(
                (dd) => dd?.label
              );
              values["parties"] = selectedParties.map((item) => item.value);

              const url = `/api/master/job/${props.allJobs.id}/`;
              apiAuth
                .patch(url, values)
                .then((response) => {
                  NotificationManager.success(
                    "",
                    `Job Updated Successfully`,
                    3000,
                    null,
                    null,
                    ""
                  );
                  props.closeAddPopup();
                  // props
                })
                .catch((error) => {
                  NotificationManager.error(
                    "",
                    `Job Update Error`,
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
                        placeholder={"Select"}
                        styles={customStyles}
                        value={selConsignee}
                        options={consigneeOptions}
                        // onInputChange={(val) => {
                        //   getOrganization(val);
                        // }}
                        onChange={(data) => {
                          setSelConsignee(data);
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
                        placeholder="Shipper Name"
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
                        placeholder={"Select"}
                        styles={customStyles}
                        options={poaOptions}
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
                      <Select
                        placeholder={"Select"}
                        styles={customStyles}
                        value={selClient}
                        options={clientOptions}
                        // onInputChange={(val) => {
                        //   getClientOrganization(val);
                        // }}
                        onChange={(data) => {
                          setSelClient(data);
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
                        placeholder={"Select"}
                        styles={customStyles}
                        options={poaOptions}
                        value={selPOA}
                        onChange={(data) => {
                          setSelPOA(data);
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
                      <Label htmlFor="pol" className="form-label">
                        POL
                        <span className="text-danger">*</span>
                      </Label>

                      <Select
                        placeholder={"Select"}
                        styles={customStyles}
                        options={poaOptions}
                        value={selPOL}
                        onChange={(data) => {
                          setSelPOL(data);
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
                        placeholder={"Select"}
                        styles={customStyles}
                        options={typeOptions}
                        value={selType}
                        onChange={(data) => {
                          setSelType(data);
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
                        value={scopeType}
                        options={scopeofworkOptions}
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
                      </Label>
                      <DatePicker
                        selected={values["eta"]}
                        onChange={(date) => {
                          setFieldValue("eta", date);
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
                      </Label>
                      <DatePicker
                        selected={values["etd"]}
                        onChange={(date) => {
                          setFieldValue("etd", date);
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
                        value={selBranch}
                        onChange={(data) => {
                          setSelBranch(data);
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
                      </Label>

                      <Select
                        name="type"
                        placeholder={"Select"}
                        styles={customStyles}
                        options={OrganizationTypeOptions}
                        isMulti
                        value={organization_type}
                        onChange={(data) => {
                          setOrganization_type(data);
                          getPartiesOptions(data);
                        }}
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
                <Grid container spacing={2} style={{ zIndex: 200 }}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="parties" className="form-label">
                        Parties
                      </Label>
                      <Select
                        name="parties"
                        placeholder={"Select"}
                        styles={customStyles}
                        options={partiesOptions}
                        isMulti
                        value={selectedParties}
                        onChange={(data) => {
                          setSelectedParties(data);
                        }}
                      />
                      <ErrorMessage
                        name="parties"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="notify" className="form-label">
                        Notify
                      </Label>
                      <Select
                        value={selNotify}
                        placeholder={"Select"}
                        styles={customStyles}
                        options={allParties}
                        onChange={(data) => {
                          setFieldValue("notify", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="notify"
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
                      <Label htmlFor="broker" className="form-label">
                        Broker
                      </Label>
                      <Select
                        value={selBroker}
                        placeholder={"Select"}
                        styles={customStyles}
                        options={allParties}
                        onChange={(data) => {
                          setFieldValue("broker", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="broker"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="commodity" className="form-label">
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
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="container_type" className="form-label">
                        Container/Consignment
                        {/* <span className="text-danger">*</span> */}
                      </Label>
                      <Select
                        name="type"
                        value={selContainerTypes}
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

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="transporter" className="form-label">
                        Transporter
                        {/* <span className="text-danger">*</span> */}
                      </Label>
                      <Select
                        value={selTransporter}
                        placeholder={"Select"}
                        styles={customStyles}
                        options={allParties}
                        onChange={(data) => {
                          setFieldValue("transporter", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="transporter"
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
                      <Label htmlFor="quantity_text" className="form-label">
                        Quantity
                        {/* <span className="text-danger">*</span> */}
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
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="client_ref" className="form-label">
                        Client Ref
                        {/* <span className="text-danger">*</span> */}
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
                  <Grid item lg={6} xs={12}>
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

export default EditJob;
