import React, { Component } from "react";
import { Row, Button, Label, Container, Card } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";
import PRIAPI from "../../pages/DashboardCrm/PRIAPI";
import { async } from "q";

class FilesUpload extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      images: [
        {
          name: "",
          file: "",
          fileurl: "",
          heatmaps: {},
          type: "VisType.HEATMAP",
        },
      ],
      openedSteps: [0],

      videoes: [
        {
          name: "",
          file: "",
          fileurl: "",
        },
      ],
      openedVideoSteps: [0],
    };
  }

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
    }

    this.setState({ openedVideoSteps });
  }

  predictImage = (img, index) => {
    if (img.file && img.name) {
      let fdata = new FormData();
      fdata.append("file", img.file);
      fdata.append("name", img.name);
      fdata.append("project", this.props.project?.id);

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

  handleSave = async () => {
    // let imgs = [...this.state.images];

    // await imgs.map(async (ig) => {
    //   if (ig.id) {
    //     await apiAuth
    //       .patch("/api/projectfiles/" + ig.id + "/", {
    //         heatmaps: ig.heatmaps,
    //         whiteness_score: ig.heatmaps?.lightness_score,
    //         dullness_score: ig.heatmaps?.dullness_score,
    //         uniformity_score: ig.heatmaps?.uniformity_score,
    //         blurrness_score: ig.heatmaps?.blurrness_score,
    //         memorability_score: ig.heatmaps?.memorability_score,
    //       })
    //       .then((res) => {
    //         let data = res.data;
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // });

    NotificationManager.success(
      "",
      "Images/Videoes Added Successfully.",
      3000,
      null,
      null,
      ""
    );

    this.props.history.push("/project");
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
      fdata.append("project", this.props.project?.id);

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

  render() {
    return (
      <>
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
                          <Colxx lg="4">
                            <div className="form-group">
                              <Label htmlFor="logo">Image/File Name</Label>
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
                                  imgs[index]["fileurl"] = URL.createObjectURL(
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
                                    imgs[index]["type"] = "VisType.SPOTLIGHT";
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
                                    img.type === "VisType.SPOTLIGHT_LEVEL_SETS"
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
                                        ? img.fileurl
                                        : `data:image/png;base64, ${
                                            img["heatmaps"][img.type]
                                          }`
                                    }
                                    alt=""
                                    width="100%"
                                    style={{
                                      maxHeight: "65vh",
                                    }}
                                    className="img-fluid"
                                  />
                                </Colxx>
                              </Row>
                            </Card>
                          </Colxx>
                          <Colxx lg="12">
                            <Row className="d-flex justify-content-around">
                              <Colxx lg="1"></Colxx>
                              <Colxx lg="2">
                                <Card classname="d-flex flex-column justify-content-center align-items-center">
                                  <p className="mt-2 d-flex justify-content-center">
                                    Whiteness Score
                                  </p>
                                  <p className="d-flex justify-content-center">
                                    {Number(
                                      img["heatmaps"]["lightness_score"] || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card classname="d-flex flex-column justify-content-center align-items-center">
                                  <p className="mt-2 d-flex justify-content-center">
                                    Dullness Score
                                  </p>
                                  <p className="d-flex justify-content-center">
                                    {Number(
                                      img["heatmaps"]["dullness_score"] || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card classname="d-flex flex-column justify-content-center align-items-center">
                                  <p className="mt-2 d-flex justify-content-center">
                                    Uniformity Score
                                  </p>
                                  <p className="d-flex justify-content-center">
                                    {Number(
                                      img["heatmaps"]["uniformity_score"] || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card classname="d-flex flex-column justify-content-center align-items-center">
                                  <p className="mt-2 d-flex justify-content-center">
                                    Blurriness Score
                                  </p>
                                  <p className="d-flex justify-content-center">
                                    {Number(
                                      img["heatmaps"]["blurrness_score"] || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                              <Colxx lg="2">
                                <Card classname="d-flex flex-column justify-content-center align-items-center">
                                  <p className="mt-2 d-flex justify-content-center">
                                    Memorability Score
                                  </p>
                                  <p className="d-flex justify-content-center">
                                    {Number(
                                      img["heatmaps"]["memorability_score"] || 0
                                    ).toFixed(2)}
                                  </p>
                                </Card>
                              </Colxx>
                            </Row>
                          </Colxx>
                        </Row>
                      </Colxx>
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
                          <Colxx lg="4">
                            <div className="form-group">
                              <Label htmlFor="logo">Video/File Name</Label>
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
                                  imgs[index]["fileurl"] = URL.createObjectURL(
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
                          <Colxx
                            lg="1"
                            className="d-flex justify-content-center align-items-center"
                          >
                            <div className="d-flex align-items-center">
                              {/* <i
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
                              ></i> */}
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
                    <div>
                      <Button
                        onClick={() => this.handleSave()}
                        style={{ background: "#1062fe" }}
                      >
                        Save & Complete
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          this.props.history.push("/project");
                        }}
                        style={{ background: "#1062fe" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
        </Row>
      </>
    );
  }
}

export default FilesUpload;
