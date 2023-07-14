import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { Card, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import VictoriaMatrics from "./AddVictoriaMatric";
import AddMqtt from "./AddMqtt";
import AddInflux from "./AddInflux";
import NotificationManager from "../../components/Common/NotificationManager";

const EditServer = (props) => {
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  const [openedSteps, setOpenedSteps] = useState([0]);
  const [mqtt_types, setMqttTypes] = useState([]);
  const [vm_types, setVMTypes] = useState([]);

  const [openedVMSteps, setOpenedVMSteps] = useState([0]);

  const [influx_types, setInfluxTypes] = useState([]);
  const [openedInfluxSteps, setOpenedInfluxSteps] = useState([0]);

  const [serverData, setServerData] = useState(null);

  const handleSteps = (step) => {
    let ops = [...openedSteps];
    if (ops.includes(step)) {
      ops = ops.filter((stp) => stp !== step);
    } else {
      ops.push(step);
    }

    setOpenedSteps(ops);
  };

  const handleVMSteps = (step) => {
    let ops = [...openedVMSteps];
    if (ops.includes(step)) {
      ops = ops.filter((stp) => stp !== step);
    } else {
      ops.push(step);
    }

    setOpenedVMSteps(ops);
  };

  const handleInfluxSteps = (step) => {
    let ops = [...openedInfluxSteps];
    if (ops.includes(step)) {
      ops = ops.filter((stp) => stp !== step);
    } else {
      ops.push(step);
    }

    setOpenedInfluxSteps(ops);
  };

  const handleData = async () => {
    await apiAuth
      .get("/api/server/")
      .then((response) => {
        let data = response.data.filter(
          (dd) => dd.id === Number(props.match.params.serverId)
        );

        if (data.length > 0) {
          data = { ...data[0] };

          setServerData(data);

          if (data.mqtts?.length > 0) {
            setMqttTypes(data.mqtts);
          }

          if (data.victoriamatrics?.length > 0) {
            setVMTypes(data.victoriamatrics);
          }

          if (data.influx?.length > 0) {
            setInfluxTypes(data.influx);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Edit Server"
            pageTitle="Settings"
            back_button={true}
            history={props.history}
          />
        </Container>
        {serverData ? (
          <Row mb="4">
            <Colxx lg="12">
              <div className="card">
                <div className="card-body">
                  <Formik
                    initialValues={{
                      name: serverData?.name ? serverData?.name : "",
                      server_ip: serverData?.server_ip
                        ? serverData?.server_ip
                        : "",
                      port: serverData?.port ? serverData?.port : "",
                      talk: serverData?.talk ? serverData?.talk : "",
                      username: serverData?.username
                        ? serverData?.username
                        : "",
                      password: serverData?.password
                        ? serverData?.password
                        : "",
                    }}
                    validationSchema={Yup.object({
                      name: Yup.string()
                        .max(20, "Must be 20 characters or less")
                        .trim()
                        .required("Required"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      const url = `/api/server/${props.match.params.serverId}/`;

                      if (mqtt_types.length > 0) values.mqtts = [...mqtt_types];
                      if (vm_types.length > 0)
                        values.victoriamatrics = [...vm_types];
                      if (influx_types.length > 0)
                        values.influx = [...influx_types];

                      apiAuth
                        .patch(url, values)
                        .then((response) => {
                          if (response.status === 200) {
                            NotificationManager.success(
                              "",
                              `Server Updated Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );
                            props?.history?.goBack();
                          } else {
                            NotificationManager.error(
                              "",
                              `Server Update Error`,
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
                            `Server Update Error`,
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
                            <Label htmlFor="name">Server Name</Label>
                            <Field
                              className="form-control"
                              name="name"
                              placeholder="Server Name"
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
                          <div className="form-group mb-3">
                            <Label htmlFor="server_ip">Server IP</Label>
                            <Field
                              className="form-control"
                              name="server_ip"
                              placeholder="Server IP"
                              type="text"
                            />
                            <ErrorMessage
                              name="server_ip"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="port">Server PORT</Label>
                            <Field
                              className="form-control"
                              name="port"
                              placeholder="Server PORT"
                              type="text"
                            />
                            <ErrorMessage
                              name="port"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="talk">Server TALK</Label>
                            <Field
                              className="form-control"
                              name="talk"
                              placeholder="Server TALK"
                              type="text"
                            />
                            <ErrorMessage
                              name="talk"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="username">Username</Label>
                            <Field
                              className="form-control"
                              name="username"
                              placeholder="Username"
                              type="text"
                            />
                            <ErrorMessage
                              name="username"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                        <Colxx lg="6">
                          <div className="form-group mb-3">
                            <Label htmlFor="password">Password</Label>
                            <div className="pass-wrapper">
                              <Field
                                className="form-control"
                                name="password"
                                type={is_password_hidden ? "password" : "text"}
                                placeholder="Password"
                              />
                              {is_password_hidden ? (
                                <i
                                  className="fa fa-eye"
                                  onClick={() =>
                                    set_is_password_hidden((data) => !data)
                                  }
                                ></i>
                              ) : (
                                <i
                                  className="fa fa-eye-slash"
                                  onClick={() =>
                                    set_is_password_hidden((data) => !data)
                                  }
                                ></i>
                              )}
                            </div>
                            <ErrorMessage
                              name="password"
                              render={(msg) => (
                                <div className="text-danger">{msg}</div>
                              )}
                            />
                          </div>
                        </Colxx>
                      </Row>
                      <h4 className="d-flex align-items-center">
                        Influx Server
                        <i
                          className="ri-add-circle-fill float-right cursor-pointer text-primary ml-3"
                          onClick={() => {
                            let infs = influx_types;
                            infs.push({
                              port: "",
                              server_url: "",
                              token: "",
                              bucket: "",
                              measurement: "",
                              future: "",
                              org: "",
                            });

                            setInfluxTypes(infs);
                            setOpenedInfluxSteps([infs.length - 1]);
                          }}
                          style={{
                            fontSize: "25px",
                            //   color: "#e2863b",
                          }}
                        ></i>
                      </h4>
                      <Separator className="mb-4"></Separator>
                      <Row className="mb-4">
                        {influx_types?.map((influx, index) => {
                          return (
                            <AddInflux
                              key={influx}
                              influx={influx}
                              influx_types={influx_types}
                              index={index}
                              openedInfluxSteps={openedInfluxSteps}
                              setInfluxTypes={setInfluxTypes}
                              handleInfluxSteps={handleInfluxSteps}
                            />
                          );
                        })}
                      </Row>
                      <h4 className="d-flex align-items-center">
                        Mqtt
                        <i
                          className="ri-add-circle-fill float-right cursor-pointer text-primary ml-3"
                          onClick={() => {
                            let mqts = [...mqtt_types];
                            mqts.push({
                              port: "",
                              url: "",
                              username: "",
                              password: "",
                              subscription_channel: "",
                              publish_channel: "",
                              admin_topic: "",
                            });
                            setOpenedSteps([mqts.length - 1]);
                            setMqttTypes(mqts);
                          }}
                          style={{
                            fontSize: "25px",
                            //   color: "#e2863b",
                          }}
                        ></i>
                      </h4>
                      <Separator className="mb-4"></Separator>
                      <Row className="mb-4">
                        {mqtt_types?.map((mqtt, index) => {
                          return (
                            <AddMqtt
                              key={mqtt}
                              index={index}
                              mqtt={mqtt}
                              mqtt_types={mqtt_types}
                              openedSteps={openedSteps}
                              setMqttTypes={setMqttTypes}
                              handleSteps={handleSteps}
                            />
                          );
                        })}
                      </Row>

                      <h4 className="d-flex align-items-center">
                        Victoria Matrics
                        <i
                          className="ri-add-circle-fill float-right cursor-pointer text-primary ml-3"
                          onClick={() => {
                            let vms = vm_types;
                            vms.push({
                              port: "",
                              server_url: "",
                              token: "",
                              bucket: "",
                              measurement: "",
                              future: "",
                              org: "",
                            });

                            setVMTypes(vms);
                            setOpenedVMSteps([vms.length - 1]);
                          }}
                          style={{
                            fontSize: "25px",
                            //   color: "#e2863b",
                          }}
                        ></i>
                      </h4>
                      <Separator className="mb-4"></Separator>
                      <Row className="mb-4">
                        {vm_types?.map((vm, index) => {
                          return (
                            <VictoriaMatrics
                              key={vm}
                              vm={vm}
                              vm_types={vm_types}
                              index={index}
                              openedVMSteps={openedVMSteps}
                              setVMTypes={setVMTypes}
                              handleVMSteps={handleVMSteps}
                            />
                          );
                        })}
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
                          className="btn btn-light float-right"
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
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default EditServer;
