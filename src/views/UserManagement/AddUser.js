import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { Card, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
// import VictoriaMatrics from "./AddVictoriaMatric";
// import AddMqtt from "./AddMqtt";
// import AddInflux from "./AddInflux";
import NotificationManager from "../../components/Common/NotificationManager";

const AddUser = (props) => {
  const history = useHistory();

  const [is_password_hidden, set_is_password_hidden] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [company, setCompany] = useState(null);
  const [workshopData, setWorkshopData] = useState(null);
  const [centerData, setCenterData] = useState(null);
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [centerId, setCenterId] = useState(null);
  const [workshopId, setWorkshopId] = useState([]);

  const RoleOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const getContactCenter = () => {
    apiAuth
      .get("/api/contact_center/")
      .then((response) => {
        let data = response.data.filter(
          (ws) =>
            String(ws.company) ===
            String("66548c7c-6cd2-4bdc-bace-ac1c0128327c")
        );
        setCenterData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getWorkshop = () => {
    apiAuth
      .get("/api/workshop/")
      .then((response) => {
        let data = response.data.filter(
          (ws) =>
            String(ws.company) ===
            String("66548c7c-6cd2-4bdc-bace-ac1c0128327c")
        );

        setWorkshopData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStates = () => {
    apiAuth
      .get("/api/state/read")
      .then((response) => {
        let data = response.data;
        data = data.map((dd, i) => {
          dd["sno"] = i + 1;
          return dd;
        });
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
        setCities(data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error("", `Cities Get Error`, 3000, null, null, "");
      });
  };

  // useEffect(() => {
  //   getWorkshop();
  //   getContactCenter();
  //   getStates();
  //   getRegions();
  //   getCities();
  // }, []);

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <div className="page-content">
        {/* <Container fluid>
          <BreadCrumb
            title="Add User"
            pageTitle="Settings"
            back_button={true}
            history={props.history}
          />
        </Container> */}
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Create User </h2>

          <button className="btn btn-danger" onClick={goBack}>
            Back
          </button>
        </div>
        <Row mb="4">
          <Colxx lg="12">
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <h2>User Information</h2>
              <p>Fill User details here.</p>
              <div className="card-body">
                <Formik
                  initialValues={{
                    first_name: "",
                    last_name: "",
                    password: "",
                    // user_name: "",
                    mobile: "",
                    email: "",
                    role: "",
                    // workshop_id: "",
                    // contact_center_id: "",
                    // city: [],
                    // state: [],
                    // region: [],
                  }}
                  validationSchema={Yup.object({
                    first_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .trim()
                      .required("First Name is Required"),
                    last_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .trim()
                      .required("Last Name is Required"),
                    password: Yup.string().required("Password is Required"),
                    role: Yup.string().required("Role is Required!"),
                    // user_name: Yup.string().ensure(),
                    mobile: Yup.string()
                      .matches(
                        /^[0-9]{10}$/,
                        "Mobile number must be exactly 10 digits"
                      )
                      .required("Mobile Number is Required"),
                    email: Yup.string().email().required("Email is Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    const company = JSON.parse(
                      localStorage.getItem("authUser")
                    )?.company_id;
                    values["company_id"] = company;
                    const url = "/api/user-create/";
                    apiAuth
                      .post(url, values)
                      .then((response) => {
                        // if (response.status === 200) {
                        NotificationManager.success(
                          "",
                          `User Added Successfully`,
                          3000,
                          null,
                          null,
                          ""
                        );
                        props?.history?.push("/user-management");
                        // } else {
                        //   NotificationManager.error(
                        //     "",
                        //     `User Add Error`,
                        //     3000,
                        //     null,
                        //     null,
                        //     ""
                        //   );
                        // }
                      })
                      .catch((error) => {
                        NotificationManager.error(
                          "",
                          `User Add Error`,
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
                            <Label htmlFor="first_name">First Name</Label>
                            <Field
                              className="form-control"
                              name="first_name"
                              placeholder="First Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                            <ErrorMessage
                              name="first_name"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          {" "}
                          <div className="form-group mb-3">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Field
                              className="form-control"
                              name="last_name"
                              placeholder="Last Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                            <ErrorMessage
                              name="last_name"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="password">Password</Label>
                            <Field
                              className="form-control"
                              name="password"
                              placeholder="Password"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                            <ErrorMessage
                              name="password"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>

                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Field
                              className="form-control"
                              name="mobile"
                              placeholder="Mobile Number"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                            <ErrorMessage
                              name="mobile"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="email">Email</Label>
                            <Field
                              className="form-control"
                              name="email"
                              placeholder="Email"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                            <ErrorMessage
                              name="email"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          {" "}
                          <div className="form-group">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              options={RoleOptions}
                              onChange={(data) => {
                                setSelectedRole(data.value);
                                setFieldValue("role", data.value);
                              }}
                              styles={customStyles}
                            />
                            <ErrorMessage
                              name="role"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
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
                          color="success"
                          // style={{ backgroundColor: "#29B6F6" }}
                          className={`btn-shadow btn-multiple-state float-right ${
                            props.loading ? "show-spinner" : ""
                          }`}
                          // size="lg"
                        >
                          <span className="spinner d-inline-block">
                            <span className="bounce1" />
                            <span className="bounce2" />
                            <span className="bounce3" />
                          </span>
                          <span className="label">
                            {props.addText || "Submit"}
                          </span>
                        </Button>{" "}
                        {/* <Button
                          className="btn btn-light float-right"
                          type="reset"
                          onClick={() => {
                            props.history.goBack();
                          }}
                        >
                          {" "}
                          Cancel{" "}
                        </Button> */}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Card>
          </Colxx>
        </Row>
      </div>
    </>
  );
};

export default AddUser;
