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
import { InfoCircle } from "react-bootstrap-icons";
import mapdata from "./MapData";

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
        <Container fluid>
          <BreadCrumb title="CRM" pageTitle="Dashboards" />
        </Container>
        <div>
          <Row>
            <Colxx lg="6">
              <Row>
                <Colxx xs="12" lg="6">
                  <Card
                    style={{
                      background: "#f3f3f9",
                      boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                    }}
                  >
                    <CardHeader
                      className="card-title mx-auto "
                      style={{
                        background: "#f3f3f9",
                        color: "#1062fe",
                        fontWeight: "900",
                        boxShadow: "0 2px 2px rgba(56, 65, 74, 0.15)",
                      }}
                    >
                      Pending Projects
                    </CardHeader>
                    <CardBody
                      style={{ fontSize: "20px", fontWeight: 600 }}
                      className="mx-auto"
                    >
                      {pendingClients}
                    </CardBody>
                  </Card>
                </Colxx>
                <Colxx xs="12" lg="6">
                  <Card
                    style={{
                      background: "#f3f3f9",
                      boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                    }}
                  >
                    <CardHeader
                      className="card-title mx-auto"
                      style={{
                        background: "#f3f3f9",
                        color: "#1062fe",
                        fontWeight: "900",
                        boxShadow: "0 2px 2px rgba(56, 65, 74, 0.15)",
                      }}
                    >
                      Completed Projects
                    </CardHeader>
                    <CardBody
                      style={{ fontSize: "20px", fontWeight: 600 }}
                      className="mx-auto"
                    >
                      {completedClients}
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>
              <Row>
                <Colxx lg="12" xs="12">
                  <>
                    <Card
                      style={{
                        boxShadow: "0 -1px 5px 5px rgba(56, 65, 74, 0.15)",
                        height: "96%",
                        background: "#f3f3f9",
                      }}
                    >
                      <CardHeader
                        className="card-title d-flex justify-content-between align-items-center"
                        style={{
                          background: "#f3f3f9",
                          boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "18px",
                          }}
                        >
                          Team Member List
                        </span>
                        <span> Total ({teamData?.length})</span>
                      </CardHeader>
                      <div>
                        <DataTable
                          customStyles={customStyles}
                          columns={[
                            {
                              name: (
                                <span
                                  className="font-weight-bold fs-18"
                                  style={{ fontWeight: 600 }}
                                >
                                  Full Name
                                </span>
                              ),
                              selector: (row) => row.name,
                              sortable: true,
                            },
                            {
                              name: (
                                <span
                                  className="font-weight-bold fs-18"
                                  style={{ fontWeight: 600 }}
                                >
                                  Email
                                </span>
                              ),
                              selector: (row) => row.email_id,
                              sortable: true,
                            },
                            {
                              name: (
                                <span
                                  className="font-weight-bold fs-18"
                                  style={{ fontWeight: 600 }}
                                >
                                  Designation
                                </span>
                              ),
                              selector: (row) => row.designation,
                              sortable: true,
                            },
                          ]}
                          data={teamData}
                          pagination={true}
                          noDataComponent={<></>}
                        />
                      </div>
                    </Card>
                  </>
                </Colxx>
              </Row>
            </Colxx>

            <Colxx lg="6" xs="12">
              <>
                <Card
                  style={{
                    height: "97%",
                    background: "#f3f3f9",
                    boxShadow: "0 1px 5px 5px rgba(56, 65, 74, 0.15)",
                  }}
                >
                  <CardHeader
                    className="card-title"
                    style={{
                      background: "#f3f3f9",
                      boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                    }}
                  >
                    <h5>Recent Projects List</h5>
                  </CardHeader>

                  <div>
                    <DataTable
                      customStyles={customStyles1}
                      columns={[
                        {
                          name: (
                            <span
                              className="font-weight-bold fs-18"
                              style={{ fontWeight: 600 }}
                            >
                              Id
                            </span>
                          ),
                          selector: (row) => row.id,
                          sortable: true,
                        },
                        {
                          name: (
                            <span
                              className="font-weight-bold fs-18"
                              style={{ fontWeight: 700 }}
                            >
                              Project Name
                            </span>
                          ),
                          selector: (row) => row.name,
                          sortable: true,
                        },
                      ]}
                      data={projectsData}
                      pagination={true}
                      noDataComponent={<></>}
                    />
                  </div>
                </Card>
              </>
            </Colxx>
          </Row>
        </div>

        <Row>
          <Colxx lg="1">
            <Card
              className="pt-3 h-100"
              style={{
                width: "fit-content",
                background: "#f3f3f9",
                boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
              }}
            >
              <Row className="m-0">
                <Colxx
                  lg="12"
                  className={[
                    "d-flex justify-content-center py-2 cursor-pointer",
                    type === "VisType.HEATMAP"
                      ? "bg-light border-start border-4 border-primary"
                      : "",
                  ].join(" ")}
                  onClick={() => setType("VisType.HEATMAP")}
                >
                  <i
                    className="ri-image-line fa-2x"
                    style={{ fontSize: "20px" }}
                  ></i>
                </Colxx>
                <Colxx
                  lg="12"
                  className={[
                    "d-flex justify-content-center py-2 cursor-pointer",
                    type === "VisType.HEATMAP_OVERLAY"
                      ? "bg-light border-start border-4 border-primary"
                      : "",
                  ].join(" ")}
                  onClick={() => setType("VisType.HEATMAP_OVERLAY")}
                >
                  <i
                    className="ri-fire-line fa-2x"
                    style={{ fontSize: "20px" }}
                  ></i>
                </Colxx>
                <Colxx
                  lg="12"
                  className={[
                    "d-flex justify-content-center py-2 cursor-pointer",
                    type === "VisType.SPOTLIGHT"
                      ? "bg-light border-start border-4 border-primary"
                      : "",
                  ].join(" ")}
                  onClick={() => setType("VisType.SPOTLIGHT")}
                >
                  <i
                    className="ri-command-line fa-2x"
                    style={{ fontSize: "20px" }}
                  ></i>
                </Colxx>
                <Colxx
                  lg="12"
                  className={[
                    "d-flex justify-content-center py-2 cursor-pointer",
                    type === "VisType.SPOTLIGHT_LEVEL_SETS"
                      ? "bg-light border-start border-4 border-primary"
                      : "",
                  ].join(" ")}
                  onClick={() => setType("VisType.SPOTLIGHT_LEVEL_SETS")}
                >
                  <i
                    className="ri-drag-move-line fa-2x"
                    style={{ fontSize: "20px" }}
                  ></i>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
          <Colxx lg="11">
            <Card
              className="p-2 mb-0"
              style={{
                background: "#f3f3f9",
                boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
              }}
            >
              <Row>
                <Colxx lg="12">
                  {loading ? (
                    <img
                      src={
                        type === "VisType.HEATMAP"
                          ? fileData?.file
                          : `data:image/png;base64, ${predictData[type]}`
                      }
                      alt=""
                      width="100%"
                      style={{
                        maxHeight: "65vh",
                      }}
                      className="img-fluid"
                    />
                  ) : (
                    <></>
                  )}
                </Colxx>
              </Row>
              <Row className="mt-2">
                <Colxx lg="4">
                  <div className="form-group">
                    <Label htmlFor="logo">Predict Image</Label>
                    <input
                      className="form-control"
                      name="logo"
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        setFileData({
                          file: URL.createObjectURL(e.target.files[0]),
                          picfile: e.target.files[0],
                        });
                      }}
                      style={{ background: "#f3f3f9" }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="2" className="d-flex align-items-center mt-4">
                  <Button
                    className="btn btn-primary float-right"
                    onClick={() => predictImage()}
                    style={{ background: "#1062fe" }}
                  >
                    {fetching ? "Wait..." : "Predict"}
                  </Button>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
          <Colxx lg="12">
            <Row className="d-flex justify-content-around mt-3">
              <Colxx lg="1"></Colxx>
              <Colxx lg="2">
                <Card
                  classname="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    padding: "4px",
                    background: "#fff",
                    color: "#1062fe",
                  }}
                >
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen["Whiteness Score"]}
                    autohide={false}
                    target="WhitenessScore"
                    // toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Image Whiteness Score Some images can be too white or too
                    bright which might not be good for the advertisement
                    purposes. The analysis of prominent colors present in the
                    images can indicate if the images are too white.
                  </Tooltip>
                  <span
                    className="d-flex justify-content-end"
                    id="WhitenessScore"
                  >
                    <InfoCircle
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => enableScoreInfo("Whiteness Score")}
                    />
                  </span>
                  <h5
                    className="mt-2 d-flex justify-content-center"
                    style={{
                      color: "#1062fe",
                    }}
                  >
                    Whiteness Score
                  </h5>

                  <p className="d-flex justify-content-center text-dark">
                    {Number(predictData.lightness_score || 0).toFixed(2)}
                  </p>
                </Card>
              </Colxx>
              <Colxx lg="2">
                <Card
                  classname="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    padding: "4px",
                    background: "#fff",
                    color: "#1062fe",
                  }}
                >
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen["Dullness Score"]}
                    autohide={false}
                    target="DullnessScore"
                    // toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Image Dullness Score Dull Images may not be good for the
                    advertisement purposes. The analysis of prominent colors
                    present in the images can indicate a lot about if the image
                    is dull or not.
                  </Tooltip>
                  <span className="  d-flex justify-content-end">
                    <InfoCircle
                      style={{ cursor: "pointer" }}
                      className="me-2 "
                      id="DullnessScore"
                      onMouseEnter={() => enableScoreInfo("Dullness Score")}
                    />
                  </span>
                  <h5
                    className="mt-2 d-flex justify-content-center"
                    style={{
                      color: "#1062fe",
                    }}
                  >
                    Dullness Score
                  </h5>

                  <p className="d-flex justify-content-center text-dark">
                    {Number(predictData.dullness_score || 0).toFixed(2)}
                  </p>
                </Card>
              </Colxx>
              <Colxx lg="2">
                <Card
                  classname="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    padding: "4px",
                    background: "#fff",
                    color: "#1062fe",
                  }}
                >
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen["Uniformity Score"]}
                    autohide={false}
                    target="UniformityScore"
                    // toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    Average Pixel Width Some images may contain no pixel
                    variation and are entirely uniform. Average Pixel Width is a
                    measure which indicates the number of edges present in the
                    image. If this number comes out to be very low, then the
                    image is most likely a uniform image and may not represent
                    right content.
                  </Tooltip>
                  <span className="d-flex justify-content-end">
                    <InfoCircle
                      style={{
                        cursor: "pointer",
                      }}
                      className="me-2"
                      id="UniformityScore"
                      onMouseEnter={() => enableScoreInfo("Uniformity Score")}
                    />
                  </span>
                  <h5
                    className="mt-2 d-flex justify-content-center"
                    style={{ color: "#1062fe" }}
                  >
                    Uniformity Score
                  </h5>

                  <p
                    className="d-flex justify-content-center text-dark"
                    style={{
                      color: "#1062fe",
                    }}
                  >
                    {Number(predictData.uniformity_score || 0).toFixed(2)}
                  </p>
                </Card>
              </Colxx>
              <Colxx lg="2">
                <Card
                  classname="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    padding: "4px",
                    background: "#fff",
                    color: "#1062fe",
                  }}
                >
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen["Blurrness Score"]}
                    autohide={false}
                    target="BlurrnessScore"
                    // toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    This score calculates if the image is blur or if it contains
                    some elements that have some blur effect.
                  </Tooltip>
                  <span className="  d-flex justify-content-end">
                    <InfoCircle
                      style={{ cursor: "pointer" }}
                      className="me-2"
                      id="BlurrnessScore"
                      onMouseEnter={() => enableScoreInfo("Blurrness Score")}
                    />
                  </span>
                  <h5
                    className="mt-2 d-flex justify-content-center"
                    style={{
                      color: "#1062f3",
                    }}
                  >
                    Blurrness Score
                  </h5>

                  <p
                    className="d-flex justify-content-center text-dark"
                    style={{
                      color: "#1062f3",
                    }}
                  >
                    {Number(predictData.blurrness_score || 0).toFixed(2)}
                  </p>
                </Card>
              </Colxx>
              <Colxx lg="2">
                <Card
                  classname="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    padding: "4px",
                    background: "#fff",
                    color: "#1062fe",
                  }}
                >
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen["Memorability Score"]}
                    autohide={false}
                    target="MemorabilityScore"
                    // toggle={() => setTooltipOpen(!tooltipOpen)}
                  >
                    This score is calculated based on image memorability data
                    (containing 60,000 images from diverse sources). Using
                    state-of-the-art machine learning models, we can make
                    quantified predictions about how much people will remember
                    in an image based on intrinsic memorability of that image.
                  </Tooltip>
                  <span className="  d-flex justify-content-end">
                    <InfoCircle
                      style={{ cursor: "pointer" }}
                      id="MemorabilityScore"
                      className="me-2"
                      onMouseEnter={() => enableScoreInfo("Memorability Score")}
                    />
                  </span>
                  <h5
                    className="mt-2 d-flex justify-content-center "
                    style={{
                      color: "#1062fe",
                    }}
                  >
                    Memorability Score
                  </h5>

                  <p
                    className="d-flex justify-content-center text-dark"
                    style={{
                      color: "#1062fe",
                    }}
                  >
                    {Number(predictData.memorability_score || 0).toFixed(2)}
                  </p>
                </Card>
              </Colxx>
            </Row>
          </Colxx>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default DashboardCrm;
