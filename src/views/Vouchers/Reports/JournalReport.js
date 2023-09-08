import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";

const Content = () => {
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        JOURNAL VOUCHER - ADN/RV/23/0057
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem label={"Journal No."} value={""} />
          <DisplayItem label={"Branch"} value={"03-AUG-23"} />
          <DisplayItem label={"Narration"} value={"SNB BANK "} />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"GL Date"} value={""} />
          <DisplayItem label={"Account"} value={""} />
        </div>
      </div>

      {/* Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center ">A/C Name</th>
            <th className="text-center">Narration </th>
            <th className="text-center">Currency</th>
            <th className="text-center">FCY Amount</th>
            <th className="text-center">Ex. Rate</th>
            <th className="text-center">Dr Amount</th>
            <th className="text-center">Cr Amount</th>
          </tr>
          {[1, 2].map((dd) => (
            <>
              <tr>
                <td className="text-center">50741-CAR RENTAL CHARGES (IBIS)</td>
                <td className="text-center">
                  CAR RENTAL CHARGES (IBIS) -- G/L
                </td>
                <td className="text-center">SAR</td>
                <td className="text-center">3,405.00</td>
                <td className="text-center">1.00000</td>
                <td className="text-center">3,500.00</td>
                <td className="text-center">700</td>
              </tr>
            </>
          ))}
          <tr>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center">Total:</td>
            <td className="text-center">3,920.24</td>
            <td className="text-center">3,920.24</td>
          </tr>
        </table>
      </div>

      {/* Remarks */}
      <div className="p-2 ">
        <p className="fw ml-3">Remarks :</p>
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

const JournalReport = (props) => {
  const [state, setState] = useState({ costs: [] });

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
    </div>
  );
};

export default JournalReport;
