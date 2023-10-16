import React, { useEffect, useState } from "react";
import moment from "moment";
import numberToWords from "number-to-words";

import apiAuth from "../../../helpers/ApiAuth";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import NotificationManager from "../../../components/Common/NotificationManager";

const Content = ({ data }) => {
  // console.log("payment", data);
  var total = 0;
  var word_amount = "";
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        PAYMENT VOUCHER
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem label={"Paid To"} value={data?.voucher?.pay_to} />
          <DisplayItem
            label={"Date"}
            value={moment(data?.voucher?.date).format("DD/MM/YYYY")}
          />
          <DisplayItem label={"Paid From"} value={"SNB BANK "} />
          <DisplayItem
            label={"Job No"}
            value={data?.voucher?.job?.job_number}
          />
          <DisplayItem
            label={"Reference No./ Date"}
            value={data?.voucher?.ref_no}
          />
          <DisplayItem label={"Remarks"} value={data?.voucher?.job?.remarks} />
        </div>
        <div id="right-side-items">
          <DisplayItem label={"Payment No"} value={""} />
          <DisplayItem
            label={"GL Date"}
            value={moment(data?.voucher?.gl_date).format("DD/MM/YYYY")}
          />
          <DisplayItem
            label={"Type"}
            value={data?.voucher?.instrument_type || ""}
          />
          <DisplayItem label={"Client"} value={""} />
          <DisplayItem label={"Narration"} value={data?.voucher?.naration} />
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
              <div className="text-center">
                <span className="p-2"></span>
              </div>
            </td>
            <td className="text-center w-25">
              {data?.voucher?.job?.job_number}
            </td>
            <td className="text-center w-25"></td>
          </tr>
        </table>
      </div>

      {/* Second Table */}
      <div id="table" className="my-2">
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center">Against V.No </th>
            <th className="text-center">Date </th>
            {/* <th className="text-center">Ref. No.</th> */}
            <th className="text-center">Description</th>
            <th className="text-center">Dr/Cr </th>
            <th className="text-center">Currency </th>
            <th className="text-center">Ex Rate </th>
            <th className="text-center">FCY Amount</th>
            <th className="text-center">Amount</th>
          </tr>
          {data?.accounts?.length &&
            data?.accounts?.map((dd) => {
              total += Number(dd?.amount_qty);
              word_amount = Number.isFinite(Number(total))
                ? numberToWords.toWords(Number(total))
                : String(total);
              word_amount = String(
                word_amount.charAt(0).toUpperCase() + word_amount.slice(1)
              );
              return (
                <>
                  <tr>
                    <td className="text-center">{dd?.sac_code}</td>
                    <td className="text-center">
                      {moment(dd?.ref_date).format("DD/MM/YYYY")}
                    </td>
                    {/* <td className="text-center">{dd?.ref_no}</td> */}
                    <td className="text-center">{dd?.narration}</td>
                    <td className="text-center">{dd?.dr_cr}</td>
                    <td className="text-center">
                      {dd?.currency.split(" - ")[0]}
                    </td>
                    <td className="text-center">{dd?.ex_rate}</td>
                    <td className="text-center">
                      {Number(dd?.fcy_amount).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {Number(dd?.amount_qty).toFixed(2)}
                    </td>
                  </tr>
                </>
              );
            })}
          <tr>
            <td className="text-center"></td>
            <td className="text-center"></td>
            {/* <td className="text-center">/td> */}
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              Total:
            </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {Number(total).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
        <span>{word_amount} Only </span>
        <span style={{ marginLeft: "30px", marginRight: "10px" }}>
          {Number(total).toFixed(2)}
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
        <div className="card reportdownproject">
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

export default PaymentReport;
