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

const ResetSuccessful = (props) => {
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
                  <div className="p-lg-5 p-4 text-center">
                    <div>
                      <h2 className="text-dark text-center">
                        Your password has been successfully reset
                      </h2>

                      <div className="mt-4">
                        <Button color="success" className="w-75" type="submit">
                          Proceed to Login
                        </Button>
                      </div>
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

export default ResetSuccessful;
