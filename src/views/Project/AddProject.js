import React, { useEffect, useState } from "react";
import { Row, Button, Label, Container, Card } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";
import BreadCrumb from "../../components/Common/BreadCrumb";
import FilesUpload from "./FilesUpload";

const AddProject = (props) => {
  const [selectedDate, setSelectedDate] = useState();
  const [state, setState] = useState({});
  const [clients, setClients] = useState([]);

  const handleDateChange = (selectedDates) => {
    setSelectedDate(selectedDates[0]);
    const formattedDate = moment(new Date(selectedDates))
      .tz("Asia/kolkata")
      .toISOString();
    setSelectedDate(formattedDate);
  };

  useEffect(() => {
    getClients();
  }, []);

  const getClients = () => {
    apiAuth
      .get("/api/client")
      .then((res) => {
        let data = res.data;
        setClients(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Add Project"
          pageTitle="Settings"
          back_button={true}
          history={props.history}
        />
      </Container>
      {!state.isFilesUpload ? (
        <div className="card-body">
          <Row>
            <Colxx lg="8">
              <div
                className="card"
                style={{
                  background: "#f3f3f9",
                  boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                }}
              >
                <div className="card-body">
                  <Formik
                    initialValues={{
                      name: "",
                      status: "PENDING",
                      start_date: "",
                      type: "image",
                      client_id: "",
                      file: [],
                      logo: null,
                    }}
                    validationSchema={Yup.object({
                      name: Yup.string().required("Required"),
                      client_id: Yup.string().required("Required"),
                    })}
                    enctype="multipart/form-data"
                    onSubmit={(values, { resetForm }) => {
                      const url = "/api/project/";

                      const formData = new FormData();

                      formData.append("name", values["name"]);
                      formData.append("status", values["status"]);
                      formData.append("start_date", selectedDate);
                      formData.append("type", values["type"]);
                      formData.append("client_id", values["client_id"]);
                      if (values["logofile"])
                        formData.append("logo", values["logofile"]);

                      // setState({
                      //   ...state,
                      //   isFilesUpload: true,
                      //   selectedProject: {
                      //     id: 51,
                      //     logo: "https://darsa-test.s3.amazonaws.com/media/projectlogo/960_AIworksquad_JG-02.jpg",
                      //     name: "Test Project",
                      //     start_date: "2023-03-22T18:30:00Z",
                      //     status: "PENDING",
                      //     suggestions: null,
                      //     client_id: 17,
                      //     created_by: null,
                      //     team_members: [],
                      //   },
                      // });

                      apiAuth
                        .post(url, formData)
                        .then((response) => {
                          if (response.status === 200) {
                            NotificationManager.success(
                              "",
                              `Project created Successfully.`,
                              3000,
                              null,
                              null,
                              ""
                            );
                            setState({
                              ...state,
                              isFilesUpload: true,
                              selectedProject: response.data,
                            });
                            // props.closeAddPopup();
                          } else {
                            NotificationManager.error(
                              "",
                              `Project Add Error`,
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
                            `Project Add Error`,
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
                          <Colxx lg="12">
                            <div className="form-group mb-3">
                              <Label htmlFor="client_id">Client Name *</Label>
                              <Field
                                className="form-control"
                                name="client_id"
                                as="select"
                                placeholder="Project Name"
                                style={{ background: "#f3f3f9" }}
                              >
                                <option value={""}>Select</option>
                                {clients.map((cc) => {
                                  return (
                                    <option key={cc.id} value={cc.id}>
                                      {cc.name}
                                    </option>
                                  );
                                })}
                              </Field>

                              <ErrorMessage
                                name="client_id"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg="12">
                            <div className="form-group mb-3">
                              <Label htmlFor="name">Project Name *</Label>
                              <Field
                                className="form-control"
                                name="name"
                                type="text"
                                placeholder="Project Name"
                                style={{ background: "#f3f3f9" }}
                              />

                              <ErrorMessage
                                name="name"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>
                          <Colxx lg={12}>
                            <div>
                              <Label className="form-label">Start Date *</Label>
                              <Flatpickr
                                className="form-control"
                                options={{
                                  dateFormat: "d-m-Y",
                                }}
                                placeholder="Project Start Date"
                                onChange={handleDateChange}
                                value={selectedDate}
                                style={{ background: "#f3f3f9" }}
                              />
                            </div>
                          </Colxx>
                        </Row>
                        <Row>
                          <Colxx lg="12">
                            <div className="form-group my-3">
                              <Label htmlFor="logo">Project Logo</Label>
                              <Field
                                className="form-control"
                                name="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setFieldValue("logofile", e.target.files[0])
                                }
                                style={{ background: "#f3f3f9" }}
                              />

                              <ErrorMessage
                                name="logo"
                                render={(msg) => (
                                  <div className="text-danger">{msg}</div>
                                )}
                              />
                            </div>
                          </Colxx>

                          {/* <Colxx lg="6">
                          <div className="form-group mt-3">
                            <Label htmlFor="file">File</Label>
                            <Field
                              className="form-control"
                              name="file"
                              type="file"
                              accept={`image/*`}
                              multiple
                              onChange={(e) => {
                                setFieldValue("filename", e.target.files[0]);
                                setFilesSelected((prevFiles) => [
                                  ...prevFiles,
                                  e.target.files[0],
                                ]);
                              }}
                            />
                            <ErrorMessage
                              name="file"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx> */}
                        </Row>
                        <Separator className="mb-4 mt-4" />
                        <div className="d-flex justify-content-end">
                          <Button
                            type="submit"
                            className={`btn-shadow btn-multiple-state ${
                              props.loading ? "show-spinner" : ""
                            }`}
                            size="lg"
                            style={{ background: "#1062fe " }}
                          >
                            <span className="spinner d-inline-block">
                              <span className="bounce1" />
                              <span className="bounce2" />
                              <span className="bounce3" />
                            </span>
                            <span className="label">Next</span>
                          </Button>
                          {/* <Button
                          className="btn btn-light float-right"
                          type="reset"
                          onClick={() => props.history.goBack()}
                        >
                          Cancel
                        </Button> */}
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </Colxx>
          </Row>
        </div>
      ) : (
        <>
          <FilesUpload
            history={props.history}
            project={state.selectedProject}
          />
        </>
      )}
    </div>
  );
};

export default AddProject;
