import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const AddCoupon = (props) => {
  const [copounState, setCopounState] = useState();

  const copounOption = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: "",
                  code: "",
                  status: copounState,
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                  code: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                  status: Yup.string().required("status is required!"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/coupon/";
                  console.log("copoun", values);
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      //console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `Copoun Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Copoun Add Error`,
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
                        `Copoun Add Error`,
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
                      <Colxx lg="6">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="code">Code</Label>
                          <Field
                            className="form-control"
                            name="code"
                            placeholder="Code"
                            type="text"
                          />
                          <ErrorMessage
                            name="code"
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
                          <Label htmlFor="status">Status</Label>
                          <Select
                            options={copounOption}
                            value={copounState}
                            onChange={(data) => {
                              setCopounState(data);
                              setFieldValue("status", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="status"
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

export default AddCoupon;
