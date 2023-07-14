import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

const AddCompany = (props) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  company_name: "",
                  short_name: "",
                  address1: "",
                  address2: "",
                  zip_code: "",
                  city: "",
                  state: "",
                  country: "",
                  users: [],
                  address_type: "",
                  active: "True",
                  tax_code: "",
                }}
                validationSchema={Yup.object({
                  company_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  short_name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  address1: Yup.string()
                    .max(300, "Must be 20 characters or less")
                    .trim(),
                  address2: Yup.string()
                    .max(300, "Must be 20 characters or less")
                    .trim(),
                  zip_code: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  city: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  state: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  country: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  address_type: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                  tax_code: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim(),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/admin/company/";
                  let object = {
                    company_name: values["company_name"],
                    short_name: values["short_name"],
                    address: {
                      address1: values["address1"] ? values["address1"] : "Na",
                      address2: values["address2"] ? values["address2"] : "Na",
                      zip_code: values["zip_code"] ? values["zip_code"] : "Na",
                      city: values["city"] ? values["city"] : "Na",
                      state: values["state"] ? values["state"] : "Na",
                      country: values["country"] ? values["country"] : "Na",
                      address_type: values["address_type"]
                        ? values["address_type"]
                        : "Na",
                    },
                    users: values["users"],
                    active: "True",
                    tax_code: values["tax_code"],
                  };
                  apiAuth
                    .get("/api/admin/company/")
                    .then((res) => {
                      let flag = false;
                      res.data.forEach((comp) => {
                        if (comp.company_name === object.company_name)
                          flag = true;
                      });

                      if (flag) {
                        NotificationManager.error(
                          "",
                          `Company name already exist`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      } else {
                        apiAuth
                          .post(url, object)
                          .then((response) => {
                            if (response.status === 201) {
                              NotificationManager.success(
                                "",
                                `Company Added Successfully`,
                                3000,
                                null,
                                null,
                                ""
                              );
                              props.closeAddPopup();
                            } else {
                              NotificationManager.error(
                                "",
                                `Company Add Error`,
                                3000,
                                null,
                                null,
                                ""
                              );
                            }
                          })
                          .catch((error) => {
                            NotificationManager.error(
                              "",
                              `Company Add Error`,
                              3000,
                              null,
                              null,
                              ""
                            );
                          });
                      }
                    })
                    .catch((error) => {
                      NotificationManager.error(
                        "",
                        `Company Add Error`,
                        3000,
                        null,
                        null,
                        ""
                      );
                    });
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom ">
                    <Row>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="company_name">Company Name</Label>
                          <Field
                            className="form-control"
                            name="company_name"
                            placeholder="Company Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="company_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="short_name">Short Name</Label>
                          <Field
                            className="form-control"
                            name="short_name"
                            placeholder="Short Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="short_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="address1">Address1</Label>
                          <Field
                            className="form-control"
                            name="address1"
                            type="text"
                            placeholder="Address1"
                          />
                          <ErrorMessage
                            name="address1"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="address2">Address2</Label>
                          <Field
                            className="form-control"
                            name="address2"
                            type="text"
                            placeholder="Address2"
                          />
                          <ErrorMessage
                            name="address2"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="zip_code">Zip Code</Label>
                          <Field
                            className="form-control"
                            name="zip_code"
                            type="tex"
                            placeholder="zip_code"
                          />
                          <ErrorMessage
                            name="zip_code"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="country">Country</Label>
                          <Select
                            options={Country.getAllCountries().map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
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
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="state">State</Label>
                          <Select
                            options={State.getStatesOfCountry(
                              selectedCountry?.value
                            )?.map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
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
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group">
                          <Label htmlFor="city">City</Label>
                          <Select
                            options={City.getCitiesOfState(
                              selectedCountry?.value,
                              selectedState?.value
                            )?.map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
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
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="address_type">Address Type</Label>
                          <Field
                            className="form-control"
                            name="address_type"
                            type="text"
                            placeholder="address_type"
                          />
                          <ErrorMessage
                            name="address_type"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="tax_code">Tax Code</Label>
                          <Field
                            className="form-control"
                            name="tax_code"
                            type="text"
                            placeholder="Tax Code"
                          />
                          <ErrorMessage
                            name="tax_code"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Separator className="mb-4 mt-4" />
                    <div className="d-flex justify-content-between">
                      <Button
                        type="submit"
                        color="primary"
                        className={`btn-shadow btn-multiple-state  ${
                          props.loading ? "show-spinner" : ""
                        }`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">{props.addText || "Add"}</span>
                      </Button>{" "}
                      <Button
                        className="btn btn-light float-right"
                        type="reset"
                        onClick={() => {
                          props.closeAddPopup();
                        }}
                      >
                        {" "}
                        Cancel{" "}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default AddCompany;
