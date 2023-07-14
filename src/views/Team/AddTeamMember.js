import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const AddTeamMember = (props) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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
                  name: "",
                  email_id: "",
                  designation: "",
                  phone_number: "",
                  project: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  email_id: Yup.string().email().required("Required"),
                  designation: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .trim()
                    .required("Required"),
                  phone_number: Yup.number()
                    .integer()
                    .positive()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/teams/";
                  let object = {
                    name: values["name"],
                    email_id: values["email_id"],
                    designation: values["designation"],
                    phone_number: values["phone_number"],
                    project_id: selectedProject.value,
                  };
                  apiAuth
                    .get("/api/teams")
                    .then((res) => {
                      let flag = false;
                      res.data.forEach((dd) => {
                        if (dd.email_id === object.email_id) flag = true;
                      });

                      if (flag) {
                        NotificationManager.error(
                          "",
                          `Team member already exist`,
                          3000,
                          null,
                          null,
                          ""
                        );
                      } else {
                        apiAuth
                          .post(url, object)
                          .then((response) => {
                            //console.log(response.data);
                            if (response.status === 201) {
                              NotificationManager.success(
                                "",
                                `Team member Added Successfully`,
                                3000,
                                null,
                                null,
                                ""
                              );
                              props.closeAddPopup();
                            } else {
                              NotificationManager.error(
                                "",
                                `Team member Add Error`,
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
                              `Team member Add Error`,
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
                        `Team member Add Error`,
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
                          <Label htmlFor="designation">Designation</Label>
                          <Field
                            className="form-control"
                            name="designation"
                            type="text"
                            placeholder="designation..."
                          />
                          <ErrorMessage
                            name="designation"
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
                            value={selectedProject}
                            options={projects?.map((pj) => {
                              return {
                                label: pj.name,
                                value: pj.id,
                              };
                            })}
                            onChange={(value) => {
                              setSelectedProject(value);
                              setFieldValue("project", value.value);
                            }}
                          />

                          <ErrorMessage
                            name="project"
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

export default AddTeamMember;
