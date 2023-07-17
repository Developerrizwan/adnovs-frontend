import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Input, Label } from "reactstrap";
import AuthSlider from "../authCarousel";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  apiError,
  registerPublicUser,
  loginUser,
} from "../../../store/actions";
import { useSelector, useDispatch } from "react-redux";
import NotificationManager from "../../../components/Common/NotificationManager";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { Grid } from "@mui/material";

const CoverSignUp = (props) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { logError } = useSelector((state) => ({
    logError: state.Login.error,
  }));

  useEffect(() => {
    if (logError) {
      NotificationManager.error("", logError, 3000, null, null, "");
      dispatch(apiError(""));
    }
  }, [logError]);

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  const validatePassword = (value) => {
    let error;
    let regExp = new RegExp(
      "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$"
    );

    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 6) {
      error = "Value must be longer than 5 characters";
    } else if (!regExp.test(value)) {
      error =
        "Password must have at least One Uppercase, One Number, One Lowercase, And One Special Character";
    }

    return error;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const responseSuccessGoogle = (response) => {
    dispatch(loginUser(response, props.history, "google"));
    // dispatch({
    //   type: "SET_USER",
    //   user: response.profileObj,
    // });
    // dispatch({
    //   type: "SET_TOKEN",
    //   token: response.accessToken,
    // });
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "618283004370-4o0tkge5ja8b9bkti0alkv3rcajo8bjj.apps.googleusercontent.com",
        callback: responseSuccessGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("loginDiv"), {
        // type: "standard",
        theme: "filled_black",
        // size: "small",
        text: "continue_with",
        shape: "pill",
      });

      // google.accounts.id.prompt()
    }
  }, [responseSuccessGoogle]);

  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden m-0">
                  <Row className="justify-content-center g-0">
                    <AuthSlider />

                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <div>
                          <h5 className="text-dark">Sign Up</h5>
                          {/* <p className="text-muted">
                            Get your Neurowonk account now.
                          </p> */}
                        </div>

                        <div id="loginDiv"></div>
                        <div className="mt-4 text-center">
                          <div>
                            {/* <GoogleLogin
                              // render={(renderProps) => (
                              //   <Button
                              //     color="danger"
                              //     to="#"
                              //     className="btn-icon me-1"
                              //     onClick={renderProps.onClick}
                              //   >
                              //     <i className="ri-google-fill fs-16" />
                              //   </Button>
                              // )}
                              className="googleLogin"
                              clientId="578586401941-afd5dm86n6sh978s3bi8f1hk37tsur3f.apps.googleusercontent.com"
                              onSuccess={(res) =>
                                console.log("dddddddddd", res)
                              }
                              onFailure={(err) => {
                                console.log("eeeeeeer", err);
                              }}
                            /> */}
                            <div className="signin-other-title mt-4">
                              <h5
                                className="fs-13 mb-4 title"
                                style={{ color: "#666" }}
                              >
                                OR
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Formik
                            initialValues={{
                              fName: "Manish",
                              lName: "",
                              email: "manish@darsa.ai",
                              password: "efgH123$",
                              confirmPassword: "efgH123$",
                              // username: "Manish",
                              mobileNo: "",
                              companyName: "",
                              companyEmail: "",
                              companyAddress: "",
                              state: undefined,
                              country: undefined,
                            }}
                            validationSchema={Yup.object({
                              fName: Yup.string()
                                .max(20, "Must be 20 characters or less")
                                .trim()
                                .required("First name is Required"),
                              lName: Yup.string()
                                .max(20, "Must be 20 characters or less")
                                .trim()
                                .required("Last name is Required"),
                              email: Yup.string()
                                .email()
                                .required("Email is Required"),
                              mobileNo: Yup.string()
                                .max(10, "Must be 20 characters or less")
                                .trim()
                                .required("Mobile Number is Required"),
                              companyName: Yup.string()
                                .max(20, "Must be 20 characters or less")
                                .trim()
                                .required("Company Name is Required"),
                              companyAddress: Yup.string()
                                .max(20, "Must be 20 characters or less")
                                .trim()
                                .required("Company Address is Required"),
                            })}
                            onSubmit={(values) => {
                              // values.mobile = values.mobile
                              //   ? values.mobile
                              //   : undefined;
                              values.state = values.state
                                ? values.state
                                : undefined;
                              values.country = values.country
                                ? values.country
                                : undefined;
                              console.log("values", values);
                              dispatch(
                                registerPublicUser(values, props.history)
                              );
                            }}
                          >
                            {({ values, errors, touched, setFieldValue }) => (
                              <Form className="av-tooltip tooltip-label-bottom">
                                <Grid container>
                                  <Grid item lg={6} xs={12}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="email"
                                        className="form-label"
                                      >
                                        First Name
                                        <span className="text-danger">*</span>
                                      </label>
                                      <Field
                                        className="form-control"
                                        // placeholder="Enter your first name"
                                        name="fName"
                                      />
                                      {errors.fName && touched.fName && (
                                        <div className="invalid-feedback d-block">
                                          {errors.fName}
                                        </div>
                                      )}
                                    </div>
                                  </Grid>

                                  <Grid item lg={6} xs={12}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="email"
                                        className="form-label"
                                      >
                                        Last Name
                                        <span className="text-danger">*</span>
                                      </label>
                                      <Field
                                        className="form-control"
                                        // placeholder="Enter your Email"
                                        name="lName"
                                      />
                                      {errors.lName && touched.lName && (
                                        <div className="invalid-feedback d-block">
                                          {errors.lName}
                                        </div>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>

                                <div className="mb-3">
                                  <label htmlFor="email" className="form-label">
                                    Email Address
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    // placeholder="Enter your Email"
                                    name="email"
                                  />
                                  {errors.email && touched.email && (
                                    <div className="invalid-feedback d-block">
                                      {errors.email}
                                    </div>
                                  )}
                                </div>

                                {/* <div className="mb-3">
                                  <label
                                    htmlFor="username"
                                    className="form-label"
                                  >
                                    Username
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    placeholder="Enter UserName"
                                    name="username"
                                  />
                                  {errors.username && touched.username && (
                                    <div className="invalid-feedback d-block">
                                      {errors.username}
                                    </div>
                                  )}
                                </div> */}

                                <div className="mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="password"
                                  >
                                    Enter Password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="position-relative auth-pass-inputgroup">
                                    <Field
                                      className="form-control"
                                      // placeholder="Enter Password"
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      validate={validatePassword()}
                                    />

                                    <div
                                      className={[
                                        "btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted",
                                      ].join(" ")}
                                      onClick={() => {
                                        setShowPassword((prev) => !prev);
                                      }}
                                      id="password-addon"
                                    >
                                      <i
                                        className={[
                                          showPassword
                                            ? "ri-eye-close-line"
                                            : "ri-eye-fill",
                                          "align-middle",
                                        ].join(" ")}
                                      ></i>
                                    </div>

                                    {errors.password && touched.password && (
                                      <div className="invalid-feedback d-block">
                                        {errors.password}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label
                                    className="form-label"
                                    htmlFor="confirmPassword"
                                  >
                                    Confirm Password{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div className="position-relative auth-pass-inputgroup">
                                    <Field
                                      className="form-control"
                                      // placeholder="Enter Password"
                                      type={showPassword ? "text" : "password"}
                                      name="confirmPassword"
                                      validate={validatePassword()}
                                    />

                                    <div
                                      className={[
                                        "btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted",
                                      ].join(" ")}
                                      onClick={() => {
                                        setShowPassword((prev) => !prev);
                                      }}
                                      id="password-addon"
                                    >
                                      <i
                                        className={[
                                          showPassword
                                            ? "ri-eye-close-line"
                                            : "ri-eye-fill",
                                          "align-middle",
                                        ].join(" ")}
                                      ></i>
                                    </div>

                                    {errors.confirmPassword &&
                                      touched.confirmPassword && (
                                        <div className="invalid-feedback d-block">
                                          {errors.confirmPassword}
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label
                                    htmlFor="mobileNo"
                                    className="form-label"
                                  >
                                    Mobile Number
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    // placeholder="Enter your Email"
                                    name="mobileNo"
                                  />
                                  {errors.mobileNo && touched.mobileNo && (
                                    <div className="invalid-feedback d-block">
                                      {errors.mobileNo}
                                    </div>
                                  )}
                                </div>

                                <div className="mb-3">
                                  <label
                                    htmlFor="companyName"
                                    className="form-label"
                                  >
                                    Company Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    // placeholder="Enter your Email"
                                    name="companyName"
                                  />
                                  {errors.companyName &&
                                    touched.companyName && (
                                      <div className="invalid-feedback d-block">
                                        {errors.companyName}
                                      </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                  <label
                                    htmlFor="companyEmail"
                                    className="form-label"
                                  >
                                    Company Email Address
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    // placeholder="Enter your Email"
                                    name="companyEmail"
                                  />
                                  {errors.companyEmail &&
                                    touched.companyEmail && (
                                      <div className="invalid-feedback d-block">
                                        {errors.companyEmail}
                                      </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                  <label
                                    htmlFor="companyAddress"
                                    className="form-label"
                                  >
                                    Company Address
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    // placeholder="Enter your Email"
                                    name="companyAddress"
                                  />
                                  {errors.companyAddress &&
                                    touched.companyAddress && (
                                      <div className="invalid-feedback d-block">
                                        {errors.companyAddress}
                                      </div>
                                    )}
                                </div>

                                <Grid container>
                                  <Grid item xs={12} lg={6}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="state"
                                        className="form-label"
                                      >
                                        State
                                      </label>
                                      <Select
                                        options={Country.getAllCountries().map(
                                          (state) => {
                                            return {
                                              label: state.name,
                                              value: state.isoCode,
                                            };
                                          }
                                        )}
                                        value={selectedCountry}
                                        onChange={(data) => {
                                          setFieldValue("country", data.label);
                                          setSelectedCountry(data);
                                        }}
                                      />
                                      {errors.state && touched.state && (
                                        <div className="invalid-feedback d-block">
                                          {errors.state}
                                        </div>
                                      )}
                                    </div>
                                  </Grid>
                                  <Grid item xs={12} lg={6}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="country"
                                        className="form-label"
                                      >
                                        Country
                                      </label>
                                      <Select
                                        options={Country.getAllCountries().map(
                                          (state) => {
                                            return {
                                              label: state.name,
                                              value: state.isoCode,
                                            };
                                          }
                                        )}
                                        value={selectedCountry}
                                        onChange={(data) => {
                                          setFieldValue("country", data.label);
                                          setSelectedCountry(data);
                                        }}
                                      />
                                      {errors.country && touched.country && (
                                        <div className="invalid-feedback d-block">
                                          {errors.country}
                                        </div>
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>

                                {/* <div className="form-check">
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id="auth-remember-check"
                                  />
                                  <Label
                                    className="form-check-label"
                                    htmlFor="auth-remember-check"
                                  >
                                    Agree to terms and conditions
                                  </Label>
                                </div> */}
                                {/* <div className="mb-4">
                                  <p className="mb-0 fs-12 text-muted fst-italic">
                                    By registering you agree to the Neurowonk{" "}
                                    <Link
                                      to="#"
                                      className="text-primary text-decoration-underline fst-normal fw-medium"
                                    >
                                      Terms of Use
                                    </Link>
                                  </p>
                                </div> */}

                                <div className="mt-4">
                                  <button
                                    className="btn btn-success w-100"
                                    type="submit"
                                  >
                                    Sign Up
                                  </button>
                                </div>

                                {/* <div className="mt-4 text-center">
                                  <div className="signin-other-title">
                                    <h5 className="fs-13 mb-4 title text-muted">
                                      Create account with
                                    </h5>
                                  </div>

                                  <div>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-icon waves-effect waves-light me-1"
                                    >
                                      <i className="ri-facebook-fill fs-16"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-icon waves-effect waves-light me-1"
                                    >
                                      <i className="ri-google-fill fs-16"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-dark btn-icon waves-effect waves-light me-1"
                                    >
                                      <i className="ri-github-fill fs-16"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-info btn-icon waves-effect waves-light"
                                    >
                                      <i className="ri-twitter-fill fs-16"></i>
                                    </button>
                                  </div>
                                </div> */}
                              </Form>
                            )}
                          </Formik>
                        </div>

                        <div className="mt-5 text-center">
                          <p className="mb-0">
                            Have an account ?{" "}
                            <Link
                              to="/auth-signin-cover"
                              className="fw-semibold text-primary text-decoration-underline"
                            >
                              {" "}
                              Login
                            </Link>{" "}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <footer className="footer">
          <Container>
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Velzon. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default CoverSignUp;
