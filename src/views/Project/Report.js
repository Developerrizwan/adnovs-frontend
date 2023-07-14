import React, { Component, useEffect, useState } from "react";
import { Row, Button, Label, Container, Card } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";
import PRIAPI from "../../pages/DashboardCrm/PRIAPI";
import BreadCrumb from "../../components/Common/BreadCrumb";
//import images
import logoDark from "../../assets/images/logo-dark.png";
import bg from "../../assets/images/bg.png";
import EEG from "../../assets/images/EEG.png";
import how from "../../assets/images/how.png";
import arrow from "../../assets/images/arrow.png";
import heatmap from "../../assets/images/heatmap.png";
import catchmasala from "../../assets/images/catchmasala.png";
import maggi from "../../assets/images/maggi.png";
import pavBhaji from "../../assets/images/pavBhaji.png";
import bgPic from "../../assets/images/bgPic.png";
import bgPic2 from "../../assets/images/bgPic.png";
import { Box } from "@mui/material";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useParams } from "react-router";

const Report = (props) => {
  // const [imgs, setImgs] = useState(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  const params = useParams();

  async function exportProjectToPdf() {
    setLoading(true);
    const doc = new jsPDF("p", "px");
    const elements = document.getElementsByClassName("reportdownproject");
    await creatPdf({ doc, elements });

    doc.save(`${state.project?.name}-report.pdf`);
    setLoading(false);
  }

  async function creatPdf({ doc, elements }) {
    let top = 20;
    const padding = 10;

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);
      try {
        const imgData = await htmlToImage.toPng(el);
        // setImgs(imgData);

        let elHeight = el.offsetHeight;
        let elWidth = el.offsetWidth;

        const pageWidth = doc.internal.pageSize.getWidth();

        if (elWidth > pageWidth) {
          const ratio = pageWidth / elWidth;
          elHeight = elHeight * ratio - padding;
          elWidth = elWidth * ratio - padding;
        }

        const pageHeight = doc.internal.pageSize.getHeight();

        if (top + elHeight > pageHeight) {
          doc.addPage();
          top = 20;
        }

        doc.addImage(
          imgData,
          "PNG",
          padding,
          top,
          elWidth,
          elHeight,
          `image${i}`
        );
        top += elHeight;
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleProject = () => {
    const { reportId } = params;

    apiAuth
      .get("/api/projectfiles/?project_id=" + reportId)
      .then((res) => {
        let data = res.data;
        let project = data.project;
        let client = data.client;
        let images = data?.project_files?.map((ig) => {
          ig["type"] = "VisType.HEATMAP";
          return ig;
        });
        setState({
          ...state,
          images: images,
          project: project,
          client: client,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleProject();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Report"
            pageTitle="Report"
            back_button={true}
            history={props.history}
          />
        </Container>
        {state.project ? (
          <Container fluid>
            <button
              className="button"
              onClick={exportProjectToPdf}
              style={{
                borderRadius: "10px 10px",
                padding: "8px",
                background: "#1062fe",
                fontWeight: 600,
                border: "#3d78e3",
                color: "#fff",
                margingLeft: "50%",
              }}
            >
              {loading ? "Downloading..." : "Download As PDF"}
            </button>
            {/* <img src={imgs} alt="" width={"100%"} height={"100%"} /> */}
            <Row>
              <Colxx lg="12" className="reportdownproject mt-2">
                <Card
                  style={{
                    borderRadius: "5px 5px",
                    padding: "6%",
                    background: `url(${bgPic})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Colxx>
                      {/* <img
                      src={logoDark}
                      className="img-fluid"
                      alt=""
                      style={{
                        width: "15%",
                        marginBottom: "20%",
                        marginTop: "2%",
                      }}
                    /> */}
                      <h4
                        style={{
                          marginBottom: "20%",
                          marginTop: "2%",
                        }}
                      >
                        NEUROWONK
                      </h4>
                      <h1 style={{ fontSize: "2.6rem", color: "#000" }}>
                        {state.project?.name} Report
                      </h1>
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>
              {/* <hr/> */}
              <Colxx lg="12" xs="12" className="reportdownproject">
                <Card style={{ padding: "4%" }}>
                  <Row>
                    <Colxx lg="6" xs="12">
                      <h2
                        style={{
                          color: "#3d78e3",
                          marginTop: "2%",

                          marginTop: "5%",
                        }}
                      >
                        EEG and Eye tracking
                      </h2>
                      <p style={{ marginTop: "6%", fontSize: "1.2rem" }}>
                        Eye-tracking helps us to track where the userwas looking
                        on your product and generateattention maps based on
                        first 5 seconds ofviewing activity.
                      </p>
                      <p style={{ marginTop: "4%", fontSize: "1.2rem" }}>
                        Researches have proved that first 5 secondsof consumer
                        viewing activity influences theirbuying behavior of the
                        product.
                      </p>
                      <p style={{ marginTop: "4%", fontSize: "1.2rem" }}>
                        EEG analysis helps us to understand how theconsumer
                        engages with the product and how the brand placement and
                        design influencesthe purchase of the product.
                      </p>
                    </Colxx>
                    <Colxx lg="6" xs="12">
                      <img src={EEG} alt="" style={{ width: "100%" }} />
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>

              <Colxx lg="12" xs="12" className="reportdownproject">
                <Card style={{ padding: "4%" }}>
                  <Row>
                    <Colxx lg="7" xs="12">
                      <h2
                        style={{
                          color: "#3d78e3",
                          marginTop: "6%",
                        }}
                      >
                        How do we do it?
                      </h2>
                      <p style={{ marginTop: "6%", fontSize: "1.2rem" }}>
                        We test participants with hardware-enabled{" "}
                        <span style={{ fontWeight: 700 }}> eye-trackers</span>
                        and{" "}
                        <span style={{ fontWeight: 700 }}>
                          {" "}
                          and collect these data.
                        </span>
                      </p>
                      <p style={{ marginTop: "4%", fontSize: "1.2rem" }}>
                        This gives us unique access to their responses asthey
                        unfold over time. With Research you can analyze and
                        diagnose where the customer experience succeeds and
                        where it goes wrong.
                      </p>
                      <p style={{ marginTop: "4%", fontSize: "1.2rem" }}>
                        We then use this data to train predictive AI models that
                        gives both visual attention prediction as well as
                        cognitive response prediction.
                      </p>
                    </Colxx>
                    <Colxx lg="5" xs="12">
                      <img src={how} alt="" style={{ width: "80%" }} />
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>

              <Colxx lg="12" className="reportdownproject">
                <Card style={{ padding: "15%", textAlign: "center" }}>
                  <h1
                    style={{
                      marginBottom: "4%",
                      color: "#000",
                      fontSize: "2.5rem",
                    }}
                  >
                    {state.project?.name} Tests
                  </h1>
                  <div style={{ textAlign: "center" }}>
                    <img src={arrow} alt="" style={{ width: "16%" }} />
                  </div>
                </Card>
              </Colxx>

              <Colxx lg="12" xs="12" className="reportdownproject">
                <Card style={{ padding: "4%" }}>
                  <h2
                    style={{
                      color: "#3d78e3",
                      marginTop: "2%",

                      marginTop: "2%",
                    }}
                  >
                    Measurement Factors
                  </h2>
                  <p
                    style={{
                      marginTop: "1%",
                      fontSize: "1.2rem",
                      color: "grey",
                    }}
                  >
                    Our algorithm takes into account various aspects of your
                    design – the amount of text, text size, and text contrast,
                    colorfulness, number of images, and their size.
                  </p>
                  <Row style={{ marginTop: "3%" }}>
                    <Colxx lg="4" xs="12">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "90%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Dullness score:
                        </h3>
                        <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          Image Dullness Score <br /> Dull Images may not be
                          good for the advertisement purposes. The analysis of
                          prominent colors present in the images can indicate a
                          lot about if the image is dull or not.
                        </p>
                        {/* <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Severe Difficulty (0-29)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Moderate Difficulty (30-59)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Optimal Clarity (60-94)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Too Simple (95-100)
                            </span>
                          </li>
                        </ul> */}
                      </Card>
                    </Colxx>
                    <Colxx lg="4" xs="12">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "90%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Whiteness score:
                        </h3>
                        <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          Image Whiteness Score <br /> Some images can be too
                          white or too bright which might not be good for the
                          advertisement purposes. The analysis of prominent
                          colors present in the images can indicate if the
                          images are too white.
                        </p>
                        {/* <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Less Memorable (0-49)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Medium Memorable (50-89)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Highly Memorable (90-100)
                            </span>
                          </li>
                        </ul> */}
                      </Card>
                    </Colxx>
                    <Colxx lg="4" xs="12">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "90%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Uniformity score:
                        </h3>
                        <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          Average Pixel Width <br /> Some images may contain no
                          pixel variation and are entirely uniform. Average
                          Pixel Width is a measure which indicates the number of
                          edges present in the image. If this number comes out
                          to be very low, then the image is most likely a
                          uniform image and may not represent right content.
                        </p>
                        {/* <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Low valence (0-39)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Medium valence (40-70)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              High valence (70-100)
                            </span>
                          </li>
                        </ul> */}
                      </Card>
                    </Colxx>
                    <Colxx lg="4" xs="12">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "90%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Blurriness score:
                        </h3>
                        <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          This score calculates if the image is blur or if it
                          contains some elements that have some blur effect.
                        </p>
                        {/* <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Less Memorable (0-49)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Medium Memorable (50-89)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Highly Memorable (90-100)
                            </span>
                          </li>
                        </ul> */}
                      </Card>
                    </Colxx>
                    <Colxx lg="4" xs="12">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "90%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Memory Score:
                        </h3>
                        <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          This score is calculated based on image memorability
                          data (containing 60,000 images from diverse sources).
                          Using state-of-the-art machine learning models, we can
                          make quantified predictions about how much people will
                          remember in an image based on intrinsic memorability
                          of that image.
                        </p>
                        {/* <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Less Memorable (0-49)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Medium Memorable (50-89)
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Highly Memorable (90-100)
                            </span>
                          </li>
                        </ul> */}
                      </Card>
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>

              {state.images?.map((img) => {
                return (
                  <>
                    <Colxx
                      key={img.name}
                      lg="12"
                      xs="12"
                      className="reportdownproject"
                    >
                      <Card style={{ padding: "4%" }}>
                        <Row>
                          <Colxx lg="6" xs="12">
                            <img
                              src={img.file}
                              alt=""
                              style={{ width: "60%" }}
                            />
                          </Colxx>
                          <Colxx lg="6" xs="12">
                            <h2
                              style={{
                                color: "#000",
                                marginTop: "2%",
                              }}
                            >
                              {img.name} Heatmaps Score
                            </h2>
                            <hr />
                            <p style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                              Whiteness Score -{" "}
                              {Number(img.whiteness_score || 0).toFixed(2)}
                              {/* <span style={{ color: "grey" }}>
                              (Moderate Difficulty)
                            </span> */}
                            </p>
                            <p style={{ fontSize: "1.2rem" }}>
                              Dullness Score -{" "}
                              {Number(img.dullness_score || 0).toFixed(2)}
                              {/* <span style={{ color: "grey" }}>
                              (Medium Memorable)
                            </span> */}
                            </p>
                            <p style={{ fontSize: "1.2rem" }}>
                              Uniformity Score -{" "}
                              {Number(img.uniformity_score || 0).toFixed(2)}
                              {/* <span style={{ color: "grey" }}>
                              (Medium Valence)
                            </span> */}
                            </p>
                            <p style={{ fontSize: "1.2rem" }}>
                              Blurriness Score -{" "}
                              {Number(img.blurrness_score || 0).toFixed(2)}
                              {/* <span style={{ color: "grey" }}>
                              (Medium Valence)
                            </span> */}
                            </p>
                            <p style={{ fontSize: "1.2rem" }}>
                              Memorability Score -{" "}
                              {Number(img.memorability_score || 0).toFixed(2)}
                              {/* <span style={{ color: "grey" }}>
                              (Medium Valence)
                            </span> */}
                            </p>
                          </Colxx>
                        </Row>
                      </Card>
                    </Colxx>
                    <Colxx lg="12" xs="12" className="reportdownproject">
                      <Card style={{ padding: "4%" }}>
                        <h2
                          style={{
                            color: "#3d78e3",
                            marginTop: "2%",
                          }}
                        >
                          {img.name} Supporting Evidence
                        </h2>
                        <p
                          style={{
                            marginTop: "1%",
                            fontSize: "1.2rem",
                            color: "grey",
                          }}
                        >
                          Comparisons with baseline
                        </p>
                        <Row style={{ marginTop: "3%" }}>
                          <Colxx lg="4" xs="12">
                            <Card
                              style={{
                                padding: "2%",
                                backgroundColor: "#F4F5FF",
                                borderRadius: "20px 20px",
                                height: "100%",
                              }}
                            >
                              <div style={{ textAlign: "center" }}>
                                <img
                                  src={`data:image/png;base64, ${img["heatmaps"]["VisType.HEATMAP_OVERLAY"]}`}
                                  alt=""
                                  style={{
                                    width: "90%",
                                    borderRadius: "20px 20px",
                                  }}
                                />
                              </div>
                            </Card>
                          </Colxx>
                          <Colxx lg="4" xs="12">
                            <Card
                              style={{
                                padding: "2%",
                                backgroundColor: "#F4F5FF",
                                borderRadius: "20px 20px",
                                height: "100%",
                              }}
                            >
                              <div style={{ textAlign: "center" }}>
                                <img
                                  src={`data:image/png;base64, ${img["heatmaps"]["VisType.SPOTLIGHT"]}`}
                                  alt=""
                                  style={{
                                    width: "90%",
                                    borderRadius: "20px 20px",
                                  }}
                                />
                              </div>
                            </Card>
                          </Colxx>
                          <Colxx lg="4" xs="12">
                            <Card
                              style={{
                                padding: "2%",
                                backgroundColor: "#F4F5FF",
                                borderRadius: "20px 20px",
                                height: "100%",
                              }}
                            >
                              <div style={{ textAlign: "center" }}>
                                {" "}
                                <img
                                  src={`data:image/png;base64, ${img["heatmaps"]["VisType.SPOTLIGHT_LEVEL_SETS"]}`}
                                  alt=""
                                  style={{
                                    width: "90%",
                                    borderRadius: "20px 20px",
                                  }}
                                />
                              </div>
                            </Card>
                          </Colxx>
                        </Row>
                      </Card>
                    </Colxx>
                  </>
                );
              })}

              {/* <Colxx lg="12" xs="12" className="reportdownproject">
                <Card style={{ padding: "4%" }}>
                  <h2
                    style={{
                      color: "#3d78e3",
                      marginTop: "2%",
                    }}
                  >
                    Recommendation
                  </h2>
                  <p
                    style={{
                      marginTop: "1%",
                      fontSize: "1.2rem",
                      color: "grey",
                    }}
                  >
                    Comparisons with baseline
                  </p>
                  <Row style={{ marginTop: "3%" }}>
                    <Colxx lg="6">
                      <Box
                        style={{
                          padding: "10%",
                          border: "5px solid #F4F5FF",
                          borderRadius: "20px 20px",
                          height: "100%",
                        }}
                      >
                        <h2
                          style={{
                            color: "#000",
                            marginTop: "2%",
                          }}
                        >
                          Context
                        </h2>
                        <p style={{ marginTop: "6%", fontSize: "1.2rem" }}>
                          Comparison of Attention Maps, Clarity Scores, Memory
                          Scores and Valence Scores with similar products in the
                          market show a comparative negative design acceptance
                          curve.
                        </p>
                      </Box>
                    </Colxx>

                    <Colxx lg="6">
                      <Card
                        style={{
                          padding: "10%",
                          backgroundColor: "#F4F5FF",
                          borderRadius: "20px 20px",
                          height: "100%",
                        }}
                      >
                        <h3 style={{ color: "#000", marginTop: "2%" }}>
                          Suggestions
                        </h3>

                        <ul style={{ marginTop: "5%", fontSize: "1.2rem" }}>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Brand placement is good but could be made
                              morevisible to avoid corner of death. This could
                              be done byplacing the brand name in the center.
                              This would alsoincrease the Memory score which
                              will help in brandremembrance.
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              All the designs show medium and lower valence
                              values. This could be improved by making the food
                              images placed in a way to come under line of
                              sight.
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Low valence value could also be improved by adding
                              positive text such as "delicious" , "tasty" , etc.
                              on the design.
                            </span>
                          </li>
                          <li style={{ color: "#3d78e3" }}>
                            <span style={{ color: "#000" }}>
                              Clarity Scores should be improved by using more
                              contrasting colors instead of similar and merging
                              colors
                            </span>
                          </li>
                        </ul>
                      </Card>
                    </Colxx>
                  </Row>
                </Card>
              </Colxx> */}

              <Colxx lg="12" className="reportdownproject">
                <Card
                  style={{
                    borderRadius: "5px 5px",
                    padding: "6%",
                    background: `url(${bgPic2})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Colxx lg="6">
                      {/* <img
                      src={logoDark}
                      className="img-fluid"
                      alt=""
                      style={{ width: "20%", marginBottom: "30%" }}
                    /> */}
                      <h4
                        style={{
                          marginBottom: "30%",
                          marginTop: "2%",
                        }}
                      >
                        NEUROWONK
                      </h4>
                      <h1 style={{ fontSize: "3.6rem", color: "#000" }}>
                        Thank you!
                      </h1>
                    </Colxx>
                  </Row>
                </Card>
              </Colxx>
            </Row>
          </Container>
        ) : (
          <div className="loading"></div>
        )}
      </div>
    </>
  );
};

export default Report;
