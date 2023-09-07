import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import shipLogo from "../../../assets/images/ship-logo.png";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./ReportHeader";
import ReportFooter from "./ReportFooter";
import DownloadReport from "./DownloadReport";

const Content = () => {
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
          <DisplayItem label={"Paid To"} value={""} />
          <DisplayItem label={"Date"} value={"03-AUG-23"} />
          <DisplayItem label={"Paid From"} value={"SNB BANK "} />
          <DisplayItem label={"Job No"} value={""} />
          <DisplayItem label={"Reference No./ Date"} value={""} />
          <DisplayItem
            label={"Remarks"}
            value={"QAMA EXPENSE PAID BY SNB(RE ENTRY FOR AFSAL)"}
          />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"Payment No"} value={"DN/PV/23/0364 (POSTED)"} />
          <DisplayItem label={"GL Date"} value={"03-AUG-23"} />
          <DisplayItem label={"Type"} value={"CASH"} />
          <DisplayItem label={"Client"} value={""} />
          <DisplayItem
            label={"Narration"}
            value={"QAMA EXPENSE PAID BY SNB(RE ENTRY FOR AFSAL)"}
          />
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
                <span className="p-2">
                  IQAMA EXPENSES IQAMA EXPENSE PAID BY SNB(RE ENTRY FOR AFSAL)
                </span>
              </div>
            </td>
            <td className="text-center w-25"></td>
            <td className="text-center w-25">200.00</td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        Two Hundred Only
        <span style={{ marginLeft: "30px" }}>200.00</span>
      </h5>

      {/* Second Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center">Against V.No </th>
            <th className="text-center">Date </th>
            <th className="text-center">Ref. No.</th>
            <th className="text-center">Ref. No.</th>
            <th className="text-center">Description</th>
            <th className="text-center">Dr/Cr </th>
            <th className="text-center">Curr </th>
            <th className="text-center">FCY Amount</th>
            <th className="text-center">Amount</th>
          </tr>
          {/* <tr>
            <td className=" w-50">
              <div className=" ">
                <span className="p-2">
                  IQAMA EXPENSES IQAMA EXPENSE PAID BY SNB(RE ENTRY FOR AFSAL)
                </span>
              </div>
            </td>
            <td className="text-center w-25"></td>
            <td className="text-center w-25">200.00</td>
          </tr> */}
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

const PaymentReport = (props) => {
  const [state, setState] = useState({ costs: [] });

  useEffect(() => {
    let id = Number(props.match.params.id);
    getVoucherData(id);
  }, []);

  const getVoucherData = (id) => {
    apiAuth
      .get(`/api/payment-voucher/${id}`)
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
        marginTop: "75px",
        marginBottom: "75px",
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
        <Content />

        {/* Footer */}
        <ReportFooter />
      </div>
    </div>
  );
};

export default PaymentReport;
