import React from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const AddDevice = (props) => {
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: "",
                  company: "",
                  location: "",
                  temperature: "",
                  rssi_value: "",
                  acceleration: "",
                  gmt_tm: "",
                  cutoff: "",
                  pir: "",
                  beacon_type: "",
                  transmission_power: "",
                  battery: "",
                  major: "",
                  minor: "",
                  tlm: "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = "/api/device/";
                  let acc = values["acceleration"].split(",");
                  values.acceleration_x = acc.length > 0 ? acc[0] : 0;
                  values.acceleration_y = acc.length > 1 ? acc[1] : 0;
                  values.acceleration_z = acc.length > 2 ? acc[2] : 0;
                  apiAuth
                    .post(url, values)
                    .then((response) => {
                      //console.log(response.data);
                      if (response.status === 201) {
                        NotificationManager.success(
                          "",
                          `Device Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Device Add Error`,
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
                        `Device Add Error`,
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
                    <Colxx lg="4">
                      {" "}
                      <div className="form-group mb-3">
                        <Label htmlFor="name">Device Name</Label>
                        <Field
                          className="form-control"
                          name="name"
                          placeholder="Device Name"
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
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group">
                        <Label htmlFor="location">Location</Label>
                        <Field
                          as="select"
                          name="location"
                          className="form-control"
                        >
                          <option value="">Select Location</option>
                          {props.locations?.map((comp, index) => {
                            return (
                              <option value={comp.id} key={index}>
                                {comp.name}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage
                          name="location"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Field
                          className="form-control"
                          name="temperature"
                          placeholder="Temperature"
                          type="text"
                        />
                        <ErrorMessage
                          name="temperature"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="rssi_value">RSSI Value</Label>
                        <Field
                          className="form-control"
                          name="rssi_value"
                          placeholder="RSSI Value"
                          type="text"
                        />
                        <ErrorMessage
                          name="rssi_value"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="acceleration">
                          Acceleration(x,y,z)
                        </Label>
                        <Field
                          className="form-control"
                          name="acceleration"
                          placeholder="x,y,z"
                          type="text"
                        />
                        <ErrorMessage
                          name="acceleration"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="gmt_tm">GMT Time</Label>
                        <Field
                          className="form-control"
                          name="gmt_tm"
                          placeholder="GMT Time"
                          type="text"
                        />
                        <ErrorMessage
                          name="gmt_tm"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="cutoff">Cutoff</Label>
                        <Field
                          className="form-control"
                          name="cutoff"
                          placeholder="Cutoff"
                          type="text"
                        />
                        <ErrorMessage
                          name="cutoff"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="pir">PIR</Label>
                        <Field
                          className="form-control"
                          name="pir"
                          placeholder="pir"
                          type="text"
                        />
                        <ErrorMessage
                          name="pir"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="beacon_type">Beacon Type</Label>
                        <Field
                          className="form-control"
                          name="beacon_type"
                          placeholder="Beacon Type"
                          type="text"
                        />
                        <ErrorMessage
                          name="beacon_type"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="transmission_power">
                          Transmission Power
                        </Label>
                        <Field
                          className="form-control"
                          name="transmission_power"
                          placeholder="Transmission Power"
                          type="text"
                        />
                        <ErrorMessage
                          name="transmission_power"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="battery">Battery</Label>
                        <Field
                          className="form-control"
                          name="battery"
                          placeholder="Battery"
                          type="text"
                        />
                        <ErrorMessage
                          name="battery"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="major">Major</Label>
                        <Field
                          className="form-control"
                          name="major"
                          placeholder="Major"
                          type="text"
                        />
                        <ErrorMessage
                          name="major"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="minor">Minor</Label>
                        <Field
                          className="form-control"
                          name="minor"
                          placeholder="Minor"
                          type="text"
                        />
                        <ErrorMessage
                          name="minor"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="4">
                      <div className="form-group mb-3">
                        <Label htmlFor="tlm">TLM</Label>
                        <Field
                          className="form-control"
                          name="tlm"
                          placeholder="TLM"
                          type="text"
                        />
                        <ErrorMessage
                          name="tlm"
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
              </Formik>
            </div>
          </div>
        </Colxx>
      </Row>
    </>
  );
};

export default AddDevice;
