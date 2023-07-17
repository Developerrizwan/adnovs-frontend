import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "reactstrap";
import API from "../../../helpers/API";
import NotificationManager from "../../../components/Common/NotificationManager";

import AuthSlider from "../authCarousel";
import axios from "axios";

const CoverPasswReset = () => {
  const history = useHistory();

  const [openFields, setOpenFields] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newOtp, setNewOpt] = useState("");

  const getOpt = () => {
    const sendEmail = {
      email: email,
    };
    API.post("/api/forget-password/otp", sendEmail)
      .then((response) => {
        const data = response.data;
        setOpenFields(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verifyOtp = async () => {
    const passwordObj = {
      email: email,
      new_password: newPassword,
      otp: newOtp,
    };
    await API.post("/api/forget-password/verify", passwordObj)
      .then((response) => {
        const data = response.data;
        NotificationManager.success(
          "",
          "Password updated successfully.",
          3000,
          null,
          null,
          ""
        );
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });

    setOpenFields(false);
    setNewOpt("");
  };

  return (
    <React.Fragment>
      <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div className="bg-overlay"></div>
        <div className="auth-page-content overflow-hidden pt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <Card className="overflow-hidden">
                  <Row className="justify-content-center g-0">
                    <AuthSlider />

                    <Col lg={6}>
                      <div className="p-lg-5 p-4">
                        <h5 className="text-dark">Enter your Email Address</h5>
                        {/* <p className="text-muted">Reset password with Neurowonk</p> */}

                        <div className="mt-2 text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/rhvddzym.json"
                            trigger="loop"
                            colors="primary:#0ab39c"
                            className="avatar-xl"
                            style={{ width: "120px", height: "120px" }}
                          ></lord-icon>
                        </div>

                        {/* <div
                          className="alert alert-borderless alert-warning text-center mb-2 mx-2"
                          role="alert"
                        >
                          Enter your email and instructions will be sent to you!
                        </div> */}
                        <div className="p-2">
                          <form>
                            <div className="mb-4">
                              <label className="form-label">Email Address</label>
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                // placeholder="Enter email address"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>

                            {openFields && (
                              <>
                                <div className="mb-4">
                                  <label className="form-label">OTP</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="otp"
                                    placeholder="Enter OTP"
                                    required
                                    onChange={(e) => setNewOpt(e.target.value)}
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="form-label">
                                    Change Password
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="change-password"
                                    placeholder="Enter New Password"
                                    required
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                  />
                                </div>
                              </>
                            )}

                            <div className="text-center mt-4">
                              <Button
                                color="success"
                                className="w-100"
                                type="submit"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  if (openFields) verifyOtp();
                                  else getOpt();
                                }}
                              >
                                {openFields === true ? "Submit" : "Send OTP"}
                              </Button>
                            </div>
                          </form>
                        </div>

                        <div className="mt-5 text-left">
                          <p className="mb-0">
                            Remember the password? 
                            <Link
                              to="/auth-signin-cover"
                              className="fw-bold text-dark text-decoration-underline"
                            >
                              {" "}
                              Sign in{" "}
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
        {/* <footer className="footer">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <p className="mb-0">
                    &copy; {new Date().getFullYear()} Velzon. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </footer> */}
      </div>
    </React.Fragment>
  );
};

export default CoverPasswReset;
