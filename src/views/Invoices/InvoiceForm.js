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

const InvoiceForm = (props) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };
  const dateOptions = [{ label: "test", value: "test" }];

  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  return (
    <React.Fragment>
      <Card className="p-3" style={{ background: "#EDEDED" }}>
        <Formik
          initialValues={{
            job_no: "",
            shipment_no: "",
            mawb_mbl: "",
            date_filter: "",
            from_date: "",
            to_date: "",
            selected_sale: "",
            selected_cost: "",
            net_total: "",
          }}
          validationSchema={Yup.object({
            job_no: Yup.string().required("Job No is Required"),
            shipment_no: Yup.string().required("Shipment No is Required"),
            mawb_mbl: Yup.string().required("MAWB  No is Required"),
            date_filter: Yup.string().required("Date is Required"),
            // from_date: Yup.string().required("From Date is Required"),
            // to_date: Yup.string().required("To Date is Required"),
            selected_sale: Yup.string().required("Selected Sale is Required"),
            selected_cost: Yup.string().required("Selected Job is Required"),
            net_total: Yup.string().required("Net Total is Required"),
          })}
          onSubmit={(values, { reset }) => {
            const company = JSON.parse(
              localStorage.getItem("authUser")
            )?.company_id;
            values["company"] = company;
            console.log("dddd", values);

            // const url = "/api/master/job/";
            // apiAuth
            //   .post(url, values)
            //   .then((response) => {
            //     // if (response.status === 201) {
            //     NotificationManager.success(
            //       "",
            //       `Enquiry Created Successfully`,
            //       3000,
            //       null,
            //       null,
            //       ""
            //     );
            //     props?.history?.push("/jobs");
            //     // } else {
            //     // NotificationManager.error(
            //     //   "",
            //     //   `Job Create Error`,
            //     //   3000,
            //     //   null,
            //     //   null,
            //     //   ""
            //     // );
            //     // }
            //   })
            //   .catch((error) => {
            //     NotificationManager.error(
            //       "",
            //       `Enquiry Create Error`,
            //       3000,
            //       null,
            //       null,
            //       ""
            //     );
            //   });
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="av-tooltip tooltip-label-bottom">
              <Grid container spacing={2}>
                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <div>
                      <Label htmlFor="job_no" className="pe-2 w-50">
                        {" "}
                        Job No
                      </Label>
                      <Field
                        className="form-control"
                        name="job_no"
                        style={{ background: "#EDEDED" }}
                        type="text"
                      />
                    </div>
                    <ErrorMessage
                      name="job_no"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    />
                  </div>
                </Grid>

                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <div>
                      <Label htmlFor="shipment_no">Shipment No</Label>
                      <Field
                        className="form-control"
                        name="shipment_no"
                        // placeholder="Consignee Name"
                        type="text"
                        style={{ background: "#EDEDED" }}
                      />
                    </div>
                    <ErrorMessage
                      name="shipment_no"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    />
                  </div>
                </Grid>

                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <div>
                      <Label htmlFor="mawb_mbl" className="  w-50 pe-2">
                        MAWB/MBL No
                      </Label>
                      <Field
                        className="form-control"
                        name="mawb_mbl"
                        // placeholder="Bayan Number"
                        type="text"
                        style={{ background: "#EDEDED" }}
                      />
                    </div>
                    <ErrorMessage
                      name="mawb_mbl"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid spacing={2} container>
                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <Label htmlFor="date_filter" className="form-label">
                      Date Filter
                      <span className="text-danger">*</span>
                    </Label>
                    <Select
                      name="type"
                      placeholder={"Select"}
                      styles={customStyles}
                      options={dateOptions}
                      onChange={(data) => {
                        setFieldValue("date_filter", data.value);
                      }}
                    />
                    <ErrorMessage
                      name="date_filter"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    />
                  </div>
                </Grid>

                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <Label htmlFor="from_date" className="form-label">
                      From Date
                      <span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => {
                        SetFromDate(date);
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="d MMMM yyyy h:mm aa"
                    />
                    {/* <ErrorMessage
                      name="from_date"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    /> */}
                  </div>
                </Grid>
                <Grid item lg={4} xs={4}>
                  <div className="mb-3">
                    <Label htmlFor="to_date" className="form-label">
                      To Date
                      <span className="text-danger">*</span>
                    </Label>
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => {
                        setToDate(date);
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="d MMMM yyyy h:mm aa"
                    />
                    {/* <ErrorMessage
                      name="to_date"
                      render={(msg) => <div className="text-danger">{msg}</div>}
                    /> */}
                  </div>
                </Grid>
              </Grid>

              <Grid>
                <Grid container spacing={2}>
                  <Grid item lg={4} xs={4}>
                    <div className="mb-3">
                      <div>
                        <Label htmlFor="selected_sale">Selected Sale</Label>
                        <Field
                          className="form-control"
                          name="selected_sale"
                          type="text"
                          style={{ background: "#EDEDED" }}
                        />
                      </div>
                      <ErrorMessage
                        name="selected_sale"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={4} xs={4}>
                    <div className="mb-3">
                      <div>
                        <Label htmlFor="selected_cost">Selected Cost</Label>
                        <Field
                          className="form-control"
                          name="selected_cost"
                          type="text"
                          style={{ background: "#EDEDED" }}
                        />
                      </div>
                      <ErrorMessage
                        name="selected_cost"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={4} xs={4}>
                    <div className="mb-3">
                      <div>
                        <Label htmlFor="net_total">Net Total</Label>
                        <Field
                          className="form-control"
                          name="net_total"
                          type="text"
                          style={{ background: "#EDEDED" }}
                        />
                      </div>
                      <ErrorMessage
                        name="net_total"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
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
    </React.Fragment>
  );
};

export default InvoiceForm;
