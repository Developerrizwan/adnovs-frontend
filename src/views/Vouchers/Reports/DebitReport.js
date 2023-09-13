import React, { useEffect, useState } from "react";
import numberToWords from "number-to-words";
import QRCode from "react-qr-code";

import apiAuth from "../../../helpers/ApiAuth";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import NotificationManager from "../../../components/Common/NotificationManager";

const Content = ({ data }) => {
  const [state, setState] = useState({});
  var curCurrency = data?.voucher?.currency.split(" ")[0];
  var totalExcludeVat = 0;
  var totalTaxableAmt = 0;
  var totalVatAmt = 0;

  // console.log("tax", data);
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        TAX CREDIT VOUCHER - ADN/RV/23/0057
      </h4>

      <div className="row" style={{ placeItems: "center" }}>
        <div className="col-lg-8">
          <div className="p-2" style={{ overflowX: "auto" }}>
            <table className="w-100">
              <tr>
                <td className="fw">Invoice Number:</td>
                <td>ADN/CN/23/009</td>
                <td>ADN/CN/23/009</td>
                {/* <td></td> */}
              </tr>
            </table>
          </div>

          <div className="p-2" style={{ overflowX: "auto" }}>
            <table className="w-100">
              <tr>
                <td className="fw">Invoice Issue Date:</td>
                <td>08/05/2022</td>
                <td>10/09/2022</td>
                {/* <td></td> */}
              </tr>
              <tr>
                <td className="fw">Date Of Supply:</td>
                <td>01/02/2023</td>
                <td>12/03/2023</td>
                {/* <td></td> */}
              </tr>
            </table>
          </div>
        </div>
        <div className="col-lg-4 text-center">
          <QRCode size={150} value={String(state?.qrcodeString)} />
        </div>
      </div>

      {/* Display Items */}
      <div
        id="display-items"
        className="mt-4 mb-2 d-flex justify-content-around align-items-center"
      >
        <div id="left-side-items">
          <h5
            style={{
              background: "#d3d3d3",
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            Seller
          </h5>
          <>
            <DisplayItem label={"Name"} value={"Adnov Shipping & Logistics"} />
            <DisplayItem
              label={"Building No"}
              value={"AL MALIK KHALID ROAD - HAYY"}
            />
            <DisplayItem
              label={"Street Name"}
              value={"JEDDAH KINGDOM OF SAUDI ARABIA"}
            />
            <DisplayItem label={"District"} value={""} />
            <DisplayItem label={"City"} value={""} />
            <DisplayItem label={"Country"} value={"Saudi Arabia"} />
            <DisplayItem label={"Postal Code"} value={""} />
            <DisplayItem label={"Additional No"} value={""} />
            <DisplayItem label={"VAT Number"} value={""} />
            <DisplayItem label={"Other Seller ID"} value={""} />
          </>
        </div>

        <div id="right-side-items">
          <h5
            style={{
              background: "#d3d3d3",
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            Buyer
          </h5>
          <>
            <DisplayItem label={"Name"} value={"Adnov Shipping & Logistics"} />
            <DisplayItem
              label={"Building No"}
              value={"AL MALIK KHALID ROAD - HAYY"}
            />
            <DisplayItem
              label={"Street Name"}
              value={"JEDDAH KINGDOM OF SAUDI ARABIA"}
            />
            <DisplayItem label={"District"} value={""} />
            <DisplayItem label={"City"} value={""} />
            <DisplayItem label={"Country"} value={"Saudi Arabia"} />
            <DisplayItem label={"Postal Code"} value={""} />
            <DisplayItem label={"Additional No"} value={""} />
            <DisplayItem label={"VAT Number"} value={""} />
            <DisplayItem label={"Other Seller ID"} value={""} />
          </>
        </div>
      </div>

      <div className="p-2" style={{ overflowX: "auto" }}>
        <table className="w-100">
          {/* <tr style={{ background: "#B6D0E2" }}>
            <td className="fw">Line Items:</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr> */}
          <tr style={{ background: "#d3d3d3" }}>
            <td className="text-center fw">Nature of goods or service</td>
            <td className="text-center fw">Unit Price</td>
            <td className="text-center fw">Quantity</td>
            <td className="text-center fw">Taxable Amount</td>
            <td className="text-center fw">Discount</td>
            <td className="text-center fw">Tax Rate</td>
            <td className="text-center fw">Tax Amount</td>
            <td className="text-center fw">Item Subtotal(Including VAT)</td>
          </tr>
          {data?.accounts?.length &&
            data?.accounts.map((dd) => {
              totalExcludeVat += Number(dd?.qty) * Number(dd?.fcy_amount);
              totalTaxableAmt += Number(dd?.taxable_amount);
              totalVatAmt += Number(dd?.tax_amount);
              return (
                <>
                  <tr>
                    <td className="text-center">{dd?.ac_name?.type}</td>
                    <td className="text-center">
                      {Number(dd?.fcy_amount).toFixed(2)}
                    </td>
                    <td className="text-center">{dd?.qty}</td>
                    <td className="text-center">
                      {Number(dd?.taxable_amount).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {Number(dd?.discount || 0).toFixed(2)}
                    </td>
                    <td className="text-center">{dd?.tax_group_code + "%"}</td>
                    <td className="text-center">
                      {Number(dd?.tax_amount).toFixed(2)}
                    </td>
                    <td className="text-center">
                      {(
                        Number(dd?.fcy_amount) * Number(dd?.qty) +
                        Number(dd?.taxable_amount)
                      ).toFixed(2)}
                    </td>
                  </tr>
                </>
              );
            })}
        </table>
      </div>

      <div
        className="mb-5"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2">
            <tr>
              <td className="p-1 fw border-0">Total (Excluding VAT)</td>
              <td className="p-1 border-0">
                {totalExcludeVat.toFixed(2)} {curCurrency}
              </td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">Discount</td>
              <td className="p-1 border-0">0.00 {curCurrency}</td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">
                Total Taxable Amount (Excluding VAT)
              </td>
              <td className="p-1 border-0">
                {totalTaxableAmt.toFixed(2)} {curCurrency}
              </td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">Total VAT</td>
              <td className="p-1 border-0">
                {totalVatAmt.toFixed(2)} {curCurrency}
              </td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">Total Amount Due</td>
              <td className="p-1 border-0">
                {(totalExcludeVat + totalTaxableAmt + totalVatAmt).toFixed(2)}{" "}
                {curCurrency}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

const DisplayItem = ({ label, value }) => {
  return (
    <>
      <div className="my-1" style={{ fontSize: "20px" }}>
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

const DebitReport = (props) => {
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
        let total_amount = 0;
        let vat_amount = 0;
        let exd_vat_total_amount = 0;
        let word_amount = "Zero";
        let qrcodeString = "";
        let data = response.data.results.map((ct) => {
          // console.log("ccccccccc", ct);
          ct.vat_amount = Number(
            (Number(ct.amount_sar) * Number(ct.tax_group_code)) / 100
          ).toFixed(2);
          ct.total_amount = Number(
            Number(ct.amount_sar) + Number(ct.tax_amount)
          ).toFixed(2);

          exd_vat_total_amount = Number(
            Number(exd_vat_total_amount) + Number(ct.amount_sar)
          ).toFixed(2);

          total_amount = Number(
            Number(total_amount) + Number(ct.total_amount)
          ).toFixed(2);

          vat_amount = Number(
            Number(vat_amount) + Number(ct.vat_amount)
          ).toFixed(2);

          word_amount = Number.isFinite(Number(total_amount))
            ? numberToWords.toWords(Number(total_amount))
            : String(total_amount);
          word_amount = String(
            word_amount.charAt(0).toUpperCase() + word_amount.slice(1)
          );

          // genrating qrcode string using TLV format

          try {
            let sellarNameBuf = getTLVForValue("1", "Adnovs");
            let registrationBuf = getTLVForValue(
              "2",
              String(state?.invoice?.client_name?.vat_trn_number)
            );
            let timestampBuf = getTLVForValue(
              "3",
              String(state.invoice?.created_at)
            );
            let inoiceAmountBuf = getTLVForValue("4", String(total_amount));
            let vatamountBuf = getTLVForValue("5", String(vat_amount));

            let tagsBufsArray = [
              sellarNameBuf,
              registrationBuf,
              timestampBuf,
              inoiceAmountBuf,
              vatamountBuf,
            ];

            let qrCodeBuf = Buffer.concat(tagsBufsArray);
            qrcodeString = qrCodeBuf.toString("base64");
          } catch (error) {
            console.log(error);
          }

          return ct;
        });
        setState((prev) => {
          return {
            ...prev,
            accounts: data,
            total_amount,
            vat_amount,
            exd_vat_total_amount,
            word_amount,
            qrcodeString,
          };
        });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Invoice.", 3000, null, null, "");
      });
  };

  const getTLVForValue = (tag, value) => {
    var tagBuf = Buffer.from([tag], "utf8");
    var tagValueLenBuf = Buffer.from([String(value).length], "utf8");
    var tagValueBuf = Buffer.from(String(value), "utf8");
    var bufsArray = [tagBuf, tagValueLenBuf, tagValueBuf];
    return Buffer.concat(bufsArray);
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

export default DebitReport;
