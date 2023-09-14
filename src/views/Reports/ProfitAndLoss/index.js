import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import apiAuth from "../../../helpers/ApiAuth";
import moment from "moment";

const ProfitAndLoss = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(false);
  const [jobOptions, setJobOptions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getJobOptions();
  }, []);

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

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    const formattedDate = parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return formattedDate;
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  return (
    <React.Fragment>
      {/* {console.log("wwwwww", props?.organizationData)} */}
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-5 mt-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-3">Profit and Loss</h2>

              <button
                className="btn btn-danger"
                onClick={() => history.goBack()}
              >
                Back
              </button>
            </div>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <div className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  job: props.isEdit ? props.report?.job : "",
                  start_time: props.voucherData?.start_time
                    ? new Date(props.voucherData?.start_time)
                    : new Date(),
                  end_time: props.voucherData?.end_time
                    ? new Date(props.voucherData?.end_time)
                    : new Date(),
                }}
                validationSchema={Yup.object({
                  // job: Yup.string().ensure().required("Job is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const st = changeDateFormat(values.start_time);
                  const et = changeDateFormat(values.end_time);
                  history.push(
                    `/report/profit-loss/?jobId=${values.job}&st=${st}&et=${et}`
                  );
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3" style={{ zIndex: 200 }}>
                          <label htmlFor="job" className="form-label">
                            Job Type
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Select
                            options={jobOptions}
                            value={selectedJob}
                            // onInputChange={(val) => {
                            //   getJobOptions(val);
                            // }}
                            onChange={(data) => {
                              setFieldValue("job", data.value);
                              setSelectedJob(data);
                            }}
                          />
                          <ErrorMessage
                            name="job"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="start_time" className="form-label">
                            Start Time
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["start_time"]}
                              onChange={(date) => {
                                setFieldValue("start_time", date);
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
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="end_time" className="form-label">
                            End Time
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["end_time"]}
                              onChange={(date) => {
                                setFieldValue("end_time", date);
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
                        </div>
                      </Grid>
                    </Grid>

                    <div style={{ marginTop: "40px" }}>
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
                            {props.isEdit ? "Update" : "Generate"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default ProfitAndLoss;
