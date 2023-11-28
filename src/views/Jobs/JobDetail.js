import React, { useEffect, useState } from "react";
import { Row, Container } from "reactstrap";
import { useParams } from "react-router";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card } from "@mui/material";
import apiAuth from "../../helpers/ApiAuth";
import JobTable from "./JobTable";
import NotificationManager from "../../components/Common/NotificationManager";
import EnquiryTable from "./EnquiryTable";

const JobDetail = (props) => {
  const [loading, setLoading] = useState(false);
  const { jobId } = useParams();

  const getJobDetail = () => {
    apiAuth
      .get(`/api/master/invoice/`)
      .then((response) => {
        let data = response.data;
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Vouchers Get Error`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getJobDetail();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid></Container>
      </div>
    </>
  );
};

export default JobDetail;
