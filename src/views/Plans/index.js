import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import { Check2 } from "react-bootstrap-icons";
const Plans = (props) => {
  const [plansData, setPlansData] = useState([]);
  const [activeButton, setActiveButton] = useState("Weekly");
  const [activeCard, setActiveCard] = useState(1);
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [subscription_id, setSubscription_id] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  console.log(paymentSessionId, "paymentSessionId");
  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = () => {
    apiAuth
      .get("/api/plans")
      .then((res) => {
        setPlansData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleActiveCard = (item) => {
    setActiveCard(item.id);
  };

  const displayStripePayModal = (item) => {
    const planId = {
      plan_id: item.id,
    };
    apiAuth
      .post("/api/checkout-session/", planId)
      .then((response) => {
        const url = response.data.url;
        window.location.replace(url);

        console.log("url", url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const successLoad = () => {
  //   const onStatus = {
  //     status: "Active",
  //   };
  //   apiAuth
  //     .patch(`/api/usersubscription/${subscription_id}`, onStatus)
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getPayment_session_id = (id) => {
  //   const planId = {
  //     plan_id: id,
  //   };

  //   apiAuth
  //     .post(`/api/order-subscription/`, planId)
  //     .then((res) => {
  //       const data = res.data;
  //       console.log("ssss", data.Response);
  //       setPaymentSessionId(data.Response.payment_session_id);
  //       setOrderStatus(data.Response.order_status);
  //       setSubscription_id(data.Subscription_id);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   // successLoad();
  // };

  // useEffect(() => {
  //   if (paymentSessionId === "") {
  //     console.log("No session_id specified");
  //     return;
  //   }
  //   const cf = new window.Cashfree(paymentSessionId);
  //   cf.redirect();

  // const onSuccess = (data) => {
  //   if (data.order && data.order.status === "PAID") {
  //     console.log("xyz");
  //   } else {
  //     console.log("abc");
  //   }
  // };

  // const onFailure = (data) => {
  //   console.log(data.order.errorText);
  // };
  // }, [paymentSessionId]);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title="Plans"
          pageTitle="Settings"
          history={props.history}
          back_button={true}
        />
      </Container>
      <Row>
        <Colxx className="d-flex justify-content-center align-items-center">
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "56px",
              maxWidth: "186px",
              padding: "0.25rem",
              width: "100%",
              borderRadius: "28px",
              background: "#1062fe",
            }}
          >
            <button
              style={{
                alignItems: "center",
                display: "flex",
                flexGrow: "1",
                height: "100%",
                justifyContent: "center",
                background:
                  activeButton === "Weekly" ? "#f3f3f9" : "transparent",
                color: activeButton === "Weekly" ? "black" : "white",
                fontSize: "13px",
                borderRadius: "24px",
                border: "0px",
              }}
              onClick={() => handleClick("Weekly")}
            >
              Weekly
            </button>
            <button
              style={{
                alignItems: "center",
                display: "flex",
                flexGrow: "1",
                height: "100%",
                justifyContent: "center",
                background:
                  activeButton === "Monthly" ? "#f3f3f9" : "transparent",
                color: activeButton === "Monthly" ? "black" : "white",
                fontSize: "13px",
                borderRadius: "24px",
                border: "0px",
              }}
              onClick={() => handleClick("Monthly")}
            >
              Monthly
            </button>
            <button
              style={{
                alignItems: "center",
                display: "flex",
                flexGrow: "1",
                height: "100%",
                justifyContent: "center",
                background:
                  activeButton === "Annually" ? "#f3f3f9" : "transparent",
                color: activeButton === "Annually" ? "black" : "white",
                fontSize: "13px",
                borderRadius: "24px",
                border: "0px",
              }}
              onClick={() => handleClick("Annually")}
            >
              Annually
            </button>
          </div>
        </Colxx>
      </Row>
      <Row>
        <Colxx
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          {plansData
            .filter((pp) => pp.type === activeButton)
            .map((item) => {
              return (
                <Card
                  key={item.id}
                  style={{
                    width: "400px",
                    margin: "10px",
                    padding: "20px",
                    boxShadow: "0 -1px 5px 5px rgba(56, 65, 74, 0.15)",
                    background: activeCard === item.id ? "#1062fe" : "#f3f3f9",
                    color: activeCard === item.id ? "white" : "black",
                  }}
                  onClick={() => handleActiveCard(item)}
                >
                  <Row className="d-flex justify-content-center">
                    <Colxx
                      lg="10"
                      className=""
                      style={{
                        color: activeCard === item.id ? "white" : "black",
                      }}
                    >
                      <p
                        className=" text-center h3 mt-4 font-weight-bold"
                        style={{
                          color: activeCard === item.id ? "white" : "black",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          color: activeCard === item.id ? "white" : "black",
                        }}
                      >
                        <span
                          className="h3 d-flex align-items-center justify-content-center"
                          style={{
                            color: activeCard === item.id ? "white" : "black",
                          }}
                        >
                          {/* {console.log(typeof item.cost, "cost type")} */}
                          &#8377; {item.cost}
                        </span>
                      </p>
                    </Colxx>
                  </Row>
                  <div className="d-flex flex-column justify-content-between h-100">
                    <Row className="d-flex justify-content-center">
                      <Colxx lg="10">
                        <div className="d-flex align-items-center justify-content-center">
                          <p
                            className="h4 text-justify pt-3"
                            style={{
                              color: activeCard === item.id ? "white" : "black",
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </Colxx>
                      <Colxx lg="10">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <i
                            className="fa fa-check text-primary d-flex align-items-center py-1 px-2 mx-2"
                            style={{
                              height: "26px",
                              width: "26px",
                              fontSize: "14px",
                              textAlign: "center",
                              lineHeight: "26px",
                              borderRadius: "50%",
                              background: "#effaf3",
                            }}
                          ></i> */}
                          <Check2 className="me-2" />
                          <p className="text-justify pt-3">
                            {item.notes.split(",")[0]}
                          </p>
                        </div>
                      </Colxx>
                      <Colxx lg="10">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <i
                            className="fa fa-check text-primary d-flex align-items-center py-1 px-2 mx-2"
                            style={{
                              height: "26px",
                              width: "26px",
                              fontSize: "14px",
                              textAlign: "center",
                              lineHeight: "26px",
                              borderRadius: "50%",
                              background: "#effaf3",
                            }}
                          ></i> */}
                          <Check2 className="me-2" />

                          <p className="text-justify pt-3">
                            {item.notes.split(",")[1]}
                          </p>
                        </div>
                      </Colxx>
                      <Colxx lg="10">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <i
                            className="fa fa-check text-primary d-flex align-items-center py-1 px-2 mx-2"
                            style={{
                              height: "26px",
                              width: "26px",
                              fontSize: "14px",
                              textAlign: "center",
                              lineHeight: "26px",
                              borderRadius: "50%",
                              background: "#effaf3",
                            }}
                          ></i> */}
                          <Check2 className="me-2" />
                          <p className="text-justify pt-3">
                            {item.notes.split(",")[2]}
                          </p>
                        </div>
                      </Colxx>
                      <Colxx lg="10"></Colxx>
                      <Colxx lg="10">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <i
                            className="fa fa-check text-primary d-flex align-items-center py-1 px-2 mx-2"
                            style={{
                              height: "26px",
                              width: "26px",
                              fontSize: "14px",
                              textAlign: "center",
                              lineHeight: "26px",
                              borderRadius: "50%",
                              background: "#effaf3",
                            }}
                          ></i> */}
                          <Check2 className="me-2" />

                          <p className="text-justify pt-3">
                            {item.notes.split(",")[3]}
                          </p>
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="">
                        <div className="d-flex justify-content-center align-items-center border-rounded">
                          <button
                            // type="submit"
                            className="btn btn-primary rounded-0 font-weight-bold rounded-5"
                            style={{
                              margin: "15px",
                              fontWeight: 900,
                              background:
                                activeCard === item.id ? "white" : "#1062fe",
                              color:
                                activeCard === item.id ? "#5b71b9" : "white",
                            }}
                            onClick={() => {
                              // console.log(item, "clicked item");
                              // displayRazorpay(item.cost);
                              displayStripePayModal(item);
                            }}
                          >
                            Choose Plan
                          </button>
                        </div>
                      </Colxx>
                    </Row>
                  </div>
                </Card>
              );
            })}
        </Colxx>
      </Row>
    </div>
  );
};

export default Plans;
