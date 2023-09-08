import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportFooter from "./helpers/ReportFooter";
import ReportHeader from "./helpers/ReportHeader";
import DownloadReport from "./helpers/DownloadReport";

const Content = () => {
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        RECEIPT VOUCHER - ADN/RV/23/0057
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem
            label={"Received From"}
            value={
              "QC CLOUD - TAQNIYYAT AL-SAHAB FOR INF ORMATION TECHNOLOGY EST"
            }
          />
          <DisplayItem label={"A/C Name"} value={"SNB BANK"} />
          <DisplayItem label={"Type"} value={"CASH"} />
          <DisplayItem
            label={"Narration"}
            value={"AYMENT RECEIVED FROM QC CLOUD TO SNB"}
          />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"Receipt No"} value={"ADN/RV/23/0057"} />
          <DisplayItem label={"Date"} value={"02-AUG-23 ( POSTED )"} />
          <DisplayItem label={"Cheque/Ref.No"} value={"CHECK123"} />
        </div>
      </div>

      {/* Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center w-75">Description</th>
            <th className="text-center w-25">Amount</th>
          </tr>
          <tr>
            <td className=" w-25">
              <div className=" ">
                <span className="p-2">
                  QC CLOUD - TAQNIYYAT AL-SAHAB FOR INFORMATION TECHNOLOGY EST
                  157-21003054 / UK-DMM
                </span>
                <br />
                <div className="d-flex justify-content-between align-items-center p-2">
                  <span>ADN/INV/23/0096 </span>
                  <span>10-JUL-23 </span>
                  <span>157-21003054 / UK-DMM</span>
                  <span>29,233.40</span>
                </div>
              </div>
            </td>
            <td className="text-center w-25">29,233.40</td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        Twenty-Nine thousand Two Hundred Thirty-Three and forty Only
        <span style={{ marginLeft: "30px" }}>29,233.40</span>
      </h5>

      {/* Computer generated Text */}
      <div className="d-flex justify-content-center align-items-center my-5">
        <p style={{ width: "45%", fontWeight: 600 }}>
          This is a computer generated document and does not require a signature
          Receipt issued for cheque payments will be subject to realization of
          the cheque
        </p>
      </div>
    </div>
  );
};

const DisplayItem = ({ label, value }) => {
  return (
    <>
      <span>
        <span
          style={{ fontWeight: 600, width: "120px", display: "inline-block" }}
        >
          {label}
        </span>
        : {value}
      </span>
      <br />
    </>
  );
};

const ReceiptReport = (props) => {
  const [state, setState] = useState({ costs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let id = Number(props.match.params.id);
    getVoucherData(id);
  }, []);

  const getVoucherData = (id) => {
    apiAuth
      .get(`/api/master/voucher/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, invoice: data });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Invoice.", 3000, null, null, "");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: "15px",
          marginBottom: "15px",

          width: "1200px",
        }}
      >
        {/* Download */}
        <DownloadReport />

        {/* Page for downloading pdf */}
        <div
          className="card reportdownproject"
          style={{
            border: "1px solid black",
            margin: "5px",
            padding: "10px",
          }}
        >
          {/* Header */}
          <ReportHeader />

          {/* Content */}
          <Content />

          {/* Footer */}
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default ReceiptReport;
