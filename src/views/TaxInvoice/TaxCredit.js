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

const TaxCredit = (props) => {
  const [state, setState] = useState({ costs: [] });
  const [loading, setLoading] = useState(false);

  async function exportProjectToPdf() {
    setLoading(true);
    const doc = new jsPDF("p", "px");
    const elements = document.getElementsByClassName(" reportdownproject");
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
          <div className="col-lg-4 mb-1">
            <img
              src={shipLogo}
              alt=""
              width={200}
              style={{ margin: "auto", display: "block" }}
            />
          </div>
          <div
            className="col-lg-8"
            style={{
              background: "#009ada",
              padding: "25px",
              color: "#fff",
              fontSize: "30px",
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.4rem",
            }}
          >
            TAX CREDIT NOTE
          </div>
        </div>

        <div className="p-3 mt-2">
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            765, AIMALIKKHALIDSTREET, 7748 AI BAGHDADIYAH GHARBIYA PO BOX 22234,
            JEDDAH, KINGDOM OF SAUDI ARABIA
          </p>
        </div>

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
            <QRCode size={150} value={String(state.qrcodeString)} />
          </div>
        </div>

        <div className="p-2 mt-4" style={{ overflowX: "auto" }}>
          <table className="w-100">
            <tr style={{ background: "#d3d3d3" }}>
              <td className="fw border-0">Seller:</td>
              <td className="border-0"></td>
              <td className="border-0 fw">Buyer:</td>
              <td className="border-0"></td>
            </tr>
            <tr>
              <td className="fw">Name:</td>
              <td>Adnov Shipping & Logistics</td>
              <td className="fw" style={{ borderRight: 0 }}>
                Name:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
            <tr>
              <td className="fw">Building No:</td>
              <td>AL MALIK KHALID ROAD - HAYY</td>
              <td className="fw" style={{ borderRight: 0 }}>
                Building No:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
            <tr>
              <td className="fw">Street Name:</td>
              <td>JEDDAH KINGDOM OF SAUDI ARABIA</td>
              <td className="fw" style={{ borderRight: 0 }}>
                Street Name:
              </td>
              <td style={{ borderLeft: 0 }}>AL AMEER FAISAL BIN FAHAD</td>
            </tr>
            <tr>
              <td className="fw">District:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                District:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
            <tr>
              <td className="fw">City:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                City:
              </td>
              <td style={{ borderLeft: 0 }}>AL KHOBAR</td>
            </tr>
            <tr>
              <td className="fw">Country:</td>
              <td>Saudi Arabia</td>
              <td className="fw" style={{ borderRight: 0 }}>
                Country:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
            <tr>
              <td className="fw">Postal Code:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                Postal Code:
              </td>
              <td style={{ borderLeft: 0 }}>31865</td>
            </tr>
            <tr>
              <td className="fw">Additional No:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                Additional No:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
            <tr>
              <td className="fw">VAT Number:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                VAT Number:
              </td>
              <td style={{ borderLeft: 0 }}>563574672681</td>
            </tr>
            <tr>
              <td className="fw">Other Seller ID:</td>
              <td></td>
              <td className="fw" style={{ borderRight: 0 }}>
                Other Seller ID:
              </td>
              <td style={{ borderLeft: 0 }}></td>
            </tr>
          </table>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="w-100">
            <tr style={{ background: "#B6D0E2" }}>
              <td className="fw">Line Items:</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
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
            <tr>
              <td>TRANSPORTATION CHARGES</td>
              <td className="text-end">250.00</td>
              <td className="text-end">1</td>
              <td className="text-end">250.00</td>
              <td className="text-end">0.00</td>
              <td className="text-end">15%</td>
              <td className="text-end">37.50</td>
              <td className="text-end">287.50 SAR</td>
            </tr>
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
                <td className="p-1 border-0">250.00 SAR</td>
              </tr>
              <tr>
                <td className="p-1 fw border-0">Discount</td>
                <td className="p-1 border-0">0.00 SAR</td>
              </tr>
              <tr>
                <td className="p-1 fw border-0">
                  Total Taxable Amount (Excluding VAT)
                </td>
                <td className="p-1 border-0">250.00 SAR</td>
              </tr>
              <tr>
                <td className="p-1 fw border-0">Total VAT</td>
                <td className="p-1 border-0">37.50 SAR</td>
              </tr>
              <tr>
                <td className="p-1 fw border-0">Total Amount Due</td>
                <td className="p-1 border-0">287.50 SAR</td>
              </tr>
            </table>
          </div>
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

export default TaxCredit;
