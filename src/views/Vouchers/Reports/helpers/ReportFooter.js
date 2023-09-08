import React from "react";
import {
  BrowserChrome,
  EnvelopeAtFill,
  TelephoneFill,
} from "react-bootstrap-icons";

const FooterItem = ({ label }) => {
  return (
    <div
      style={{
        width: "200px",
      }}
    >
      <span
        style={{
          display: "block",
          textAlign: "center",
          borderBottom: "1px solid black",
        }}
      >
        ddddddddddd
      </span>
      <span
        style={{
          display: "block",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const ReportFooter = () => {
  return (
    <>
      <div
        style={{
          marginTop: "5%",
          marginBottom: "10%",
        }}
        className="d-flex justify-content-around align-items-center"
      >
        <FooterItem label={"Accountant (Adnovs Logistics)"} />
        <FooterItem label={"Checked By"} />
        <FooterItem label={"Receiver's Signature"} />
      </div>
      <div
        className="mt-3 p-3 d-flex justify-content-between align-items-center"
        style={{
          background: "#009ada",
          color: "#fff",
        }}
      >
        <h4 className="text-light">
          <BrowserChrome /> www.adnov.com
        </h4>

        <h4 className="text-light">
          <EnvelopeAtFill /> adnov@gmail.com
        </h4>

        <h4 className="text-light">
          <TelephoneFill /> +91 9999999999
        </h4>
      </div>
    </>
  );
};

export default ReportFooter;
