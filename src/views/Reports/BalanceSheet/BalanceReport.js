import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import apiAuth from "../../../helpers/ApiAuth";
import shipLogo from "../../../assets/images/ship-logo.png";
import Translate from "../../TaxInvoice/Translate";
import NotificationManager from "../../../components/Common/NotificationManager";
import DownloadReport from "../../Vouchers/Reports/helpers/DownloadReport";

const Content = ({ data }) => {
  console.log("balance", data);

  var assetTotal = 0;
  var liabilityTotal = 0;
  var equityTotal = 0;

  return (
    <div id="content" className="mt-3 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        Balance Sheet
      </h4>

      {/* Display Items */}
      {/* <div
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
                {data?.length > 0 ? data[0]?.currency?.split(" - ")[0] : ""}
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
      </div> */}

      {/* Table */}
      <div id="table" className="my-4">
        <table className="htmlTable mt-2 w-100 ">
          <tr>
            <th style={{ width: "40%" }} className="text-center">
              Group Name
            </th>
            <th style={{ width: "40%" }} className="text-center">
              Account Name
            </th>
            <th style={{ width: "20%" }} className="text-center">
              Total Amount
            </th>
          </tr>
          <tr className="mt-2">
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

          {["ASSET", "LIABILITY", "EQUITY"].map((item) => {
            return (
              <>
                <tr>
                  {/* Group Name Column */}
                  <td className="text-left border-top-0 border-bottom-0 my-0 py-0 ">
                    <>
                      <p
                        className="my-0 py-0 pb-2"
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          marginLeft: "70px",
                          fontFamily: "sans-serif",
                          color: "black",
                        }}
                      >
                        {item}
                      </p>
                      {data?.length ? (
                        <>
                          {data?.map((dd) => {
                            return (
                              <>
                                {dd?.type === item ? (
                                  <div className="my-2 border border-bottom-0">
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        paddingLeft: "100px",
                                      }}
                                    >
                                      {dd?.income_amount === 0
                                        ? ""
                                        : `${dd?.group}`}
                                    </span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                      <div className="border-top"></div>
                      <p
                        className="my-0 py-0 mt-2 mb-2"
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          marginLeft: "90px",
                          fontFamily: "sans-serif",
                          color: "black",
                        }}
                      >
                        {item} TOTAL
                      </p>
                      <div
                        className="border-bottom"
                        style={{ border: "1px solid #000" }}
                      ></div>
                    </>
                  </td>

                  {/* Account Name Column */}
                  <td className="text-center border-top-0 border-bottom-0">
                    <>
                      <p className="my-0 py-0">
                        ---------------------------------------------------
                      </p>
                      {data?.length ? (
                        data?.map((dd, i) => {
                          return (
                            <>
                              {dd?.type === item ? (
                                <div className="my-2 text-center border border-bottom-0">
                                  <span style={{ fontSize: "14px" }}>
                                    {" "}
                                    {dd?.account_name}
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <div className="border-top"></div>
                      <p
                        className="my-0 py-0 mt-2 mb-2"
                        style={{
                          fontSize: "16px",
                          fontWeight: 900,
                          textAlign: "center",
                          // marginLeft: "50px",
                          fontFamily: "sans-serif",
                          color: "black",
                          display: "hidden",
                        }}
                      >
                        -------------------
                      </p>
                      <div
                        className="border-bottom"
                        style={{ border: "1px solid #000" }}
                      ></div>
                    </>
                  </td>

                  {/* Total Amount Column */}
                  <td className="text-center border-top-0 border-bottom-0">
                    <>
                      <p className="my-0 py-0">----------------</p>
                      {data?.length ? (
                        data?.map((dd) => {
                          if (dd?.type === "ASSET") {
                            assetTotal += Number(dd?.total_amount);
                          } else if (dd?.type === "LIABILITY") {
                            liabilityTotal += Number(dd?.total_amount);
                          } else if (dd?.type === "EQUITY") {
                            equityTotal += Number(dd?.total_amount);
                          }
                          return (
                            <>
                              {dd?.type === item ? (
                                <div className="my-2 text-center border border-bottom-0">
                                  <span>
                                    {" "}
                                    {Number(dd?.total_amount).toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <div className="border-top"></div>
                      <p
                        className="my-0 py-0 mt-2 mb-2"
                        style={{
                          fontSize: "16px",
                          fontWeight: 900,
                          textAlign: "center",
                          // marginLeft: "50px",
                          fontFamily: "sans-serif",
                          color: "black",
                        }}
                      >
                        {item === "ASSET"
                          ? assetTotal.toFixed(2)
                          : item === "LIABILITY"
                          ? liabilityTotal.toFixed(2)
                          : item === "EQUITY"
                          ? equityTotal.toFixed(2)
                          : "0.00"}
                      </p>
                      <div
                        className="border-bottom"
                        style={{ border: "1px solid #000" }}
                      ></div>
                    </>
                  </td>
                </tr>
              </>
            );
          })}
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
        <div className="col-lg-3 mt-4 mb-1">
          <img
            src={shipLogo}
            alt=""
            width={200}
            style={{ margin: "auto", display: "block" }}
          />
        </div>

        {/* Company Details */}
        {/* <div className="col-lg-9 d-flex flex-column align-items-end p-4">
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

            <span>VAT : {data?.vat_number}</span>
          </div>
        </div> */}
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
        <DownloadReport reportName="Balance Report" />

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
