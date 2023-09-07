import React from "react";
import shipLogo from "../../../assets/images/ship-logo.png";

const ReportHeader = () => {
  return (
    <>
      <div className="row" style={{ placeItems: "center" }}>
        {/* Logo */}
        <div className="col-lg-3 mb-1">
          <img
            src={shipLogo}
            alt=""
            width={200}
            style={{ margin: "auto", display: "block" }}
          />
        </div>

        {/* Company Details */}
        <div className="col-lg-9 d-flex flex-column align-items-end p-4">
          <h4 style={{ fontFamily: "sans-serif" }}>
            ADNOV SHIPPING & LOGISTICS
          </h4>
          <div className="d-flex flex-column align-items-end">
            <span>Al Malik Khalid Road, Hayy Sharafiyya - 7748,</span>
            <br />
            <span>Jeddah 22234 Kingdom Of Saudi Arabia</span>
            <br />
            <span>CR : 4030471839</span>
            <br />
            <span>VAT : 311281265600003</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportHeader;
