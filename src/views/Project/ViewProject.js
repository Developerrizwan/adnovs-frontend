import React, { Component } from "react";
import { Row, Button, Label, Container, Card, Tooltip } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";
import PRIAPI from "../../pages/DashboardCrm/PRIAPI";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Line } from "react-chartjs-2";
import { InfoCircle } from "react-bootstrap-icons";
import _ from "lodash";

class ViewProject extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      images: [],
      videoes: [],
      project: null,
      client: null,
      openedSteps: [0],
      openedVideoSteps: [0],
      tooltipOpen: {},
    };
  }

  enableScoreInfo = (type) => {
    let obj = { ...this.state.tooltipOpen };
    obj[type] = true;
    this.setState({ tooltipOpen: obj });
    setTimeout(() => {
      let objj = { ...this.state.tooltipOpen };
      objj[type] = false;
      this.setState({ tooltipOpen: { ...objj } });
    }, 2000);
  };

  handleSteps(step) {
    let openedSteps = this.state.openedSteps;
    if (openedSteps.includes(step)) {
      openedSteps = openedSteps.filter((stp) => stp !== step);
    } else {
      openedSteps.push(step);
    }

    this.setState({ openedSteps });
  }

  handleVideoSteps(step) {
    let openedVideoSteps = this.state.openedVideoSteps;
    if (openedVideoSteps.includes(step)) {
      openedVideoSteps = openedVideoSteps.filter((stp) => stp !== step);
    } else {
      openedVideoSteps.push(step);
      this.getEmotions(this.state.videoes[step], step);
    }

    this.setState({ openedVideoSteps });
  }

  componentDidMount() {
    this.handleProject();
  }

  handleProject = () => {
    const { projectId } = this.props.match.params;

    apiAuth
      .get("/api/projectfiles/?project_id=" + projectId)
      .then((res) => {
        let data = res.data;
        let project = data.project;
        let client = data.client;
        let images = data?.project_files?.map((ig) => {
          ig["type"] = "VisType.HEATMAP";
          return ig;
        });
        let videoes = data?.video_files;

        if (videoes.length > 0) {
          this.getEmotions(videoes[0], 0);
        }

        this.setState({
          images: images,
          project: project,
          client: client,
          videoes,
          loaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  predictImage = (img, index) => {
    if (img.file && img.name) {
      let fdata = new FormData();
      fdata.append("file", img.file);
      fdata.append("name", img.name);
      fdata.append("project", this.state.project?.id);

      if (img.id) {
        apiAuth
          .patch("/api/projectfiles/" + img.id + "/", fdata)
          .then((res) => {
            let data = res.data;
            let imgs = [...this.state.images];
            imgs[index]["id"] = data.id;
            this.setState({ images: imgs }, () => {
              this.predictData(imgs[index], index);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        apiAuth
          .post("/api/projectfiles/", fdata)
          .then((res) => {
            let data = res.data;
            let imgs = [...this.state.images];
            imgs[index]["id"] = data.id;
            imgs[index]["file1"] = data.file;
            imgs[index]["newfile"] = true;
            this.setState({ images: imgs }, () => {
              this.predictData(imgs[index], index);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      NotificationManager.error(
        "",
        "Name and Image Required",
        3000,
        null,
        null,
        ""
      );
    }
  };

  predictData = (img, index) => {
    let fdata = new FormData();
    if (img?.file) {
      fdata.append("image", img.file);
      PRIAPI.post("/predict", fdata)
        .then((response) => {
          const data = response.data?.heatmap;
          let imgs = [...this.state.images];
          imgs[index]["heatmaps"] = data;
          imgs[index]["whiteness_score"] = data?.lightness_score;
          imgs[index]["dullness_score"] = data?.dullness_score;
          imgs[index]["uniformity_score"] = data?.uniformity_score;
          imgs[index]["blurrness_score"] = data?.blurrness_score;
          imgs[index]["memorability_score"] = data?.memorability_score;
          imgs[index]["isPredict"] = false;
          this.setState({ images: imgs });

          if (!response.data.error) this.updateData(imgs[index]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  updateData = (ig) => {
    if (ig.id) {
      apiAuth
        .patch("/api/projectfiles/" + ig.id + "/", {
          heatmaps: ig.heatmaps,
          whiteness_score: ig.heatmaps?.lightness_score,
          dullness_score: ig.heatmaps?.dullness_score,
          uniformity_score: ig.heatmaps?.uniformity_score,
          blurrness_score: ig.heatmaps?.blurrness_score,
          memorability_score: ig.heatmaps?.memorability_score,
        })
        .then((res) => {
          let data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleDelete = (img, index) => {
    let imgs = [...this.state.images];
    imgs.splice(index, 1);
    this.setState({
      images: imgs,
    });

    if (img.id) {
      apiAuth
        .delete("/api/projectfiles/" + img.id + "/")
        .then((res) => {
          let data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleVideoDelete = (img, index) => {
    let imgs = [...this.state.videoes];
    imgs.splice(index, 1);
    this.setState({
      videoes: imgs,
    });

    if (img.id) {
      apiAuth
        .delete("/api/projectvideos/" + img.id + "/")
        .then((res) => {
          let data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  uploadVideo = (img, index) => {
    if (img.file && img.name) {
      let fdata = new FormData();
      fdata.append("video", img.file);
      fdata.append("name", img.name);
      fdata.append("project", this.state.project?.id);

      if (img.id) {
        apiAuth
          .patch("/api/projectvideos/" + img.id + "/", fdata)
          .then((res) => {
            let data = res.data;
            let imgs = [...this.state.videoes];
            imgs[index]["id"] = data.id;
            imgs[index]["isUpload"] = false;
            imgs[index]["uploaded"] = true;
            this.setState({ videoes: imgs });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        apiAuth
          .post("/api/projectvideos/", fdata)
          .then((res) => {
            let data = res.data;
            let imgs = [...this.state.videoes];
            imgs[index]["id"] = data.id;
            imgs[index]["isUpload"] = false;
            imgs[index]["uploaded"] = true;
            this.setState({ videoes: imgs });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      NotificationManager.error(
        "",
        "Name And Video file Required",
        3000,
        null,
        null,
        ""
      );
    }
  };

  getEmotions = (video, index) => {
    apiAuth
      .get("/api/videoprocess/?video_id=" + video.id)
      .then((res) => {
        let data = res.data.map((dd) => {
          dd.sno = Number(dd.sno);
          return dd;
        });

        data = _.sortBy(data, "sno");
        let videoes = [...this.state.videoes];
        videoes[index]["labels"] = data.map((dd) => {
          let secs = Number(dd.sno) / 25;

          let mm = Math.floor(secs / 60);

          secs = secs - mm * 60;

          let lb = `${mm < 10 ? `0${mm}` : mm}:${
            secs < 10 ? `0${secs}` : secs
          }`;

          return lb;
        });
        videoes[index]["cognitiveData"] = data.map((dd) => dd.low_load);
        videoes[index]["cognitiveMediumData"] = data.map(
          (dd) => dd.medium_load
        );
        videoes[index]["positiveData"] = data.map((dd) => dd.happy);
        videoes[index]["neutralData"] = data.map((dd) => dd.neutral);

        this.setState({
          videoes: videoes,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Project Details"
              pageTitle="Settings"
              back_button={true}
              history={this.props.history}
            />
          </Container>
          {this.state.loaded ? (
            <Row>
              <Colxx lg="12">
                <Card className="p-2">
                  <Row>
                    <Colxx sm="12">
                      <p>Project Name - {this.state.project?.name}</p>
                      <p>Client Name - {this.state.client?.name}</p>
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>
            </Row>
          ) : (
            <div className="loading"></div>
          )}

          <Row>
            <Colxx lg="12">
              <Card className="p-2">
                <Row>
                  <Colxx sm="12">
                    <div className="d-flex justify-content-between w-100">
                      <p className="font-weight-bold">Project Images</p>
                      <div>
                        <Button
                          onClick={() => {
                            let imgs = [...this.state.images];
                            imgs.push({
                              name: "",
                              file: "",
                              fileurl: "",
                              heatmaps: {},
                              type: "VisType.HEATMAP",
                            });
                            this.setState({
                              images: imgs,
                              openedSteps: [imgs.length - 1],
                            });
                          }}
                          style={{ background: "#1062fe" }}
                        >
                          Add More
                        </Button>
                      </div>
                    </div>
                  </Colxx>
                </Row>
              </Card>
            </Colxx>
          </Row>
          <Row>
            {this.state.images?.map((img, index) => {
              return (
                <>
                  <Colxx lg="12">
                    <Row className="w-100">
                      <Colxx lg="12">
                        <Card className="p-2">
                          <Row className="mt-2">
                            {img.id ? (
                              <>
                                {" "}
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">{img.name}</Label>
                                  </div>
                                </Colxx>
                                <Colxx lg="7"></Colxx>
                              </>
                            ) : (
                              <>
                                {" "}
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">
                                      Image/File Name
                                    </Label>
                                    <input
                                      className="form-control"
                                      name="logo"
                                      placeholder="Image/File Name"
                                      value={img.name}
                                      type="text"
                                      onChange={(e) => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["name"] = e.target.value;
                                        this.setState({
                                          images: imgs,
                                        });
                                      }}
                                    />
                                  </div>
                                </Colxx>
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">Upload Image</Label>
                                    <input
                                      className="form-control"
                                      name="logo"
                                      type="file"
                                      accept="image/png"
                                      onChange={(e) => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["file"] = e.target.files[0];
                                        imgs[index]["fileurl"] =
                                          URL.createObjectURL(
                                            e.target.files[0]
                                          );

                                        this.setState({
                                          images: imgs,
                                        });
                                      }}
                                    />
                                  </div>
                                </Colxx>
                                <Colxx
                                  lg="3"
                                  className="d-flex align-items-center mt-4"
                                >
                                  <Button
                                    className="btn float-right"
                                    onClick={() => {
                                      let imgs = [...this.state.images];
                                      imgs[index]["isPredict"] = true;
                                      this.setState({ images: imgs }, () => {
                                        this.predictImage(img, index);
                                      });
                                    }}
                                    style={{ background: "#1062fe" }}
                                  >
                                    {img.isPredict ? "Wait..." : "Predict"}
                                  </Button>
                                </Colxx>
                              </>
                            )}
                            <Colxx
                              lg="1"
                              className="d-flex justify-content-center align-items-center"
                            >
                              <div className="d-flex align-items-center">
                                <i
                                  onClick={() => {
                                    this.handleSteps(index);
                                  }}
                                  style={{
                                    fontSize: "24px",
                                  }}
                                  className={
                                    this.state.openedSteps.includes(index)
                                      ? "ri-checkbox-indeterminate-fill float-left cursor-pointer text-primary fa-2x"
                                      : "ri-add-box-fill float-left cursor-pointer text-primary fa-2x"
                                  }
                                ></i>
                                <i
                                  className="ri-delete-bin-fill float-right cursor-pointer ml-2 text-danger"
                                  onClick={() => {
                                    this.handleDelete(img, index);
                                  }}
                                  style={{
                                    fontSize: "24px",
                                    //   color: "#e2863b",
                                  }}
                                ></i>
                              </div>
                            </Colxx>
                          </Row>
                        </Card>
                      </Colxx>

                      {this.state.openedSteps?.includes(index) ? (
                        <>
                          <Colxx lg="12">
                            <Row>
                              <Colxx
                                lg="1"
                                className="d-flex justify-content-center align-items-center"
                              >
                                <Card
                                  className="w-50 pt-3"
                                  style={{ height: "100%" }}
                                >
                                  <Row className="m-0">
                                    <Colxx
                                      lg="12"
                                      className={[
                                        "d-flex justify-content-center py-2 cursor-pointer",
                                        img.type === "VisType.HEATMAP"
                                          ? "bg-light border-start border-4 border-primary"
                                          : "",
                                      ].join(" ")}
                                      onClick={() => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["type"] = "VisType.HEATMAP";
                                        this.setState({ images: imgs });
                                      }}
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
                                        img.type === "VisType.HEATMAP_OVERLAY"
                                          ? "bg-light border-start border-4 border-primary"
                                          : "",
                                      ].join(" ")}
                                      onClick={() => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["type"] =
                                          "VisType.HEATMAP_OVERLAY";
                                        this.setState({ images: imgs });
                                      }}
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
                                        img.type === "VisType.SPOTLIGHT"
                                          ? "bg-light border-start border-4 border-primary"
                                          : "",
                                      ].join(" ")}
                                      onClick={() => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["type"] =
                                          "VisType.SPOTLIGHT";
                                        this.setState({ images: imgs });
                                      }}
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
                                        img.type ===
                                        "VisType.SPOTLIGHT_LEVEL_SETS"
                                          ? "bg-light border-start border-4 border-primary"
                                          : "",
                                      ].join(" ")}
                                      onClick={() => {
                                        let imgs = [...this.state.images];
                                        imgs[index]["type"] =
                                          "VisType.SPOTLIGHT_LEVEL_SETS";
                                        this.setState({ images: imgs });
                                      }}
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
                                <Card className="p-2">
                                  <Row>
                                    <Colxx lg="12">
                                      <img
                                        src={
                                          img.type === "VisType.HEATMAP"
                                            ? img.newfile
                                              ? img.file1
                                              : img.file
                                            : `data:image/png;base64, ${
                                                img["heatmaps"][img.type]
                                              }`
                                        }
                                        alt=""
                                        width="100%"
                                        className="img-fluid"
                                      />
                                    </Colxx>
                                  </Row>
                                </Card>
                              </Colxx>
                            </Row>
                          </Colxx>
                          <Colxx lg="12">
                            <Row className="d-flex justify-content-around">
                              <Colxx lg="1"></Colxx>
                              <Colxx lg="2">
                                <Card
                                  classname="d-flex flex-column justify-content-center align-items-center"
                                  style={{
                                    background: "#fff",
                                    color: "#1062fe",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    padding: "4px",
                                  }}
                                >
                                  <Tooltip
                                    placement="top"
                                    isOpen={
                                      this.state.tooltipOpen["Whiteness Score"]
                                    }
                                    autohide={false}
                                    target="WhitenessScore"
                                  >
                                    Image Whiteness Score Some images can be too
                                    white or too bright which might not be good
                                    for the advertisement purposes. The analysis
                                    of prominent colors present in the images
                                    can indicate if the images are too white.
                                  </Tooltip>
                                  <span
                                    className="d-flex justify-content-end"
                                    id="WhitenessScore"
                                  >
                                    <InfoCircle
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() =>
                                        this.enableScoreInfo("Whiteness Score")
                                      }
                                    />
                                  </span>
                                  <p className="mt-2 d-flex justify-content-center ">
                                    Whiteness Score
                                  </p>
                                  <p className="d-flex justify-content-center text-dark">
                                    {Number(img.whiteness_score || 0).toFixed(
                                      2
                                    )}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card
                                  classname="d-flex flex-column justify-content-center align-items-center"
                                  style={{
                                    background: "#fff",
                                    color: "#1062fe",
                                    fontWeight: 700,
                                    padding: "4px",
                                    fontSize: "16px",
                                  }}
                                >
                                  <Tooltip
                                    placement="top"
                                    isOpen={
                                      this.state.tooltipOpen["Dullness Score"]
                                    }
                                    autohide={false}
                                    target="DullnessScore"
                                  >
                                    Image Whiteness Score Some images can be too
                                    white or too bright which might not be good
                                    for the advertisement purposes. The analysis
                                    of prominent colors present in the images
                                    can indicate if the images are too white.
                                  </Tooltip>
                                  <span
                                    className="d-flex justify-content-end"
                                    id="DullnessScore"
                                  >
                                    <InfoCircle
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() =>
                                        this.enableScoreInfo("Dullness Score")
                                      }
                                    />
                                  </span>

                                  <p className="mt-2 d-flex justify-content-center ">
                                    Dullness Score
                                  </p>
                                  <p className="d-flex justify-content-center text-dark">
                                    {Number(img.dullness_score || 0).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card
                                  classname="d-flex flex-column justify-content-center align-items-center"
                                  style={{
                                    background: "#fff",
                                    color: "#1062fe",
                                    fontWeight: 700,
                                    padding: "4px",
                                    fontSize: "16px",
                                  }}
                                >
                                  <Tooltip
                                    placement="top"
                                    isOpen={
                                      this.state.tooltipOpen["Uniformity Score"]
                                    }
                                    autohide={false}
                                    target="UniformityScore"
                                  >
                                    Image Whiteness Score Some images can be too
                                    white or too bright which might not be good
                                    for the advertisement purposes. The analysis
                                    of prominent colors present in the images
                                    can indicate if the images are too white.
                                  </Tooltip>
                                  <span
                                    className="d-flex justify-content-end"
                                    id="UniformityScore"
                                  >
                                    <InfoCircle
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() =>
                                        this.enableScoreInfo("Uniformity Score")
                                      }
                                    />
                                  </span>

                                  <p className="mt-2 d-flex justify-content-center ">
                                    Uniformity Score
                                  </p>
                                  <p className="d-flex justify-content-center text-dark">
                                    {Number(img.uniformity_score || 0).toFixed(
                                      2
                                    )}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card
                                  classname="d-flex flex-column justify-content-center align-items-center"
                                  style={{
                                    background: "#fff",
                                    color: "#1062fe",
                                    padding: "4px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                  }}
                                >
                                  <Tooltip
                                    placement="top"
                                    isOpen={
                                      this.state.tooltipOpen["Blurriness Score"]
                                    }
                                    autohide={false}
                                    target="BlurrinessScore"
                                  >
                                    Image Whiteness Score Some images can be too
                                    white or too bright which might not be good
                                    for the advertisement purposes. The analysis
                                    of prominent colors present in the images
                                    can indicate if the images are too white.
                                  </Tooltip>
                                  <span
                                    className="d-flex justify-content-end"
                                    id="BlurrinessScore"
                                  >
                                    <InfoCircle
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() =>
                                        this.enableScoreInfo("Blurriness Score")
                                      }
                                    />
                                  </span>

                                  <p className="mt-2 d-flex justify-content-center ">
                                    Blurriness Score
                                  </p>
                                  <p className="d-flex justify-content-center text-dark">
                                    {Number(img.blurrness_score || 0).toFixed(
                                      2
                                    )}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card
                                  classname="d-flex flex-column justify-content-center align-items-center"
                                  style={{
                                    background: "#fff",
                                    color: "#1062fe",
                                    padding: "4px",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                  }}
                                >
                                  <Tooltip
                                    placement="top"
                                    isOpen={
                                      this.state.tooltipOpen[
                                        "Memorability Score"
                                      ]
                                    }
                                    autohide={false}
                                    target="MemorabilityScore"
                                  >
                                    Image Whiteness Score Some images can be too
                                    white or too bright which might not be good
                                    for the advertisement purposes. The analysis
                                    of prominent colors present in the images
                                    can indicate if the images are too white.
                                  </Tooltip>
                                  <span
                                    className="d-flex justify-content-end"
                                    id="MemorabilityScore"
                                  >
                                    <InfoCircle
                                      className="me-2"
                                      style={{ cursor: "pointer" }}
                                      onMouseEnter={() =>
                                        this.enableScoreInfo(
                                          "Memorability Score"
                                        )
                                      }
                                    />
                                  </span>
                                  <p className="mt-2 d-flex justify-content-center ">
                                    Memorability Score
                                  </p>
                                  <p className="d-flex justify-content-center text-dark">
                                    {Number(
                                      img.memorability_score || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                            </Row>
                          </Colxx>
                        </>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </Colxx>
                </>
              );
            })}
          </Row>

          <Row>
            <Colxx lg="12">
              <Card className="p-2">
                <Row>
                  <Colxx sm="12">
                    <div className="d-flex justify-content-between w-100">
                      <p className="font-weight-bold">Project Videoes</p>
                      <div>
                        <Button
                          onClick={() => {
                            let imgs = [...this.state.videoes];
                            imgs.push({
                              name: "",
                              file: "",
                              fileurl: "",
                            });
                            this.setState({
                              videoes: imgs,
                              openedVideoSteps: [imgs.length - 1],
                            });
                          }}
                          style={{ background: "#1062fe" }}
                        >
                          Add More
                        </Button>
                      </div>
                    </div>
                  </Colxx>
                </Row>
              </Card>
            </Colxx>
          </Row>

          <Row>
            {this.state.videoes?.map((img, index) => {
              return (
                <>
                  <Colxx lg="12">
                    <Row className="w-100">
                      <Colxx lg="12">
                        <Card className="p-2">
                          <Row className="mt-2">
                            {img.id ? (
                              <>
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">{img.name}</Label>
                                  </div>
                                </Colxx>
                                <Colxx lg="7"></Colxx>
                              </>
                            ) : (
                              <>
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">
                                      Video/File Name
                                    </Label>
                                    <input
                                      className="form-control"
                                      name="logo"
                                      placeholder="Video/File Name"
                                      value={img.name}
                                      type="text"
                                      onChange={(e) => {
                                        let imgs = [...this.state.videoes];
                                        imgs[index]["name"] = e.target.value;
                                        this.setState({
                                          videoes: imgs,
                                        });
                                      }}
                                    />
                                  </div>
                                </Colxx>
                                <Colxx lg="4">
                                  <div className="form-group">
                                    <Label htmlFor="logo">Upload Video</Label>
                                    <input
                                      className="form-control"
                                      name="logo"
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => {
                                        let imgs = [...this.state.videoes];
                                        imgs[index]["file"] = e.target.files[0];
                                        imgs[index]["fileurl"] =
                                          URL.createObjectURL(
                                            e.target.files[0]
                                          );

                                        this.setState({
                                          videoes: imgs,
                                        });
                                      }}
                                    />
                                  </div>
                                </Colxx>
                                <Colxx
                                  lg="3"
                                  className="d-flex align-items-center mt-4"
                                >
                                  <Button
                                    className="btn float-right"
                                    onClick={() => {
                                      let imgs = [...this.state.videoes];
                                      imgs[index]["isUpload"] = true;
                                      this.setState({ videoes: imgs }, () => {
                                        this.uploadVideo(img, index);
                                      });
                                    }}
                                    style={{ background: "#1062fe" }}
                                  >
                                    {img.isUpload
                                      ? "Wait..."
                                      : img.uploaded
                                      ? "Reupload"
                                      : "Upload"}
                                  </Button>
                                </Colxx>
                              </>
                            )}

                            <Colxx
                              lg="1"
                              className="d-flex justify-content-center align-items-center"
                            >
                              <div className="d-flex align-items-center">
                                <i
                                  onClick={() => {
                                    this.handleVideoSteps(index);
                                  }}
                                  style={{
                                    fontSize: "24px",
                                  }}
                                  className={
                                    this.state.openedVideoSteps.includes(index)
                                      ? "ri-checkbox-indeterminate-fill float-left cursor-pointer text-primary fa-2x"
                                      : "ri-add-box-fill float-left cursor-pointer text-primary fa-2x"
                                  }
                                ></i>
                                <i
                                  className="ri-delete-bin-fill float-right cursor-pointer ml-2 text-danger"
                                  onClick={() => {
                                    this.handleVideoDelete(img, index);
                                  }}
                                  style={{
                                    fontSize: "24px",
                                    //   color: "#e2863b",
                                  }}
                                ></i>
                              </div>
                            </Colxx>
                          </Row>
                        </Card>
                      </Colxx>

                      {this.state.openedVideoSteps?.includes(index) ? (
                        <>
                          <Colxx lg="12">
                            <Row>
                              <Colxx lg="12">
                                <Card className="p-2">
                                  <Row>
                                    <Colxx lg="12">
                                      <video
                                        style={{
                                          width: "100%",
                                          height: "600px",
                                          objectFit: "fill",
                                        }}
                                        className="img-fluid"
                                        // autoPlay
                                        loop
                                        // muted
                                        playsInline
                                        controls
                                      >
                                        <source
                                          className="img-fluid"
                                          width="100%"
                                          src={img.processed_video}
                                          type="video/mp4"
                                        />
                                      </video>
                                    </Colxx>
                                  </Row>
                                </Card>
                              </Colxx>
                            </Row>
                          </Colxx>
                          <Colxx lg="12">
                            <Row>
                              <Colxx lg="12">
                                <Card className="p-2">
                                  <Line
                                    width={723}
                                    height={200}
                                    data={{
                                      labels: img.labels || [],
                                      datasets: [
                                        {
                                          label: "Focus",
                                          fill: false,
                                          lineTension: 0.5,
                                          backgroundColor:
                                            "rgba(255,64,64,0.2)",
                                          borderColor: "rgba(255,64,64,1)",
                                          borderCapStyle: "butt",
                                          borderDash: [],
                                          borderDashOffset: 0.0,
                                          borderJoinStyle: "miter",
                                          pointBorderColor: "rgba(255,64,64,1)",
                                          pointBackgroundColor: "#fff",
                                          pointBorderWidth: 1,
                                          pointHoverRadius: 5,
                                          pointHoverBackgroundColor:
                                            "rgba(255,64,64,1)",
                                          pointHoverBorderColor: "#fff",
                                          pointHoverBorderWidth: 2,
                                          pointRadius: 1,
                                          pointHitRadius: 10,
                                          data: img.cognitiveData,
                                        },
                                        {
                                          label: "Positive emotion",
                                          fill: false,
                                          lineTension: 0.5,
                                          backgroundColor:
                                            "rgba(103,177,115,0.2)",
                                          borderColor: "rgba(103,177,115,1)",
                                          borderCapStyle: "butt",
                                          borderDash: [],
                                          borderDashOffset: 0.0,
                                          borderJoinStyle: "miter",
                                          pointBorderColor:
                                            "rgba(103,177,115,1)",
                                          pointBackgroundColor: "#fff",
                                          pointBorderWidth: 1,
                                          pointHoverRadius: 5,
                                          pointHoverBackgroundColor:
                                            "rgba(103,177,115,1)",
                                          pointHoverBorderColor: "#eef0f2",
                                          pointHoverBorderWidth: 2,
                                          pointRadius: 1,
                                          pointHitRadius: 10,
                                          data: img.positiveData,
                                        },
                                        {
                                          label: "Cognitive Load",
                                          fill: false,
                                          lineTension: 0.5,
                                          backgroundColor:
                                            "rgba(80,133,230,0.2)",
                                          borderColor: "rgba(80,133,230,1)",
                                          borderCapStyle: "butt",
                                          borderDash: [],
                                          borderDashOffset: 0.0,
                                          borderJoinStyle: "miter",
                                          pointBorderColor:
                                            "rgba(80,133,230,1)",
                                          pointBackgroundColor: "#fff",
                                          pointBorderWidth: 1,
                                          pointHoverRadius: 5,
                                          pointHoverBackgroundColor:
                                            "rgba(80,133,230,1)",
                                          pointHoverBorderColor: "#eef0f2",
                                          pointHoverBorderWidth: 2,
                                          pointRadius: 1,
                                          pointHitRadius: 10,
                                          data: img.cognitiveMediumData,
                                        },
                                        {
                                          label: "Neutral emotion",
                                          fill: false,
                                          lineTension: 0.5,
                                          backgroundColor:
                                            "rgba(255,0,255,0.2)",
                                          borderColor: "rgba(255,0,255,1)",
                                          borderCapStyle: "butt",
                                          borderDash: [],
                                          borderDashOffset: 0.0,
                                          borderJoinStyle: "miter",
                                          pointBorderColor: "rgba(255,0,255,1)",
                                          pointBackgroundColor: "#fff",
                                          pointBorderWidth: 1,
                                          pointHoverRadius: 5,
                                          pointHoverBackgroundColor:
                                            "rgba(255,0,255,1)",
                                          pointHoverBorderColor: "#eef0f2",
                                          pointHoverBorderWidth: 2,
                                          pointRadius: 1,
                                          pointHitRadius: 10,
                                          data: img.neutralData,
                                        },
                                      ],
                                    }}
                                    options={{
                                      x: {
                                        ticks: {
                                          font: {
                                            family: "Poppins",
                                          },
                                        },
                                      },
                                      y: {
                                        ticks: {
                                          font: {
                                            family: "Poppins",
                                          },
                                        },
                                      },
                                      plugins: {
                                        legend: {
                                          labels: {
                                            // This more specific font property overrides the global property
                                            font: {
                                              family: "Poppins",
                                            },
                                          },
                                        },
                                      },
                                    }}
                                  />
                                </Card>
                              </Colxx>
                            </Row>
                          </Colxx>
                        </>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </Colxx>
                </>
              );
            })}
          </Row>
        </div>
      </>
    );
  }
}

export default ViewProject;
