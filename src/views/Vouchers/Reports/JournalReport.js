import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import moment from "moment";

const Content = ({ data }) => {
  var totalDr = 0;
  var totalCr = 0;
  console.log("journal data------", data);
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        JOURNAL VOUCHER
      </h4>

      {/* Display Items */}
      <div
        id="display-items"
        className="d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <DisplayItem label={"Journal No."} value={data?.voucher?.id} />
          <DisplayItem label={"Branch"} value={data?.voucher?.branch} />
          <DisplayItem label={"Narration"} value={data?.voucher?.narration} />
        </div>
        <div id="right-side-items">
          <DisplayItem
            label={"GL Date"}
            value={moment(data?.voucher?.gl_date).format("DD/MM/YYYY")}
          />
          <DisplayItem
            label={"Account"}
            value={data?.voucher?.party_account?.name}
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
            <th className="text-center">Dr/Cr </th>
            <th className="text-center">FCY Amount</th>
            <th className="text-center">Ex. Rate</th>
            <th className="text-center">Dr Amount</th>
            <th className="text-center">Cr Amount</th>
          </tr>
          {data?.accounts?.length > 0 &&
            data?.accounts?.map((dd) => {
              console.log("inside map", dd);
              totalDr +=
                dd.dr_cr === "Dr" ? Number(dd?.amount_sar).toFixed(2) : 0.0;
              totalCr +=
                dd.dr_cr === "Cr" ? Number(dd?.amount_sar).toFixed(2) : 0.0;
              return (
                <>
                  <tr>
                    <td className="text-center">{dd?.ac_name?.name}</td>
                    <td className="text-center">{dd?.remarks}</td>
                    <td className="text-center">
                      {dd?.ac_name?.currency.split(" - ")[0]}
                    </td>
                    <td className="text-center">{dd?.dr_cr}</td>
                    <td className="text-center">
                      {Number(dd?.fcy_amount).toFixed(2)}
                    </td>
                    <td className="text-center">{dd?.ex_rate}</td>
                    <td className="text-center">
                      {dd.dr_cr === "Dr"
                        ? Number(dd?.amount_sar).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="text-center">
                      {dd.dr_cr === "Cr"
                        ? Number(dd?.amount_sar).toFixed(2)
                        : "0.00"}
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
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              Total:
            </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {console.log("totalDR: ", totalDr, typeof totalDr)}
              {totalDr}
            </td>
            <td className="text-center" style={{ background: "#d3d3d3" }}>
              {console.log("totalCR: ", totalCr)}
              {Number(totalCr).toFixed(2)}
            </td>
          </tr>
        </table>
      </div>

      {/* Remarks */}
      <div className="p-2 ">
        <p className="fw ml-3">Remarks : {data?.voucher?.remarks}</p>
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
        : {value || ""}
      </div>
    </>
  );
};

const JournalReport = (props) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    let id = Number(props.match.params.id);
    getVoucherData(id);
  }, []);

  const getVoucherData = (id) => {
    apiAuth
      .get(`/api/master/voucher/${id}`)
      .then((response) => {
        let data = response?.data;
        setState((prev) => ({ ...prev, voucher: data }));
        getTableData(id);
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

export default JournalReport;
