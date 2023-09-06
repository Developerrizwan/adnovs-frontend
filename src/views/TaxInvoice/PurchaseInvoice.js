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

const PurchaseInvoice = (props) => {
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
      {/* {console.log("eeeeeee", state.invoice)} */}
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
            PURCHASE INVOICE
          </div>
        </div>

        <div className="p-3 mt-2">
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            765, AIMALIKKHALIDSTREET, 7748 AI BAGHDADIYAH GHARBIYA PO BOX 22234,
            JEDDAH, KINGDOM OF SAUDI ARABIA
          </p>
        </div>

        {/* <div className="row mt-2 p-2">
          <div className="col-lg-6">
            <h5 className="mb-4" style={{ fontWeight: 700, color: "#000" }}>
              INVOICE TO
              <Translate text={"INVOICE TO"} />{" "}
              <span
                style={{
                  marginLeft: "3px",
                }}
              >
                :
              </span>
            </h5>
            <p>{state.invoice?.client_name?.name}</p>
            <p>{state.invoice?.client_name?.address}</p>
            <p>
              VAT Number الرقم الضريبي
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state.invoice?.client_name?.vat_trn_number}
              </div>
            </p>
          </div>
          <div className="col-lg-6" style={{ borderLeft: "1px solid #000" }}>
            <ShowDataWithTranslate2
              width={"400px"}
              fontWeight={"600"}
              textTransform={"uppercase"}
              label={"Customer VAT Number"}
              value={state.invoice?.client_name?.vat_trn_number}
            />
            <ShowDataWithTranslate2
              width={"400px"}
              fontWeight={"600"}
              textTransform={"uppercase"}
              label={"Invoice No"}
              value={state?.invoice?.id}
            />
            <ShowDataWithTranslate2
              width={"400px"}
              fontWeight={"600"}
              textTransform={"uppercase"}
              label={"Invoice Date"}
              value={moment(state?.invoice?.date).format("MM/DD/YYYY")}
            />
            <ShowDataWithTranslate2
              width={"400px"}
              fontWeight={"600"}
              textTransform={"uppercase"}
              label={"Payment Due Date"}
              value={moment(state?.invoice?.due_date).format("MM/DD/YYYY")}
            />
          </div>
        </div> */}

        {/* <hr style={{ border: "1px solid #000" }} /> */}

        <div className="row p-2">
          <div className="col-lg-6 col-xs-12">
            <table>
              <tr>
                <td className="border-0 fw">PIN No.:</td>
                <td className="border-0">{state?.invoice?.id}</td>
              </tr>
              <tr>
                <td className="border-0 fw">A/C Name:</td>
                <td className="border-0">
                  {state?.invoice?.company?.account_name.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">Narration:</td>
                <td className="border-0">
                  {" "}
                  {state?.invoice?.narration.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">HBL No.:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Ref No.:</td>
                <td className="border-0">{state?.invoice?.job?.client_ref}</td>
              </tr>
              <tr>
                <td className="border-0 fw">Currency:</td>
                <td className="border-0">
                  {state?.invoice?.currency_sar.toUpperCase()}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">ETA:</td>
                <td className="border-0">
                  {moment(state.invoice?.job?.eta).format("MM/DD/YYYY")}
                </td>
              </tr>
            </table>
          </div>
          <div className="col-lg-6 col-xs-12">
            <table>
              <tr>
                <td className="border-0 fw">Date:</td>
                <td className="border-0">
                  {moment(state.invoice?.created_at).format("MM/DD/YYYY")}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">GL Date:</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0 fw">Client:</td>
                <td className="border-0">
                  {state?.invoice?.client_name?.name}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">MBL No.:</td>
                <td className="border-0">
                  {state?.invoice?.client_name?.mobile}
                </td>
              </tr>
              <tr>
                <td className="border-0 fw">Job No.:</td>
                <td className="border-0">{state?.invoice?.job?.job_number}</td>
              </tr>
              <tr>
                <td className="border-0 fw">ETD:</td>
                <td className="border-0">
                  {moment(state.invoice?.job?.etd).format("MM/DD/YYYY")}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2 w-100">
            <tr>
              <th className="text-center">Container No.</th>
              <th className="text-center">Type</th>
              <th className="text-center">No Of Pcs</th>
              <th className="text-center">Gross Weight</th>
              <th className="text-center">Volume</th>
              <th className="text-center">Volume Weight</th>
            </tr>
            <tr>
              {console.log("sss", state)}
              <td className="text-end"></td>
              <td className="text-end">
                {state?.invoice?.party_account?.type[0]}
              </td>
              <td className="text-end">2 PIECES</td>
              <td className="text-end">405.00 KGS</td>
              <td className="text-end"></td>
              <td className="text-end"></td>
            </tr>
          </table>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2 w-100">
            <tr>
              <th className="text-center">A/C Name</th>
              <th className="text-center">Narration</th>
              <th className="text-center">Job No.</th>
              <th className="text-center">Shipment No.</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Currency</th>
              <th className="text-center">Amount / Qty</th>
              <th className="text-center">FCY Amount</th>
              <th className="text-center">Total Amount (SAR)</th>
            </tr>
            <tr>
              <td className="text-end">
                {state?.invoice?.company?.account_name.toUpperCase()}
              </td>
              <td className="text-end">
                {" "}
                {state?.invoice?.narration.toUpperCase()}
                {state?.invoice?.narration ? (
                  <>
                    {"/"}
                    <Translate text={state?.invoice?.narration.toUpperCase()} />
                  </>
                ) : (
                  ""
                )}
              </td>
              <td className="text-end">
                {state?.invoice?.job?.job_number.toUpperCase()}
              </td>
              <td className="text-end">{state?.invoice?.job?.shipper_name}</td>
              <td className="text-end">{state?.invoice?.ex_rate}</td>
              <td className="text-end">
                {" "}
                {state?.invoice?.currency_sar.toUpperCase()}
              </td>
              <td className="text-end">{state?.invoice?.bill_amount}</td>
              <td className="text-end">{state?.invoice?.fc_amount}</td>
              <td className="text-end">{state?.invoice?.amount_sar}</td>
            </tr>
          </table>
        </div>

        {/* <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="w-100 mt-2 border-0">
            <tr className="border-0">
              <td className="border-0"></td>
              <td className="border-0"></td>
              <td className="border-0"></td>
              <td className="border-0"></td>
              <td className="border-0 fw">Six Hundred Ninety</td>
              <td className="border-0"></td>
              <td className="border-0 fw">690.00</td>
            </tr>
          </table>
        </div>

        <div className="p-5" style={{ overflowX: "auto", padding: "20px" }}>
          <h5 className="text-dark">Remarks<span>INC5442161</span></h5>
          
        </div> */}

        <div className="p-5" style={{ overflowX: "auto" }}>
          <table className="w-100">
            <tr style={{ borderBottom: "1px solid #000" }}>
              <th className="border-0 fw">REQUESTED BY</th>
              <th className="border-0 fw">CHECKED BY</th>
              <th className="border-0 fw">CHQ ISSUED BY</th>
              <th className="border-0 fw">ACCOUNTANT</th>
              <th className="border-0 fw">APPROVED BY</th>
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

export default PurchaseInvoice;
