import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

// import avatar from "../../assets/images/users/avatar-1.jpg";
import avatar from "../../assets/images/users/user-dummy-img.jpg";

// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import { Colxx } from "../../components/Common/CustomBootstrap";

const UserProfile = () => {
  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [idx, setidx] = useState("");
  const [userName, setUserName] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");

  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));

  useEffect(() => {
    // if (sessionStorage.getItem("authUser")) {
    //   const obj = JSON.parse(sessionStorage.getItem("authUser"));
    //   if (!isEmpty(user)) {
    //     obj.data.username = user?.username;
    //     sessionStorage.removeItem("authUser");
    //     sessionStorage.setItem("authUser", JSON.stringify(obj));
    //   }

    //   setUserName(obj.data?.username);
    //   setemail(obj.data?.email);
    //   setidx(obj.data?._id || "1");

    //   setTimeout(() => {
    //     dispatch(resetProfileFlag());
    //   }, 3000);
    // }

    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      console.log(obj, "auth obj");
      if (!isEmpty(user)) {
        obj.username = user?.username;
        obj.email = user?.email;
        obj.mobile = user?.mobile;
        localStorage.removeItem("authUser");
        localStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj?.username || "user");
      setemail(obj?.email || "");
      setidx(obj?.id || "");
      setMobile(obj?.mobile || "");
      setDesignation(obj?.designation || "");

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: userName || "user",
      idx: idx || "",
      email: email || "",
      mobile: mobile || "",
      designation: designation || "",
      no_of_projects_done: "0",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
      password: Yup.string(),
      email: Yup.string().required("Required"),
      // mobile: Yup.number().integer().positive().required("Required"),
      // designation: Yup.string().required("Required"),
      //   no_of_projects_done: Yup.number()
      //     .integer()
      //     .positive()
      //     .required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  const handleUpdate = () => {};

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? (
                <Alert color="success">Username Updated To {userName}</Alert>
              ) : null}

              <Card
                style={{
                  background: "#f3f3f9",
                  boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                }}
              >
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || "Admin"}</h5>
                        <p className="mb-1">Email Id : {email}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update User Profile</h4>

          <Card
            style={{
              background: "#f3f3f9",
              boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
            }}
          >
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  // return false;
                }}
              >
                <div className="form-group">
                  <Row>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">User Name</Label>
                      <Input
                        name="username"
                        className="form-control"
                        placeholder="Enter User Name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username || ""}
                        invalid={
                          validation.touched.username &&
                          validation.errors.username
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.username &&
                      validation.errors.username ? (
                        <FormFeedback type="invalid">
                          {validation.errors.username}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">User Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter User Email"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                  </Row>

                  <Row>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">Mobile</Label>
                      <Input
                        name="mobile"
                        className="form-control"
                        placeholder="Enter Moile number"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mobile || ""}
                        invalid={
                          validation.touched.mobile && validation.errors.mobile
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.mobile && validation.errors.mobile ? (
                        <FormFeedback type="invalid">
                          {validation.errors.mobile}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">Designation</Label>
                      <Input
                        name="designation"
                        className="form-control"
                        placeholder="Enter Your Designation"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.designation || ""}
                        invalid={
                          validation.touched.designation &&
                          validation.errors.designation
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.designation &&
                      validation.errors.designation ? (
                        <FormFeedback type="invalid">
                          {validation.errors.designation}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                  </Row>
                  <Row>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">
                        Number of Projects done
                      </Label>
                      <Input
                        name="no_of_projects_done"
                        className="form-control"
                        disabled={true}
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.no_of_projects_done || ""}
                        invalid={
                          validation.touched.no_of_projects_done &&
                          validation.errors.no_of_projects_done
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.no_of_projects_done &&
                      validation.errors.no_of_projects_done ? (
                        <FormFeedback type="invalid">
                          {validation.errors.no_of_projects_done}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                    <Colxx lg="6" className="mb-3">
                      <Label className="form-label">Change Password</Label>
                      <Input
                        name="password"
                        className="form-control"
                        placeholder="Enter Your New Password"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password || ""}
                        invalid={
                          validation.touched.password &&
                          validation.errors.password
                            ? true
                            : false
                        }
                        style={{ background: "#f3f3f9" }}
                      />
                      {validation.touched.password &&
                      validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                    </Colxx>
                  </Row>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    style={{ background: "#1062fe" }}
                    // onClick={handleUpdate}
                  >
                    Update
                  </Button>{" "}
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
