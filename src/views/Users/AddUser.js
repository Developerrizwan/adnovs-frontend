import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const AddUser = (props) => {
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  first_name: "",
                  last_name: "",
                  company: "",
                  mobile: "",
                  iotgroups: "",
                  groups: "",
                }}
                validationSchema={Yup.object({
                  email: Yup.string().email().required("Required"),
                  first_name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                  last_name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim(),
                  password: Yup.string()
                    .trim()
                    .required("Please Enter your password")
                    .matches(
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                      "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number And One Special Case Character"
                    ),
                  mobile: Yup.string().matches(
                    /^[0-9]*$/,
                    "Please enter valid number"
                  ),
                  company: Yup.string().trim().required("Required"),
                  groups: Yup.string().trim().required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/admin/users/";
                  values.company = [values["company"]];
                  values.groups = [values["groups"]];

                  if (values.iotgroups)
                    values.iotgroups = [values["iotgroups"]];
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      //console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `User Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `User Add Error`,
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
                        `User Add Error`,
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
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="email">Email</Label>
                          <Field
                            className="form-control"
                            name="email"
                            type="text"
                            placeholder="Email"
                          />

                          <ErrorMessage
                            name="email"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="password">Password</Label>
                          <div className="pass-wrapper">
                            <Field
                              className="form-control"
                              name="password"
                              type={is_password_hidden ? "password" : "text"}
                              placeholder="Password"
                            />
                            {is_password_hidden ? (
                              <i
                                className="fa fa-eye"
                                onClick={() =>
                                  this.setState({ is_password_hidden: false })
                                }
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                onClick={() =>
                                  this.setState({ is_password_hidden: true })
                                }
                              ></i>
                            )}
                          </div>
                          <ErrorMessage
                            name="password"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="first_name">First Name</Label>
                          <Field
                            className="form-control"
                            name="first_name"
                            placeholder="First Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="first_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Field
                            className="form-control"
                            name="last_name"
                            placeholder="Last Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="last_name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="mobile">Mobile</Label>
                          <Field
                            className="form-control"
                            name="mobile"
                            type="text"
                            placeholder="Mobile"
                          />

                          <ErrorMessage
                            name="mobile"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="6">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="company">Company</Label>
                          <Select
                            options={props.companies?.map((comp) => {
                              return {
                                label: comp.company_name,
                                value: comp.company_name,
                              };
                            })}
                            onChange={(data) => {
                              setFieldValue("company", data.label);
                            }}
                          />
                          <ErrorMessage
                            name="company"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="iotgroups">Group</Label>
                          <Select
                            options={props.iotGroups?.map((comp) => {
                              return {
                                label: comp.name,
                                value: comp.id,
                              };
                            })}
                            onChange={(data) => {
                              setFieldValue("iotgroups", data.label);
                            }}
                          />
                          <ErrorMessage
                            name="iotgroups"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="groups">Role</Label>
                          <Select
                            options={props.groups?.map((comp) => {
                              return {
                                label: comp.name,
                                value: comp.name,
                              };
                            })}
                            onChange={(data) => {
                              setFieldValue("groups", data.label);
                            }}
                          />
                          <ErrorMessage
                            name="groups"
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
                        <span className="label">Add</span>
                      </Button>{" "}
                      <Button
                        className="btn btn-light float-right"
                        type="reset"
                        onClick={() => props.history.goBack()}
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

export default AddUser;
