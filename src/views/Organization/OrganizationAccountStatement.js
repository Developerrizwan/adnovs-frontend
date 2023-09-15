import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import Select from "react-select";

const OrganizationAccountStatement = (props) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedOrganizationLedger, setSelectedOrganizationLedger] = useState({
    label: "ACCOUNTS RECEIVABLE STATEMENT",
    value: "receive",
  });

  const LedgerOrganizationOptions = [
    { label: "ACCOUNTS RECEIVABLE STATEMENT", value: "receive" },
    { label: "ACCOUNTS PAYABLE STATEMENT", value: "pay" },
  ];

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Account</span>,
      selector: (row) => row.account,
      cell: (value) => {
        return (
          <div
            title={value.account}
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "250px",
            }}
          >
            {value.account}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => moment(row.date).format("DD-MM-YYYY HH:mm:ss"),
      cell: (value) => {
        return (
          <div
            title={moment(value.date).format("DD-MM-YYYY HH:mm:ss")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "220px",
            }}
          >
            {moment(value.date).format("DD-MM-YYYY HH:mm:ss")}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return (
          <div
            title={value.currency}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.currency}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Dr Amount</span>,
    //   selector: (row) => row.dr_amount,
    //   cell: (value) => {
    //     return (
    //       <div
    //         title={value.dr_amount}
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           maxWidth: "200px",
    //         }}
    //       >
    //         {value.dr_amount}
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Cr Amount</span>,
    //   selector: (row) => row.cr_amount,
    //   cell: (value) => {
    //     return (
    //       <div
    //         title={value.cr_amount}
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           maxWidth: "200px",
    //         }}
    //       >
    //         {value.cr_amount}
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Net Amount</span>,
      selector: (row) => row.net_amount,
      cell: (value) => {
        return (
          <div
            title={value.net_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.net_amount}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Party Account</span>,
      selector: (row) => row.party_account,
      cell: (value) => {
        return (
          <div
            title={value.party_account}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.party_account}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">JOB</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return (
          <div
            title={value.job_no}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.job_no}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Naration</span>,
      selector: (row) => row.narrations,
      cell: (value) => {
        return (
          <div
            title={value.narrations}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.narrations}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Branch</span>,
      selector: (row) => row.branch,
      cell: (value) => {
        return (
          <div
            title={value.branch}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.branch}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Language Name</span>,
    //   selector: (row) => row.language_name,
    //   cell: (value) => {
    //     return (
    //       <div
    //         title={value.language_name}
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           maxWidth: "200px",
    //         }}
    //       >
    //         {value.language_name}
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
  ]);
  const history = useHistory();

  const getReport = (id, type, st, et) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/account/statement/?organization=${id}&type=${type}&start_time=${st}&end_time=${et}`
      )
      .then((res) => {
        const { data } = res;
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    const formattedDate = parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return formattedDate;
  };

  return (
    <React.Fragment>
      <div className={"page-content"}>
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Accounts Statement</h2>

          <button className="btn btn-danger" onClick={() => history.goBack()}>
            Back
          </button>
        </div>

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <div className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  start_time: new Date() || "",
                  end_time: new Date() || "",
                  organizationLedger: selectedOrganizationLedger?.value || "",
                }}
                validationSchema={Yup.object({
                  organizationLedger: Yup.string()
                    .ensure()
                    .required("Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const st = changeDateFormat(values.start_time);
                  const et = changeDateFormat(values.end_time);
                  const id = Number(props.match.params.organizationId);
                  const type = values?.organizationLedger;
                  getReport(id, type, st, et);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3" style={{ zIndex: 200 }}>
                          <label
                            htmlFor="organizationLedger"
                            className="form-label"
                          >
                            Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={LedgerOrganizationOptions}
                            value={selectedOrganizationLedger}
                            onChange={(data) => {
                              setFieldValue("organizationLedger", data.value);
                              setSelectedOrganizationLedger(data);
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
                            {"Generate"}
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

        <Grid
          container
          spacing={2}
          style={{
            marginTop: "5px",
          }}
        >
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            {" "}
            <DataTable
              customStyles={customStyles}
              columns={cols}
              data={reports}
              pagination={true}
            />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default OrganizationAccountStatement;
