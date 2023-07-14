import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const EditClient = (props) => {
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: props.selectedClient?.name,
                  email_id: props.selectedClient?.email_id,
                  phone_number: props.selectedClient?.phone_number,
                }}
                enableReinitialize={true}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  email_id: Yup.string().email().required("Required"),
                  phone_number: Yup.number()
                    .integer()
                    .positive()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = `/api/client/${props.selectedClient?.id}`;
                  let object = {
                    name: values["name"],
                    email_id: values["email_id"],
                    phone_number: values["phone_number"],
                  };
                  apiAuth
                    .patch(url, values)
                    .then((response) => {
                      console.log(response.data);
                      if (response.status === 200) {
                        NotificationManager.success(
                          "",
                          `Client Edited Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Client Edit Error`,
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
                        `Client Edit Error`,
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
                        className="btn float-right"
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

export default EditClient;
