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

const options = [
  { value: "all", label: "All" },
  { value: "option1", label: "Option1" },
];

const DebitVoucher = (props) => {
  const history = useHistory();

  const [jobs, setJobs] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedOption, setSelectedOption] = useState({
    value: "all",
    label: "All",
  });
  const [date, setDate] = useState(new Date());
  const [glDate, setGlDate] = useState(new Date());
  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "Debit",
    label: "Debit",
  });
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [selOutAmtoption, setSelOutAmtoption] = useState(null);

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (props.isEdit && jobOptions.length) {
      const sel = jobOptions.find((opt) => opt?.id === props.voucherData?.job);
      setSelectedJob(sel);
    }
    if (props.isEdit && jobOptions.length) {
      const sel = jobOptions.find((opt) => opt?.id === props.voucherData?.job);
      setSelectedJob(sel);
    }
  }, [jobOptions, props]);

  const getJobs = () => {
    apiAuth
      .get("/api/master/job/")
      .then((res) => {
        const { data } = res;
        let opts = data.map((dd) => {
          return {
            label: `${dd?.bl_number} - ${dd?.consignee_name}`,
            value: dd?.id,
          };
        });
        setJobOptions(opts);
      })
      .catch((err) => console.log(err));
  };

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit", label: "Debit" },
    { value: "Credit", label: "Credit" },
  ];

  const partyOptions = [
    { value: "Party 1", label: "Party 1" },
    { value: "Party 2", label: "Party 2" },
    { value: "Party 3", label: "Party 3" },
  ];

  const concernOptions = [
    { value: "ConcernOpt 1", label: "ConcernOpt 1" },
    { value: "ConcernOpt 2", label: "ConcernOpt 2" },
    { value: "ConcernOpt 3", label: "ConcernOpt 3" },
  ];

  const OutAmtOptions = [
    { value: "OutAmtOpt 1", label: "OutAmtOpt 1" },
    { value: "OutAmtOpt 2", label: "OutAmtOpt 2" },
    { value: "OutAmtOpt 3", label: "OutAmtOpt 3" },
  ];

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
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Debit Voucher</h2>
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
                  voucher_type: props.voucherData?.voucher_type || "Debit",
                  job: String(props.voucherData?.job) || "",
                  branch: props.voucherData?.branch || "",
                  book: props.voucherData?.book || "Book",
                  date: props.voucherData?.date || "",
                  glDate: props.voucherData?.glDate || "",
                  fc_amount: props.voucherData?.fc_amount || "",
                  amount_sar: props.voucherData?.amount_sar || "",
                  party_account: props.voucherData?.party_account || "",
                  against_concern: props.voucherData?.against_concern || "",
                  naration: props.voucherData?.naration || "",
                  outstanding_amount:
                    props.voucherData?.outstanding_amount || "",
                  remarks: props.voucherData?.remarks || "",
                }}
                validationSchema={Yup.object({
                  // job: Yup.string().ensure().required("Job is Required"),
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
                  // values["job"] = selectedJob.value;
                  values["date"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["glDate"] = moment(glDate).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  );
                  if (props.isEdit && props.voucherData) {
                    apiAuth
                      .patch(
                        `/api/master/voucher/${props.voucherData?.id}/`,
                        values
                      )
                      .then((res) => {
                        NotificationManager.success(
                          "Debit Voucher",
                          "Voucher Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "Debit Voucher",
                          "Voucher Create Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    apiAuth
                      .post("/api/master/voucher/", values)
                      .then((res) => {
                        NotificationManager.success(
                          "Debit Voucher",
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
                          "Debit Voucher",
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucher_type" className="form-label">
                            Voucher Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="voucher_type"
                            styles={customStyles}
                            value={selectedVoucher}
                            options={voucherOptions}
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
                          <label htmlFor="party_account" className="form-label">
                            Job Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onChange={(data) => {
                              setFieldValue("job", data.value);
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
                          <label htmlFor="party_account" className="form-label">
                            Party A/c
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={partyOptions}
                            value={selectedParty}
                            onChange={(data) => {
                              setFieldValue("party_account", data.label);
                              setSelectedParty(data);
                            }}
                            styles={customStyles}
                          />
                          {errors.party_account && touched.party_account && (
                            <div className="invalid-feedback d-block">
                              {errors.party_account}
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
                            options={concernOptions}
                            value={selectedConcern}
                            onChange={(data) => {
                              setFieldValue("against_concern", data.label);
                              setSelectedConcern(data);
                            }}
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
                            Naration
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
                            options={OutAmtOptions}
                            value={selOutAmtoption}
                            onChange={(data) => {
                              setFieldValue("outstanding_amount", data.label);
                              setSelOutAmtoption(data);
                            }}
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

export default DebitVoucher;
