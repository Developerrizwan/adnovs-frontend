import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import logoSm from "../assets/images/small-logo.png";
import logoDark from "../assets/images/ship-logo.png";
import logoLight from "../assets/images/logo-light.png";

//Import Components
import VerticalLayout from "./VerticalLayouts/index";
import TwoColumnLayout from "./TwoColumnLayout";
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";

const Sidebar = ({ layoutType }) => {
  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (
      document.documentElement.getAttribute("data-sidebar-size") === "sm-hover"
    ) {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    } else if (
      document.documentElement.getAttribute("data-sidebar-size") ===
      "sm-hover-active"
    ) {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    }
  };

  return (
    <React.Fragment>
      <div
        className="app-menu navbar-menu"
        // style={{
        //   background: "grey",
        // }}
      >
        <div className="navbar-brand-box" style={{ background: "#494a4d" }}>
          <div className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
              {/* hdhhf */}
            </span>
            <span className="logo-lg w-100">
              <img src={logoDark} className="img-fluid" alt="" height="17" />
              {/* <div
                className="dummy"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10%",
                }}
              >
                <h1>ADNOV</h1>
              </div> */}
            </span>
          </div>
          {/* <hr style={{ color: "white", width: "100%" }} /> */}
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              {/* <img src={logoSm} alt="" height="22" /> */}
            </span>
            <span className="logo-lg">
              {/* <img src={logoLight} alt="" height="17" /> */}
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === "twocolumn" ? (
          <TwoColumnLayout layoutType={layoutType} />
        ) : (
          <SimpleBar id="scrollbar" className="h-100">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <VerticalLayout layoutType={layoutType} />
              </ul>
            </Container>
          </SimpleBar>
        )}
        <div className="sidebar-background"></div>
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
