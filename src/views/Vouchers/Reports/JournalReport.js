import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import moment from "moment";

const Content = ({ data }) => {
  // console.log("data.voucher", data.voucher);
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
          <DisplayItem label={"Journal No."} value={data.voucher?.id} />
          <DisplayItem label={"Branch"} value={data.voucher?.branch} />
          <DisplayItem label={"Narration"} value={data.voucher?.narration} />
        </div>
        <div id="right-side-items">
          <DisplayItem
            label={"GL Date"}
            value={moment(data.voucher?.gl_date).format("MM/DD/YYYY")}
          />
          <DisplayItem
            label={"Account"}
            value={data.voucher?.party_account?.name}
          />
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
          {data?.accounts.length &&
            data?.accounts.map((dd) => (
              <>
                <tr>
                  <td className="text-center">{dd?.ac_name}</td>
                  <td className="text-center">{dd?.remarks}</td>
                  <td className="text-center">
                    {dd?.party_account?.currency.split(" - ")[0]}
                  </td>
                  <td className="text-center">{dd?.fc_amount}</td>
                  <td className="text-center">{dd?.ex_rate}</td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                </tr>
              </>
            ))}
          <tr>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center">Total:</td>
            <td className="text-center"></td>
            <td className="text-center"></td>
          </tr>
        </table>
      </div>

      {/* Remarks */}
      <div className="p-2 ">
        <p className="fw ml-3">Remarks : {data.voucher?.remarks}</p>
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
          style={{ fontWeight: 600, width: "120px", display: "inline-block" }}
        >
          {label}
        </span>
        : {value}
      </div>
    </>
  );
};

const JournalReport = (props) => {
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
          <Content data={state || null} />

          {/* Footer */}
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default JournalReport;
