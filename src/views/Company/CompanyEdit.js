import { Box, Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Country, State, City } from "country-state-city";

import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Label, Button } from "reactstrap";

const CompanyEdit = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const getCountries = () => {
    const opts = Country.getAllCountries().map((state) => {
      return {
        label: state.name,
        value: state.isoCode,
      };
    });
    setCountryOptions(opts);
    let sel = null;

    sel = opts.find((dd) => dd.label === props.companyData?.country);
    setSelectedCountry(sel);

    if (sel) {
      getStates(sel);
    }
  };

  const getStates = (country) => {
    const opts = State.getStatesOfCountry(country?.value)?.map((state) => {
      return {
        label: state.name,
        value: state.isoCode,
      };
    });
    setStateOptions(opts);

    const sel = opts.find((dd) => dd.label === props.companyData?.state);
    setSelectedState(sel);
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <React.Fragment>
      {props.companyData ? (
        <Card className="p-3" style={{ background: "#EDEDED" }}>
          <Formik
            initialValues={{
              name: props?.companyData?.name ? props?.companyData?.name : "",
              email: props?.companyData?.email ? props?.companyData?.email : "",
              country: props?.companyData?.country
                ? props?.companyData?.country
                : "",
              state: props?.companyData?.state ? props?.companyData?.state : "",
              address: props?.companyData?.address
                ? props?.companyData?.address
                : "",
              users: props?.companyData?.users ? props?.companyData?.users : [],
              account_name: props?.companyData?.account_name
                ? props?.companyData?.account_name
                : "",
              account_number: props?.companyData?.account_number
                ? props?.companyData?.account_number
                : "",
              bank_name: props?.companyData?.bank_name
                ? props?.companyData?.bank_name
                : "",
              swift_code: props?.companyData?.swift_code
                ? props?.companyData?.swift_code
                : "",
              iban_code: props?.companyData?.iban_code
                ? props?.companyData?.iban_code
                : "",
              language_address: props?.companyData?.language_address
                ? props?.companyData?.language_address
                : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Company Name is Required"),
              email: Yup.string().email().required("Email is Required"),
              address: Yup.string().required("Address Name is Required"),
              country: Yup.string().ensure().required("Country is Required"),
              state: Yup.string().ensure().required("State is Required"),
              account_name: Yup.string().required("Account Name is Required"),
              account_number: Yup.string()
                .matches(
                  /^\d{9,18}$/,
                  "Account number must be between 9 to 18 digits"
                )
                .required("Account number is required"),
              bank_name: Yup.string().required("Bank Name is Required"),
              swift_code: Yup.string().required("Swift Code Name is Required"),
              iban_code: Yup.string().required("IBAN Code Name is Required"),
            })}
            onSubmit={(values, { reset }) => {
              const company = JSON.parse(
                localStorage.getItem("authUser")
              )?.company_id;
              values["company"] = company;
              values.country = values.country ? values.country : undefined;
              const url = `/api/master/company/${props.companyData.id}/`;
              apiAuth
                .patch(url, values)
                .then((response) => {
                  NotificationManager.success(
                    "",
                    ` Company Updated Successfully`,
                    3000,
                    null,
                    null,
                    ""
                  );
                  props.closeAddPopup();
                  // props.getCompany();
                })
                .catch((error) => {
                  NotificationManager.error(
                    "",
                    `Company Update Error`,
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
                        Company Name
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
                    <div className="form-group mb-3">
                      <Label htmlFor="email">
                        Email
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        type="text"
                        style={{ background: "#EDEDED" }}
                      />
                      <ErrorMessage
                        name="email"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6} style={{ zIndex: "200" }}>
                    <div className="mb-3">
                      <label htmlFor="country" className="form-label">
                        Country
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={countryOptions}
                        styles={customStyles}
                        value={selectedCountry}
                        onChange={(data) => {
                          setFieldValue("country", data.label);
                          setSelectedCountry(data);
                        }}
                      />
                      <ErrorMessage
                        name="country"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} lg={6} style={{ zIndex: "100" }}>
                    <div className="mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={stateOptions}
                        styles={customStyles}
                        required
                        value={selectedState}
                        onChange={(data) => {
                          setFieldValue("state", data.label);
                          setSelectedState(data);
                        }}
                      />
                      <ErrorMessage
                        name="state"
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
                      <Label htmlFor="account_name" className="form-label">
                        Account Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="account_name"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="account_name"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="bank_name" className="form-label">
                        Bank Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="bank_name"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="bank_name"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid spacing={2} container>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="account_number" className="form-label">
                        Account No
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="account_number"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="account_number"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="iban_code" className="form-label">
                        IBAN Code
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="iban_code"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="iban_code"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="language_address" className="form-label">
                        Language Address
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        placeholder="Language Address"
                        name="language_address"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="language_address"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="swift_code" className="form-label">
                        Swift Code
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="swift_code"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="swift_code"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid spacing={2} container>
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

                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    color="success"
                    className={`btn btn-success  ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    // size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">Update</span>
                  </Button>{" "}
                  <Button
                    colo="success"
                    className="btn  float-right"
                    type="reset"
                    onClick={() => props.closeAddPopup()}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default CompanyEdit;
