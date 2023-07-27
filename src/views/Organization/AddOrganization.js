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

const AddOrganization = (props) => {
  const history = useHistory();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };
  const goBack = () => {
    history.goBack();
  };

  const [coavalue, setCoavalue] = useState([]);

  const typeOptions = [
    {
      value: "Consignee",
      label: "Consignee",
    },
    {
      value: "Client",
      label: "Client",
    },
  ];

  const getCoa = () => {
    apiAuth
      .get("api/master/coa/")
      .then((response) => {
        let data = response.data.results;
        setCoavalue(data);
        console.log("coa", data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCoa();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Create Organization</h2>

          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  name: "",
                  type: "",
                  // coa: "",
                  language_name: "",
                  address: "",
                  vat_trn_number: "",
                  browse_logo: "",
                  website: "",
                  remarks: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Name is Required"),
                  language_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Language Name is Required"),
                  vat_trn_number: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Vat Trn Number is Required"),
                  website: Yup.string()
                    // .url("Invalid URL format")
                    .required("Website URL is required"),
                  address: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  remarks: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  type: Yup.string().required("Type is Required"),
                  //   coa: Yup.number().required("COA is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  // values["coa"] = coavalue.map((item) => item.id);
                  values["coa"] = 7;
                  console.log("values", values);
                  const url = "/api/master/organization/";
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      NotificationManager.success(
                        "",
                        `Organization Created Successfully`,
                        3000,
                        null,
                        null,
                        ""
                      );
                      props?.history?.push("/organization");
                    })
                    .catch((error) => {
                      NotificationManager.error(
                        "",
                        `Organization Create Error`,
                        3000,
                        null,
                        null,
                        ""
                      );
                    });
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="name" className="form-label">
                            Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="name"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="type" className="form-label">
                            Type
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            options={typeOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("type", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="type"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="language_name" className="form-label">
                            Language Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="language_name"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="language_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="address" className="form-label">
                            Address
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            as="textarea"
                            className="form-control"
                            name="address"
                            style={{ background: "#EDEDED" }}
                          />
                          <ErrorMessage
                            name="address"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="vat_trn_number"
                            className="form-label"
                          >
                            Vat Trn Number
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="vat_trn_number"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="vat_trn_number"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Website
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="website"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="website"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="browse_logo" className="form-label">
                            Browse Logo
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="browse_logo"
                            type="input"
                            fileType="image/*"
                            style={{ background: "#EDEDED" }}
                          />
                          <ErrorMessage
                            name="browse_logo"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      {/* <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="coa" className="form-label">
                            COA
                            <span className="text-danger">*</span>
                          </Label>

                          <Field
                            className="form-control"
                            name="coa"
                            type="number"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="coa"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid> */}
                    </Grid>

                    <div className="mb-3">
                      <Label htmlFor="remarks" className="form-label">
                        Remarks
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        as="textarea"
                        className="form-control"
                        name="remarks"
                        style={{ background: "#EDEDED" }}
                      />
                      <ErrorMessage
                        name="remarks"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
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
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default AddOrganization;
