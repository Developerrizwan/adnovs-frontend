import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const EditGroup = (props) => {
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: props.groupData?.name ? props.groupData?.name : "",
                  //   company: props.groupData?.company
                  //     ? props.groupData?.company
                  //     : "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = `/api/iotgroups/${props.groupData?.id}/`;

                  apiAuth
                    .patch(url, values)
                    .then((response) => {
                      if (response.status === 200) {
                        NotificationManager.success(
                          "",
                          `Group Updated Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Group Update Error`,
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
                        `Group Update Error`,
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
                    <Colxx lg="12">
                      {" "}
                      <div className="form-group mb-3">
                        <Label htmlFor="name">Group Name</Label>
                        <Field
                          className="form-control"
                          name="name"
                          placeholder="Group Name"
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
                    {/* <Colxx lg="6">
                      <div className="form-group">
                        <Label htmlFor="company">Company</Label>
                        <Field
                          as="select"
                          name="company"
                          className="form-control"
                        >
                          <option value="">Select Company</option>
                          {props.companies?.map((comp, index) => {
                            return (
                              <option value={comp.id} key={index}>
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
                    </Colxx> */}
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
                      <span className="label">Update</span>
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
              </Formik>
            </div>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default EditGroup;
