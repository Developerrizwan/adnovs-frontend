import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { Card } from "reactstrap";
import Select from "react-select";
import NotificationManager from "../../components/Common/NotificationManager";

const AddUser = (props) => {
  const history = useHistory();
  const [selectedRole, setSelectedRole] = useState(null);

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

  useEffect(() => {
    if (props.isEdit) {
      const sel = RoleOptions.find(
        (dd) => dd.value === props.userData?.groups[0]
      );
      setSelectedRole(sel);
    }
  }, []);

  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      <div className={`${props.isEdit ? "" : "page-content"}`}>
        {props.isEdit ? (
          <></>
        ) : (
          <div
            className="mb-5 mt-3"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h2 className="mx-3">Create User </h2>

            <button className="btn btn-danger" onClick={goBack}>
              Back
            </button>
          </div>
        )}
        <Row mb="4">
          <Colxx lg="12">
            <Card className="p-3" style={{ background: "white" }}>
              <h2>User Information</h2>
              <p>Fill User details here.</p>
              <div className="card-body">
                <Formik
                  initialValues={{
                    first_name: props.userData?.first_name || "",
                    last_name: props.userData?.last_name || "",
                    password: props.userData?.password || "",
                    mobile: props.userData?.mobile || "",
                    email: props.userData?.email || "",
                    role: props.userData?.groups[0] || "",
                  }}
                  validationSchema={Yup.object({
                    first_name: Yup.string()
                      .max(50, "Must be 50 characters or less")
                      .trim()
                      .required("First Name is Required"),
                    last_name: Yup.string()
                      .max(50, "Must be 50 characters or less")
                      .trim()
                      .required("Last Name is Required"),
                    password: Yup.string().required("Password is Required"),
                    role: Yup.string().ensure().required("Role is Required!"),
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
                    if (props.isEdit) {
                      const url = `/api/user/delete/${props.userData.id}/`;
                      apiAuth
                        .patch(url, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `User Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.isEdit
                            ? props.closeAddPopup()
                            : props?.history?.push("/user-management");
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
                    } else {
                      const url = "/api/user-create/";
                      apiAuth
                        .post(url, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `User Added Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props?.history?.push("/user-management");
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
                    }
                  }}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="av-tooltip tooltip-label-bottom ">
                      <Row>
                        <Colxx lg="6">
                          {" "}
                          <div className="form-group mb-3">
                            <Label htmlFor="first_name">
                              First Name
                              <span className="text-danger">*</span>
                            </Label>
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
                            <Label htmlFor="last_name">
                              Last Name
                              <span className="text-danger">*</span>
                            </Label>
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
                            <Label htmlFor="email">
                              Email
                              <span className="text-danger">*</span>
                            </Label>
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
                          <div className="form-group mb-3">
                            <Label htmlFor="mobile">
                              Mobile Number
                              <span className="text-danger">*</span>
                            </Label>
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
                            <Label htmlFor="password">
                              Password
                              <span className="text-danger">*</span>
                            </Label>
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
                          {" "}
                          <div className="form-group">
                            <Label htmlFor="role">
                              Role
                              <span className="text-danger">*</span>
                            </Label>
                            <Select
                              value={selectedRole}
                              options={RoleOptions}
                              onChange={(data) => {
                                setSelectedRole(data);
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
