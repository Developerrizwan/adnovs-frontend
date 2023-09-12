import React, { useEffect, useState } from "react";
import moment from "moment";
import numberToWords from "number-to-words";

import apiAuth from "../../../helpers/ApiAuth";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import NotificationManager from "../../../components/Common/NotificationManager";

const Content = ({ data }) => {
  // console.log("receipt", data);

  var word_amount = Number.isFinite(Number(data?.voucher?.amount_sar))
    ? numberToWords.toWords(Number(data?.voucher?.amount_sar))
    : String(data?.voucher?.amount_sar);
  word_amount = String(
    word_amount.charAt(0).toUpperCase() + word_amount.slice(1)
  );

  return (
    <div id="content" className="mt-5 mx-4">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        RECEIPT VOUCHER
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem
            label={"Received From"}
            value={data?.voucher?.received_from || ""}
          />
          <DisplayItem
            label={"A/C Name"}
            value={data?.voucher?.party_account?.name || ""}
          />
          <DisplayItem
            label={"Type"}
            value={data?.voucher?.instrument_type || ""}
          />
          <DisplayItem label={"Narration"} value={data?.voucher?.naration} />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"Receipt No"} value={""} />
          <DisplayItem
            label={"Date"}
            value={moment(data?.voucher?.date).format("DD/MM/YYYY")}
          />
          <DisplayItem
            label={"Cheque/Ref.No"}
            value={data?.voucher?.ref_no || ""}
          />
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
                <span className="p-2">{data?.voucher?.received_from}</span>
                <br />
                <div className="d-flex justify-content-between align-items-center p-2">
                  <span>ADN/INV/23/0096 </span>
                  <span>
                    {moment(data?.voucher?.date).format("DD/MM/YYYY")}{" "}
                  </span>
                  <span>{data?.voucher?.ref_no}</span>
                  <span>{Number(data?.voucher?.amount_sar).toFixed(2)}</span>
                </div>
              </div>
            </td>
            <td className="text-center w-25">
              {Number(data?.voucher?.amount_sar).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        <span>{word_amount} Only </span>
        <span style={{ marginLeft: "30px", marginRight: "10px" }}>
          {Number(data?.voucher?.amount_sar).toFixed(2)}
        </span>
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

const ReceiptReport = (props) => {
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
        getTableData(id);
        setState((prev) => ({ ...prev, voucher: data }));
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Voucher.", 3000, null, null, "");
      });
  };

  const getTableData = (id) => {
    apiAuth
      .get(`/api/master/accountdetails/?voucher=${id}`)
      .then((response) => {
        let data = response.data?.results;
        setState((prev) => ({ ...prev, accounts: data }));
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

          width: "1000px",
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
          <ReportHeader data={state?.voucher?.company} />

          {/* Content */}
          <Content data={state} />

          {/* Footer */}
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default ReceiptReport;
