import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import apiAuth from "../../../helpers/ApiAuth";
import shipLogo from "../../../assets/images/ship-logo.png";
import Translate from "../../TaxInvoice/Translate";
import NotificationManager from "../../../components/Common/NotificationManager";
import DownloadReport from "../../Vouchers/Reports/helpers/DownloadReport";

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
        Balance Sheet
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
              <td className="border-0">
                {data?.length > 0 ? data[0]?.currency.split(" - ")[0] : ""}
              </td>
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
            <th className="text-center w-25">Account Name</th>
            <th className="text-center w-25">Total Amount</th>
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
                Balance Sheet
              </p>
            </td>
            <td className="text-center border-top-0 border-bottom-0"></td>
            <td className="text-center border-top-0 border-bottom-0"></td>
          </tr>
          <tr>
            <td className="text-left border-top-0 border-bottom-0 my-0 py-0">
              <>
                <p
                  className="mb-2 py-0"
                  style={{
                    fontSize: "14px",

                    fontWeight: 700,
                    marginLeft: "70px",
                    fontFamily: "sans-serif",
                    color: "black",
                  }}
                >
                  ASSET
                </p>
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
                  FIXED ASSET
                </p>
                {data?.length ? (
                  <>
                    {data?.map((dd) => {
                      return (
                        <>
                          <div
                            className="my-1 "
                            style={{ marginLeft: "100px" }}
                          >
                            {" "}
                            {dd?.income_amount === 0
                              ? ""
                              : `${dd?.name}-${dd?.code}`}
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
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
                  FIXED ASSET TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0 border-bottom-0"></td>
            <td className="text-center border-top-0 border-bottom-0">
              {/* Income - Current Amount details */}
              <>
                <p className="my-0 py-0">----------------</p>
                {data?.length ? (
                  data?.map((dd) => {
                    incomeTotal += Number(dd?.income_amount);
                    return (
                      <>
                        <div className="my-1 text-center">
                          <span>
                            {" "}
                            {dd?.income_amount === 0
                              ? ""
                              : Number(dd?.income_amount).toFixed(2)}
                          </span>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
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
                  CURRENT ASSET
                </p>
                {data?.length ? (
                  <>
                    {data?.map((dd) => {
                      return (
                        <>
                          <div className="my-1" style={{ marginLeft: "100px" }}>
                            {" "}
                            {dd?.expenses_amount === 0
                              ? ""
                              : `${dd?.name}-${dd?.code}`}
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
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
                  CURRENT ASSET TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0"></td>
            <td className="text-center border-top-0">
              <>
                {/* Expense current Amount details */}
                <p className="my-0 py-0">----------------</p>
                {data?.length ? (
                  data?.map((dd) => {
                    expenseTotal += Number(dd?.expenses_amount);
                    return (
                      <>
                        <div className="my-1" style={{ textAlign: "center" }}>
                          <span>
                            {dd?.expenses_amount === 0
                              ? ""
                              : Number(dd?.expenses_amount).toFixed(2)}{" "}
                          </span>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "16px",

                    fontWeight: 900,
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
                  CURRENT LIABILITIES
                </p>
                {data?.length ? (
                  <>
                    {data?.map((dd) => {
                      return (
                        <>
                          <div className="my-1" style={{ marginLeft: "100px" }}>
                            {" "}
                            {dd?.expenses_amount === 0
                              ? ""
                              : `${dd?.name}-${dd?.code}`}
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
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
                  CURRENT LIABILITIES TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0"></td>
            <td className="text-center border-top-0">
              <>
                {/* Expense current Amount details */}
                <p className="my-0 py-0">----------------</p>
                {data?.length ? (
                  data?.map((dd) => {
                    expenseTotal += Number(dd?.expenses_amount);
                    return (
                      <>
                        <div className="my-1" style={{ textAlign: "center" }}>
                          <span>
                            {dd?.expenses_amount === 0
                              ? ""
                              : Number(dd?.expenses_amount).toFixed(2)}{" "}
                          </span>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "16px",

                    fontWeight: 900,
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
                  ACCOUNTS PAYABLE
                </p>
                {data?.length ? (
                  <>
                    {data?.map((dd) => {
                      return (
                        <>
                          <div className="my-1" style={{ marginLeft: "100px" }}>
                            {" "}
                            {dd?.expenses_amount === 0
                              ? ""
                              : `${dd?.name}-${dd?.code}`}
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
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
                  ACCOUNTS PAYABLE TOTAL
                </p>
              </>
            </td>
            <td className="text-center border-top-0"></td>
            <td className="text-center border-top-0">
              <>
                {/* Expense current Amount details */}
                <p className="my-0 py-0">----------------</p>
                {data?.length ? (
                  <>
                    {data?.map((dd) => {
                      expenseTotal += Number(dd?.expenses_amount);
                      return (
                        <>
                          <div className="my-1" style={{ textAlign: "center" }}>
                            <span>
                              {dd?.expenses_amount === 0
                                ? ""
                                : Number(dd?.expenses_amount).toFixed(2)}{" "}
                            </span>
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
                <p
                  className="my-0 py-0"
                  style={{
                    fontSize: "16px",

                    fontWeight: 900,
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

const ReportHeader = ({ data }) => {
  // console.log("headerrr", data);
  return (
    <>
      <div className="row" style={{ placeItems: "center" }}>
        {/* Logo */}
        <div className="col-lg-3 mb-1">
          <img
            src={shipLogo}
            alt=""
            width={200}
            style={{ margin: "auto", display: "block" }}
          />
        </div>

        {/* Company Details */}
        <div className="col-lg-9 d-flex flex-column align-items-end p-4">
          <h3 style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
            {data?.name}
          </h3>
          <span>
            <Translate
              fontsize={"24px"}
              fontWeight={600}
              text={data?.name || ""}
            />
          </span>

          <div className="d-flex flex-column align-items-end">
            <span>{data?.address}</span>
            <br />
            <span>
              {data?.state} , {data?.country}
            </span>
            <br />
            {/* <span>CR : 4030471839</span>
            <br /> */}
            <span>VAT : {data?.vat_number}</span>
          </div>
        </div>
      </div>
    </>
  );
};

const BalanceReport = (props) => {
  const location = useLocation();

  const [state, setState] = useState({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("jobId");
    const startTime = searchParams.get("st");
    const endTime = searchParams.get("et");

    getVoucherData(id, startTime, endTime);
  }, []);

  const getVoucherData = (id, st, et) => {
    apiAuth
      .get(`/api/sheet_report/?start_date=${st}&end_date=${et}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, data });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error(
          "",
          "Invalid Balance Report.",
          3000,
          null,
          null,
          ""
        );
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
          <ReportHeader
            data={state?.data?.length > 0 ? state?.data[0]?.company : {}}
          />

          {/* Content */}
          <Content data={state?.data} />

          {/* Footer */}
          {/* <ReportFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default BalanceReport;
