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
  const [teamData, setTeamData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [predictData, setPredictData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState({});

  const [type, setType] = useState("VisType.HEATMAP");
  document.title = "CRM Dashboard";
  const [completedClients, setCompletedClients] = useState(0);
  const [pendingClients, setPendingClients] = useState(0);

  useEffect(() => {
    getTeamMembers();
    getProjects();
  }, []);

  const getTeamMembers = () => {
    apiAuth
      .get("/api/teams-view")
      .then((response) => {
        let data = response.data;
        // console.log(data, "team");
        setTeamData(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProjects = () => {
    apiAuth
      .get("/api/project")
      .then((response) => {
        const data = response.data;
        // console.log("projects", data);
        let pendingClients = response.data.filter(
          (cl) => cl.status === "PENDING"
        );
        let completedClients = response.data.filter(
          (cl) => cl.status !== "PENDING"
        );
        setCompletedClients(completedClients.length);
        setPendingClients(pendingClients.length);
        setProjectsData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const predictImage = () => {
    let fdata = new FormData();
    if (fileData?.picfile) {
      fdata.append("image", fileData?.picfile);

      // let c = mapdata?.heatmap;
      // Object.keys(c).forEach((ke) => console.log("===>", ke));
      setFetching(true);
      PRIAPI.post("/predict", fdata)
        .then((response) => {
          const data = response.data?.heatmap;
          // console.log("rrrrrrrrrrrrrr", data);
          if (!response.data.error) setPredictData(data);

          setLoading(true);
          setFetching(false);
        })
        .catch((error) => {
          console.log(error);
        });

      // setPredictData(c);
    }
  };

  const customStyles1 = {
    table: {
      style: {
        minHeight: "150px",
        maxHeight: "80vh",
        backgroundColor: "#f3f3f9",
        overflowY: "scroll",
      },
    },
    // title: {
    //   style: {
    //     fontColor: "red",
    //     fontWeight: "900",
    //   },
    // },
    headCells: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
      },
    },
    cells: {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "none",
        minHeight: "56px",
        fontSize: "17px",
      },
    },
    headRow: {
      style: {
        color: "#1062fe",
        backgroundColor: "#f3f3f9",
      },
    },
    rows: {
      style: {
        color: "#000",
        backgroundColor: "#f3f3f9",
      },
    },
    pagination: {
      style: {
        color: "#000",
        backgroundColor: "#f3f3f9",
      },
    },
  };

  const enableScoreInfo = (type) => {
    let obj = { ...tooltipOpen };
    obj[type] = true;
    setTooltipOpen(obj);
    setTimeout(() => {
      let objj = { ...tooltipOpen };
      objj[type] = false;
      setTooltipOpen({ ...objj });
    }, 2000);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        {/* <Container fluid>
          <BreadCrumb title="CRM" pageTitle="Dashboards" />
        </Container> */}
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
                              top: "40px",
                              left: "40px",
                            }}
                          />
                        </Grid>
                        <Grid lg={3} xs={3}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            Jobs
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            63
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
                              left: "40px",
                            }}
                          />
                        </Grid>
                        <Grid lg={4} xs={4}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                              Vouchers
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            17
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
                              left: "40px",
                            }}
                          />
                        </Grid>
                        <Grid lg={3} xs={3}>
                          <h3 style={{ fontSize: "16px", fontWeight: "400" }}>
                            Invoices
                          </h3>
                          <p style={{ fontSize: "30px", fontWeight: "700" }}>
                            44
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
