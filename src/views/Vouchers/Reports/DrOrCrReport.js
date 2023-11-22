import React, { useEffect, useState } from "react";
import numberToWords from "number-to-words";
import QRCode from "react-qr-code";
import { Buffer } from "buffer";

import apiAuth from "../../../helpers/ApiAuth";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import NotificationManager from "../../../components/Common/NotificationManager";
import moment from "moment";

const Content = ({ data, curReport }) => {
  // console.log("taxx", data);
  console.log("db/cb data", data);
  const [state, setState] = useState({});
  var curCurrency = data?.voucher?.currency?.split(" ")[0];
  var totalExcludeVat = 0;
  var totalTaxableAmt = 0;
  var totalVatAmt = 0;
  const buyer =
    curReport === "debit" ? data?.voucher?.company : data?.voucher?.client_name;
  const seller =
    curReport === "debit" ? data?.voucher?.client_name : data?.voucher?.company;

  // console.log("tax", data);
  return (
    <div id="content" className="mt-5 mx-2">
      {/* VOUCHER Title */}
      <h4
        className="text-center mb-4"
        style={{ fontFamily: "sans-serif", color: "gray" }}
      >
        {`TAX ${curReport.toUpperCase()} VOUCHER`}
      </h4>

      {/* Voucher Details and QR code */}
      <div className="d-flex justify-content-around align-items-center ">
        <div className="">
          <DisplayItem
            width={"200px"}
            label={"Invoice Number"}
            value={data?.voucher?.invoice?.invoice_number}
          />
          <DisplayItem
            width={"200px"}
            label={"Invoice Issue Date"}
            value={moment(data?.voucher?.invoice?.date).format("DD/MM/YYYY")}
          />
          <DisplayItem
            width={"200px"}
            label={"Date Of Supply"}
            value={moment(data?.voucher?.invoice?.due_date).format(
              "DD/MM/YYYY"
            )}
          />
        </div>
        <div className="mr-4">
          <QRCode size={150} value={String(state?.qrcodeString)} />
        </div>
      </div>

      {/* Display Items */}
      <div
        id="display-items"
        className="mt-4 mb-2 d-flex justify-content-around align-items-center"
      >
        {/* Seller items */}
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
          {/* {console.log("seller", seller)} */}
          <>
            <DisplayItem label={"Name"} value={seller?.name} />
            <DisplayItem label={"Building No"} value={""} />
            <DisplayItem label={"Street Name"} value={""} />
            <DisplayItem label={"District"} value={""} />
            <DisplayItem label={"City"} value={seller?.state} />
            <DisplayItem label={"Country"} value={seller?.country} />
            <DisplayItem
              label={"Postal Code"}
              value={seller?.post_box_no || ""}
            />
            <DisplayItem label={"Additional No"} value={""} />
            <DisplayItem
              label={"VAT Number"}
              value={seller?.vat_number || seller?.vat_trn_number}
            />
            <DisplayItem label={"Other Seller ID"} value={""} />
          </>
        </div>

        {/* Buyer items */}
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
          {/* {console.log("buyer", buyer)} */}

          <>
            <DisplayItem label={"Name"} value={buyer?.name} />
            <DisplayItem label={"Building No"} value={""} />
            <DisplayItem label={"Street Name"} value={""} />
            <DisplayItem label={"District"} value={""} />
            <DisplayItem label={"City"} value={buyer?.city} />
            <DisplayItem label={"Country"} value={buyer?.country} />
            <DisplayItem
              label={"Postal Code"}
              value={buyer?.post_box_no || ""}
            />
            <DisplayItem label={"Additional No"} value={""} />
            <DisplayItem
              label={"VAT Number"}
              value={buyer?.vat_trn_number || buyer?.vat_number}
            />
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
            <th className="text-center">Dr/Cr </th>
            <td className="text-center fw">Taxable Amount</td>
            <td className="text-center fw">Discount</td>
            <td className="text-center fw">Tax Rate</td>
            <td className="text-center fw">Tax Amount</td>
            <td className="text-center fw">Item Subtotal(Including VAT)</td>
          </tr>
          {data?.accounts?.length > 0 &&
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
                    <td className="text-center">{dd?.dr_cr}</td>
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
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "50px",
        }}
      >
        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2">
            <tr>
              <td className="p-1 fw border-0">Total (Excluding VAT)</td>
              <td className="p-1 border-0">
                :
                <span style={{ marginLeft: "10px" }}>
                  {totalExcludeVat.toFixed(2)} {curCurrency}
                </span>
              </td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">Discount</td>
              <td className="p-1 border-0">
                : <span style={{ marginLeft: "10px" }}>0.00 {curCurrency}</span>
              </td>
            </tr>
            {/* <tr>
              <td className="p-1 fw border-0">
                <span>Total Taxable Amount (Excluding VAT)</span>
              </td>
              <td className="p-1 border-0">
                :
                <span style={{ marginLeft: "10px" }}>
                  {totalTaxableAmt.toFixed(2)} {curCurrency}
                </span>
              </td>
            </tr> */}
            <tr>
              <td className="p-1 fw border-0">Total VAT</td>
              <td className="p-1 border-0">
                :
                <span style={{ marginLeft: "10px" }}>
                  {totalVatAmt.toFixed(2)} {curCurrency}
                </span>
              </td>
            </tr>
            <tr>
              <td className="p-1 fw border-0">Total Amount Due</td>
              <td className="p-1 border-0">
                :
                <span style={{ marginLeft: "10px" }}>
                  {(totalExcludeVat + totalVatAmt).toFixed(2)}
                  {curCurrency}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

const DisplayItem = ({ label, value, width = "150px" }) => {
  return (
    <>
      <div className="my-1" style={{ fontSize: "20px" }}>
        <span
          style={{ fontWeight: 600, width: width, display: "inline-block" }}
        >
          {label}
        </span>
        : {value}
      </div>
    </>
  );
};

const DrOrCrReport = (props) => {
  const [state, setState] = useState({});
  const [curReport, setCurReport] = useState("");

  useEffect(() => {
    let id = Number(props.match.params.id);
    const cur = props.match.path.split("/")[2];
    setCurReport(cur);
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
          <Content curReport={curReport} data={state} />

          {/* Footer */}
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default DrOrCrReport;
