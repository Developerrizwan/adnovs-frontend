import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";

const options = [
  { value: "all", label: "All" },
  { value: "option1", label: "Option1" },
];

const JournalVoucher = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <h1 className="mb-4 mx-4">Journal Voucher</h1>
        {/* <Grid container spacing={2}>
          <Grid item style={{placeItems: "center"}}> */}
        <Card
          className="p-3"
          style={{ background: "#EDEDED", width: "70%", margin: "auto" }}
        >
          <Formik
            initialValues={{
              branch: "",
              book: "",
              date: "",
              glDate: "",
              fcAmount: "",
              sarAmount: "",
              party: undefined,
              againstConcern: undefined,
              narration: "",
              outstandingAmount: "",
              remarks: "",
            }}
            validationSchema={Yup.object({
              branch: Yup.string().required("Branch is Required"),
              book: Yup.string().required("Book is Required"),
              fcAmount: Yup.string().required("FC Amount is Required"),
              sarAmount: Yup.string().required("SAR Amount is Required"),
              narration: Yup.string().required("Narration is Required"),
              outstandingAmount: Yup.string().required(
                "Outstanding Amount is Required"
              ),
              remarks: Yup.string().required("Remarks is Required"),
            })}
            onSubmit={(values) => {
              values.party = values.party ? values.party : undefined;
              values.againstConcern = values.againstConcern
                ? values.againstConcern
                : undefined;
              console.log("values", values);
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="av-tooltip tooltip-label-bottom">
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
                      <Field
                        className="form-control"
                        name="date"
                        style={{ background: "#EDEDED" }}
                      />
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
                      <Field
                        className="form-control"
                        name="glDate"
                        style={{ background: "#EDEDED" }}
                      />
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
                      <label htmlFor="fcAmount" className="form-label">
                        FC Amount
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        className="form-control"
                        name="fcAmount"
                        style={{ background: "#EDEDED" }}
                      />
                      {errors.fcAmount && touched.fcAmount && (
                        <div className="invalid-feedback d-block">
                          {errors.fcAmount}
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <label htmlFor="sarAmount" className="form-label">
                        Amount (SAR)
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        className="form-control"
                        name="sarAmount"
                        style={{ background: "#EDEDED" }}
                      />
                      {errors.sarAmount && touched.sarAmount && (
                        <div className="invalid-feedback d-block">
                          {errors.sarAmount}
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
                      <label htmlFor="againstConcern" className="form-label">
                        Against Concern
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={options}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        styles={customStyles}
                      />
                      {errors.againstConcern && touched.againstConcern && (
                        <div className="invalid-feedback d-block">
                          {errors.againstConcern}
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <label htmlFor="narration" className="form-label">
                        Narration
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        className="form-control"
                        name="narration"
                        style={{ background: "#EDEDED" }}
                      />
                      {errors.narration && touched.narration && (
                        <div className="invalid-feedback d-block">
                          {errors.narration}
                        </div>
                      )}
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <label htmlFor="outstandingAmount" className="form-label">
                        Outstanding Amount
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={options}
                        value={selectedOption}
                        onChange={setSelectedOption}
                        styles={customStyles}
                      />
                      {errors.outstandingAmount &&
                        touched.outstandingAmount && (
                          <div className="invalid-feedback d-block">
                            {errors.outstandingAmount}
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
                    name="reamrks"
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
        {/* </Grid> */}
        {/* <Grid item lg={4} style={{ margin: "auto" }}>
            <img src={jobsImage} alt="" />
          </Grid> */}
        {/* </Grid> */}
      </div>
    </React.Fragment>
  );
};

export default JournalVoucher;
