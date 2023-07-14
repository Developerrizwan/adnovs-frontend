import React, { useState } from "react";
import { Row, Label } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { Card } from "reactstrap";

const AddMqtt = ({
  index,
  mqtt,
  mqtt_types,
  setMqttTypes,
  openedSteps,
  handleSteps,
}) => {
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  return (
    <>
      <Colxx
        lg="12"
        className="d-flex flex-column align-items-center my-2"
        key={index}
      >
        <Row className="w-100">
          <Colxx lg="12">
            <Card className="p-2">
              <Row>
                <Colxx
                  lg="12"
                  className="d-flex justify-content-between align-items-center px-3"
                >
                  <div>
                    {index + 1}. {mqtt.url}
                  </div>
                  <div className="d-flex align-items-center">
                    <i
                      onClick={() => {
                        handleSteps(index);
                      }}
                      className={
                        openedSteps.includes(index)
                          ? "ri-arrow-up-s-line float-left cursor-pointer text-primary fa-2x"
                          : "ri-arrow-down-s-line float-left cursor-pointer text-primary fa-2x"
                      }
                      style={{
                        fontSize: "24px",
                        //   color: "#e2863b",
                      }}
                    ></i>
                    <i
                      className="ri-delete-bin-5-line float-right cursor-pointer ml-2"
                      onClick={() => {
                        let mqts = [...mqtt_types];
                        mqts.splice(index, 1);
                        setMqttTypes([...mqts]);
                      }}
                      style={{
                        fontSize: "18px",
                        //   color: "#e2863b",
                      }}
                    ></i>
                  </div>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
        </Row>

        {openedSteps.includes(index) ? (
          <Row className="mt-1 w-100 justify-content-center">
            <Colxx lg="11">
              <Row>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label>MQTT PORT</Label>
                    <input
                      value={mqtt.port}
                      className="form-control"
                      placeholder="MQTT PORT"
                      type="text"
                      onChange={(e) => {
                        let mqs = [...mqtt_types];
                        mqs[index]["port"] = e.target.value;
                        setMqttTypes([...mqs]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="mqtturl">MQTT URL</Label>
                    <input
                      value={mqtt.url}
                      className="form-control"
                      name="mqtturl"
                      placeholder="MQTT URL"
                      type="text"
                      onChange={(e) => {
                        let mqts = [...mqtt_types];

                        mqts[index]["url"] = e.target.value;

                        setMqttTypes([...mqts]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="mqttusername">MQTT Username</Label>
                    <input
                      value={mqtt.username}
                      className="form-control"
                      name="mqttusername"
                      placeholder="MQTT Username"
                      type="text"
                      onChange={(e) => {
                        let mqts = [...mqtt_types];

                        mqts[index]["username"] = e.target.value;

                        setMqttTypes([...mqts]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="">MQTT Password</Label>
                    <div className="pass-wrapper">
                      <input
                        className="form-control"
                        name="mqttpassword"
                        value={mqtt.password}
                        type={is_password_hidden ? "password" : "text"}
                        placeholder="Password"
                        onChange={(e) => {
                          let mqts = [...mqtt_types];

                          mqts[index]["password"] = e.target.value;

                          setMqttTypes([...mqts]);
                        }}
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
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmtoken">Token</Label>
                    <input
                      value={mqtt.token}
                      className="form-control"
                      name="vmtoken"
                      placeholder="Token"
                      type="text"
                      onChange={(e) => {
                        let mqts = [...mqtt_types];
                        mqts[index]["token"] = e.target.value;
                        setMqttTypes([...mqts]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="mqttsubscriptionchannel">
                      MQTT Subscription Channel
                    </Label>
                    <input
                      value={mqtt.subscription_channel}
                      className="form-control"
                      name="subscription_channel"
                      placeholder="MQTT Subscription Channel"
                      type="text"
                      onChange={(e) => {
                        let mqts = [...mqtt_types];

                        mqts[index]["subscription_channel"] = e.target.value;

                        setMqttTypes([...mqts]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="mqttpublish_channel">
                      MQTT Publish Channel
                    </Label>
                    <input
                      value={mqtt.publish_channel}
                      className="form-control"
                      name="mqttpublish_channel"
                      placeholder="MQTT Publish Channel"
                      type="text"
                      onChange={(e) => {
                        let mqts = [...mqtt_types];

                        mqts[index]["publish_channel"] = e.target.value;

                        setMqttTypes([...mqts]);
                      }}
                    />
                  </div>
                </Colxx>
              </Row>
            </Colxx>
          </Row>
        ) : (
          <></>
        )}
      </Colxx>
    </>
  );
};

export default AddMqtt;
