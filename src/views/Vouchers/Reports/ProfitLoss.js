import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import moment from "moment";

const Content = ({ data }) => {
  // console.log("profit", data);

  var incomeTotal = 0;
  var expenseTotal = 0;

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
              <td className="border-0">{data[0]?.currency.split(" - ")[0]}</td>
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
        <table className="htmlTable mt-2 w-100 ">
          <tr>
            <th className="text-center w-50">Group Name</th>
            <th className="text-center w-25">Previous Amount</th>
            <th className="text-center w-25">Current Amount</th>
          </tr>
          <tr>
            <td className="text-left border-top-0 border-bottom-0 my-0 py-0">
              <p
                className="my-1 py-0"
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  marginLeft: "30px",
                  fontFamily: "sans-serif",
                  color: "black",
                }}
              >
                PROFIT AND LOSS
              </p>
            </td>
            <td className="text-center border-top-0 border-bottom-0"></td>
            <td className="text-center border-top-0 border-bottom-0"></td>
          </tr>
          <tr>
            <td className="text-left border-top-0 border-bottom-0 my-0 py-0">
              <>
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",

                    fontWeight: 700,
                    marginLeft: "70px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  INCOME
                </p>
                {data?.length &&
                  data?.map((dd) => {
                    return (
                      <>
                        <div
                          className="my-1 "
                          style={{ marginLeft: "100px" }}
                        >{`${dd?.name}-${dd?.code}`}</div>
                      </>
                    );
                  })}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",

                    fontWeight: 700,
                    marginLeft: "90px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  INCOME TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0 border-bottom-0"></td>
            <td className="text-center border-top-0 border-bottom-0">
              {/* Income - Current Amount details */}
              <>
                <p className="my-0 py-0"></p>
                {data?.length &&
                  data?.map((dd) => {
                    incomeTotal += Number(dd?.expenses_amount);
                    return (
                      <>
                        <div className="my-1 text-center">
                          <span>{Number(dd?.income_amount).toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    textAlign: "center",
                    // marginLeft: "50px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  {incomeTotal.toFixed(2) || "0.00"}
                </p>
              </>
            </td>
          </tr>
          <tr>
            <td className="text-left border-top-0">
              <>
                <p
                  className="my-0 py-0"
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",

                    marginLeft: "70px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  EXPENSES
                </p>
                {data?.length &&
                  data?.map((dd) => {
                    return (
                      <>
                        <div
                          className="my-1"
                          style={{ marginLeft: "100px" }}
                        >{`${dd?.name}-${dd?.code}`}</div>
                      </>
                    );
                  })}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    marginLeft: "80px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  EXPENSE TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0"></td>
            <td className="text-center border-top-0">
              <>
                {/* Expense current Amount details */}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    marginLeft: "50px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                ></p>
                {data?.length &&
                  data?.map((dd) => {
                    expenseTotal += Number(dd?.expenses_amount);
                    return (
                      <>
                        <div className="my-1" style={{ textAlign: "center" }}>
                          <span>{Number(dd?.expenses_amount).toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "14px",

                    fontWeight: 700,
                    textAlign: "center",
                    // marginLeft: "50px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  {expenseTotal.toFixed(2) || "0.00"}
                </p>
              </>
            </td>
          </tr>
        </table>
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

const ProfitLoss = (props) => {
  const [state, setState] = useState({});

  useEffect(() => {
    const id = Number(props.match.params.jobId);
    let startTime = props.match.params.startTime;
    let endTime = props.match.params.endTime;

    getVoucherData(id, startTime, endTime);
  }, []);

  const getVoucherData = (id, st, et) => {
    apiAuth
      .get(
        `/api/profit/loss/?job=${id}&type=Profit/Loss&start_time=${st}&end_time=${et}`
      )
      .then((response) => {
        let data = response.data;
        setState({ ...state, data });
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
            //   padding: "10px",
          }}
        >
          {/* Header */}
          <ReportHeader data={state?.data[0]?.company} />

          {/* Content */}
          <Content data={state?.data} />

          {/* Footer */}
          {/* <ReportFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
