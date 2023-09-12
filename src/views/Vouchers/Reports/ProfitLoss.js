import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import moment from "moment";

const Content = ({ voucher }) => {
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        PROFIT LOSS SUMMARY
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <table>
            <tr>
              <td className="border-0 fw">Branch Name:</td>
              <td className="border-0"></td>
            </tr>
            <tr>
              <td className="border-0 fw">Currency:</td>
              <td className="border-0"></td>
            </tr>
          </table>
        </div>
        <div id="right-side-items">
          <table>
            <tr>
              <td className="border-0 fw"></td>
              <td className="border-0"></td>
            </tr>
            <tr>
              <td className="border-0 fw">To:</td>
              <td className="border-0"></td>
            </tr>
          </table>
        </div>
      </div>

      {/* Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center w-50">Group Name</th>
            <th className="text-center w-25">Previous Amount</th>
            <th className="text-center w-25">Current Amount</th>
          </tr>
          <tr>
            <td className="text-center border-top-0 border-bottom-0">
              Air Export Income
            </td>
            <td className="text-center border-top-0 border-bottom-0">5</td>
            <td className="text-center border-top-0 border-bottom-0">12</td>
          </tr>
          <tr>
            <td className="text-center border-top-0 border-bottom-0">
              Sea Import Income
            </td>
            <td className="text-center border-top-0 border-bottom-0">5</td>
            <td className="text-center border-top-0 border-bottom-0">12</td>
          </tr>
          <tr>
            <td className="text-center border-top-0">Profit Loss Total</td>
            <td className="text-center border-top-0"></td>
            <td className="text-center border-top-0"></td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        {console.log("ssssssss", voucher?.amount_sar)}
        {/* <RupeesToWordsConverter amount={voucher?.amount_sar} /> */}
        <span style={{ marginLeft: "30px" }}>{voucher?.amount_sar}</span>
      </h5>
    </div>
  );
};

const DisplayItem = ({ label, value }) => {
  return (
    <>
      <div className="my-1">
        <span
          style={{ fontWeight: 600, width: "130px", display: "inline-block" }}
        >
          {label}
        </span>
        : {value}
      </div>
    </>
  );
};

const ProfitLoss = (props) => {
  const [state, setState] = useState({});

  useEffect(() => {
    let id = Number(props.match.params.id);
    getVoucherData(id);
  }, []);

  const getVoucherData = (id) => {
    apiAuth
      .get(`/api/master/voucher/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, voucher: data });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Voucher.", 3000, null, null, "");
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
            //   padding: "10px",
          }}
        >
          {/* Header */}
          <ReportHeader />

          {/* Content */}
          <Content voucher={state?.voucher} />

          {/* Footer */}
          {/* <ReportFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
