/* eslint-disable no-prototype-builtins */
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Card } from "reactstrap";
import shipLogo from "../../assets/images/ship-logo.png";
import "./table.css";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import QRCode from "react-qr-code";
import moment from "moment";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { Buffer } from "buffer";
import numberToWords from "number-to-words";
import Translate from "./StatementTranslate";

const AccountStatement = (props) => {
  const [state, setState] = useState({ costs: [] });
  const [objData, setObjData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [translatedObject, setTranslatedObject] = useState({});
  const targetLanguage = "ar"; // Language code for Arabic

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
    let jobId = Number(props.match.params.jobId);
    getJob(jobId);
  }, []);

  const getJob = (id) => {
    apiAuth
      .get(`/api/master/job/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, job: data });
        getCosts(data.id);
        setObjData(data);
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Job.", 3000, null, null, "");
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
            let sellarNameBuf = getTLVForValue("1", "Adnovs");
            let registrationBuf = getTLVForValue(
              "2",
              String(state?.invoice?.consignee_name?.vat_trn_number)
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
        NotificationManager.error("", "Invalid Job.", 3000, null, null, "");
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
      <div style={{ padding: "25px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
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
        <div className="card reportdownproject" style={{ padding: "20px" }}>
          <div className="row">
            <div className="col-lg-4">
              <h4 className="mb-2" style={{ fontWeight: "bold" }}>
                {state?.job?.company?.name}
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <p className="mb-1 fw">Tel :</p>
                <p className="mb-1 ms-1">
                  {state?.job?.consignee_name?.mobile}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <p className="mb-1 fw x">Fax :</p>
                <p className="mb-1 ms-1">
                  {/* {state?.job?.consignee_name?.mobile} */}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <p className="mb-1 fw x">CR No :</p>
                <p className="mb-1 ms-1">
                  {/* {state?.job?.consignee_name?.mobile} */}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <p className="mb-1 fw x">Email :</p>
                <p className="mb-1 ms-1">{state?.job?.company?.email}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <p className="mb-1 fw x">VAT# :</p>
                <p className="mb-1 ms-1">
                  {state?.job?.consignee_name?.vat_trn_number}
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4 d-flex">
              <img
                src={shipLogo}
                alt=""
                width={300}
                style={{ margin: "auto" }}
              />
            </div>
            <div className="col-lg-4 d-flex flex-column align-items-end">
              <h4 className="mb-2" style={{ color: "#000" }}>
                <Translate text={state?.job?.company?.name} />
              </h4>
              <p>
                <Translate text={state?.job?.consignee_name?.mobile} />
              </p>
              <p>
                {/* <Translate text={state?.job?.consignee_name?.mobile} /> */}
                {/* fax */}
              </p>
              <p>
                {/* <Translate text={state?.job?.consignee_name?.mobile} /> */}
                {/* cr no */}
              </p>
              <p>
                <Translate text={state?.job?.company?.email} />
              </p>
              <p>
                {state?.invoice?.narration ? (
                  <Translate
                    text={state?.job?.consignee_name?.vat_trn_number}
                  />
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>
          <hr style={{ border: "1px solid #000" }} />
          <div className="row">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginBottom: "20px",
                // textDecoration: "underline",
              }}
            >
              <h3>
                Account Statement / <Translate text={"TAX INVOICE"} />
              </h3>
            </div>
            <div className="p-2" style={{ overflowX: "auto" }}>
              <table className="htmlTable mt-2 w-100">
                <tr>
                  <td className="fw">Account Code</td>
                  <td>{state?.job?.company?.account_number}</td>
                  <td className="fw">From Date</td>
                  <td>{moment(state.job?.created_at).format("MM/DD/YYYY")}</td>
                  <td>{moment(state.job?.created_at).format("MM/DD/YYYY")}</td>
                </tr>
                <tr>
                  <td className="fw">Account Name</td>
                  <td>{state?.job?.company?.account_name}</td>
                  <td className="fw">To Date</td>
                  <td>30/12/2020</td>
                  <td>14/08/2018</td>
                </tr>
                <tr>
                  <td className="fw">
                    CURRENCY IN: {state?.job?.consignee_name?.currency}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="p-2" style={{ overflowX: "auto" }}>
              <table className="htmlTable mt-2 w-100">
                <tr style={{ background: "#d3d3d3" }}>
                  <th className="p-1 fw">DATE</th>
                  <th className="p-1 fw">DESCRIPTION</th>
                  <th className="p-1 fw">VOUCHER</th>
                  <th className="p-1 fw">VOCH#</th>
                  <th className="p-1 fw">DEBIT</th>
                  <th className="p-1 fw">CREDIT</th>
                  <th className="p-1 fw">BALANCE</th>
                </tr>
                <tr>
                  <td className="fw">08/09/2009</td>
                  <td>Invoice for afg737873</td>
                  <td className="fw">Invoice</td>
                  <td>60</td>
                  <td>5,042.42</td>
                  <td>0.00</td>
                  <td>5,042.42</td>
                </tr>
                <tr>
                  <td className="fw">08/09/2009</td>
                  <td>Invoice for afg737873</td>
                  <td className="fw">Invoice</td>
                  <td>60</td>
                  <td>5,042.42</td>
                  <td>0.00</td>
                  <td>5,042.42</td>
                </tr>
              </table>
            </div>
          </div>

          <div
            className="mb-5"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div className="p-2" style={{ overflowX: "auto" }}>
              <table className="htmlTable mt-2">
                <tr style={{ background: "#d3d3d3" }}>
                  <td className="p-1 fw">Period Total: </td>
                  <td className="p-1">5,042.42</td>
                  <td className="p-1">5,042.42</td>
                  <td rowSpan="2" className="p-1">
                    5,042.42
                  </td>
                </tr>
                <tr style={{ background: "#d3d3d3" }}>
                  <td className="p-1 fw">Total: </td>
                  <td className="p-1">5,042.42</td>
                  <td className="p-1">5,042.42</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountStatement;
