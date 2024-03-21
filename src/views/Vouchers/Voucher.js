import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import NotificationManager from "../../components/Common/NotificationManager";
import { getAllISOCodes } from "iso-country-currency";
import { useParams } from "react-router";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import AccountDetail from "../AccountDetails/AccountDetail";
import UpdateVoucherStatus from "./UpdateVoucherStatus";

const Voucher = (props) => {
  const history = useHistory();
  const { voucherId } = useParams();

  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [organizationOptions, setOrganizationOptions] = useState(null);
  const [fromAndToOptions, setFromAndToOptions] = useState([]);
  const [selectedVoucherFrom, setSelectedVoucherFrom] = useState(null);
  const [selectedVoucherTo, setSelectedVoucherTo] = useState(null);
  const [vocherState, setVocherState] = useState({});
  const [accountDetailsModal, setAccountDetailsModal] = useState(false);

  // const [date, setDate] = useState(new Date());
  // const [period, setPeriod] = useState(``);
  // const [period, setPeriod] = useState(`${date.getMonth()} ${date.getFullYear()}`)
  const [selectedParty, setSelectedParty] = useState(null);
  const [selBranch, setSelBranch] = useState(null);
  // const [selectedConcern, setSelectedConcern] = useState(null);
  // const [selOutAmtoption, setSelOutAmtoption] = useState(null);
  // const [selCategory, setSelCategory] = useState(null);
  const [selCurrency, setSelCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vouchId, setVouchId] = useState("");
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);

  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "Journal",
    label: "Journal",
  });
  const [selectedInvoucherFor, setSelectedInvoucherFor] = useState(null);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceOptions, setInvoiceOptions] = useState(null);
  const [branchOptions, setBranchOptions] = useState(null);

  const [selStatus, setSelStatus] = useState({
    value: "Created",
    label: "Created",
  });
  const [selInstType, setSelInstType] = useState({
    value: "Cash",
    label: "Cash",
  });

  // const [categoryOptions, setCategoryOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [partyOptions, setPartyOptions] = useState([]);
  // const [coaOptions, setCoaOptions] = useState([]);
  const [modal, setModal] = React.useState(false);

  const toggle = () => setModal(!modal);

  const instTypeOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
  ];

  const statusOptions = [
    { value: "Created", label: "Created" },
    { value: "Posted", label: "Posted" },
  ];

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "DebitNote", label: "Debit Note" },
    { value: "CreditNote", label: "Credit Note" },
  ];

  useEffect(() => {
    // console.log("voucherType", voucherId);
    const selVouFor =
      voucherId === "DebitNote"
        ? { label: "Vendor", value: "Vendor" }
        : { label: "Customer", value: "Customer" };
    setSelectedInvoucherFor(selVouFor);
    const sel = voucherOptions.find((dd) => dd.value === voucherId);
    setSelectedVoucher(sel);
    getJobOptions();
    if (props?.isEdit) {
      getInvoices(props?.voucherData?.voucher_type);
    } else {
      getInvoices(voucherId);
    }
    getPartyOptions();
    getAllCurrencyCodes();
    getBranchOptions();

    if (props?.isEdit) {
      const selectedStatus =
        props.voucherData?.status && props.voucherData.status === "Created"
          ? { label: "Created", value: "Created" }
          : { label: "Posted", value: "Posted" };
      setSelStatus(selectedStatus);

      setSelectedInvoucherFor({
        label: props.voucherData?.voucher_for,
        value: props.voucherData?.voucher_for,
      });

      const selvoucher = voucherOptions.find(
        (dd) => dd.value === props.voucherData?.voucher_type
      );
      setSelectedVoucher(selvoucher);
    }
  }, []);

  const getInvoices = (e) => {
    const type1 =
      e === "DebitNote" ? "Purchase" : e === "CreditNote" ? "Sales" : "";
    setLoading(true);
    apiAuth
      .get(`/api/master/invoice/?type=${type1}`)
      .then((response) => {
        let data = response.data;
        const invoiceOpts = data?.map((dd) => {
          return {
            label: dd?.invoice_number,
            value: dd?.id,
          };
        });
        const selInvoice = invoiceOpts.find(
          (item) => item.value === props.voucherData?.invoice?.id
        );
        setSelectedInvoice(selInvoice);
        setInvoiceOptions(invoiceOpts);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${
            error.response?.data?.Error || `${selectedInvoice.value} Get Error`
          }`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const invoiceGetData = () => {
    setLoading(true);
    apiAuth
      .get(`/api/get_coa_invoices/?account=${selectedParty?.value}`)
      .then((response) => {
        let data = response?.data;

        console.log("localstorageeee", localStorage.getItem("voucher-type"));
        const finalData = data?.filter((item) => {
          switch (localStorage.getItem("voucher-type")) {
            case "Journal":
              return true;
            case "Payment":
            case "DebitNote":
              return item?.type === "Purchase";
            case "CreditNote":
            case "Receipt":
              return item?.type === "Sales";
            default:
              return true;
          }
        });
        setInvoiceData(finalData);
        setLoading(false);
        setUpdateStatusModal(true);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Invoice Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
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
      const selCurr = allCurrencies.find(
        (cur) => cur.value === props.voucherData?.currency
      );

      setSelCurrency(selCurr);
    }
    setCurrencyOptions(allCurrencies);
  };

  const getBranchOptions = () => {
    apiAuth
      .get("/api/master/branch")
      .then((res) => {
        let { data } = res;
        data = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.name,
          };
        });
        if (props?.isEdit) {
          setSelBranch({
            label: props.voucherData?.branch,
            value: props.voucherData?.branch,
          });
        }
        setBranchOptions(data);
      })
      .catch((err) => console.log(err));
  };

  const getPartyOptions = () => {
    apiAuth
      .get(`/api/get-coa/`)
      .then((res) => {
        let { data } = res;
        data = data.map((rr) => {
          return {
            label: `${rr.code}-${rr.name}`,
            value: rr.id,
            type: "coa",
          };
        });
        const selParty = data.find(
          (cur) => cur.value === props.voucherData?.party_account?.id
        );
        setPartyOptions(data);
        getOrganizationOptions(data);
      })
      .catch((err) => console.log(err));
  };

  const getJobOptions = (val) => {
    apiAuth
      .get(`/api/get-jobs/?page=${1}&search=${val || ""}&type=Job`)
      .then((res) => {
        const { data } = res;
        let jobOpts = data?.map((opt) => {
          return {
            label: ` ${opt?.type} - ${opt?.job_number}`,
            value: opt?.id,
          };
        });
        if (props.isEdit) {
          const selJob = jobOpts.find(
            (cur) => cur.value === props.voucherData?.job?.id
          );
          setSelectedJob(selJob);
        }
        setJobOptions(jobOpts);
      })
      .catch((err) => console.log(err));
  };

  const getOrganizationOptions = (opts) => {
    setLoading(true);
    apiAuth
      .get(`/api/get-organization/`)
      .then((response) => {
        let data = response.data;
        const consOpts = data.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
            type: "organization",
          };
        });

        const finalOpts = consOpts.concat(opts);
        setFromAndToOptions(finalOpts);
        const sel_party = finalOpts.find(
          (item) => item.value === props?.voucherData?.party_account?.id
        );

        setSelectedParty(sel_party);

        const sel_voucherFrom = finalOpts.find(
          (item) => item.value === Number(props?.voucherData?.voucher_from)
        );
        setSelectedVoucherFrom(sel_voucherFrom);
        const sel_voucherTo = finalOpts.find(
          (item) => item.value === Number(props?.voucherData?.voucher_to)
        );

        setSelectedVoucherTo(sel_voucherTo);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const goBack = () => {
    history.push("/vouchers");
  };

  const routePage = (event) => {
    if (event.value === "Journal") {
      history.push("/journal-voucher");
    } else if (event.value === "Payment") {
      history.push("/payment-voucher");
    } else if (event.value === "Receipt") {
      history.push("/receipt-voucher");
    } else if (event.value === "Debit Note") {
      history.push("/debit-voucher");
    } else if (event.value === "Credit Note") {
      history.push("/credit-voucher");
    }
  };

  // const customValidation = (formType, fieldValue) => {
  //   if (
  //     formType === "Journal" ||
  //     formType === "Payment" ||
  //     formType === "Receipt"
  //   ) {
  //     return "Required";
  //   }

  //   return null;
  // };

  const validateAccount = (value) => {
    if (
      !value &&
      (selectedVoucher?.value === "DebitNote" ||
        selectedVoucher?.value === "CreditNote")
    )
      return "Required";
    return "";
  };

  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">{selectedVoucher.label} Voucher</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item lg={11} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "white" }}>
              <Formik
                initialValues={{
                  date: props.voucherData?.date
                    ? new Date(props.voucherData?.date)
                    : new Date(),
                  gl_date: props.voucherData?.gl_date
                    ? new Date(props.voucherData?.gl_date)
                    : new Date(),
                  voucher_type: "",
                  invoice: "",
                  company: "",
                  voucher_from: props.voucherData?.voucher_from || "",
                  voucher_from_type: props.voucherData?.voucher_from_type || "",
                  voucher_to: props.voucherData?.voucher_to || "",
                  voucher_to_type: props.voucherData?.voucher_to_type || "",
                  branch: props.voucherData?.branch || "",
                  period: props.voucherData?.period
                    ? new Date(props.voucherData?.period)
                    : new Date(),
                  status: props.voucherData?.status || "",
                  job: props.voucherData?.job?.id || "",
                  party_account: props.voucherData?.party_account?.id || "",
                  party_account_type:
                    props.voucherData?.party_account_type || "",
                  currency: props.voucherData?.currency || "",
                  ex_rate: props.voucherData?.ex_rate || 1,
                  address: props.voucherData?.address || "",
                  fc_amount: props.voucherData?.fc_amount || "",
                  amount_sar: props.voucherData?.amount_sar || "",
                  ref_no: props.voucherData?.ref_no || "",
                  ref_date: props.voucherData?.ref_date
                    ? new Date(props.voucherData?.ref_date)
                    : new Date(),
                  naration: props.voucherData?.naration || "",
                  division: props.voucherData?.division || "",
                  remarks: props.voucherData?.remarks || "",
                  instrument_type: props.voucherData?.instrument_type || "Cash",
                  received_from: props.voucherData?.received_from || "",
                  voucher_for:
                    props.voucherData?.voucher_for || voucherId === "DebitNote"
                      ? "Vendor"
                      : "Customer",
                  voucher_number: props.voucherData?.voucher_number || "",
                }}
                validationSchema={Yup.object({
                  // branch: Yup.string().required("Required!"),
                  // period: Yup.string().required("Required!"),
                  // job: Yup.string().ensure().required("Required!"),
                  // address: Yup.string().required("Required!"),
                  // naration: Yup.string().required("Required!"),
                  // division: Yup.string().required("Required!"),
                  // remarks: Yup.string().required("Required!"),
                  // amount_sar: Yup.string().required("Required!"),
                  // ref_no: Yup.string().required("Required!"),
                  // party_account: Yup.string().ensure().required("Required!"),
                  // party_account: Yup.string().when(["selectedVoucher"], {
                  //   is: (selectedVoucher) =>
                  //     selectedVoucher &&
                  //     (selectedVoucher?.value === "DebitNote" ||
                  //       selectedVoucher?.value === "CreditNote"),
                  //   otherwise: Yup.string().notRequired(),
                  // }),
                  // party_account: Yup.string().test(
                  //   "customValidation",
                  //   "Required",
                  //   function (value) {
                  //     // Access other form values if needed
                  //     const formType = selectedVoucher?.value;
                  //     return customValidation(formType, value);
                  //   }
                  // ),
                  // currency: Yup.string().ensure().required("Required!"),
                })}
                onSubmit={(values) => {
                  values["voucher_type"] = selectedVoucher.value;
                  values["company"] = JSON.parse(
                    localStorage.getItem("authUser")
                  ).company_id;
                  setLoading(true);
                  if ((props.isEdit && props.voucherData) || vouchId) {
                    values["voucher_number"] =
                      vocherState?.voucher_number ||
                      props.voucherData?.voucher_number;
                    apiAuth
                      .patch(
                        `/api/master/voucher/${
                          props.voucherData?.id || vouchId
                        }/`,
                        values
                      )
                      .then((res) => {
                        NotificationManager.success(
                          "Journal Voucher",
                          "Voucher Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );

                        if (!vouchId) props.closeAddPopup();
                        setLoading(false);
                      })
                      .catch((err) => {
                        setLoading(false);
                        NotificationManager.error(
                          "Journal Voucher",
                          "Voucher Create Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    if (!loading)
                      apiAuth
                        .post("/api/master/voucher/", values)
                        .then((res) => {
                          const { data } = res;
                          setVouchId(data?.id);
                          setLoading(false);
                          NotificationManager.success(
                            "Journal Voucher",
                            "Voucher Created Successfully",
                            3000,
                            null,
                            null,
                            ""
                          );
                          setVocherState((prev) => {
                            return {
                              ...vocherState,
                              voucher_id: res?.data?.id,
                              voucher_number: res?.data?.voucher_number,
                            };
                          });
                          // history.push("/vouchers");
                        })
                        .catch((err) => {
                          setLoading(false);
                          NotificationManager.error(
                            "Journal Voucher",
                            "Voucher Create Error",
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                  }
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucher_type" className="form-label">
                            Voucher Type
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            name="voucher_type"
                            styles={customStyles}
                            value={selectedVoucher}
                            options={voucherOptions}
                            onChange={(event) => {
                              console.log(event, "event");
                              setSelectedVoucher(event);
                              setFieldValue("voucher_type", event.value);
                              getInvoices(event.value);
                            }}
                          />
                          {errors.voucher_type && touched.voucher_type && (
                            <div className="invalid-feedback d-block">
                              {errors.voucher_type}
                            </div>
                          )}
                        </div>
                      </Grid>
                      {props?.isEdit && (
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="voucher_number"
                              className="form-label"
                            >
                              Voucher Number
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Field
                              placeholder="Voucher No"
                              className="form-control"
                              name="voucher_number"
                              style={{ background: "#EDEDED" }}
                            />
                            {errors.voucher_number &&
                              touched.voucher_number && (
                                <div className="invalid-feedback d-block">
                                  {errors.voucher_number}
                                </div>
                              )}
                          </div>
                        </Grid>
                      )}
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["date"]}
                              onChange={(date) => {
                                setFieldValue("date", date);
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="d MMMM yyyy h:mm aa"
                            />
                            <div
                              style={{
                                position: "relative",
                                // cursor: "pointer",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                {/* <i className="bi bi-calendar4-week"></i> */}
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                          {errors.date && touched.date && (
                            <div className="invalid-feedback d-block">
                              {errors.date}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={5} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="gl_date" className="form-label">
                            G/L Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["gl_date"]}
                              onChange={(date) => {
                                setFieldValue("gl_date", date);
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="d MMMM yyyy h:mm aa"
                            />
                            <div
                              style={{
                                position: "relative",
                                // cursor: "pointer",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                {/* <i className="bi bi-calendar4-week"></i> */}
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                          {errors.gl_date && touched.gl_date && (
                            <div className="invalid-feedback d-block">
                              {errors.gl_date}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={5} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ref_date" className="form-label">
                            Ref Date
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["ref_date"]}
                              onChange={(date) => {
                                setFieldValue("ref_date", date);
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="d MMMM yyyy h:mm aa"
                            />
                            <div
                              style={{
                                position: "relative",
                                // cursor: "pointer",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                {/* <i className="bi bi-calendar4-week"></i> */}
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                          {errors.ref_date && touched.ref_date && (
                            <div className="invalid-feedback d-block">
                              {errors.ref_date}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="branch" className="form-label">
                            Branch
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            value={selBranch}
                            onChange={(data) => {
                              setSelBranch(data);
                              setFieldValue("branch", data.value);
                              // if (data.value === "DUBAI") {
                              //   setFieldValue("ex_rate", 1);
                              //   setFieldValue("amount_sar", "AED");
                              // }
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
                          <label htmlFor="period" className="form-label">
                            Period
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              placeholder="Period"
                              selected={values["period"]}
                              onChange={(date) => {
                                setFieldValue("period", date);
                              }}
                              dateFormat="yyyy MMMM"
                              showMonthYearPicker
                            />
                            <div
                              style={{
                                position: "relative",
                                // cursor: "pointer",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                {/* <i className="bi bi-calendar4-week"></i> */}
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                          {errors.period && touched.period && (
                            <div className="invalid-feedback d-block">
                              {errors.period}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            Status
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            options={statusOptions}
                            value={selStatus}
                            onChange={(data) => {
                              setFieldValue("status", data.label);
                              setSelStatus(data);
                            }}
                            styles={customStyles}
                          />
                          {errors.status && touched.status && (
                            <div className="invalid-feedback d-block">
                              {errors.status}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            name="currency"
                            styles={customStyles}
                            value={selCurrency}
                            options={currencyOptions}
                            onChange={(data) => {
                              setFieldValue("currency", data.value);
                              // console.log("eeeee", data);
                              setSelCurrency(data);
                            }}
                          />
                          {errors.currency && touched.currency && (
                            <div className="invalid-feedback d-block">
                              {errors.currency}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="party_account" className="form-label">
                            Party A/C
                            {(selectedVoucher?.value === "DebitNote" ||
                              selectedVoucher?.value === "CreditNote") && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <Select
                            name="party_account"
                            styles={customStyles}
                            value={selectedParty}
                            options={fromAndToOptions}
                            onChange={(data) => {
                              setFieldValue("party_account", data.value);
                              setFieldValue("party_account_type", data.type);
                              setSelectedParty(data);
                            }}
                          />
                          <Field
                            placeholder="1"
                            className="form-control"
                            name="party_account"
                            validate={(value) => validateAccount(value)}
                            style={{ background: "#EDEDED", display: "none" }}
                          />

                          {errors.party_account && touched.party_account && (
                            <div className="invalid-feedback d-block">
                              {errors.party_account}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="job" className="form-label">
                            Job Type
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onInputChange={(val) => {
                              getJobOptions(val);
                            }}
                            onChange={(data) => {
                              setFieldValue("job", data.value);
                              setSelectedJob(data);
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ex_rate" className="form-label">
                            Ex Rate
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            placeholder="1"
                            className="form-control"
                            name="ex_rate"
                            style={{ background: "#EDEDED" }}
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
                          />
                          {errors.ex_rate && touched.ex_rate && (
                            <div className="invalid-feedback d-block">
                              {errors.ex_rate}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="fc_amount" className="form-label">
                            FC Amount
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            placeholder="FC Amount"
                            className="form-control"
                            name="fc_amount"
                            style={{ background: "#EDEDED" }}
                            onChange={(e) => {
                              setFieldValue("fc_amount", e.target.value);
                              if (values["ex_rate"] > 0) {
                                setFieldValue(
                                  "amount_sar",
                                  Number(e.target.value) *
                                    Number(values["ex_rate"])
                                );
                              }
                            }}
                          />
                          {errors.fc_amount && touched.fc_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fc_amount}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="amount_sar" className="form-label">
                            Amount (SAR)
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            placeholder="Amount (SAR)"
                            className="form-control"
                            name="amount_sar"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.amount_sar && touched.amount_sar && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_sar}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      {selectedVoucher?.value === "Journal" ||
                      selectedVoucher?.value === "Payment" ||
                      selectedVoucher?.value === "Receipt" ? (
                        <></>
                      ) : (
                        <>
                          <Grid item lg={4} xs={12}>
                            <div className="mb-3">
                              <label
                                htmlFor="voucher_from"
                                className="form-label"
                              >
                                From
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <Select
                                name="voucher_from"
                                styles={customStyles}
                                value={selectedVoucherFrom}
                                options={fromAndToOptions}
                                onChange={(event) => {
                                  console.log(event, "event");
                                  setSelectedVoucherFrom(event);
                                  setFieldValue("voucher_from", event.value);
                                  setFieldValue(
                                    "voucher_from_type",
                                    event.type
                                  );
                                }}
                              />
                              {errors.voucher_from && touched.voucher_from && (
                                <div className="invalid-feedback d-block">
                                  {errors.voucher_from}
                                </div>
                              )}
                            </div>
                          </Grid>
                          <Grid item lg={4} xs={12}>
                            <div className="mb-3">
                              <label
                                htmlFor="voucher_to"
                                className="form-label"
                              >
                                To
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <Select
                                name="voucher_to"
                                styles={customStyles}
                                value={selectedVoucherTo}
                                options={fromAndToOptions}
                                onChange={(event) => {
                                  // console.log(event, "event");
                                  setSelectedVoucherTo(event);
                                  setFieldValue("voucher_to", event.value);
                                  setFieldValue("voucher_to_type", event.type);
                                }}
                              />
                              {errors.voucher_to && touched.voucher_to && (
                                <div className="invalid-feedback d-block">
                                  {errors.voucher_to}
                                </div>
                              )}
                            </div>
                          </Grid>
                        </>
                      )}
                      {selectedVoucher.value === "Payment" && (
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label htmlFor="pay_to" className="form-label">
                              Pay To
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Field
                              className="form-control"
                              name="pay_to"
                              placeholder="Pay To"
                              style={{ background: "#EDEDED" }}
                            />
                            {errors.pay_to && touched.pay_to && (
                              <div className="invalid-feedback d-block">
                                {errors.pay_to}
                              </div>
                            )}
                          </div>
                        </Grid>
                      )}
                      {selectedVoucher.value === "Receipt" && (
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="received_from"
                              className="form-label"
                            >
                              Recieved from
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Field
                              className="form-control"
                              name="received_from"
                              placeholder="Recieved from"
                              style={{ background: "#EDEDED" }}
                            />
                            {errors.received_from && touched.received_from && (
                              <div className="invalid-feedback d-block">
                                {errors.received_from}
                              </div>
                            )}
                          </div>
                        </Grid>
                      )}

                      {(selectedVoucher.value === "Payment" ||
                        selectedVoucher.value === "Receipt") && (
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label
                              htmlFor="instrument_type"
                              className="form-label"
                            >
                              Instrument Type
                              {/* <span className="text-danger">*</span> */}
                            </label>

                            <Select
                              name="instrument_type"
                              styles={customStyles}
                              value={selInstType}
                              options={instTypeOptions}
                              onChange={(data) => {
                                setFieldValue("instrument_type", data.value);
                                setSelInstType(data);
                              }}
                            />
                            {errors.instrument_type &&
                              touched.instrument_type && (
                                <div className="invalid-feedback d-block">
                                  {errors.instrument_type}
                                </div>
                              )}
                          </div>
                        </Grid>
                      )}
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ref_no" className="form-label">
                            Ref No
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            placeholder="Ref No"
                            className="form-control"
                            name="ref_no"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.ref_no && touched.ref_no && (
                            <div className="invalid-feedback d-block">
                              {errors.ref_no}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="naration" className="form-label">
                            Naration
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            name="naration"
                            placeholder="Naration"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.naration && touched.naration && (
                            <div className="invalid-feedback d-block">
                              {errors.naration}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="division" className="form-label">
                            Division
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            name="division"
                            className="form-control"
                            placeholder="division"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.division && touched.division && (
                            <div className="invalid-feedback d-block">
                              {errors.division}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    {(selectedVoucher?.value === "DebitNote" ||
                      selectedVoucher?.value === "CreditNote") && (
                      <Grid container spacing={2}>
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label htmlFor="invoice" className="form-label">
                              Invoice
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Select
                              name="invoice"
                              styles={customStyles}
                              value={selectedInvoice}
                              options={invoiceOptions}
                              onChange={(event) => {
                                console.log(event, "event");
                                setSelectedInvoice(event);
                                setFieldValue("invoice", event.value);
                              }}
                            />
                            {errors.invoice && touched.invoice && (
                              <div className="invalid-feedback d-block">
                                {errors.invoice}
                              </div>
                            )}
                          </div>
                        </Grid>
                        <Grid item lg={4} xs={12}>
                          <div className="mb-3">
                            <label htmlFor="voucher_for" className="form-label">
                              Voucher For
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Select
                              name="voucher_for"
                              styles={customStyles}
                              value={selectedInvoucherFor}
                              options={[
                                { label: "Customer", value: "Customer" },
                                { label: "Vendor", value: "Vendor" },
                              ]}
                              onChange={(event) => {
                                // console.log(event, "event");
                                setSelectedInvoucherFor(event);
                                setFieldValue("voucher_for", event.value);
                              }}
                            />
                            {errors.voucher_for && touched.voucher_for && (
                              <div className="invalid-feedback d-block">
                                {errors.voucher_for}
                              </div>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    )}

                    {selectedVoucher?.value === "Payment" ||
                    selectedVoucher?.value === "Journal" ||
                    selectedVoucher?.value === "Receipt" ? (
                      <></>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item lg={8} xs={12}>
                          <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                              Address
                              {/* <span className="text-danger">*</span> */}
                            </label>
                            <Field
                              placeholder="Address"
                              className="form-control"
                              name="address"
                              style={{ background: "#EDEDED" }}
                            />
                            {errors.address && touched.address && (
                              <div className="invalid-feedback d-block">
                                {errors.address}
                              </div>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    )}

                    <div className="mb-3">
                      <label htmlFor="remarks" className="form-label">
                        Remarks
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <Field
                        as="textarea"
                        className="form-control"
                        name="remarks"
                        style={{ background: "#EDEDED" }}
                      />
                      {errors.remarks && touched.remarks && (
                        <div className="invalid-feedback d-block">
                          {errors.remarks}
                        </div>
                      )}
                    </div>

                    {loading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="mt-4 mb-3">
                          <button
                            className="btn btn-success"
                            // disabled={vocherState?.voucher_id && !props?.isEdit}
                            type="submit"
                          >
                            {props.isEdit || vouchId ? "Update" : "Submit"}
                          </button>
                          {vocherState.voucher_id || props.isEdit ? (
                            <div
                              className="btn btn-info float-right ms-3"
                              onClick={() => setAccountDetailsModal(true)}
                            >
                              Add Account
                            </div>
                          ) : (
                            <></>
                          )}
                          {vocherState.voucher_id || props.isEdit ? (
                            <div
                              className="btn btn-warning float-right ms-3"
                              onClick={() => {
                                invoiceGetData();
                              }}
                            >
                              Update Invoices
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>

                        {/* <button
                          className="btn btn-success mx-5"
                          type="button"
                          onClick={toggle}
                        >
                          Open Modal
                        </button> */}
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
          {/* <Grid item lg={4} style={{ margin: "auto" }}>
            <img src={jobsImage} alt="" />
          </Grid> */}
        </Grid>
      </div>
      {/* <Modal isOpen={modal} centered={modal} toggle={toggle}>
        <ModalBody>Modal</ModalBody>
      </Modal> */}
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={accountDetailsModal}
        toggle={() => {
          setAccountDetailsModal(false);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setAccountDetailsModal(false);
          }}
        >
          Add Account
        </ModalHeader>
        <ModalBody>
          <AccountDetail
            fromVoucher={true}
            voucherId={vouchId}
            closeAddPopup={() => {
              setAccountDetailsModal(false);
            }}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={updateStatusModal}
        toggle={() => {
          setUpdateStatusModal(false);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setUpdateStatusModal(false);
          }}
        >
          Update Invoices
        </ModalHeader>
        <ModalBody>
          <UpdateVoucherStatus data={[...invoiceData]} />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Voucher;
