import React from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const AddBranch = (props) => {
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: props?.modal?.value?.name || "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/master/branch/";
                  const urll = `/api/master/branch/${props?.modal?.value?.id}`;

                  props?.modal?.type === "Add"
                    ? apiAuth
                        .post(url, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `Branch Added Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.close();
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Branch Add Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        })
                    : apiAuth
                        .patch(urll, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `Branch Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.close();
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Branch Update Error`,
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
                        <div className="form-group">
                          <Label htmlFor="name"> Name</Label>
                          <Field
                            className="form-control"
                            name="name"
                            placeholder="Branch Name"
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
                        <span className="label">
                          {props?.modal?.type === "Add" ? "Add" : "Update"}
                        </span>
                      </Button>
                      <Button
                        className="btn btn-light float-right"
                        type="reset"
                        onClick={() => props.close()}
                      >
                        Cancel
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

export default AddBranch;
