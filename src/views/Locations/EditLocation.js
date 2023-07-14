import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment-timezone";
import NotificationManager from "../../components/Common/NotificationManager";

const EditLocation = (props) => {
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  name: props.locationData?.name
                    ? props.locationData?.name
                    : "",
                  company: props.locationData?.company
                    ? props.companies.filter(
                        (lc) => lc.company_name === props.locationData?.company
                      ).length > 0
                      ? props.companies.filter(
                          (lc) =>
                            lc.company_name === props.locationData?.company
                        )[0].id
                      : ""
                    : "",
                  server: props.locationData?.company
                    ? props.servers.filter(
                        (lc) => lc.name === props.locationData?.server
                      ).length > 0
                      ? props.servers.filter(
                          (lc) => lc.name === props.locationData?.server
                        )[0].id
                      : ""
                    : "",
                  location_x: props.locationData?.location_x
                    ? props.locationData?.location_x
                    : "",
                  location_y: props.locationData?.location_y
                    ? props.locationData?.location_y
                    : "",
                  timezone: props.locationData?.timezone
                    ? props.locationData?.timezone
                    : "",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .max(100, "Must be 100 characters or less")
                    .trim()
                    .required("Required"),
                })}
                onSubmit={(values, { resetForm }) => {
                  const url = `/api/location/${props.locationData?.id}/`;
                  apiAuth
                    .patch(url, values)
                    .then((response) => {
                      if (response.status === 200) {
                        NotificationManager.success(
                          "",
                          `Location Updated Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      } else {
                        NotificationManager.error(
                          "",
                          `Location Update Error`,
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
                        `Location Update Error`,
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
                    <Colxx lg="6">
                      {" "}
                      <div className="form-group mb-3">
                        <Label htmlFor="name">Location Name</Label>
                        <Field
                          className="form-control"
                          name="name"
                          placeholder="Location Name"
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
                    <Colxx lg="6">
                      <div className="form-group">
                        <Label htmlFor="server">Server</Label>
                        <Field
                          as="select"
                          name="server"
                          className="form-control"
                        >
                          <option value="">Select Server</option>
                          {props.servers?.map((server, index) => {
                            return (
                              <option value={server.id} key={index}>
                                {server.name}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage
                          name="server"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="6">
                      <div className="form-group mb-3">
                        <Label htmlFor="location_x">Latitude</Label>
                        <Field
                          className="form-control"
                          name="location_x"
                          placeholder="Location Latitude"
                          type="text"
                        />
                        <ErrorMessage
                          name="location_x"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="6">
                      <div className="form-group mb-3">
                        <Label htmlFor="location_y">Longitude</Label>
                        <Field
                          className="form-control"
                          name="location_y"
                          placeholder="Location Longitude"
                          type="text"
                        />
                        <ErrorMessage
                          name="location_y"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                    <Colxx lg="6">
                      <div className="form-group">
                        <Label htmlFor="timezone">TimeZone</Label>
                        <Field
                          as="select"
                          name="timezone"
                          className="form-control"
                        >
                          {moment.tz.names()?.map((comp, index) => {
                            return (
                              <option value={comp} key={index}>
                                {comp}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage
                          name="timezone"
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

export default EditLocation;
