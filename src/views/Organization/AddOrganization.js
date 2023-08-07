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
  const [typeValue, setTypeValue] = useState(null);
  const [coaValue, setCoaValue] = useState(null);
  const [gstValue, setGstValue] = useState(null);

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

  const branchOptions = [{ label: "JEDDHA", value: "JEDDHA" }];

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

  const initialValues = () => {
    let selCurr = currencyOptions.find(
      (dd) => dd.value === props.organizationData?.currency
    );
    setSelCurrency(selCurr);
  };

  useEffect(() => {
    getCoaOptions();
  }, []);

  useEffect(() => {
    getCoaOptions();
    getAllCurrencyCodes();
    // initialValues();
    setSelCurrency({
      label: props.organizationData?.currency,
      value: props.organizationData?.currency,
    });

    setTypeValue({
      label: props.organizationData?.type,
      value: props.organizationData?.type,
    });

    setSelectedCountry({
      label: props?.organizationData?.country,
      value: props?.organizationData?.country,
    });
    setSelectedState({
      label: props?.organizationData?.state_code,
      value: props?.organizationData?.state_code,
    });
    setSelectedCity({
      label: props?.organizationData?.city,
      value: props?.organizationData?.city,
    });
    setCoaValue({
      label: props?.organizationData?.coa?.code,
      value: props?.organizationData?.coa?.id,
    });
    setGstValue({
      label: props?.organizationData?.gstin_registeredm,
      value: props?.organizationData?.gstin_registered,
    });
  }, [props.isEdit]);

  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-5 mt-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-3">Create Organization</h2>

              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  name: props.isEdit ? props.organizationData?.name : "",
                  type: props.isEdit ? props.organizationData?.type : "",
                  language_name: props.isEdit
                    ? props.organizationData?.language_name
                    : "",
                  address: props.isEdit ? props.organizationData?.address : "",
                  vat_trn_number: props.isEdit
                    ? props.organizationData?.vat_trn_number
                    : "",
                  currency: props.isEdit
                    ? props.organizationData?.currency
                    : "",
                  branch: props.isEdit ? props.organizationData?.branch : "",
                  payment_terms: props.isEdit
                    ? props.organizationData?.payment_terms
                    : "",
                  city: props.isEdit ? props.organizationData?.city : "",
                  zip_code: props.isEdit
                    ? props.organizationData?.zip_code
                    : "",
                  mobile: props.isEdit ? props.organizationData?.mobile : "",
                  email: props.isEdit ? props.organizationData?.email : "",
                  country: props.isEdit ? props.organizationData?.country : "",
                  state_code: props.isEdit
                    ? props.organizationData?.state_code
                    : "",
                  building_name: props.isEdit
                    ? props.organizationData?.building_name
                    : "",
                  port_name: props.isEdit
                    ? props.organizationData?.port_name
                    : "",
                  post_box_no: props.isEdit
                    ? props.organizationData?.post_box_no
                    : "",
                  gstin_registered: props.isEdit
                    ? props.organizationData?.gstin_registered
                    : "",
                  gstin: props.isEdit ? props.organizationData?.gstin : "",
                  website: props.isEdit ? props.organizationData?.website : "",
                  coa: props.isEdit ? props.organizationData?.coa : "",
                  remarks: props.isEdit ? props.organizationData?.remarks : "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Name is Required"),
                  email: Yup.string()
                    .email("Email must be a valid email")
                    .required("Email is Required"),
                  mobile: Yup.string()
                    .matches(
                      /^[0-9]{10}$/,
                      "Invalid Mobile number, must be exactly 10 digits"
                    )
                    .required("Mobile Number is Required"),

                  vat_trn_number: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Vat Trn Number is Required"),
                  currency: Yup.string()
                    .ensure()
                    .required("Currency is Required"),
                  branch: Yup.string()
                    .ensure()
                    .required("Currency is Required"),
                  payment_terms: Yup.string().required(
                    "Payment Terms is Required"
                  ),
                  language_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Language Name is Required"),
                  type: Yup.string().ensure().required("Type is Required"),
                  country: Yup.string()
                    .ensure()
                    .required("Country is Required"),
                  state_code: Yup.string()
                    .ensure()
                    .required("State is Required"),
                  city: Yup.string().ensure().required("City is Required"),
                  building_name: Yup.string().required(
                    "Building Name is Required"
                  ),
                  website: Yup.string()
                    .url("Invalid URL format")
                    .required("Website URL is required"),
                  language_address: Yup.string()
                    .max(400, "Must be 400 characters or less")
                    .trim()
                    .required("Language Address is Required"),
                  coa: Yup.string().ensure().required("COA is Required"),
                  // zip_code: Yup.string().required("Zip Code is Required"),
                  // address: Yup.string()
                  //   .max(400, "Must be 400 characters or less")
                  //   .trim()
                  //   .required("Address is Required"),
                  // remarks: Yup.string()
                  //   .max(400, "Must be 400 characters or less")
                  //   .trim()
                  //   .required("Remarks is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  values.country = values.country ? values.country : undefined;
                  values.state_code = values.state_code
                    ? values.state_code
                    : undefined;
                  props.isEdit
                    ? apiAuth
                        .patch(
                          `/api/master/organization/${props.organizationData.id}`,
                          values
                        )
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `Organization Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.isEdit
                            ? props.closeAddPopup()
                            : props?.history?.push("/organization");
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Organization Update Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        })
                    : apiAuth
                        .post("/api/master/organization/", values)
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
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="name" className="form-label">
                            Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            placeholder="Name"
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
                      <Grid item lg={4} xs={12}>
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
                      <Grid item lg={4} xs={12}>
                        <div className=" mb-3">
                          <Label htmlFor="mobile">
                            Mobile Number
                            <span className="text-danger">*</span>
                          </Label>
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
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
                            placeholder="Vat Trn Number"
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

                      <Grid item lg={4} xs={12}>
                        <div style={{ zIndex: 300 }} className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                            <span className="text-danger">*</span>
                          </label>
                          <Select
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
                      <Grid item lg={4} xs={12}>
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
                            defaultValue={{ label: branchValue }}
                            onChange={(data) => {
                              // setBranchValue(data);
                              setFieldValue("branch", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="branch"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="payment_terms" className="form-label">
                            Payment Terms
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            placeholder="Payment Terms"
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
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="language_name" className="form-label">
                            Language Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            placeholder="Language Name"
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
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="type" className="form-label">
                            Type
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            value={typeValue}
                            placeholder={"Select"}
                            options={typeOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("type", data.value);
                              setTypeValue(data);
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
                      <Grid item xs={12} lg={4} style={{ zIndex: "200" }}>
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

                      <Grid item xs={12} lg={4}>
                        <div className="mb-3">
                          <label htmlFor="state_code" className="form-label">
                            State
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
                              setFieldValue("state_code", data.label);
                              setSelectedState(data);
                            }}
                          />
                          <ErrorMessage
                            name="state_code"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <div className="mb-3">
                          <label htmlFor="city" className="form-label">
                            City
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={City.getCitiesOfState(
                              selectedCountry?.value,
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
                    </Grid>

                    <Grid spacing={2} container>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Building Name
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            className="form-control"
                            name="building_name"
                            placeholder="Building Name"
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
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="post_box_no" className="form-label">
                            Post Box No
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            placeholder="Post Box No"
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
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Zip Code
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            placeholder="Zip Code"
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

                    <Grid spacing={2} container>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="website" className="form-label">
                            Website
                            <span className="text-danger">*</span>
                          </Label>
                          <Field
                            placeholder="Website"
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
                      <Grid item lg={4} xs={12}>
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
                            value={coaValue}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("coa", data.value);
                              setCoaValue(data);
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
                      <Grid item lg={4} xs={12}>
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
                    </Grid>

                    <Grid spacing={2} container>
                      <Grid item lg={4} xs={12}>
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
                            value={gstValue}
                            options={registeredOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("gstin_registered", data.value);
                              setGstValue(data);
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

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="gstin" className="form-label">
                            GstIn
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            className="form-control"
                            placeholder="GstIn"
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
                    {/* <Grid container spacing={2}>
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
                    </Grid> */}
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="address" className="form-label">
                            Address
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            as="textarea"
                            placeholder="Address"
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

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="remarks" className="form-label">
                            Remarks
                            {/* <span className="text-danger">*</span> */}
                          </Label>
                          <Field
                            as="textarea"
                            placeholder="Remarks"
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
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default AddOrganization;
