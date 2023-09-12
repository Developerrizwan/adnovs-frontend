import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { getAllISOCodes } from "iso-country-currency";
import { useParams } from "react-router";

const AccountDetail = (props) => {
  const history = useHistory();
  const { voucherId } = useParams();

  const DrCrOptions = [
    { label: "Dr", value: "Dr" },
    { label: "Cr", value: "Cr" },
  ];
  const branchOptions = [
    { label: " JEDDAH", value: " JEDDAH" },
    { label: " DUBAI", value: " DUBAI" },
  ];

  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [organizationOptions, setOrganizationOptions] = useState(null);
  const [fromAndToOptions, setFromAndToOptions] = useState([]);
  const [tax, setTax] = useState(null);

  const [selectedParty, setSelectedParty] = useState(null);
  const [selBranch, setSelBranch] = useState(null);
  const [selAsset, setSelAsset] = useState(null);
  const [selOption, setSelOption] = useState(null);
  const [selCurrency, setSelCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedVoucher, setSelectedVoucher] = useState({});

  const [selInstType, setSelInstType] = useState({
    value: "Cash",
    label: "Cash",
  });

  const taxGroupCodeOptions = [
    {
      label: "VAT 0%",
      value: 0,
    },
    { label: "VAT 5%", value: 5 },
    { label: "VAT 10%", value: 10 },
    { label: "VAT 15%", value: 15 },
  ];

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [partyOptions, setPartyOptions] = useState([]);

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
    { value: "Debit Note", label: "Debit Note" },
    { value: "Credit Note", label: "Credit Note" },
  ];

  console.log("propsss-------------------", props);

  useEffect(() => {
    const sel = voucherOptions.find((dd) => dd.value === voucherId);
    getJobOptions();
    getPartyOptions();
    getAllCurrencyCodes();

    if (props?.isEdit) {
      setSelBranch({
        label: props.accountDetails?.inter_branch,
        value: props.accountDetails?.inter_branch,
      });
    }

    if (props?.isEdit) {
      setSelOption({
        label: props.accountDetails?.dr_cr,
        value: props.accountDetails?.dr_cr,
      });
    }

    const selectedTax = taxGroupCodeOptions.find(
      (cur) => cur.value === Number(props?.accountDetails?.tax_group_code)
    );
    setTax(selectedTax);
    const selvoucher = voucherOptions.find(
      (dd) => dd.value === props.accountDetails?.vouchers?.voucher_type
    );
    setSelectedVoucher(selvoucher);
  }, []);

  const getAllCurrencyCodes = () => {
    let allCurrencies = getAllISOCodes();
    allCurrencies = allCurrencies.map((cur) => {
      return {
        label: cur.currency + "  -  " + cur.countryName,
        value: cur.currency + "  -  " + cur.countryName,
      };
    });
    if (props.isEdit) {
      const selCurr = allCurrencies.find(
        (cur) => cur.value === props.accountDetails?.currency
      );
      console.log("curr", selCurrency);
      setSelCurrency(selCurr);
    }
    setCurrencyOptions(allCurrencies);
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
        if (props?.isEdit) {
          const selParty = data.find(
            (cur) => cur.value === props.accountDetails?.ac_name?.id
          );
          setSelectedParty(selParty);
        }
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
        let jobOpts = data.results.map((opt) => {
          return {
            label: ` ${opt?.type} - ${opt?.job_number}`,
            value: opt?.id,
          };
        });
        if (props.isEdit) {
          const selJob = jobOpts.find(
            (cur) => cur.value === props.accountDetails?.job?.id
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
    history.push("/account-details");
  };

  return (
    <React.Fragment>
      <div className={props.isEdit || props?.fromVoucher ? "" : "page-content"}>
        {props.isEdit || props?.fromVoucher ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Add Account</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}
        <Grid container spacing={2}>
          <Grid item lg={11} style={{ margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  vouchers:
                    props.accountDetails?.vouchers?.id ||
                    props?.voucherId ||
                    "",
                  // line_no: props.accountDetails?.line_no || 1,
                  ac_name: props.accountDetails?.ac_name?.id || "",
                  dr_cr: props.accountDetails?.dr_cr || "",
                  narration: props.accountDetails?.narration || "",
                  qty: props.accountDetails?.qty || "",
                  currency: props.accountDetails?.currency || "",
                  ex_rate: props.accountDetails?.ex_rate || 1,
                  amount_qty: props.accountDetails?.amount_qty || "",
                  fcy_amount: props.accountDetails?.fcy_amount || "",
                  amount_sar: props.accountDetails?.amount_sar || "",
                  tax_group_code: props.accountDetails?.tax_group_code || "",
                  taxable_amount: props.accountDetails?.taxable_amount || "",
                  tax_amount: props.accountDetails?.tax_amount || "",
                  division: props.accountDetails?.division || "",
                  asset: props.accountDetails?.asset || "",
                  inter_branch: props.accountDetails?.inter_branch || "",
                  sac_code: props.accountDetails?.sac_code || "",
                  department: props.accountDetails?.department || "",
                  shipment_no: props.accountDetails?.shipment_no || "",
                  job_no: props.accountDetails?.job_no || "",
                  remarks: props.accountDetails?.remarks || "",
                }}
                validationSchema={Yup.object({
                  // line_no: Yup.string().ensure().required("Required!"),
                  ac_name: Yup.string().ensure().required("Required!"),
                  qty: Yup.string().required("Required!"),
                  amount_qty: Yup.string().required("Required!"),
                })}
                onSubmit={(values) => {
                  console.log("shskjkj", values);
                  setLoading(true);
                  if (props.isEdit && props.accountDetails) {
                    apiAuth
                      .patch(
                        `/api/master/accountdetails/${props.accountDetails?.id}/`,
                        values
                      )
                      .then((res) => {
                        setLoading(false);
                        NotificationManager.success(
                          "Account Details",
                          "Account Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        setLoading(false);
                        NotificationManager.error(
                          "Account Details",
                          "Account Create Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    apiAuth
                      .post("/api/master/accountdetails/", values)
                      .then((res) => {
                        const { data } = res;
                        setLoading(false);
                        NotificationManager.success(
                          "Account Details",
                          "Account Created Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        console.log("ddddddd", props?.fromVoucher);
                        props?.fromVoucher
                          ? props.closeAddPopup()
                          : history.push("/account-details");
                      })
                      .catch((err) => {
                        setLoading(false);
                        NotificationManager.error(
                          "Account Details",
                          "Account Create Error",
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
                      {/* <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucher_type" className="form-label">
                            Voucher Type
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
                            }}
                          />
                          {errors.voucher_type && touched.voucher_type && (
                            <div className="invalid-feedback d-block">
                              {errors.voucher_type}
                            </div>
                          )}
                        </div>
                      </Grid> */}
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ac_name" className="form-label">
                            A/C Name
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="ac_name"
                            styles={customStyles}
                            value={selectedParty}
                            options={partyOptions}
                            onChange={(data) => {
                              setFieldValue("ac_name", data?.value);
                              setSelectedParty(data);
                            }}
                          />
                          {errors.ac_name && touched.ac_name && (
                            <div className="invalid-feedback d-block">
                              {errors.ac_name}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="dr_cr" className="form-label">
                            Dr / Cr
                          </label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={DrCrOptions}
                            value={selOption}
                            onChange={(data) => {
                              setSelOption(data);
                              setFieldValue("dr_cr", data.value);
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="amount_qty" className="form-label">
                            Amount / Qty
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="amount_qty"
                            placeholder="Amount Qty"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.amount_qty && touched.amount_qty && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_qty}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="narration" className="form-label">
                            Narration
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            name="narration"
                            placeholder="Narration"
                            style={{ background: "#EDEDED" }}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="qty" className="form-label">
                            Qty
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="qty"
                            placeholder="Qty"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.qty && touched.qty && (
                            <div className="invalid-feedback d-block">
                              {errors.qty}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                          </label>
                          <Select
                            name="currency"
                            styles={customStyles}
                            value={selCurrency}
                            options={currencyOptions}
                            onChange={(data) => {
                              setFieldValue("currency", data.value);
                              setSelCurrency(data);
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ex_rate" className="form-label">
                            Ex Rate
                          </label>
                          <Field
                            placeholder="1"
                            className="form-control"
                            name="ex_rate"
                            style={{ background: "#EDEDED" }}
                            onChange={(e) => {
                              setFieldValue("ex_rate", e.target.value);
                              if (values["fcy_amount"].length) {
                                setFieldValue(
                                  "amount_sar",
                                  Number(e.target.value) *
                                    Number(values["fcy_amount"])
                                );
                              }
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="fcy_amount" className="form-label">
                            FCY Amount
                          </label>
                          <Field
                            placeholder="FCY Amount"
                            className="form-control"
                            name="fcy_amount"
                            style={{ background: "#EDEDED" }}
                            onChange={(e) => {
                              setFieldValue("fcy_amount", e.target.value);
                              if (values["ex_rate"] > 0) {
                                setFieldValue(
                                  "amount_sar",
                                  Number(e.target.value) *
                                    Number(values["ex_rate"])
                                );
                              }
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="amount_sar" className="form-label">
                            Amount (SAR)
                          </label>
                          <Field
                            placeholder="Amount (SAR)"
                            className="form-control"
                            name="amount_sar"
                            style={{ background: "#EDEDED" }}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="tax_group_code"
                            className="form-label"
                          >
                            Tax Group Code
                          </label>
                          <Select
                            name="tax_group_code"
                            styles={customStyles}
                            value={tax}
                            options={taxGroupCodeOptions}
                            onChange={(data) => {
                              setFieldValue("tax_group_code", data.value);
                              setTax(data);
                            }}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="taxable_amount"
                            className="form-label"
                          >
                            Taxable Amount
                          </label>
                          <Field
                            className="form-control"
                            name="taxable_amount"
                            placeholder="Taxable Amount"
                            style={{ background: "#EDEDED" }}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="tax_amount" className="form-label">
                            Tax Amount
                          </label>
                          <Field
                            className="form-control"
                            name="tax_amount"
                            placeholder="Tax Amount"
                            style={{ background: "#EDEDED" }}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="inter_branch" className="form-label">
                            Inter Branch
                          </label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            value={selBranch}
                            onChange={(data) => {
                              setSelBranch(data);
                              setFieldValue("inter_branch", data.value);
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
                          <label htmlFor="sac_code" className="form-label">
                            SAC Code
                          </label>
                          <Field
                            placeholder="SAC Code"
                            className="form-control"
                            name="sac_code"
                            style={{ background: "#EDEDED" }}
                          />
                        </div>
                      </Grid>
                    </Grid>

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
                      <div className="mt-4 mb-3">
                        <button className="btn btn-success" type="submit">
                          {props.isEdit ? "Update" : "Submit"}
                        </button>
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
    </React.Fragment>
  );
};

export default AccountDetail;
