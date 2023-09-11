import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import moment from "moment";
import RupeesToWordsConverter from "./helpers/RupeesToWordsConverter";

const Content = ({ voucher }) => {
  // console.log("payment", voucher);
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        PAYMENT VOUCHER - ADN/RV/23/0057
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem label={"Paid To"} value={voucher?.pay_to} />
          <DisplayItem
            label={"Date"}
            value={moment(voucher?.date).format("DD/MM/YYYY")}
          />
          <DisplayItem label={"Paid From"} value={"SNB BANK "} />
          <DisplayItem label={"Job No"} value={voucher?.job?.job_number} />
          <DisplayItem
            label={"Reference No./ Date"}
            value={voucher?.job?.ref_date}
          />
          <DisplayItem label={"Remarks"} value={voucher?.job?.remarks} />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"Payment No"} value={""} />
          <DisplayItem
            label={"GL Date"}
            value={moment(voucher?.gl_date).format("DD/MM/YYYY")}
          />
          <DisplayItem label={"Type"} value={voucher?.instrument_type || ""} />
          <DisplayItem label={"Client"} value={""} />
          <DisplayItem label={"Narration"} value={voucher?.naration} />
        </div>
      </div>

      {/* Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center w-50">Description</th>
            <th className="text-center w-25">Shipment/Job No </th>
            <th className="text-center w-25">Amount</th>
          </tr>
          <tr>
            <td className=" w-50">
              <div className=" ">
                <span className="p-2"></span>
              </div>
            </td>
            <td className="text-center w-25">{voucher?.job?.job_number}</td>
            <td className="text-center w-25"></td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        {console.log("ssssssss", voucher?.amount_sar)}
        {/* <RupeesToWordsConverter amount={voucher?.amount_sar} /> */}
        <span style={{ marginLeft: "30px" }}>{voucher?.amount_sar}</span>
      </h5>

      {/* Second Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center">Against V.No </th>
            <th className="text-center">Date </th>
            <th className="text-center">Ref. No.</th>
            <th className="text-center">Description</th>
            <th className="text-center">Dr/Cr </th>
            <th className="text-center">Currency </th>
            <th className="text-center">FCY Amount</th>
            <th className="text-center">Amount</th>
          </tr>
          <tr>
            <td className="text-center"></td>
            <td className="text-center">
              {moment(voucher?.ref_date).format("DD/MM/YYYY")}
            </td>
            <td className="text-center">{voucher?.ref_no}</td>
            <td className="text-center"></td>
            <td className="text-center">{voucher?.party_account?.dr_cr}</td>
            <td className="text-center">
              {voucher?.party_account?.currency.split(" - ")[0]}
            </td>
            <td className="text-center">{voucher?.fc_amount}</td>
            <td className="text-center">{voucher?.amount_sar}</td>
          </tr>
        </table>
      </div>

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

const PaymentReport = (props) => {
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
        setState({ ...state, voucher: data });
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
        let data = response.data;
        setState({ ...state, accounts: data });
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
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;
