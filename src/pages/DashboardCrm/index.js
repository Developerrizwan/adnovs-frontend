import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Label,
  Row,
  Tooltip,
} from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import apiAuth from "../../helpers/ApiAuth";
import axios from "axios";
import PRIAPI from "./PRIAPI";
import { InfoCircle, ThreeDotsVertical } from "react-bootstrap-icons";
import mapdata from "./MapData";
import jobs from "../../assets/images/jobs.png";
import greenCircle from "../../assets/images/green-circle.png";
import threeDots from "../../assets/images/threeDots.png";
import vouchers from "../../assets/images/vouchers.png";
import pinkCircle from "../../assets/images/pinkCircle.png";
import invoices from "../../assets/images/invoices.png";
import blueCircle from "../../assets/images/blueCircle.png";
import { Grid } from "@mui/material";

const DashboardCrm = () => {
  const [countData, setCountData] = useState({
    invoice_count: 0,
    job_count: 0,
    voucher_count: 0,
  });
  document.title = "CRM Dashboard";

  useEffect(() => {
    getCounts();
  }, []);

  const getCounts = () => {
    apiAuth
      .get("/api/user-related-counts/")
      .then((response) => {
        let data = response.data;

        setCountData(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <Grid container>
            <Grid lg={12}>
              <Card style={{ marginBottom: "0", padding: "20px" }}>
                <Grid container spacing={2}>
                  <Grid item lg={4} xs={12}>
                    <Card style={{ marginBottom: "0", padding: "20px" }}>
                      <Grid container>
                        <Grid lg={4} xs={4}>
                          <img
                            src={greenCircle}
                            alt="green ellipse"
                            style={{
                              position: "relative",
                              width: "67px",
                              height: "67px",
                            }}
                          />
                          <img
                            src={jobs}
                            alt="jobicon"
                            style={{
                              position: "absolute",
                              width: "21px",
                              height: "21px",
                              top: "42px",
                              left: "42px",
                            }}
                          />
                        </Grid>
                        <Grid lg={3} xs={3}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            Jobs
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            {countData?.job_count}
                          </p>
                        </Grid>
                        <Grid lg={3} xs={3}></Grid>
                        <Grid lg={2} xs={2}>
                          <img src={threeDots} alt="three dots" />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Card style={{ marginBottom: "0", padding: "20px" }}>
                      <Grid container>
                        <Grid lg={4} xs={4}>
                          <img
                            src={pinkCircle}
                            alt="green ellipse"
                            style={{
                              position: "relative",
                              width: "67px",
                              height: "67px",
                            }}
                          />
                          <img
                            src={vouchers}
                            alt="jobicon"
                            style={{
                              position: "absolute",
                              width: "21px",
                              height: "21px",
                              top: "40px",
                              left: "42px",
                            }}
                          />
                        </Grid>
                        <Grid lg={4} xs={4}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            Vouchers
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            {countData?.voucher_count}
                          </p>
                        </Grid>
                        <Grid lg={2} xs={2}></Grid>
                        <Grid lg={2} xs={2}>
                          <img src={threeDots} alt="three dots" />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Card style={{ marginBottom: "0", padding: "20px" }}>
                      <Grid container>
                        <Grid lg={4} xs={4}>
                          <img
                            src={blueCircle}
                            alt="green ellipse"
                            style={{
                              position: "relative",
                              width: "67px",
                              height: "67px",
                            }}
                          />
                          <img
                            src={invoices}
                            alt="jobicon"
                            style={{
                              position: "absolute",
                              width: "21px",
                              height: "21px",
                              top: "40px",
                              left: "42px",
                            }}
                          />
                        </Grid>
                        <Grid lg={3} xs={3}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            Invoices
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            {countData?.invoice_count}
                          </p>
                        </Grid>
                        <Grid lg={3} xs={3}></Grid>
                        <Grid lg={2} xs={2}>
                          <img src={threeDots} alt="three dots" />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrm;
