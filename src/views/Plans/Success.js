import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import apiAuth from "../../helpers/ApiAuth";

const Success = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("first");
    let sessionid = window.location.search.split("session_id=")[1];
    handleSuccess(sessionid);
  }, []);

  const handleSuccess = (id) => {
    apiAuth
      .post(`/api/paymentsuccess/`, {
        session_id: id,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: "200px" }}
    >
      {loading ? (
        <Card className="rounded-2" style={{ height: "30vh", width: "40%" }}>
          <CardBody className="d-flex justify-content-center align-items-center  bg-secondary rounded">
            <h2 className="bg-secondary text-light">
              Subscription added successfully
            </h2>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="loading"></div>
        </>
      )}
    </div>
  );
};

export default Success;
