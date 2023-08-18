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

const TaxInvoice = (props) => {
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
            TAX INVOICE
          </div>
        </div>

        <div className="p-3 mt-2">
          <p style={{ fontWeight: 500, fontSize: "16px" }}>
            765, AIMALIKKHALIDSTREET, 7748 AI BAGHDADIYAH GHARBIYA PO BOX 22234,
            JEDDAH, KINGDOM OF SAUDI ARABIA
          </p>
        </div>

        <div className="row mt-2 p-2">
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
              VAT No. <Translate text={"VAT No"} /> :
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state.invoice?.client_name?.vat_trn_number}
              </div>
            </p>
          </div>
          <div className="col-lg-6" style={{ borderLeft: "1px solid #000" }}>
            <p
              style={{
                fontWeight: 600,
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "400px",
                }}
              >
                Customer VAT No
                <Translate text="Customer VAT No" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state.invoice?.client_name?.vat_trn_number}
              </div>
            </p>
            <p
              style={{
                fontWeight: 600,
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "400px",
                }}
              >
                Invoice No
                <Translate text="Invoice No" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state?.invoice?.id}
              </div>
            </p>
            <p
              style={{
                fontWeight: 600,
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "400px",
                }}
              >
                Invoice Date
                <Translate text="Invoice Date" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {moment(state.invoice?.date).format("MM/DD/YYYY")}
              </div>
            </p>
            <p
              style={{
                fontWeight: 600,
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "400px",
                }}
              >
                Payment Due Date
                <Translate text="Payment Due Date" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                :
                {state.invoice?.due_date
                  ? moment(state.invoice?.due_date).format("MM/DD/YYYY")
                  : ""}
              </div>
            </p>
          </div>
        </div>

        <hr style={{ border: "1px solid #000" }} />

        <div className="row p-2">
          <div
            className="col-lg-6 col-xs-12"
            style={{ borderRight: "1px solid #000" }}
          >
            <table className="w-100 mt-2 border-0">
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Shipper
                  <Translate text="Payment Due Date" />
                </td>
                <td className="border-0">: {state.invoice?.shipper_name}</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Consignee <Translate text={"Consignee"} />
                </td>
                <td className="border-0">
                  : {state.invoice?.consignee_name?.name}
                </td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Place of Origin <Translate text={"Place of Origin"} />
                </td>
                <td className="border-0">: {state.invoice?.pod}</td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Final Destination <Translate text={"Final Destination"} />
                </td>
                <td className="border-0">: {state.invoice?.poa}</td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Vessel / Flight <Translate text={"Vessel / Flight"} />
                </td>
                <td className="border-0">: </td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Voy / Flt <Translate text={"Voy / Flt"} />
                </td>
                <td className="border-0">:</td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Cust. P/O No <Translate text={"Cust. P/O No"} />
                </td>
                <td className="border-0">:</td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Remarks <Translate text={"Remarks"} />
                </td>
                <td className="border-0">: {state.invoice?.remarks}</td>
                <td className="border-0"></td>
              </tr>
            </table>
          </div>
          <div className="col-lg-6 col-xs-12">
            <table className="w-100 mt-2 border-0">
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Job Number <Translate text={"Job Number"} />
                </td>
                <td className="border-0">: {state.invoice?.job?.job_number}</td>
                <td className="border-0"></td>
              </tr>
              <tr>
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Job Date <Translate text={"Job Date"} />
                </td>
                <td className="border-0">
                  {" "}
                  :{" "}
                  {state.invoice?.job
                    ? moment(state.invoice?.job?.created_at).format(
                        "MM/DD/YYYY"
                      )
                    : ""}
                </td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  Master <Translate text={"Master"} />
                </td>
                <td className="border-0">: </td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  House No <Translate text={"House No"} />
                </td>
                <td className="border-0">:</td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  ETD <Translate text={"etd"} />
                </td>
                <td className="border-0">
                  :{" "}
                  {state.invoice?.job
                    ? moment(state.invoice?.job?.etd).format("MM/DD/YYYY")
                    : ""}
                </td>
                <td className="border-0"></td>
              </tr>
              <tr className="border-0">
                <td className="border-0" style={{ fontWeight: 600 }}>
                  ETA <Translate text={"ETA"} />
                </td>
                <td className="border-0">
                  :{" "}
                  {state.invoice?.job
                    ? moment(state.invoice?.job?.eta).format("MM/DD/YYYY")
                    : ""}
                </td>
                <td className="border-0"></td>
              </tr>
            </table>
          </div>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2 w-100">
            <tr style={{ background: "#dadedf" }}>
              <th style={{ padding: "5px 0" }}>
                Charge Description <br />{" "}
                <Translate text={"Charge Description"} />
              </th>
              <th>
                .Curr <br /> <Translate text={".Curr"} />
              </th>
              <th>
                Rate Per Unit <br /> <Translate text={"Rate Per Unit"} />
              </th>
              <th>
                Unit <br /> <Translate text={"Unit"} />
              </th>
              <th>
                Curr. Amount <br /> <Translate text={"Curr. Amount"} />{" "}
              </th>
              {/* <th>ROE</th> */}
              <th>
                Total Price excl. VAT <br />{" "}
                <Translate text={"Total Price excl. VAT"} />
              </th>
              <th>
                VAT% <br /> <Translate text={"VAT%"} />
              </th>
              <th>
                VAT Amount <br /> <Translate text={"VAT AMOUNT"} />
              </th>
              <th>
                Total SAR <br /> <Translate text={"Total SAR"} />
              </th>
            </tr>
            {state.costs.map((cost, index) => (
              <>
                <tr style={{ borderBottom: "1px solid #d3d3d3" }} key={index}>
                  {console.log("ccc", cost)}
                  <td>{cost?.charge?.description}</td>
                  <td>{cost?.currency}</td>
                  <td>
                    {" "}
                    {Number(cost.amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>1</td>
                  <td>
                    {" "}
                    {Number(cost.amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  {/* <td>3.760000</td> */}
                  <td>
                    {Number(cost.amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{cost.tax_group_code}</td>
                  <td>
                    {Number(cost.vat_amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {Number(cost.total_amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </>
            ))}
          </table>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="w-100 mt-2 border-0">
            <tr className="border-0">
              <td className="border-0" style={{ fontWeight: 600 }}>
                {state.word_amount} Only{" "}
                <Translate text={`${state.word_amount} Only`} />
              </td>
              <td className="border-0" style={{ fontWeight: 600 }}>
                {/* Total in: {state.invoice?.currency_sar} */}
                <div
                  style={{
                    display: "inline-block",
                    width: "150px",
                  }}
                >
                  Total in
                  <Translate text="Total in" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  :{state.invoice?.currency_sar}
                </div>
              </td>
              <td className="border-0" style={{ fontWeight: 600 }}>
                {Number(state.exd_vat_total_amount)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              {/* <td className="border-0"></td> */}
              <td className="border-0" style={{ fontWeight: 600 }}>
                {Number(state.vat_amount)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border-0" style={{ fontWeight: 600 }}>
                {Number(state.total_amount)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </table>
        </div>

        <div className="p-2" style={{ overflowX: "auto" }}>
          <table className="htmlTable mt-2 w-100">
            <tr style={{ background: "#dadedf" }}>
              <th>
                Container Details <Translate text={"Container Details"} />
              </th>
            </tr>
            <tr>
              <td>FCIU6538307, YMMU6330305 </td>
            </tr>
          </table>
        </div>

        <div className="row p-2">
          <div className="col-lg-4 col-xs-12">
            <table className="htmlTable mt-2 w-100">
              <tr style={{ background: "#dadedf" }}>
                <th>
                  No. of Containers <Translate text={"No. of Containers"} />
                </th>
                <th>
                  TYPE <Translate text={"TYPE"} />
                </th>
              </tr>
              <tr>
                <td>1</td>
                <td>20 DC</td>
              </tr>
            </table>
          </div>
          <div className="col-lg-8 col-xs-12"></div>
        </div>

        <div className="row mt-4 p-2">
          <div className="col-lg-9 col-xs-12">
            <h5 style={{ color: "#000", fontWeight: 700 }}>
              Terms & Conditions <Translate text={"Terms & Conditions"} />
            </h5>
            <p>
              If any discrepancy in the invoice must be notified within 7 days
              from the date of invoice. Otherwise, it shall be considered as
              acknowledged.
            </p>
            <h5 className="mt-4" style={{ color: "#000", fontWeight: 700 }}>
              BANK DETAILS <Translate text={"BANK DETAILS"} />
            </h5>

            <p>
              <div
                style={{
                  display: "inline-block",
                  width: "250px",
                }}
              >
                Account Name
                <Translate text="Account Name" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state?.invoice?.company?.account_name}
              </div>
            </p>

            <p>
              <div
                style={{
                  display: "inline-block",
                  width: "250px",
                }}
              >
                Account Number
                <Translate text="Account Name" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state?.invoice?.company?.account_number}
              </div>
            </p>

            <p>
              <div
                style={{
                  display: "inline-block",
                  width: "250px",
                }}
              >
                IBAN Code
                <Translate text="IBAN Code" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state?.invoice?.company?.iban_code}
              </div>
            </p>

            <p>
              <div
                style={{
                  display: "inline-block",
                  width: "250px",
                }}
              >
                Swift Code
                <Translate text="Swift Code" />
              </div>
              <div style={{ display: "inline-block", marginLeft: "5px" }}>
                : {state?.invoice?.company?.swift_code}
              </div>
            </p>
          </div>
          <div className="col-lg-3 col-xs-12 mt-4">
            <span className="p-2">
              <QRCode size={150} value={String(state.qrcodeString)} />
            </span>
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

export default TaxInvoice;
