import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Row, Button, Label, Modal, ModalHeader, ModalBody } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Card, Grid } from "@mui/material";
import Select from "react-select";
import moment from "moment";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import GenerateInvoice from "./GenerateInvoice";
import { useParams } from "react-router";
import TaxInvoiceSecond from "../TaxInvoice/TaxInvoiceSecond";
import { getAllISOCodes } from "iso-country-currency";

const Sales = (props) => {
  const { invoicesId } = useParams();
  const [selCurrency, setSelCurrency] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consigneeNameValue, setConsigneeNameValue] = useState(null);
  const [clientNameValue, setClientNameValue] = useState(null);
  const [state, setState] = useState({});
  const [generateInvoiceModal, setGenerateInvoiceModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(false);
  const [podOptions, setPodOptions] = useState([]);
  const [poaOptions, setPoaOptions] = useState([]);
  const [poaValue, setPoaValue] = useState(null);
  const [refDate, setRefDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [invoiceId, setInvoiceId] = useState(null);
  const [podValue, setPodValue] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState({
    value: "Sales",
    label: "Sales",
  });
  const [searchValue, setSearchValue] = useState("");

  const [branchValue, setBranchValue] = useState({
    label: "JEDDAH",
    value: "JEDDAH",
  });
  const [Vendorvalue, setVendorvalue] = useState("TEMP");
  const [partyOptions, setPartyOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [consigneeOptions, setConsigneeOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);

  const branchOptions = [
    { label: "JEDDAH", value: "JEDDAH" },
    { label: "DUBAI", value: "DUBAI" },
  ];
  const VendorOptions = [{ label: "TEMP", value: "TEMP" }];

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

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
        const sel = ConsOpts.find(
          (item) => item.value === props?.data?.consignee_name?.id
        );
        setConsigneeNameValue(sel);
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
        const clOptions = ClientOpts.find(
          (item) => item.value === props.data?.client_name?.id
        );
        setClientNameValue(clOptions);
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

  const getPoaOptions = (val) => {
    apiAuth
      .get(`/api/master/poa/`)
      .then((response) => {
        const { data } = response;
        const opts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.name,
          };
        });
        if (props.isEdit) {
          const sel = opts.find((dd) => dd.label === props?.data.poa);
          setPoaValue(sel);
        }
        setPoaOptions(opts);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPartyOptions = (val) => {
    apiAuth
      .get(`/api/get-coa/?search=${val || ""}`)
      .then((res) => {
        let { data } = res;
        data = data.map((rr) => {
          return {
            label: rr.code,
            value: rr.id,
          };
        });
        const sel = data.map((dd) => dd.value === props?.data?.coa);
        setPartyOptions(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPartyOptions();
    getOrganization(searchValue);
    getClientOrganization(searchValue);
    getPoaOptions();
    getPodOptions();
    getAllCurrencyCodes();
    getJobs();
    setSelectedInvoice({
      label: invoicesId,
      value: invoicesId,
    });

    if (props.isEdit) {
      setBranchValue({
        label: props.data?.consignee_name?.branch,
        value: props.data?.consignee_name?.branch,
      });
      setPodValue({
        label: props?.data?.pod,
        value: props?.data?.pod,
      });
    }
  }, []);

  const getPodOptions = (val) => {
    apiAuth
      .get(`/api/master/pod/`)
      .then((response) => {
        let { data } = response;
        data = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.name,
          };
        });
        setPodOptions(data);
        if (props.isEdit) {
          const sel = data.find((dd) => dd.value === props.data?.pod);
          setPodValue(sel);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllCurrencyCodes = () => {
    let allCurrencies = getAllISOCodes();
    allCurrencies = allCurrencies.map((cur) => {
      return {
        label: cur.currency + "  -  " + cur.countryName,
        value: cur.currency,
      };
    });
    if (props.isEdit) {
      const sel = allCurrencies.find(
        (dd) => dd.value === props.data.currency_sar
      );
      setSelCurrency(sel);
    }
    setCurrencyOptions(allCurrencies);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const getJobs = (val) => {
    apiAuth
      .get(`/api/get-jobs/?&page=${1}&search=${val || ""}&type=Job`)
      .then((res) => {
        const { data } = res;
        let opts = data.results.map((dd) => {
          return {
            label: dd.job_number,
            value: dd?.id,
          };
        });

        if (props?.isEdit) {
          const selJob = opts.find(
            (opt) => opt?.label === props.data?.job?.job_number
          );
          setSelectedJob(selJob);
        }
        setJobOptions(opts);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-5 mt-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">{selectedInvoice.value} Invoice</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}
        <Grid container spacing={2}>
          {console.log("eeeeeeeee", props?.data)}
          <Grid item lg={11} style={{ margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  bl_number: props.isEdit ? props.data?.bl_number : "",
                  consignee_name: props.isEdit
                    ? props.data?.consignee_name?.id
                    : "",
                  due_date: props.isEdit ? props.data?.due_date : "",
                  currency_sar: props.isEdit ? props.data?.currency_sar : "",
                  bayan_number: props.isEdit ? props.data?.bayan_number : "",
                  shipper_name: props.isEdit ? props.data?.shipper_name : "",
                  branch: props.isEdit
                    ? props.data?.consignee_name?.branch
                    : "JEDDAH",
                  // vendor: props.isEdit ? props.data?.vendor : "TEMP",
                  ex_rate: props.isEdit ? props.data?.ex_rate : "",
                  pod: props.isEdit ? props.data?.pod : "",
                  client_name: props.isEdit ? props.data?.client_name?.id : "",
                  fc_amount: props.isEdit ? props.data?.fc_amount : "",
                  amount_sar: props.isEdit ? props.data?.amount_sar : "",
                  poa: props.isEdit ? props.data?.poa : "",
                  remarks: props.isEdit ? props.data?.remarks : "",
                  invoice_type: props.isEdit
                    ? props.data?.invoice_type
                    : selectedInvoice.value,
                  ref_data: props.isEdit ? props.data?.ref_data : "",
                  bill_amount: props.isEdit ? props.data?.bill_amount : "",
                  narration: props.isEdit ? props.data?.narration : "",
                  job: props.isEdit ? props.data?.job?.bl_number : "",
                  coa: props.isEdit ? props.data?.coa : "",
                }}
                validationSchema={Yup.object({
                  bl_number: Yup.string().required("BL Number is Required"),
                  consignee_name: Yup.string()
                    .ensure()
                    .required("Consignee Name is Required"),
                  // date: Yup.string().required("Date is Required"),
                  currency_sar: Yup.string()
                    .ensure()
                    .required("Currency is Required"),
                  bayan_number: Yup.string().required(
                    "Bayan Number is Required"
                  ),
                  shipper_name: Yup.string().required(
                    "Shipper Name is Required"
                  ),
                  branch: Yup.string().ensure().required("Branch is Required"),
                  ex_rate: Yup.string().required("Rate is Required"),
                  pod: Yup.string().ensure().required("POD is Required"),
                  client_name: Yup.string()
                    .ensure()
                    .required("Client Name is Required"),
                  fc_amount: Yup.string().required("FC Amount is Required"),
                  poa: Yup.string().required("POA is Required"),
                  job: Yup.string().ensure().required("Job is Required"),
                  remarks: Yup.string().required("Remarks is Required"),
                })}
                onSubmit={(values, reset) => {
                  values["due_date"] = moment(dueDate).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  );

                  values["ref_data"] = moment(refDate).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  );
                  values["job"] = selectedJob?.value;
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values["invoice_type"] = selectedInvoice?.value;

                  // values["consignee_name"] = consigneeNameValue?.value;
                  // values["client_name"] = clientNameValue?.value;

                  props.isEdit
                    ? apiAuth
                        .patch(`/api/master/invoice/${props.data?.id}/`, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `Invoice Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.isEdit
                            ? props.closeAddPopup()
                            : props?.history?.push("/sales");
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Invoice Update Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        })
                    : apiAuth
                        .post("/api/master/invoice/", values)
                        .then((response) => {
                          if (response.status === 201) {
                            NotificationManager.success(
                              "",
                              `Invoice Created Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );
                            setInvoiceId(response.data.id);
                            setState((prev) => {
                              return {
                                ...state,
                                invoice_id: response.data.id,
                              };
                            });
                            // props?.history?.push("/invoices");
                          } else {
                            NotificationManager.error(
                              "",
                              `Invoice Create Error`,
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
                            `Invoice Create Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="bl_number" className="pe-2 w-50">
                              {" "}
                              BL Number
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control"
                              name="bl_number"
                              style={{ background: "#EDEDED" }}
                              placeholder="BL Number"
                              type="text"
                            />
                          </div>
                          {errors.bl_number && touched.bl_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bl_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
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
                            value={consigneeNameValue}
                            onInputChange={(val) => {
                              getOrganization(val);
                            }}
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

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Due Date
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={dueDate}
                              onChange={(date) => setDueDate(date)}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                fill: "red",
                              }}
                            >
                              <img
                                src="/calendar.svg"
                                alt="calendar"
                                width="20px"
                                height="20px"
                              />
                            </span>
                          </div>

                          {errors.due_date && touched.due_date && (
                            <div className="invalid-feedback d-block">
                              {errors.due_date}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="currency_sar" className="form-label">
                            Currency
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="currency_sar"
                            styles={customStyles}
                            value={selCurrency}
                            options={currencyOptions}
                            onChange={(data) => {
                              setFieldValue("currency_sar", data.value);
                              // console.log("eeeee", data);
                              setSelCurrency(data);
                            }}
                          />
                          {errors.currency_sar && touched.currency_sar && (
                            <div className="invalid-feedback d-block">
                              {errors.currency_sar}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="bayan_number"
                              className="  w-50 pe-2"
                            >
                              Bayan Number
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control"
                              name="bayan_number"
                              placeholder="Bayan Number"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayan_number && touched.bayan_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bayan_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
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
                            value={clientNameValue}
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
                          <Label htmlFor="branch" className="form-label">
                            Branch
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            value={branchValue}
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            onChange={(data) => {
                              setBranchValue(data);
                              setFieldValue("branch", data.label);
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

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="ex_rate" className="pe-2 w-50">
                              Ex. Rate
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control "
                              placeholder="0"
                              name="ex_rate"
                              type="text"
                              onChange={(e) => {
                                setFieldValue("ex_rate", e.target.value);
                                if (values["fc_amount"].length) {
                                  setFieldValue(
                                    "amount_sar",
                                    Number(e.target.value) *
                                      Number(values["fc_amount"])
                                  );
                                }
                              }}
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.ex_rate && touched.ex_rate && (
                            <div className="invalid-feedback d-block">
                              {errors.ex_rate}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="pod" className="form-label">
                            POD
                            <span className="text-danger">*</span>
                          </Label>

                          <Select
                            // name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={podOptions}
                            value={podValue}
                            // onInputChange={(val) => {
                            //   getPodOptions(val);
                            // }}
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="coa" className="form-label">
                            Party A/C
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            name="coa"
                            styles={customStyles}
                            value={selectedParty}
                            options={partyOptions}
                            onChange={(data) => {
                              setFieldValue("coa", data.value);
                              setSelectedParty(data);
                            }}
                          />
                          {errors.coa && touched.coa && (
                            <div className="invalid-feedback d-block">
                              {errors.coa}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="fc_amount" className="pe-2 w-50">
                              FC Amount
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control"
                              name="fc_amount"
                              placeholder="0"
                              type="text"
                              style={{ background: "#EDEDED" }}
                              onChange={(e) => {
                                setFieldValue("fc_amount", e.target.value);
                                if (values["ex_rate"].length) {
                                  setFieldValue(
                                    "amount_sar",
                                    Number(e.target.value) *
                                      Number(values["ex_rate"])
                                  );
                                }
                              }}
                            />
                          </div>
                          {errors.fc_amount && touched.fc_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fc_amount}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="amount_sar" className="pe-2 w-50">
                              {" "}
                              Amount
                              {/* <span className="text-danger">*</span> */}
                            </Label>
                            <Field
                              className="form-control"
                              name="amount_sar"
                              placeholder="0"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.amount_sar && touched.amount_sar && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_sar}
                            </div>
                          )}
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
                            value={poaValue}
                            options={poaOptions}
                            // onInputChange={(val) => {
                            //   getPoaOptions(val);
                            // }}
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
                          <label htmlFor="job" className="form-label">
                            Job No
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onInputChange={(val) => {
                              getJobs(val);
                            }}
                            onChange={(data) => {
                              setSelectedJob(data);
                              setFieldValue("job", data.label);
                            }}
                            styles={customStyles}
                          />
                          {errors.job && touched.job && (
                            <div className="invalid-feedback d-block">
                              {errors.job}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ref_data" className="form-label">
                            Ref Date
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={refDate}
                              onChange={(date) => setRefDate(date)}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                right: 10,
                                fill: "red",
                              }}
                            >
                              <img
                                src="/calendar.svg"
                                alt="calendar"
                                width="20px"
                                height="20px"
                              />
                            </span>
                          </div>

                          {errors.ref_data && touched.ref_data && (
                            <div className="invalid-feedback d-block">
                              {errors.ref_data}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    {selectedInvoice.value === "Purchase" && (
                      <Grid container spacing={2}>
                        <Grid item lg={4} xs={12}>
                          <div className="form-group mb-3">
                            <div>
                              <Label htmlFor="bill_amount">Bill Amount</Label>
                              <Field
                                name="bill_amount"
                                className="form-control"
                                placeholder="Bill Amount"
                                type="text"
                                style={{ background: "#EDEDED" }}
                              />
                            </div>
                            <ErrorMessage
                              name="bill_amount"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Grid>

                        <Grid item lg={4} xs={12}>
                          <div className="form-group mb-3">
                            <div>
                              <Label htmlFor="narration">Narration</Label>
                              <Field
                                name="narration"
                                className="form-control"
                                placeholder="Narration"
                                type="text"
                                style={{ background: "#EDEDED" }}
                              />
                            </div>
                            <ErrorMessage
                              name="narration"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    <Grid spacing={2} container>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="shipper_name"
                              className=" w-50 p e-2"
                            >
                              Shipper Name
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              className="form-control "
                              name="shipper_name"
                              placeholder="Shipper Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.shipper_name && touched.shipper_name && (
                            <div className="invalid-feedback d-block">
                              {errors.shipper_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="remarks" className="form-label">
                            Remarks
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            className="form-control"
                            placeholder="Remarks"
                            name="remarks"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.remarks && touched.remarks && (
                            <div className="invalid-feedback d-block">
                              {errors.remarks}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className="d-flex">
                      <Button
                        type="submit"
                        className={`btn btn-success me-3 ${
                          props.loading ? "show-spinner" : ""
                        }`}
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">
                          {props.isEdit ? "Update" : "Save"}
                        </span>
                      </Button>{" "}
                      <div>
                        {state.invoice_id || props?.isEdit ? (
                          <Button
                            className="btn btn-info float-right me-3"
                            onClick={() => setGenerateInvoiceModal(true)}
                          >
                            {" "}
                            Add Cost Entry
                          </Button>
                        ) : (
                          <></>
                        )}

                        {state.invoice_generated ? (
                          <Link to={`/tax-invoice-second/${state.invoice_id}`}>
                            <Button className="btn btn-warning float-right">
                              {" "}
                              View Invoice
                            </Button>
                          </Link>
                        ) : (
                          <></>
                        )}

                        {props?.isEdit ? (
                          <Link to={`/tax-invoice-second/${props?.data?.id}`}>
                            <Button className="btn btn-warning float-right">
                              {" "}
                              View Invoice
                            </Button>
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={generateInvoiceModal}
        toggle={() => {
          setGenerateInvoiceModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setGenerateInvoiceModal((prev) => !prev);
          }}
        >
          Invoice
        </ModalHeader>
        <ModalBody>
          <GenerateInvoice
            closeAddPopup={(val) => {
              setGenerateInvoiceModal(false);
              if (val) {
                setState((prev) => {
                  return {
                    ...state,
                    invoice_generated: true,
                  };
                });
              }
            }}
            invoice={state.invoice_id}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={viewInvoice}
        toggle={() => {
          setGenerateInvoiceModal((prev) => !prev);
        }}
        style={{ width: "80%" }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setViewInvoice((prev) => !prev);
          }}
        >
          Tax Invoice
        </ModalHeader>
        <ModalBody>
          <TaxInvoiceSecond
            closeAddPopup={() => {
              setViewInvoice(false);
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Sales;
