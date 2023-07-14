import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const AddTicket = (props) => {
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProject = () => {
    setLoading(true);
    apiAuth
      .get("/api/project")
      .then((response) => {
        let data = response.data;
        // console.log(response.data);
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProject();
  }, []);

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  // status: "",
                  // resolved_by: "",
                  // resolution: "",
                  project: "",
                  // raised_by: 1,
                }}
                validationSchema={Yup.object({
                  title: Yup.string()
                    .max(100, "Must be 50 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/ticket/";
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `Ticket Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Ticket Add Error`,
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
                        `Ticket Add Error`,
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
                          <Label htmlFor="title">Title</Label>
                          <Field
                            className="form-control"
                            name="title"
                            placeholder="Title"
                            type="text"
                          />
                          <ErrorMessage
                            name="title"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="description">Description</Label>
                          <Field
                            className="form-control"
                            name="description"
                            placeholder="Description"
                            type="text"
                          />
                          <ErrorMessage
                            name="description"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      {/* <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="status">Status</Label>
                          <Field
                            className="form-control"
                            name="status"
                            placeholder="Status"
                            type="text"
                          />
                          <ErrorMessage
                            name="status"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx> */}
                      {/* <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="resloved_by">Resolved_by</Label>
                          <Field
                            className="form-control"
                            name="resloved_by"
                            placeholder="Resolved_by"
                            type="text"
                          />
                          <ErrorMessage
                            name="resloved_by"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx> */}
                      {/* <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="resloution">Resolution</Label>
                          <Field
                            className="form-control"
                            name="resloution"
                            placeholder="Resolution"
                            type="text"
                          />
                          <ErrorMessage
                            name="resloution"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx> */}
                      <Colxx lg="4">
                        <div className="form-group mb-3">
                          <Label htmlFor="project">Project Name</Label>
                          {/* <Field
                            className="form-control"
                            as="select"
                            name="project"
                            onChange={(e) => {
                              setFieldValue("project", e.target.value);
                              getProject(e.target.value);
                              console.log(e.target.value);
                            }}
                          >
                            <option value={0}>Select</option>
                            {projects.map((item, index) => {
                              return (
                                <option key={index} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Field> */}

                          <Select
                            name="project"
                            placeholder={"Select"}
                            options={projects?.map((pj) => {
                              return {
                                label: pj.name,
                                value: pj.id,
                              };
                            })}
                            onChange={(event) =>
                              setFieldValue("project", event.value)
                            }
                          />

                          <ErrorMessage
                            name="project"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      {/* <Colxx lg="4">
                        {" "}
                        <div className="form-group mb-3">
                          <Label htmlFor="comment">Raised_by</Label>
                          <Field
                            className="form-control"
                            name="raised_by"
                            placeholder="Enter raised_by"
                            // component="textarea"
                            rows="6"
                          />
                          <ErrorMessage
                            name="raised_by"
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
                        onClick={() => props.closeAddPopup()}
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

export default AddTicket;
