import React from "react";
import shipLogo from "../../../../assets/images/ship-logo.png";
import Translate from "../../../TaxInvoice/Translate";

const ReportHeader = ({ data }) => {
  // console.log("headerrr", data);
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
          <h3 style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
            {data?.account_name}
          </h3>
          <span>
            {data?.account_name ? (
              <Translate
                fontsize={"24px"}
                fontWeight={600}
                text={data?.account_name || ""}
              />
            ) : (
              ""
            )}
          </span>

          <div className="d-flex flex-column align-items-end">
            <span>{data?.address}</span>
            <br />
            <span>
              {data?.state} , {data?.country}
            </span>
            <br />
            {/* <span>CR : 4030471839</span>
            <br /> */}
            <span>VAT : {data?.vat_number}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportHeader;
