import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Card } from "reactstrap";
import shipLogo from "../../assets/images/ship-logo.png";
import {
  BrowserChrome,
  EnvelopeAtFill,
  TelephoneFill,
  ThreeDotsVertical,
  Wifi,
  Wikipedia,
} from "react-bootstrap-icons";
import { Buffer } from "buffer";
import * as htmlToImage from "html-to-image";
import numberToWords from "number-to-words";
import "./table.css";
import jsPDF from "jspdf";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import moment from "moment";
import QRCode from "react-qr-code";
import Translate from "./Translate";

const ShowDataWithTranslate = ({ label, value }) => {
  return (
    <>
      <tr className="border-0">
        <td className="border-0" style={{ fontWeight: 600 }}>
          {label} <Translate text={label} />
        </td>
        <td className="border-0">: {value ? value : ""}</td>
        <td className="border-0"></td>
      </tr>
    </>
  );
};

const ShowDataWithTranslate2 = ({
  fontWeight = "",
  textTransform = "",
  label,
  value,
  width,
}) => {
  return (
    <p
      style={{
        fontWeight: fontWeight,
        color: "#000",
        textTransform: textTransform,
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: width,
        }}
      >
        {label}
        <Translate text={label} />
      </div>
      <div style={{ display: "inline-block", marginLeft: "5px" }}>
        : {value ? value : ""}
      </div>
    </p>
  );
};

const ShowTableHeadWithTranslate = ({ label }) => {
  return (
    <>
      <th style={{ padding: "5px 0" }}>
        {label} <br />
        <Translate text={label} />
      </th>
    </>
  );
};

const ReceiptVoucher = (props) => {
  const [state, setState] = useState({ costs: [] });
  const [loading, setLoading] = useState(false);

  async function exportProjectToPdf() {
    setLoading(true);
    const doc = new jsPDF("p", "px");
    const elements = document.getElementsByClassName("reportdownproject");
    await creatPdf({ doc, elements });

    doc.save(`invoice.pdf`);
    setLoading(false);
  }

  async function creatPdf({ doc, elements }) {
    let top = 20;
    const padding = 10;

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);
      try {
        const imgData = await htmlToImage.toPng(el);
        let elHeight = el.offsetHeight;
        let elWidth = el.offsetWidth;
        const pageWidth = doc.internal.pageSize.getWidth();
        if (elWidth > pageWidth) {
          const ratio = pageWidth / elWidth;
          elHeight = elHeight * ratio - padding;
          elWidth = elWidth * ratio - padding;
        }
        const pageHeight = doc.internal.pageSize.getHeight();
        if (top + elHeight > pageHeight) {
          doc.addPage();
          top = 20;
        }
        doc.addImage(
          imgData,
          "PNG",
          padding,
          top,
          elWidth,
          elHeight,
          `image${i}`
        );
        top += elHeight;
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    let invoiceid = Number(props.match.params.invoiceId);
    getInvoice(invoiceid);
  }, []);

  const getInvoice = (id) => {
    apiAuth
      .get(`/api/master/invoice/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, invoice: data });
        getCosts(data.id);
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Invoice.", 3000, null, null, "");
      });
  };
  const getCosts = (id) => {
    apiAuth
      .get(`/api/get-costentry/?invoice_id=${id}`)
      .then((response) => {
        let total_amount = 0;
        let vat_amount = 0;
        let exd_vat_total_amount = 0;
        let word_amount = "Zero";
        let qrcodeString = "";
        let data = response.data.map((ct) => {
          ct.vat_amount = Number(
            (Number(ct.amount) * Number(ct.tax_group_code)) / 100
          ).toFixed(2);
          ct.total_amount = Number(
            Number(ct.amount) + Number(ct.vat_amount)
          ).toFixed(2);

          exd_vat_total_amount = Number(
            Number(exd_vat_total_amount) + Number(ct.amount)
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
            let sellarNameBuf = getTLVForValue("1", "Seller Name");
            let registrationBuf = getTLVForValue("2", "VAT No");
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
            costs: data,
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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "15px",
          marginBottom: "5px",
          marginRight: "5px",
        }}
      >
        <Button
          color="info"
          className="float-right"
          onClick={exportProjectToPdf}
        >
          {loading ? "Downloding..." : "Download"}
        </Button>
      </div>
      <div className="card reportdownproject mb-5">
        <div className="row" style={{ placeItems: "center" }}>
          <div className="col-lg-3 mb-1">
            <img
              src={shipLogo}
              alt=""
              width={200}
              style={{ margin: "auto", display: "block" }}
            />
          </div>
          <div
            className="col-lg-9"
            style={{
              background: "#009ada",
              padding: "45px",
              color: "#fff",
              fontSize: "42px",
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.4rem",
            }}
          >
            RECEIPT VOUCHER
          </div>
        </div>

        <div className="p-3 mt-2">
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            765, AIMALIKKHALIDSTREET, 7748 AI BAGHDADIYAH GHARBIYA PO BOX 22234,
            JEDDAH, KINGDOM OF SAUDI ARABIA
          </p>
        </div>

        <div className="row p-2">
          <div className="col-lg-6 col-xs-12">
            <table>
              <tr>
                <td className="border-0 fw">Received From:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">A/C Name:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Type:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Narration:</td>
                <td className="border-0"></td>
              </tr>
            </table>
          </div>
          <div className="col-lg-6 col-xs-12">
            <table>
              <tr>
                <td className="border-0 fw">Receipt No:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Date:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Cheque/Ref. No:</td>
                <td className="border-0"></td>
              </tr>
            </table>
          </div>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2 w-100">
            <tr>
              <th className="text-center">Description</th>
              <th className="text-center">Amount</th>
            </tr>
            <tr>
              <td>IQMA EXPENSES PAID BY SNB (RE ENTRY FOR AFSAL)</td>
              <td>200</td>
            </tr>
          </table>
        </div>

        <div className="p-5 text-center text-dark">
          <h5> This is a computer generated document and does not require signature <br/> 
          Receipt issued for cheque payments will be subject to realization of the cheque</h5>
        </div>

        <div className="p-5" style={{ overflowX: "auto" }}>
          <table className="border-table">
          <tr>
          <th className="bw w-25"></th>
          <th className="bw w-25"></th>
          <th className="bw w-25"></th>
          </tr>
            <tr style={{ border: "none" }}>
              <td className="border-0 fw text-center w-25">Accountant <br/> (Adnov Logistics)</td>
              <th className="border-0 fw text-center w-25">Checked By</th>
              <th className="border-0 fw text-center w-25">Receiver's Signature</th>
            </tr>
          </table>
        </div>

        

        <div
          className="row mt-5 mb-0"
          style={{
            background: "#009ada",
            padding: "15px",
            color: "#fff",
            fontSize: "60px",
            fontWeight: 900,
            textAlign: "center",
          }}
        >
          <div className="col-lg-4 col-xs-12">
            <h5 className="text-light">
              <BrowserChrome /> www.adnov.com
            </h5>
          </div>
          <div className="col-lg-4 col-xs-12">
            <h5 className="text-light">
              <EnvelopeAtFill /> adnov@gmail.com
            </h5>
          </div>
          <div className="col-lg-4 col-xs-12">
            <h5 className="text-light">
              <TelephoneFill /> +91 9999999999
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptVoucher;
