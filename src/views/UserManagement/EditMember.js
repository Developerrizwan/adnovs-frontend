import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import Select from "react-select";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Country, State, City } from "country-state-city";

const EditUser = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [role, setRole] = useState();

  const options = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  username: props.selectedMember?.username,
                  email: props.selectedMember?.email,
                  country: props.selectedMember?.country,
                  role: props.selectedMember?.groups,
                }}
                enableReinitialize={true}
                validationSchema={Yup.object({
                  username: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  email: Yup.string().email().required("Required"),
                  country: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = `/api/user/${props.selectedMember.id}`;
                  let groupsArr = [];
                  groupsArr.append(values["role"]);
                  let object = {
                    username: values["username"],
                    email: values["email"],
                    country: values["country"],
                    groups: groupsArr,
                    // groups: values["role"] || role,
                  };
                  console.log(object, "edit member req");
                  apiAuth
                    .patch(url, object)
                    .then((response) => {
                      console.log(response.data);
                      if (response.status === 200) {
                        NotificationManager.success(
                          "",
                          `Member Updated Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Member Update Error`,
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
                        `Member Update Error`,
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
                          <Label htmlFor="username">Name</Label>
                          <Field
                            className="form-control"
                            name="username"
                            placeholder="Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="username"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="short_name">Email</Label>
                          <Field
                            className="form-control"
                            name="email"
                            placeholder="Email..."
                            type="text"
                          />
                          <ErrorMessage
                            name="email"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        <div className="mb-3">
                          <label htmlFor="country" className="form-label">
                            Country
                          </label>
                          <Select
                            options={Country.getAllCountries().map((state) => {
                              return {
                                label: state.name,
                                value: state.isoCode,
                              };
                            })}
                            defaultInputValue={props.selectedMember?.country}
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
                      {/* <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="password">Password</Label>
                          <Field
                            className="form-control"
                            name="password"
                            type="text"
                            placeholder="password..."
                          />
                          <ErrorMessage
                            name="password"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx> */}
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            options={options}
                            value={role}
                            defaultInputValue={props.selectedMember?.groups}
                            onChange={(data) => {
                              console.log(data, "clicked value");
                              // setRole(data.value);
                              setFieldValue("role", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="role"
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
                        <span className="label">
                          {props.addText || "Update"}
                        </span>
                      </Button>{" "}
                      <Button
                        className="btn  float-right"
                        type="reset"
                        onClick={() => {
                          props.closeAddPopup();
                        }}
                        style={{background: "#1062fe"}}
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

export default EditUser;
