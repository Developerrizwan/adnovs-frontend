import React, { useEffect, useState } from "react";
import moment from "moment";
import numberToWords from "number-to-words";

import apiAuth from "../../../helpers/ApiAuth";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import NotificationManager from "../../../components/Common/NotificationManager";

const Content = ({ data }) => {
  const [state, setState] = useState({ accounts: [] });
  // console.log("payment", data);

  useEffect(() => {
    let total_cr = 0;
    let total_dr = 0;
    let dr_word = "";
    let cr_word = "";
    let accounts = data.accounts?.map((ct) => {
      ct.vat_amount = Number(
        (Number(ct.amount_sar) * Number(ct.tax_group_code)) / 100
      ).toFixed(2);
      ct.total = Number(Number(ct.amount_sar) + Number(ct.vat_amount)).toFixed(
        2
      );

      if (ct.dr_cr === "Cr")
        total_cr = Number(Number(total_cr) + Number(ct.total)).toFixed(2);

      if (ct.dr_cr === "Dr")
        total_dr = Number(Number(total_dr) + Number(ct.total)).toFixed(2);
      return ct;
    });

    dr_word = Number.isFinite(Number(total_dr))
      ? numberToWords.toWords(Number(total_dr))
      : String(total_dr);
    dr_word = String(dr_word.charAt(0).toUpperCase() + dr_word.slice(1));

    cr_word = Number.isFinite(Number(total_cr))
      ? numberToWords.toWords(Number(total_cr))
      : String(total_cr);
    cr_word = String(cr_word.charAt(0).toUpperCase() + cr_word.slice(1));

    setState({
      total_cr,
      total_dr,
      cr_word,
      dr_word,
      accounts,
    });
  }, []);

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
          <DisplayItem label={"Payment No"} value={data?.voucher?.id} />
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
            <th className="text-center">Description</th>
            <th className="text-center">Dr/Cr </th>
            <th className="text-center">Currency </th>
            <th className="text-center">Amount</th>
            <th className="text-center">Vat</th>
            <th className="text-center">Vat Amount</th>
            <th className="text-center">Total Amount</th>
          </tr>
          {data?.accounts?.length &&
            data?.accounts?.map((dd) => {
              // totalDr += dd?.dr_cr === "Dr" ? Number(dd?.amount_qty) : 0;
              // word_Dramount = Number.isFinite(Number(totalDr))
              //   ? numberToWords.toWords(Number(totalDr))
              //   : String(totalDr);
              // word_Dramount = String(
              //   word_Dramount.charAt(0).toUpperCase() + word_Dramount.slice(1)
              // );

              // // Cr

              // totalCr += dd?.dr_cr === "Cr" ? Number(dd?.amount_qty) : 0;
              // word_Cramount = Number.isFinite(Number(totalCr))
              //   ? numberToWords.toWords(Number(totalCr))
              //   : String(totalCr);
              // word_Cramount = String(
              //   word_Cramount.charAt(0).toUpperCase() + word_Cramount.slice(1)
              // );
              return (
                <>
                  <tr>
                    <td className="text-center">{dd?.sac_code}</td>
                    <td className="text-center">
                      {moment(dd?.ref_date).format("DD/MM/YYYY")}
                    </td>
                    {/* <td className="text-center">{dd?.ref_no}</td> */}
                    <td className="text-center">{dd?.ac_name?.name}</td>
                    <td className="text-center">{dd?.dr_cr}</td>
                    <td className="text-center">
                      {dd?.currency.split(" - ")[0]}
                    </td>
                    <td className="text-center">
                      {Number(dd?.amount_sar).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {Number(dd?.tax_group_code).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {Number(dd?.vat_amount).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {Number(dd?.total).toFixed(2)}
                    </td>
                  </tr>
                </>
              );
            })}
          <tr>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"> Total Dr Amount - </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {state.dr_word} Only
            </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {Number(state.total_dr).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center"> Total Cr Amount - </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {state.cr_word} Only
            </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {Number(state.total_cr).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      {/* Amount in words */}
      {/* <div className="d-flex justify-content-end">
        <h5
          className="text-end"
          style={{ marginRight: "10px", position: "absolute", left: "20%" }}
        >
          Total Dr Amount -{" "}
        </h5>
        <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
          <span>{word_Dramount} Only </span>
          <span style={{ marginLeft: "30px", marginRight: "10px" }}>
            {Number(totalDr).toFixed(2)}
          </span>
        </h5>
      </div>

      <div className="d-flex justify-content-end">
        <h5
          className="text-end"
          style={{ marginRight: "10px", position: "absolute", left: "20%" }}
        >
          Total Cr Amount -{" "}
        </h5>
        <h5 className="text-end" style={{ fontFamily: "sans-serif" }}>
          <span>{word_Cramount} Only </span>
          <span style={{ marginLeft: "30px", marginRight: "10px" }}>
            {Number(totalCr).toFixed(2)}
          </span>
        </h5>
      </div> */}
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
