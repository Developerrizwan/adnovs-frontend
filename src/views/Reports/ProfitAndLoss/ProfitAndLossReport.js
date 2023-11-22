import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import apiAuth from "../../../helpers/ApiAuth";
import shipLogo from "../../../assets/images/ship-logo.png";
import Translate from "../../TaxInvoice/Translate";
import NotificationManager from "../../../components/Common/NotificationManager";
import DownloadReport from "../../Vouchers/Reports/helpers/DownloadReport";

const Content = ({ data, params }) => {
  var incomeTotal = data
    ?.filter((item) => item?.type === "INCOME")
    ?.reduce((x, y) => {
      return Number(x) + Number(y?.income_amount);
    }, 0);

  var expenseTotal = data?.reduce((x, y) => {
    return Number(x) + Number(y?.expenses_amount);
  }, 0);

  var directExpenseTotal = data
    ?.filter(
      (item) =>
        item?.expense_type === "DIRECT EXPENSES" && item?.type === "EXPENSE"
    )
    .reduce((x, y) => {
      return Number(x) + Number(y?.expenses_amount);
    }, 0);

  var otherExpenseTotal = data
    ?.filter(
      (item) =>
        item?.expense_type !== "DIRECT EXPENSES" && item?.type === "EXPENSE"
    )
    .reduce((x, y) => {
      return Number(x) + Number(y?.expenses_amount);
    }, 0);

  var grossProfit =
    Number(incomeTotal - directExpenseTotal).toFixed(2) || "0.00";
  var netProfit = Number(grossProfit - otherExpenseTotal).toFixed(2) || "0.00";

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
        <table className="htmlTable mt-2 w-100">
          <tr>
            <th className="text-center ">Group Name</th>
            <th className="text-center">Previous Amount</th>
            <th className="text-center">Current Amount</th>
          </tr>
          <tr>
            <td
              className="text-center py-2"
              style={{
                fontSize: "16px",
                fontWeight: 700,
                marginLeft: "30px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              PROFIT AND LOSS
            </td>
            <td className="text-center"></td>
            <td className="text-center"></td>
          </tr>
          {/* income */}

          <tr>
            <td
              className="text-center py-2"
              style={{
                fontSize: "16px",

                fontWeight: 700,
                marginLeft: "70px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              INCOME
            </td>
            <td className="text-center"></td>
            <td className="text-center">--------------------</td>
          </tr>
          {data?.length > 0 &&
            data
              ?.filter((dd) => dd?.income_amount && dd?.type === "INCOME")
              .map((dd) => {
                console.log("dd--------------", dd);
                return (
                  <tr key={dd.name}>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      <Link
                        to={`/ledger-statement/?coa=${dd?.coa_id}&st=${params?.st}&et=${params?.et}`}
                      >
                        {dd?.income_amount === 0
                          ? ""
                          : `${dd?.name}-${dd?.code}`}
                      </Link>
                    </td>
                    <td className="text-center"></td>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      {dd?.income_amount === 0
                        ? ""
                        : Number(dd?.income_amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          <tr>
            <td
              className="text-center py-2"
              style={{
                fontSize: "16px",

                fontWeight: 500,
                marginLeft: "90px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              INCOME TOTAL
            </td>
            <td className="text-center"></td>
            <td
              className="text-center"
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {incomeTotal ? Number(incomeTotal).toFixed(2) : "0.00"}
            </td>
          </tr>

          {/* direct expenses */}

          <tr>
            <td
              className="text-center py-2"
              style={{
                fontWeight: 700,
                fontSize: "16px",

                marginLeft: "70px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              DIRECT EXPENSES
            </td>
            <td className="text-center"></td>
            <td className="text-center">--------------------</td>
          </tr>
          {data?.length &&
            data
              ?.filter(
                (dd) =>
                  dd?.expenses_amount &&
                  dd?.expense_type === "DIRECT EXPENSES" &&
                  dd?.type === "EXPENSE"
              )
              .map((dd) => {
                return (
                  <tr key={dd.name}>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      <Link
                        to={`/ledger-statement/?coa=${dd?.coa_id}&st=${params?.st}&et=${params?.et}`}
                      >
                        {dd?.expenses_amount === 0
                          ? ""
                          : `${dd?.name}-${dd?.code}`}
                      </Link>
                    </td>
                    <td className="text-center"></td>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      {dd?.expenses_amount === 0
                        ? ""
                        : Number(dd?.expenses_amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          <tr>
            <td
              className="text-center"
              style={{
                fontSize: "16px",

                fontWeight: 500,
                marginLeft: "90px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              DIRECT EXPENSE TOTAL
            </td>
            <td className="text-center"></td>
            <td
              className="text-center"
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {" "}
              {directExpenseTotal
                ? Number(directExpenseTotal).toFixed(2)
                : "0.00"}
            </td>
          </tr>

          {/* other expenses */}

          <tr>
            <td
              className="text-center py-2"
              style={{
                fontWeight: 700,
                fontSize: "16px",

                marginLeft: "70px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              OTHER EXPENSES
            </td>
            <td className="text-center"></td>
            <td className="text-center">--------------------</td>
          </tr>
          {data?.length &&
            data
              ?.filter(
                (dd) =>
                  dd?.expenses_amount &&
                  dd?.expense_type !== "DIRECT EXPENSES" &&
                  dd?.type === "EXPENSE"
              )
              .map((dd) => {
                return (
                  <tr key={dd.name}>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      <Link
                        to={`/ledger-statement/?coa=${dd?.coa_id}&st=${params?.st}&et=${params?.et}`}
                      >
                        {dd?.expenses_amount === 0
                          ? ""
                          : `${dd?.name}-${dd?.code}`}
                      </Link>
                    </td>
                    <td className="text-center"></td>
                    <td
                      className="text-center"
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      {dd?.expenses_amount === 0
                        ? ""
                        : Number(dd?.expenses_amount).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
          <tr>
            <td
              className="text-center"
              style={{
                fontSize: "16px",

                fontWeight: 500,
                marginLeft: "90px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              OTHER EXPENSE TOTAL
            </td>
            <td className="text-center"></td>
            <td
              className="text-center"
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {" "}
              {otherExpenseTotal
                ? Number(otherExpenseTotal).toFixed(2)
                : "0.00"}
            </td>
          </tr>
          {/* gross profit */}
          <tr>
            <td
              className="text-center"
              style={{
                fontSize: "16px",

                fontWeight: 700,
                marginLeft: "90px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              GROSS PROFIT
            </td>
            <td className="text-center"></td>
            <td
              className="text-center"
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {" "}
              {grossProfit}
            </td>
          </tr>

          {/* net profit */}

          <tr>
            <td
              className="text-center"
              style={{
                fontSize: "16px",

                fontWeight: 700,
                marginLeft: "90px",
                fontFamily: "sans-serif",
                color: "black",
              }}
            >
              NET PROFIT
            </td>
            <td className="text-center"></td>
            <td
              className="text-center"
              style={{
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {" "}
              {netProfit}
            </td>
          </tr>

          {/* end */}
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

const ProfitAndLossReport = (props) => {
  const location = useLocation();
  const [state, setState] = useState({});
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("jobId");
    const startTime = searchParams.get("st");
    const endTime = searchParams.get("et");

    const dd = {};
    dd["id"] = id;
    dd["st"] = startTime;
    dd["et"] = endTime;
    setParams(dd);

    getProfitLossData(id, startTime, endTime);
  }, []);

  const getProfitLossData = (id, st, et) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/profit/loss/?job=${
          id ? id : ""
        }&type=Profit/Loss&start_time=${st}&end_time=${et}`
      )
      .then((response) => {
        let data = response.data;
        setState({ ...state, data });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error(
          "",
          "Invalid Profit Loss Report.",
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
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
      {loading ? (
        <div className="loading"></div>
      ) : (
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            width: "1000px",
          }}
        >
          {/* Download */}
          <DownloadReport reportName="Profit and Loss" />

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
            <Content data={state?.data} params={params} />

            {/* Footer */}
            {/* <ReportFooter /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitAndLossReport;
