import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Input, Label, Row, Button } from "reactstrap";
import AuthSlider from "../authCarousel";
import { Formik, Form, Field } from "formik";
import { apiError, loginUser } from "../../../store/actions";
import { useSelector, useDispatch } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import NotificationManager from "../../../components/Common/NotificationManager";
import { GoogleLogin } from "react-google-login";

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const { logError } = useSelector((state) => ({
    logError: state.Login.error,
  }));
  const [showPassword, setShowPassword] = useState(false);
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
      {/* <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100"> */}
      {/* <div className="bg-overlay"></div> */}
      <div className=" overflow-hidden ">
        <Row>
          <Col lg={12}>
            <Card className="overflow-hidden h-100 mb-0">
              <Row className="g-0" style={{ height: "100vh" }}>
                <AuthSlider />

                <Col lg={6} style={{ margin: "auto" }}>
                  <div className="p-lg-5 p-4">
                    <div>
                      <h1 className="text-dark">Reset Password</h1>
                      {/* <p className="text-muted">
                        Sign in to continue to Neurowonk.
                      </p> */}
                    </div>

                    <div className="mt-4">
                      <Formik
                        initialValues={{
                          // email: "",
                          password: "",
                          cpassword: ""
                        }}
                        onSubmit={(values) => {
                          dispatch(loginUser(values, props.history));
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form className="av-tooltip tooltip-label-bottom">
                            {/* <div className="mb-3">
                              <Label htmlFor="email" className="form-label">
                                Email
                              </Label>
                              <Field
                                className="form-control"
                                name="email"
                                validate={validateEmail()}
                              />
                              {errors.email && touched.email && (
                                <div className="invalid-feedback d-block">
                                  {errors.email}
                                </div>
                              )}
                            </div> */}

                            <div className="mb-3">
                              <div className="float-end">
                                {/* <Link
                                  to="/auth-pass-reset-cover"
                                  className="text-muted"
                                >
                                  Forgot password?
                                </Link> */}
                              </div>
                              <Label
                                className="form-label"
                                htmlFor="password-input"
                              >
                               Enter Password
                              </Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Field
                                  className="form-control"
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  validate={validatePassword()}
                                />

                                <div
                                  className={[
                                    "btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted",
                                  ].join(" ")}
                                  onClick={(e) => {
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
                              {/* <div className="float-end">
                                <Link
                                  to="/auth-pass-reset-cover"
                                  className="text-muted"
                                >
                                  Forgot password?
                                </Link>
                              </div> */}
                              <Label
                                className="form-label"
                                htmlFor="password-input"
                              >
                                Re-Enter Password
                              </Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Field
                                  className="form-control"
                                  type={showPassword ? "text" : "password"}
                                  name="cpassword"
                                  validate={validatePassword()}
                                />

                                <div
                                  className={[
                                    "btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted",
                                  ].join(" ")}
                                  onClick={(e) => {
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

                                {errors.cpassword && touched.cpassword && (
                                  <div className="invalid-feedback d-block">
                                    {errors.cpassword}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* <div className="mb-3">
                              <ReCAPTCHA
                                sitekey="6LenrXQlAAAAANR9irUzt8JQXOJgYAOquPe1EpC9"
                                onChange={(e) => {
                                  console.log("Captcha", e);
                                }}
                              />
                            </div> */}

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
                                Remember me
                              </Label>
                            </div> */}

                            <div className="mt-4">
                              <Button
                                color="success"
                                className="w-100"
                                type="submit"
                              >
                                Submit
                              </Button>
                            </div>

                            {/* <div className="mt-4 text-center">
                                  <div className="signin-other-title">
                                    <h5 className="fs-14 mb-4 title">
                                      Sign In with
                                    </h5>
                                  </div>

                                  <div>
                                    <Button
                                      color="primary"
                                      className="btn-icon me-1"
                                    >
                                      <i className="ri-facebook-fill fs-16"></i>
                                    </Button>
                                    <Button
                                      color="danger"
                                      className="btn-icon me-1"
                                    >
                                      <i className="ri-google-fill fs-16"></i>
                                    </Button>
                                    <Button
                                      color="dark"
                                      className="btn-icon me-1"
                                    >
                                      <i className="ri-github-fill fs-16"></i>
                                    </Button>
                                    <Button color="info" className="btn-icon">
                                      <i className="ri-twitter-fill fs-16"></i>
                                    </Button>
                                  </div>
                                </div> */}
                          </Form>
                        )}
                      </Formik>
                    </div>

                    {/* <div className="mt-4 text-center">
                      <div>
                        
                        <div className="signin-other-title mt-4">
                          <h5
                            className="fs-13 mb-4 title"
                            style={{ color: "#666" }}
                          >
                            OR
                          </h5>
                        </div>
                      </div>
                    </div> */}

                    {/* <div
                      id="loginDiv"
                      style={{ textAlign: "-webkit-center", marginTop: "25px" }}
                    ></div> */}

                    <div className="mt-5 text-center">
                      <p className="mb-0">
                        Remember the password ?{" "}
                        <a
                          href="/login"
                          className="fw-bold text-primary text-decoration-underline"
                        >
                          {" "}
                          Sigin
                        </a>{" "}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>

      {/* <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Neurowonk{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Nexactly AI
                    Solutions
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer> */}
      {/* </div> */}
    </React.Fragment>
  );
};

export default ResetPassword;
