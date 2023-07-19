import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../App.css";
import moment from "moment";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const options = [
  { value: "all", label: "All" },
  { value: "option1", label: "Option1" },
];

const PaymentVoucher = (props) => {
  const history = useHistory();

  const [jobs, setJobs] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [date, setDate] = useState(new Date());
  const [glDate, setGlDate] = useState(new Date());
  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "Payment",
    label: "Payment",
  });

  const VoucherOptions = [
    // { value: "vouchers", label: "All" },
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit", label: "Debit" },
    { value: "Credit", label: "Credit" },
  ];

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = () => {
    apiAuth
      .get("/api/master/job/")
      .then((res) => {
        const { data } = res;
        let opts = data.map((dd) => {
          return {
            label: dd?.job_status,
            value: dd?.id,
          };
        });
        setJobOptions(opts);
      })
      .catch((err) => console.log(err));
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
    } else if (event.value === "Debit") {
      history.push("/debit-voucher");
    } else if (event.value === "Credit") {
      history.push("/credit-voucher");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        {/* <h1 className="mb-4 mx-4">Payment Voucher</h1> */}
        <div
          className="mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-5">Payment Voucher</h2>
          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={11} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  voucher_type: "Payment",
                  job: "",
                  branch: "",
                  book: "",
                  date: "",
                  glDate: "",
                  fc_amount: "",
                  amount_sar: "",
                  party_account: "",
                  against_concern: "",
                  naration: "",
                  outstanding_amount: "",
                  remarks: "",
                }}
                validationSchema={Yup.object({
                  job: Yup.string().ensure().required("Job is Required"),
                  branch: Yup.string().required("Branch is Required"),
                  book: Yup.string().required("Book is Required"),
                  fc_amount: Yup.string().required("FC Amount is Required"),
                  amount_sar: Yup.string().required("SAR Amount is Required"),
                  naration: Yup.string().required("naration is Required"),
                  // outstandingAmount: Yup.string().required(
                  //   "Outstanding Amount is Required"
                  // ),
                  remarks: Yup.string().required("Remarks is Required"),
                })}
                onSubmit={(values) => {
                  values["job"] = selectedJob.value;
                  values["date"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["glDate"] = moment(glDate).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  );
                  apiAuth
                    .post("/api/master/voucher/", values)
                    .then((res) => {
                      NotificationManager.success(
                        "Payment Voucher",
                        "Voucher Created Successfully",
                        3000,
                        null,
                        null,
                        ""
                      );
                      history.push("/vouchers");
                    })
                    .catch((err) => {
                      NotificationManager.error(
                        "Payment Voucher",
                        "Voucher Create Error",
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucher_type" className="form-label">
                            Voucher Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="voucher_type"
                            placeholder={"Select"}
                            styles={customStyles}
                            value={selectedVoucher}
                            options={VoucherOptions}
                            onChange={(event) => {
                              routePage(event);
                              // setSelectedVoucher(event.value);
                            }}
                          />
                          {errors.voucher_type && touched.voucher_type && (
                            <div className="invalid-feedback d-block">
                              {errors.voucher_type}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="party" className="form-label">
                            Job Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onChange={(data) => {
                              setFieldValue("job", data.label);
                              setSelectedJob(data);
                            }}
                            styles={customStyles}
                          />
                          {errors.party && touched.party && (
                            <div className="invalid-feedback d-block">
                              {errors.party}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="branch" className="form-label">
                            Branch
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="branch"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.branch && touched.branch && (
                            <div className="invalid-feedback d-block">
                              {errors.branch}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="book" className="form-label">
                            Book
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="book"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.book && touched.book && (
                            <div className="invalid-feedback d-block">
                              {errors.book}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={date}
                              onChange={(date) => setDate(date)}
                            />
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
                          {/* <Field
                            className="form-control"
                            name="date"
                            style={{ background: "#EDEDED" }}
                          /> */}
                          {errors.date && touched.date && (
                            <div className="invalid-feedback d-block">
                              {errors.date}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="glDate" className="form-label">
                            G/L Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={glDate}
                              onChange={(date) => setGlDate(date)}
                            />
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
                          {/* <Field
                        className="form-control"
                        name="glDate"
                        style={{ background: "#EDEDED" }}
                      /> */}
                          {errors.glDate && touched.glDate && (
                            <div className="invalid-feedback d-block">
                              {errors.glDate}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="fc_amount" className="form-label">
                            FC Amount
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="fc_amount"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.fc_amount && touched.fc_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fc_amount}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="amount_sar" className="form-label">
                            Amount (SAR)
                            <span className="text-danger">*</span>
                          </label>
                          <Field
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="party" className="form-label">
                            Party A/c
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={options}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.party && touched.party && (
                            <div className="invalid-feedback d-block">
                              {errors.party}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="against_concern"
                            className="form-label"
                          >
                            Against Concern
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={options}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.against_concern &&
                            touched.against_concern && (
                              <div className="invalid-feedback d-block">
                                {errors.against_concern}
                              </div>
                            )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="naration" className="form-label">
                            naration
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="naration"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.naration && touched.naration && (
                            <div className="invalid-feedback d-block">
                              {errors.naration}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="outstanding_amount"
                            className="form-label"
                          >
                            Outstanding Amount
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={options}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.outstanding_amount &&
                            touched.outstanding_amount && (
                              <div className="invalid-feedback d-block">
                                {errors.outstanding_amount}
                              </div>
                            )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className="mb-3">
                      <label htmlFor="remarks" className="form-label">
                        Remarks
                        <span className="text-danger">*</span>
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
          {/* <Grid item lg={4} style={{ margin: "auto" }}>
            <img src={jobsImage} alt="" />
          </Grid> */}
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default PaymentVoucher;
