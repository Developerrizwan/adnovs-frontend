import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// import logoLight from "../assets/images/logo-light.png";
import logoLight from "../../assets/images/logo-light.png";

const EditProject = (props) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(props.projectData?.start_date);
  // const [filesSelected, setFilesSelected] = useState([]);
  const selectStatus = [
    { value: "COMPLETED", label: "COMPLETED" },
    { value: "PENDING", label: "PENDING" },
  ];

  const handleDateChange = (selectedDates) => {
    setSelectedDate(selectedDates);
  };

  return (
    <>
      {props.projectData ? (
        <Row mb="4">
          <Colxx lg="12">
            <div className="card">
              <div className="card-body">
                <Formik
                  initialValues={{
                    name: props.projectData?.name
                      ? props.projectData?.name
                      : "",
                    client_id: props.projectData?.client_id
                      ? props.projectData?.client_id
                      : "",
                    start_date: props.projectData?.start_date
                      ? props.projectData?.start_date
                      : "",
                    status: props.projectData?.status
                      ? props.projectData?.status
                      : "",
                  }}
                  validationSchema={Yup.object({
                    name: Yup.string().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    const url = `/api/project/${props.projectData?.id}/`;
                    console.log(values, "sddsfsf");

                    const formData = new FormData();

                    formData.append("name", values["name"]);
                    formData.append("status", values["status"]);
                    formData.append("start_date", selectedDate);
                    formData.append("client_id", values["client_id"]);
                    if (values["logofile"])
                      formData.append("logo", values["logofile"]);

                    apiAuth
                      .patch(url, values)
                      .then((response) => {
                        //console.log(response.data);
                        if (response.status === 200) {
                          NotificationManager.success(
                            "",
                            `Project Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.closeAddPopup();
                        } else {
                          NotificationManager.error(
                            "",
                            `Project Update Error`,
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
                          `Project Update Error`,
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
                          <div className="form-group mb-3">
                            <Label htmlFor="name">Project Name *</Label>
                            <Field
                              className="form-control"
                              name="name"
                              type="text"
                              placeholder="project name"
                            />

                            <ErrorMessage
                              name="name"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg={6}>
                          <div>
                            <Label className="form-label mb-0">
                              Start Date *
                            </Label>
                            <Flatpickr
                              className="form-control"
                              options={{
                                dateFormat: "d-m-Y",
                              }}
                              placeholder="Enter date"
                              onChange={handleDateChange}
                              value={selectedDate}
                            />
                          </div>
                        </Colxx>
                      </Row>
                      <Row>
                        <Colxx lg="6">
                          {" "}
                          <div className="form-group">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              options={selectStatus}
                              value={selectedStatus}
                              defaultInputValue={props.projectData?.status}
                              onChange={(data) => {
                                setSelectedStatus(data);
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

                        <Colxx lg="6">
                          <div className="form-group mt-3">
                            <Label htmlFor="logo">Project Logo</Label>
                            <Field
                              className="form-control"
                              name="logo"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setFieldValue("logofile", e.target.files[0])
                              }
                            />
                            <img
                              height="35px"
                              alt=""
                              src={props.projectData?.logo}
                            />
                            <ErrorMessage
                              name="logo"
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
                  )}
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

export default EditProject;
