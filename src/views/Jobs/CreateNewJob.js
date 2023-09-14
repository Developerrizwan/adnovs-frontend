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
import {
  scopeofworkOptions,
  branchOptions,
  statusOptions,
  typeOptions,
  OrganizationTypeOptions,
  containerTypes,
} from "./Options";

const CreateNewJob = (props) => {
  const [jobType, setJobType] = useState("Job");
  const [branchValue, setBranchValue] = useState(null);
  const [eta, setEta] = useState(new Date());
  const [etd, setEtd] = useState(new Date());
  const [poaOptions, setPoaOptions] = useState([]);
  const [podOptions, setPodOptions] = useState([]);
  const [selPoa, setSelPoa] = useState(null);
  const [selPod, setSelPod] = useState(null);
  const [organization_type, setOrganization_type] = useState([]);
  const [polValue, setPolValue] = useState(null);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [partiesOptions, setPartiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientOptions, setClientOptions] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [allParties, setAllParties] = useState([]);

  const getPoaOptions = (val) => {
    apiAuth
      .get(`/api/master/poa/`)
      .then((response) => {
        let { data } = response;
        setPoaOptions(data);
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
    setLoading(true);
    const s_parties = data?.map((item) => item.label);
    apiAuth
      .get(`/api/get-organization/?type=${s_parties}`)
      .then((response) => {
        let data = response.data;
        const ConsOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
          };
        });
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
        setPodOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPoaOptions();
    // getPodOptions();
    getOrganization();
    getClientOrganization();
    getAllParties();
  }, []);

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
                  pol: "",
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
                  organization_type: [],
                  parties: [],
                  branch: "",
                  notify: "",
                  client_ref: "",
                  broker: "",
                  transporter: "",
                  commodity: "",
                  quantity_text: "",
                }}
                validationSchema={Yup.object({
                  bl_number: Yup.string().required("BL Number is Required"),
                  consignee_name: Yup.string()
                    .ensure()
                    .required("Cosignee Name is Required"),
                  branch: Yup.string().required("Branch is Required"),
                  bayan_number: Yup.string().required(
                    "Bayan Number is Required"
                  ),
                  pod: Yup.string().ensure().required("POD is Required"),
                  poa: Yup.string().ensure().required("POA is Required"),
                  pol: Yup.string().ensure().required("POL is Required"),
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
                  // job_type: Yup.string()
                  //   .ensure()
                  //   .required("Job Type is Required"),
                  type: Yup.string().ensure().required("Type is Required"),
                  scope_of_work: Yup.string()
                    .ensure()
                    .required("Scope of work is Required"),
                  job_status: Yup.string()
                    .ensure()
                    .required("Job Status is Required"),
                  // organization_type: Yup.string()
                  //   .ensure()
                  //   .required("Organization Type is Required"),
                  container_type: Yup.string()
                    .ensure()
                    .required("Container Type is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values["eta"] = eta;
                  values["etd"] = etd;
                  values["organization_type"] = organization_type.map(
                    (dd) => dd?.label
                  );
                  values["parties"] = selectedParties.map((item) => item.value);
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
                            placeholder="BL Number"
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
                            // onInputChange={(val) => {
                            //   getOrganization(val);
                            // }}
                            onChange={(data) => {
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
                            placeholder="Bayan Number"
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
                            placeholder="Shipper Name"
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
                            options={poaOptions?.map((item) => {
                              return {
                                label: `${item.code}-${item.name}-${item.country}`,
                                value: item.name,
                              };
                            })}
                            value={selPod}
                            onChange={(data) => {
                              setSelPod(data);
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
                            // onInputChange={(val) => {
                            //   getClientOrganization(val);
                            // }}
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
                                label: `${item.code}-${item.name}-${item.country}`,
                                value: item.name,
                              };
                            })}
                            value={selPoa}
                            onChange={(data) => {
                              setSelPoa(data);
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
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={poaOptions?.map((item) => {
                              return {
                                label: `${item.code}-${item.name}-${item.country}`,
                                value: item.name,
                              };
                            })}
                            value={polValue}
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="por" className="form-label">
                            Place Of Receipt
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            placeholder="Place Of Receipt"
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
                            onChange={(data) => {
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
                            onChange={(data) => {
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
                            onChange={(data) => {
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
                            value={branchValue}
                            onChange={(data) => {
                              setBranchValue(data);
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
                          </Label>

                          <Select
                            name="organization_type"
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
                            name="organization_type"
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
                          <Label htmlFor="container" className="form-label">
                            Container/Consignment
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
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
                          </Label>
                          <Select
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
