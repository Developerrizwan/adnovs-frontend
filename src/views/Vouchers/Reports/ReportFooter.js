import React from "react";

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
  );
};

export default ReportFooter;
