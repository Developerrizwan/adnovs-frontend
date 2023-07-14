import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const AddClient = (props) => {
  //  const[submit, setSubmit] = useState(false);

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: "",
                  email_id: "",
                  //   date: "",
                  phone_number: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  email_id: Yup.string().email().required("Required"),
                  //   date: Yup.date()
                  //     .required("Required"),
                  phone_number: Yup.number()
                    .integer()
                    .positive()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  console.log("aaaaa", values);
                  const url = "/api/client/";
                  let object = {
                    name: values["name"],
                    email_id: values["email_id"],
                    // date: values["date"],
                    phone_number: values["phone_number"],
                  };
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      //console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `Client Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Client Add Error`,
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
                        `Client Add Error`,
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
                          <Label htmlFor="name">Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Name"
                            type="text"
                          />
                          <ErrorMessage
                            name="name"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>

                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="email_id">Email</Label>
                          <Field
                            className="form-control"
                            name="email_id"
                            placeholder="Email..."
                            type="text"
                          />
                          <ErrorMessage
                            name="email_id"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      {/* <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="designation">Date</Label>
                          <Field
                            className="form-control"
                            name="date"
                            type="date"
                            
                          />
                          <ErrorMessage
                            name="designation"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx> */}
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="phone_number">Mobile</Label>
                          <Field
                            className="form-control"
                            name="phone_number"
                            type="text"
                            placeholder="Mobile..."
                          />
                          <ErrorMessage
                            name="phone_number"
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
                        // onClick={() => setSubmit(true)}
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

export default AddClient;
