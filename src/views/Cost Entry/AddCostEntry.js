import { Card, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
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

const AddCostEntry = (props) => {
  const history = useHistory();
  const [selVoucher, setSelVoucher] = useState({
    value: "Journal",
    label: "Journal",
  });
  const [selCurrency, setSelCurrency] = useState(null);
  const [selStatus, setSelStatus] = useState(null);
  const [selJob, setSelJob] = useState(null);
  const [isDRorCR, setIsDRorCR] = useState(null);
  const [selCharge, setSelCharge] = useState(null);
  const [selShipment, setSelShipment] = useState(null);
  const [selSaleOrCost, setSelSaleOrCost] = useState(null);
  const [selProrate, setSelProrate] = useState(null);
  const [tax, setTax] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [shipmentOptions, setShipmentOptions] = useState([]);
  const [chargeOptions, setChargeOptions] = useState([]);
  const [saleOrCostOptions, setSaleOrCostOptions] = useState([
    {
      label: "Sale",
      value: "Sale",
    },
    { label: "Cost", value: "Cost" },
    { label: "Both", value: "both" },
  ]);

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit Note", label: "Debit Note" },
    { value: "Credit Note", label: "Credit Note" },
  ];

  // const SaleOrCostOptions = [
  //   {
  //     label: "Sale",
  //     value: "Sale",
  //   },
  //   { label: "Cost", value: "Cost" },
  //   { label: "Both", value: "both" },
  // ];

  const drOrCrOptions = [
    {
      label: "Dr",
      value: "Dr",
    },
    { label: "Cr", value: "Cr" },
  ];

  const prorateOptions = [
    {
      label: "Chargeable Unit",
      value: "Chargeable Unit",
    },
    { label: "Shipment Basis", value: "Shipment Basis" },
  ];

  const taxOptions = [
    {
      label: "VAT 0%",
      value: 0,
    },
    { label: "VAT 5%", value: 5 },
    { label: "VAT 10%", value: 10 },
    { label: "VAT 15%", value: 15 },
  ];

  const getChargeData = (val) => {
    apiAuth
      .get(`/api/master/charge/?page=${1}&search=${val}`)
      .then((response) => {
        let {
          data: { results },
        } = response;
        results = results.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
            description: dd?.description,
          };
        });
        setChargeOptions(results);
      })
      .catch((err) => console.log(err));
  };

  const getAllCurrencyCodes = () => {
    let allCurrencies = getAllISOCodes();
    allCurrencies = allCurrencies.map((cur) => {
      return {
        label: cur.currency + "  -  " + cur.countryName,
        value: cur.currency,
      };
    });
    setCurrencyOptions(allCurrencies);
  };

  const getJobOptions = (val) => {
    apiAuth
      .get(`/api/master/job/?&type=Job`)
      .then((res) => {
        const { data } = res;
        let jobOpts = data.map((opt) => {
          return {
            label: opt?.job_number,
            value: opt?.id,
          };
        });
        setJobOptions(jobOpts);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllCurrencyCodes();
    getJobOptions();
    getChargeData("");
  }, []);

  useEffect(() => {
    if (
      props.isEdit &&
      currencyOptions.length &&
      jobOptions.length &&
      chargeOptions.length
    ) {
      getInitialValues();
    }
  }, [currencyOptions.length, jobOptions.length, chargeOptions.length]);

  useEffect(() => {
    // Conditionally remove "Both" option if props.isedit is true
    const modifiedSaleOrCostOptions = props.isEdit
      ? saleOrCostOptions.filter((option) => option.value !== "both")
      : saleOrCostOptions;

    setSaleOrCostOptions(modifiedSaleOrCostOptions);
  }, [props.isEdit]);

  const getInitialValues = () => {
    const selectedVoucher = voucherOptions.find(
      (dd) => dd.value === props.entry?.voucher_type
    );
    setSelVoucher(selectedVoucher);

    const selectedCharge = chargeOptions.find(
      (dd) => dd.value === props.entry?.charge?.id
    );
    setSelCharge(selectedCharge);

    const selectedJob = jobOptions.find(
      (dd) => dd.value === props.entry?.job_no?.id
    );
    setSelJob(selectedJob);
    console.log("props.entry?.job_no", props.entry?.job_no?.id);
    // console.log("dd.value", dd.value);

    const selectedStatus = props.entry.job_no
      ? { label: "Active", value: true }
      : { label: "Inactive", value: false };
    setSelStatus(selectedStatus);

    const selCurr = currencyOptions.find(
      (cur) => cur.value === props.entry?.currency
    );
    setSelCurrency(selCurr);

    const selectedTax = taxOptions.find(
      (cur) => cur.value === Number(props.entry?.tax_group_code)
    );

    setTax(selectedTax);

    const selectedProrate = prorateOptions.find(
      (cur) => cur.value === props.entry?.prorate_method
    );
    setSelProrate(selectedProrate);

    const selectedSorC = saleOrCostOptions.find(
      (cur) => cur.value === props.entry?.sale_cost
    );
    setSelSaleOrCost(selectedSorC);

    const selectedDr = drOrCrOptions.find(
      (cur) => cur.value === props.entry?.dr_cr
    );
    setIsDRorCR(selectedDr);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const goBack = () => {
    history.push("/cost-entry");
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
              <h2 className="mx-5">Cost Entry</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item lg={11} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  // voucher_type: props.entry?.voucher_type || "Journal",
                  charge: props.entry?.charge?.id || "",
                  description: props.entry?.description || "",
                  job_no: props.entry?.job_no?.id || "",
                  shipment_no: props.entry?.shipment_no || "",
                  currency: props.entry?.currency || "",
                  ex_rate: props.entry?.ex_rate || "",
                  fcy_amount: props.entry?.fcy_amount || "",
                  amount: props.entry?.amount || "",
                  sale_cost: props.entry?.sale_cost || "",
                  dr_cr: props.entry?.dr_cr || "",
                  quantity: props.entry?.quantity || "",
                  // prorate_method: props.entry?.prorate_method || "",
                  tax_group_code: props.entry?.tax_group_code || "",
                }}
                validationSchema={Yup.object({
                  charge: Yup.string().ensure().required("Required!"),
                  description: Yup.string().required("Required!"),
                  job_no: Yup.string().ensure().required("Required!"),
                  shipment_no: Yup.string().required("Required!"),
                  currency: Yup.string().ensure().required("Required!"),
                  tax_group_code: Yup.string().ensure().required("Required!"),
                  dr_cr: Yup.string().ensure().required("Required!"),
                  sale_cost: Yup.string().ensure().required("Required!"),
                })}
                onSubmit={(values) => {
                  if (props.isEdit && props.entry) {
                    apiAuth
                      .patch(
                        `/api/master/cost_entry/${props.entry?.id}/`,
                        values
                      )
                      .then((res) => {
                        NotificationManager.success(
                          "",
                          "Cost Entry Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "",
                          "Cost Entry Update Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    if (values?.sale_cost === "both") {
                      // 1st time api call

                      const valuesWithCost = { ...values, sale_cost: "Cost" };
                      const valuesWithSale = { ...values, sale_cost: "Sale" };
                      apiAuth
                        .post("/api/master/cost_entry/", valuesWithCost)
                        .then((res) => {
                          console.log("res", res);
                        })
                        .catch((err) => {
                          console.log(err);
                        });

                      // 2nd time api call

                      apiAuth
                        .post("/api/master/cost_entry/", valuesWithSale)
                        .then((res) => {
                          NotificationManager.success(
                            "",
                            "Cost Entry Created Successfully",
                            3000,
                            null,
                            null,
                            ""
                          );
                          history.push("/cost-entry");
                        })
                        .catch((err) => {
                          NotificationManager.error(
                            "",
                            "Cost Entry Create Error",
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                    } else {
                      apiAuth
                        .post("/api/master/cost_entry/", values)
                        .then((res) => {
                          NotificationManager.success(
                            "",
                            "Cost Entry Created Successfully",
                            3000,
                            null,
                            null,
                            ""
                          );
                          history.push("/cost-entry");
                        })
                        .catch((err) => {
                          NotificationManager.error(
                            "",
                            "Cost Entry Create Error",
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                    }
                  }
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    {/* <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucher_type" className="form-label">
                            Voucher Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            styles={customStyles}
                            options={voucherOptions}
                            value={selVoucher}
                            onChange={(data) => {
                              setFieldValue("voucher_type", data.value);
                              setSelVoucher(data);
                            }}
                          />
                          {errors.voucher_type && touched.voucher_type && (
                            <div className="invalid-feedback d-block">
                              {errors.voucher_type}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid> */}
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="charge" className="form-label">
                            Charge
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            styles={customStyles}
                            options={chargeOptions}
                            value={selCharge}
                            onInputChange={(val) => getChargeData(val)}
                            onChange={(data) => {
                              setFieldValue("charge", data.value);
                              setFieldValue("description", data.description);
                              setSelCharge(data);
                            }}
                          />
                          {errors.charge && touched.charge && (
                            <div className="invalid-feedback d-block">
                              {errors.charge}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Description
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            placeholder="Description"
                            className="form-control"
                            name="description"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.description && touched.description && (
                            <div className="invalid-feedback d-block">
                              {errors.description}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="job_no" className="form-label">
                            Job No
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job_no"
                            styles={customStyles}
                            value={selJob}
                            options={jobOptions}
                            // onInputChange={(val) => {
                            //   getJobOptions(val);
                            // }}
                            onChange={(data) => {
                              setFieldValue("job_no", data.value);
                              setSelJob(data);
                            }}
                          />
                          {errors.job_no && touched.job_no && (
                            <div className="invalid-feedback d-block">
                              {errors.job_no}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="shipment_no" className="form-label">
                            Shipment No
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            placeholder="Shipment No"
                            className="form-control"
                            name="shipment_no"
                            style={{ background: "#EDEDED" }}
                          />
                          {/* <Select
                            name="shipment_no"
                            styles={customStyles}
                            value={selShipment}
                            options={shipmentOptions}
                            onChange={(data) => {
                              setFieldValue("shipment_no", data.value);
                              setSelShipment(data);
                            }}
                          /> */}
                          {errors.shipment_no && touched.shipment_no && (
                            <div className="invalid-feedback d-block">
                              {errors.shipment_no}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                            <span className="text-danger">*</span>
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="ex_rate" className="form-label">
                            Ex.Rate
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="0"
                            name="ex_rate"
                            style={{ background: "#EDEDED" }}
                            onChange={(e) => {
                              setFieldValue("ex_rate", e.target.value);
                              if (values["fcy_amount"].length) {
                                setFieldValue(
                                  "amount",
                                  Number(e.target.value) *
                                    Number(values["fcy_amount"])
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="fcy_amount" className="form-label">
                            FCY Amount
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="0"
                            name="fcy_amount"
                            style={{ background: "#EDEDED" }}
                            onChange={(e) => {
                              setFieldValue("fcy_amount", e.target.value);
                              if (values["ex_rate"].length) {
                                setFieldValue(
                                  "amount",
                                  Number(e.target.value) *
                                    Number(values["ex_rate"])
                                );
                              }
                            }}
                          />
                          {errors.fcy_amount && touched.fcy_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fcy_amount}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="amount" className="form-label">
                            Amount
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="0"
                            name="amount"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.amount && touched.amount && (
                            <div className="invalid-feedback d-block">
                              {errors.amount}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="tax_group_code"
                            className="form-label"
                          >
                            Tax Group Code
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="tax_group_code"
                            styles={customStyles}
                            value={tax}
                            options={taxOptions}
                            onChange={(data) => {
                              setFieldValue("tax_group_code", data.value);
                              setTax(data);
                            }}
                          />
                          {errors.tax_group_code && touched.tax_group_code && (
                            <div className="invalid-feedback d-block">
                              {errors.tax_group_code}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="dr_cr" className="form-label">
                            Dr/Cr
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="dr_cr"
                            styles={customStyles}
                            value={isDRorCR}
                            options={drOrCrOptions}
                            onChange={(data) => {
                              setFieldValue("dr_cr", data.value);
                              setIsDRorCR(data);
                            }}
                          />
                          {errors.dr_cr && touched.dr_cr && (
                            <div className="invalid-feedback d-block">
                              {errors.dr_cr}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      {/* <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="prorate_method"
                            className="form-label"
                          >
                            Prorate Method
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="prorate_method"
                            placeholder="Select"
                            styles={customStyles}
                            value={selProrate}
                            options={prorateOptions}
                            onChange={(data) => {
                              setFieldValue("prorate_method", data.value);
                              setSelProrate(data);
                            }}
                          />
                          {errors.prorate_method && touched.prorate_method && (
                            <div className="invalid-feedback d-block">
                              {errors.prorate_method}
                            </div>
                          )}
                        </div>
                      </Grid> */}
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="sale_cost" className="form-label">
                            Sale/Cost
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="sale_cost"
                            placeholder="Select"
                            styles={customStyles}
                            value={selSaleOrCost}
                            options={saleOrCostOptions}
                            onChange={(data) => {
                              setFieldValue("sale_cost", data.value);
                              setSelSaleOrCost(data);
                            }}
                          />
                          {errors.sale_cost && touched.sale_cost && (
                            <div className="invalid-feedback d-block">
                              {errors.sale_cost}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <div>
                            <label htmlFor="quantity" className=" w-50 p e-2">
                              Quantity
                            </label>
                            <Field
                              className="form-control "
                              name="quantity"
                              placeholder="1"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.quantity && touched.quantity && (
                            <div className="invalid-feedback d-block">
                              {errors.quantity}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className="mt-4 mb-3">
                      <button className="btn btn-success" type="submit">
                        {props.isEdit ? "Update" : "Submit"}
                      </button>
                    </div>
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

export default AddCostEntry;
