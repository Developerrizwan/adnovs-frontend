import React from "react";
import { Col } from "reactstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

// Import Images
import logoLight from "../../assets/images/logo-light.png";

const AuthSlider = () => {
    return (
        <React.Fragment>

            <Col lg={6}>
                <div className="p-lg-5 p-4 auth-one-bg h-100">
                    <div className="bg-overlay"></div>
                    <div className="position-relative h-100 d-flex flex-column">
                        <div className="mb-4">
                            <Link to="/dashboard" className="d-block">
                                {/* <img src={logoLight} alt="" height="18" /> */}
                                <h2 className="text-white">Neurowonk</h2>
                            </Link>
                        </div>
                        <div className="mt-auto">
                            <div className="mb-3">
                                <i className="ri-double-quotes-l display-4 text-success"></i>
                            </div>

                            <Carousel showThumbs={false} autoPlay={true} showArrows={false} showStatus={false} infiniteLoop={true} className="carousel slide" id="qoutescarouselIndicators" >
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-16 fst-italic">" Empower your marketing team to make data-driven decisions with the help of our advanced neuromarketing software. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-16 fst-italic">" Take your marketing to the next level with our intuitive and user-friendly neuromarketing software. "</p>
                                    </div>
                                </div>
                                <div className="carousel-inner text-center text-white pb-5">
                                    <div className="item">
                                        <p className="fs-16 fst-italic">" Gain deep insights into consumer behavior and preferences with our advanced neuromarketing software. "</p>
                                    </div>
                                </div>
                            </Carousel>

                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment>
    );
};

export default AuthSlider;