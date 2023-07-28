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
import { Country, State, City } from "country-state-city";

import { getAllISOCodes } from "iso-country-currency";

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

  const [coaOptions, setCoaOptions] = useState([]);
  const [selCurrency, setSelCurrency] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [branchValue, setBranchValue] = useState("JEDDHA");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

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

  const registeredOptions = [
    {
      value: "TRUE",
      label: "TRUE",
    },
    {
      value: "FALSE",
      label: "FALSE",
    },
  ];

  const branchOptions = () => [{ label: "JEDDHA", value: "JEDDHA" }];

  const getCoaOptions = () => {
    apiAuth
      .get("api/master/coa/")
      .then((response) => {
        let data = response.data.results;
        setCoaOptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllCurrencyCodes = () => {
    let allCurrencies = getAllISOCodes();
    allCurrencies = allCurrencies.map((cur) => {
      return {
        label: cur.currency + "  -  " + cur.countryName,
        value: cur.currency + "  -  " + cur.countryName,
      };
    });
    setCurrencyOptions(allCurrencies);
  };

  useEffect(() => {
    getCoaOptions();
    getAllCurrencyCodes();
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
                  // name: "",
                  // type: "",
                  // coa: "",
                  // language_name: "",
                  // language_address: "",
                  // address: "",
                  // vat_trn_number: "",
                  // browse_logo: "",
                  // website: "",
                  // remarks: "",
                  // payment_terms: "",
                  // currency: "curr 1",

                  name: "",
                  type: "",
                  language_name: "",
                  address: "",
                  vat_trn_number: "",
                  currency: "",
                  branch: "",
                  payment_terms: "",
                  city: "",
                  zip_code: "",
                  mobile: "",
                  email: "",
                  country: "",
                  state_code: "",
                  building_name: "",
                  port_name: "",
                  post_box_no: "",
                  gstin_registered: "",
                  gstin: "",
                  website: "",
                  remarks: "",
                  company: 0,
                  coa: 0,
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Name is Required"),
                  type: Yup.string().required("Type is Required"),
                  language_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Language Name is Required"),
                  address: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  vat_trn_number: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Vat Trn Number is Required"),
                  currency: Yup.string().required("Currency is Required"),
                  building_name: Yup.string().required(
                    "Building Name is Required"
                  ),
                  payment_terms: Yup.string().required(
                    "Payment Terms is Required"
                  ),
                  website: Yup.string()
                    // .url("Invalid URL format")
                    .required("Website URL is required"),
                  language_address: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  remarks: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Remarks is Required"),
                  coa: Yup.string().required("COA is Required"),
                  country: Yup.string()
                    .ensure()
                    .required("Country is Required"),
                  city: Yup.string().ensure().required("City is Required"),
                  zip_code: Yup.string().required("Zip Code is Required"),
                  mobile: Yup.string()
                    .matches(
                      /^[0-9]{10}$/,
                      "Mobile number must be exactly 10 digits"
                    )
                    .required("Mobile Number is Required"),

                  email: Yup.string().email().required("Email is Required"),

                  state: Yup.string().ensure().required("State is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values.country = values.country ? values.country : undefined;
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

                      {/* <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label
                            htmlFor="language_address"
                            className="form-label"
                          >
                            Language Address
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            as="textarea"
                            className="form-control"
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
                      </Grid> */}
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
                              setSelCurrency(data);
                            }}
                          />
                          <ErrorMessage
                            name="currency"
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
                          <Label htmlFor="branch" className="form-label">
                            Branch
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            // value={"JEDDHA"}
                            defaultValue={{ label: branchValue }}
                            onChange={(data) => {
                              // setBranchValue(data);
                              setFieldValue("branch", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="job_status"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="payment_terms" className="form-label">
                            Payment Terms
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="payment_terms"
                            style={{ background: "#EDEDED" }}
                          />
                          <ErrorMessage
                            name="payment_terms"
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
                            type="file"
                            fileType="image/*"
                            onChange={(event) => {
                              setFieldValue(
                                "browse_logo",
                                event.currentTarget.files[0]
                              );
                            }}
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="coa" className="form-label">
                            COA
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            options={coaOptions?.map((item) => {
                              return {
                                label: item.code,
                                value: item.id,
                              };
                            })}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("coa", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="coa"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid spacing={2} container>
                      <Grid item xs={12} lg={6} style={{ zIndex: "100" }}>
                        <div className="mb-3">
                          <label htmlFor="state" className="form-label">
                            City
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={City.getAllCities(
                              selectedState?.value
                            )?.map((city) => {
                              return {
                                label: city.name,
                                value: city.isoCode,
                              };
                            })}
                            styles={customStyles}
                            value={selectedCity}
                            onChange={(data) => {
                              setFieldValue("city", data.label);
                              setSelectedCity(data);
                            }}
                          />
                          <ErrorMessage
                            name="city"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Zip Code
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="zip_code"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="zip_code"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className=" mb-3">
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Field
                            className="form-control"
                            name="mobile"
                            placeholder="Mobile Number"
                            type="text"
                            style={{ background: "#EDEDED" }}
                          />
                          <ErrorMessage
                            name="mobile"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="form-group mb-3">
                          <Label htmlFor="email">Email</Label>
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
                            options={Country.getAllCountries().map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
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
                            State Code
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={State.getStatesOfCountry(
                              selectedCountry?.value
                            )?.map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
                            styles={customStyles}
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

                    <Grid spacing={2} container>
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

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Building Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="building_name"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="building_name"
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
                          <Label htmlFor="port_name" className="form-label">
                            Port Name
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            name="port_name"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="port_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="post_box_no" className="form-label">
                            Post Box No
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            name="post_box_no"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="post_box_no"
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
                          <Label
                            htmlFor="gstin_registered"
                            className="form-label"
                          >
                            GstIn Registered
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            options={registeredOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("gstin_registered", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="gstin_registered"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="gstin" className="form-label">
                            GstIn
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            name="gstin"
                            style={{ background: "#EDEDED" }}
                          />

                          <ErrorMessage
                            name="gstin"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
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
