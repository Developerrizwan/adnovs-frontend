import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const EditUser = (props) => {
  return (
    <>
      {props.userData ? (
        <Row mb="4">
          <Colxx lg="12">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{
                    email: props.userData?.email ? props.userData?.email : "",
                    first_name: props.userData?.first_name
                      ? props.userData?.first_name
                      : "",
                    last_name: props.userData?.last_name
                      ? props.userData?.last_name
                      : "",
                    mobile: props.userData?.mobile
                      ? props.userData?.mobile
                      : "",
                    iotgroups: props.userData?.iotgroups?.length
                      ? props.userData?.iotgroups[0]
                      : "",
                    groups:
                      props.userData?.groups?.length > 0
                        ? props.userData?.groups[0]
                        : "",
                    company:
                      props.userData?.company?.length > 0
                        ? props.userData?.company[0]
                        : "",
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
                    mobile: Yup.string().matches(
                      /^[0-9]*$/,
                      "Please enter valid number"
                    ),
                    groups: Yup.string().trim().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    const url = `/api/admin/users/${props.userData?.id}/`;
                    values.company = [values["company"]];
                    values.groups = [values["groups"]];

                    if (values.iotgroups)
                      values.iotgroups = [values["iotgroups"]];

                    apiAuth
                      .patch(url, values)
                      .then((response) => {
                        //console.log(response.data);
                        if (response.status === 200) {
                          NotificationManager.success(
                            "",
                            `User Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.closeAddPopup();
                        } else {
                          NotificationManager.error(
                            "",
                            `User Update Error`,
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
                          `User Update Error`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  }}
                >
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
                      {/* <Colxx lg="6">
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
                    </Colxx> */}

                      <Colxx lg="6">
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

                      <Colxx lg="6">
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

                      <Colxx lg="6">
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
                        <div className="form-group mb-3">
                          <Label htmlFor="company">Company</Label>
                          <Field
                            as="select"
                            name="company"
                            className="form-control"
                          >
                            <option value="">Select Company</option>

                            {props.companies?.map((comp, index) => {
                              return (
                                <option value={comp.company_name} key={index}>
                                  {comp.company_name}
                                </option>
                              );
                            })}
                          </Field>
                          <ErrorMessage
                            name="company"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="iotgroups">Group</Label>
                          <Field
                            as="select"
                            name="iotgroups"
                            className="form-control"
                          >
                            <option value="">Select Group</option>

                            {props.iotGroups?.map((comp, index) => {
                              return (
                                <option value={comp.id} key={index}>
                                  {comp.name}
                                </option>
                              );
                            })}
                          </Field>
                          <ErrorMessage
                            name="iotgroups"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="groups">Role</Label>
                          <Field
                            as="select"
                            name="groups"
                            className="form-control"
                          >
                            <option value="">Select Role</option>

                            {props.groups?.map((comp, index) => {
                              return (
                                <option value={comp.name} key={index}>
                                  {comp.name}
                                </option>
                              );
                            })}
                          </Field>
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
                        style={{background: "#1062fe"}}
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">Update</span>
                      </Button>{" "}
                      <Button
                        className="btn float-right"
                        type="reset"
                        onClick={() => props.closeAddPopup()}
                        style={{background: "#1062fe"}}
                      >
                        {" "}
                        Cancel{" "}
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </Colxx>
        </Row>
      ) : (
        <></>
      )}
    </>
  );
};

export default EditUser;
