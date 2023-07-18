import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { Card, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const EditUser = (props) => {
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);
  const [workshopData, setWorkshopData] = useState(null);
  const [selectedworkshops, setSelectedWorkshops] = useState([]);

  const getStates = () => {
    apiAuth
      .get("/api/state/read")
      .then((response) => {
        let data = response.data;
        data = data.map((dd, i) => {
          dd["sno"] = i + 1;
          return dd;
        });
        const sel = data.filter((dd) =>
          props?.userData?.states.some((ss) => ss === dd?.state_name)
        );
        const selStates = sel.map((ss) => {
          return {
            label: ss?.state_name,
            value: ss?.id,
          };
        });
        setSelectedStates(selStates);
        setStates(data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error("", `State Get Error`, 3000, null, null, "");
      });
  };

  const getRegions = () => {
    apiAuth
      .get("/api/region/read/")
      .then((response) => {
        let data = response.data;
        data = data.map((dd, i) => {
          dd["sno"] = i + 1;
          return dd;
        });
        const sel = data.filter((dd) =>
          props?.userData?.region.some((ss) => ss === dd?.region_name)
        );
        const selRegions = sel.map((ss) => {
          return {
            label: ss?.region_name,
            value: ss?.id,
          };
        });
        setSelectedRegions(selRegions);
        setRegions(data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Regions Get Error`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  const getCities = () => {
    apiAuth
      .get("/api/city/read/")
      .then((response) => {
        let data = response.data;
        data = data.map((dd, i) => {
          dd["sno"] = i + 1;
          return dd;
        });
        const sel = data.filter((dd) =>
          props?.userData?.citys.some((ss) => ss === dd?.city_name)
        );
        const selCities = sel.map((ss) => {
          return {
            label: ss?.city_name,
            value: ss?.id,
          };
        });
        setSelectedCities(selCities);
        setCities(data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error("", `Cities Get Error`, 3000, null, null, "");
      });
  };

  const getWorkshop = () => {
    apiAuth
      .get("/api/workshop/")
      .then((response) => {
        let data = response?.data?.filter(
          (ws) =>
            String(ws.company) ===
            String("66548c7c-6cd2-4bdc-bace-ac1c0128327c")
        );
        const sel = data.filter((dd) =>
          props?.userData?.workshops.some((ss) => ss === dd?.id)
        );
        const selWshps = sel.map((ss) => {
          return {
            label: ss?.name,
            value: ss?.id,
          };
        });
        setSelectedWorkshops(selWshps);
        setWorkshopData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (
      props?.userData !== null &&
      (props.userData?.groups.includes("user") ||
        props.userData?.groups.includes("manager"))
    ) {
      getStates();
      getRegions();
      getCities();
      getWorkshop();
    }
  }, [props?.userData?.groups]);

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <Formik
            initialValues={{
              name: props.userData?.name ? props.userData?.name : "",
              password: "",
              mobile: props.userData?.mobile ? props.userData?.mobile : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Required"),
              password: Yup.string(),
              mobile: Yup.string().max(20, "Must be 50 characters or less"),
            })}
            onSubmit={(values, { resetForm }) => {
              const states = selectedStates.map((ss) => ss?.value);
              const region = selectedRegions.map((ss) => ss?.value);
              const city = selectedCities.map((ss) => ss?.value);

              const Obj = {
                id: props.userData.id,
                name: values.name,
                password: values.password,
                mobile: values.mobile,
                // role: values.role,
                state: states,
                region: region,
                city: city,
                workshops: selectedworkshops.map((sw) => sw?.value),
              };
              const url = "/api/updateuser/";
              apiAuth
                .put(url, Obj)
                .then((response) => {
                  if (response.status === 200) {
                    NotificationManager.success(
                      "",
                      `User Updated Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    props.closeAddPopup();
                    props?.history?.push("/user-management");
                  } else {
                    NotificationManager.error(
                      "",
                      `User Update Error`,
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
                    `User Update Error`,
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
                  <Row>
                    <Colxx lg="12">
                      <div className="form-group mb-3">
                        <Label htmlFor="password">Password</Label>
                        <Field
                          className="form-control"
                          name="password"
                          placeholder="Password"
                          type="text"
                        />
                        <ErrorMessage
                          name="password"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                    </Colxx>
                  </Row>

                  <Colxx lg="12">
                    <div className="form-group mb-3">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Field
                        className="form-control"
                        name="mobile"
                        placeholder="Mobile Number"
                        type="text"
                      />
                      <ErrorMessage
                        name="mobile"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  {(props?.userData?.groups?.includes("manager") ||
                    props?.userData?.groups?.includes("user")) && (
                    <>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="workshop_id">Workshop</Label>
                          <Select
                            isMulti
                            value={selectedworkshops}
                            options={workshopData?.map((item) => {
                              return {
                                label: `${item.name} - ${item.short_code}`,
                                value: item.id,
                              };
                            })}
                            onChange={(data) => {
                              setSelectedWorkshops(data);
                              setFieldValue("workshop_id", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="workshop_id"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="state">State</Label>
                          <Select
                            isMulti
                            value={selectedStates}
                            options={states?.map((item) => {
                              return {
                                label: item.state_name,
                                value: item.id,
                              };
                            })}
                            onChange={(data) => {
                              setSelectedStates(data);
                            }}
                          />
                          <ErrorMessage
                            name="state"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="region">Region</Label>
                          <Select
                            isMulti
                            value={selectedRegions}
                            options={regions
                              // ?.filter((rg) =>
                              //   selectedStates?.some(
                              //     (ss) => ss.value === rg.state?.id
                              //   )
                              // )
                              .map((item) => {
                                return {
                                  label: item.region_name,
                                  value: item.id,
                                };
                              })}
                            onChange={(data) => {
                              setSelectedRegions(data);
                            }}
                          />
                          <ErrorMessage
                            name="region"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx lg="6">
                        <div className="form-group mb-3">
                          <Label htmlFor="workshop_id">City</Label>
                          <Select
                            isMulti
                            value={selectedCities}
                            options={cities
                              // ?.filter((ct) =>
                              //   selectedRegions?.some(
                              //     (sr) => sr.value === ct.region?.id
                              //   )
                              // )
                              .map((item) => {
                                return {
                                  label: item.city_name,
                                  value: item.id,
                                };
                              })}
                            onChange={(data) => {
                              setSelectedCities(data);
                            }}
                          />
                          <ErrorMessage
                            name="city"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </>
                  )}
                </Row>
                <Separator className="mb-4 mt-4" />
                <div
                  className="d-flex justify-content-between"
                  style={{
                    padding: "0px 20px",
                  }}
                >
                  <Button
                    type="submit"
                    color="info"
                    style={{ backgroundColor: "#29B6F6" }}
                    className={`btn-shadow btn-multiple-state float-right ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">{props.addText || "Update"}</span>
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
        </Colxx>
      </Row>
    </>
  );
};

export default EditUser;
