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
import Translate from "./Translate";

const TaxInvoiceSecond = (props) => {
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
        setObjData(data);
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
      {console.log("eeeee", state.invoice)}
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
              <h3 style={{ color: "#000" }}>{state?.invoice?.company?.name}</h3>
              <p>{state?.invoice?.company?.address}</p>
              <p>
                {state?.invoice?.company?.state} ,
                {state?.invoice?.company?.country}
              </p>
              <p style={{ fontWeight: 600 }}>
                VAT NO : {state?.invoice?.company?.vat}
              </p>
              {/* <p style={{ fontWeight: 600 }}>CR NO : </p> */}
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
              <h3 style={{ color: "#000" }}>
                <Translate text={String(state?.invoice?.company?.name)} />
              </h3>
              <p>
                {/* <Translate
                  text={
                    state?.invoice?.company?.address.length
                      ? state?.invoice?.company?.address
                      : ""
                  }
                /> */}
                {state?.invoice?.company?.language_address?.length
                  ? state?.invoice?.company?.language_address
                  : ""}
              </p>
              {/* <p>
                <Translate text={state?.invoice?.company?.state} />
                <Translate text={state?.invoice?.company?.country} />
              </p> */}
              <p style={{ fontWeight: 600 }}>
                <Translate text={"VAT NO"} />: {state?.invoice?.company?.vat}
              </p>
              {/* <p style={{ fontWeight: 600 }}>CR NO : </p> */}
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
                marginBottom: "10px",
                textDecoration: "underline",
              }}
            >
              <h3>
                TAX INVOICE / <Translate text={"TAX INVOICE"} />
              </h3>
            </div>
            <div className="col-lg-3">
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Job No
                  <Translate text="Job No" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.job?.job_number}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Enquiry No
                  <Translate text="Enquiry No" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.job?.enquiry_no}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Client - Bill To
                  <Translate text="Client - Bill To" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  :
                </div>
              </p>
              {/* <div className="">
                <span>
                  <Translate text={state?.invoice?.client_name?.address} />
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state?.invoice?.client_name?.address || ""}
                </span>{" "}
                ,
              </div> */}
              <div className="">
                <span>
                  <Translate text={state?.invoice?.client_name?.city} />
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state?.invoice?.client_name?.city}
                </span>{" "}
                ,
              </div>
              <div className="">
                <span>
                  <Translate text={state?.invoice?.client_name?.state_code} />
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state?.invoice?.client_name?.state_code}
                </span>{" "}
                ,
              </div>

              <div className="">
                <span>
                  <Translate text={state?.invoice?.client_name?.country} />
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state?.invoice?.client_name?.country}
                </span>
              </div>
            </div>
            <div className="col-lg-5">
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  Invoice Date
                  <Translate text="Invoice Date" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {moment(state.invoice?.created_at).format("MM/DD/YYYY")}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  Invoice No
                  <Translate text="Invoice No" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state?.invoice?.id}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  BL Number
                  <Translate text="BL Number" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state?.invoice?.bl_number}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  Bayan Number
                  <Translate text="Bayan Number" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state?.invoice?.bayan_number}
                </div>
              </p>

              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  Client Ref / PO No
                  <Translate text="Client Ref / PO No" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.client_name?.name}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  ETA
                  <Translate text="ETA" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {moment(state.invoice?.job?.eta).format("MM/DD/YYYY")}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "250px",
                  }}
                >
                  ETD
                  <Translate text="etd" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {moment(state.invoice?.job?.etd).format("MM/DD/YYYY")}
                </div>
              </p>
            </div>
            <div className="col-lg-4 ml-2">
              {/* <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Due Date
                  <Translate text="Due Date" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {moment(state.invoice?.due_date).format("MM/DD/YYYY")}
                </div>
              </p> */}
              {/* <p>Delivery Date : </p> */}

              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Consignee
                  <Translate text="Consignee" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.consignee_name?.name}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Shipper Name
                  <Translate text="Shipper Name" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.shipper_name}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  Notify
                  <Translate text="Notify" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  :
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  POL
                  <Translate text="POL" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.job?.pol}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  POD
                  <Translate text="POD" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.job?.pod}
                </div>
              </p>
              <p>
                <div
                  style={{
                    display: "inline-block",
                    width: "200px",
                  }}
                >
                  POA
                  <Translate text="poa" />
                </div>
                <div style={{ display: "inline-block", marginLeft: "5px" }}>
                  : {state.invoice?.job?.poa}
                </div>
              </p>

              {/* <p>BL/AWB :</p> */}
            </div>
          </div>

          {/* <hr style={{ border: "1px solid #000" }} /> */}

          <div
            style={{
              overflowX: "auto",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <table className="htmlTable mt-2 w-100">
              <tbody>
                <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
                  <th
                    className="border-0"
                    style={{
                      padding: "10px 0px",
                    }}
                  >
                    #
                  </th>

                  <th className="border-0">
                    Description
                    <br />
                    <span>
                      <Translate text={"Description"} />
                    </span>
                  </th>
                  <th className="border-0">
                    Currency
                    <br />
                    <span>
                      <Translate text={"Currency"} />
                    </span>
                  </th>
                  {/* <th className="border-0">Quantity</th>
                <th className="border-0">Rate</th> */}
                  <th className="border-0">
                    Amount
                    <br />
                    <span>
                      <Translate text={"Amount"} />
                    </span>
                  </th>
                  <th className="border-0">
                    VAT%
                    <br />
                    <span>
                      <Translate text={"VAT%"} />
                    </span>
                  </th>
                  <th className="border-0">
                    VAT
                    <br />
                    <span>
                      <Translate text={"VAT"} />
                    </span>
                  </th>
                  <th className="border-0 ">
                    Total
                    <br />
                    <span>
                      <Translate text={"Total"} />
                    </span>
                  </th>
                </tr>
                {state.costs?.map((cost, index) => {
                  return (
                    <>
                      <tr
                        style={{
                          borderBottom: "1px solid #d3d3d3",
                        }}
                        key={index}
                      >
                        <td
                          className="border-0"
                          style={{
                            padding: "10px 0px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td className="border-0">
                          {cost.charge?.name} /{" "}
                          <Translate text={cost.charge?.name} />
                        </td>
                        <td className="border-0">{cost.currency}</td>
                        {/* <td className="border-0">1</td>
                      <td className="border-0">1,161.50</td> */}
                        <td className="border-0">
                          {Number(cost.amount)?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-0">{cost.tax_group_code}</td>
                        <td className="border-0">
                          {Number(cost.vat_amount)?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-0">
                          {Number(cost.total_amount)?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* <hr className="mt-5" style={{ border: "1px solid #000" }} /> */}

          <div
            className="card mt-4"
            style={{ border: "1px solid #000", padding: "20px 10px" }}
          >
            <div className="row">
              <div className="col-lg-5 col-xs-12">
                <p>
                  <div
                    style={{
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Type
                    <Translate text="Type" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    : {state?.invoice?.job?.type}
                  </div>
                </p>
                <p>
                  <div
                    style={{
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Container
                    <Translate text="Container" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    : {state?.invoice?.job?.container_type}
                  </div>
                </p>
                <p>
                  <div
                    style={{
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Volume
                    <Translate text="Volume" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    :
                  </div>
                </p>
                <p>
                  <div
                    style={{
                      display: "inline-block",
                      width: "150px",
                    }}
                  >
                    Commodity
                    <Translate text="Commodity" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    :
                  </div>
                </p>
              </div>
              <div
                style={{
                  borderLeft: "1px solid black",
                }}
                className="col-lg-7 col-xs-12"
              >
                <div className="row">
                  <div
                    className="col-lg-8 col-md-6"
                    style={{ fontSize: "16px" }}
                  >
                    <p>
                      Total excl VAT
                      <span
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          fontWeight: 700,
                          color: "red",
                        }}
                      >
                        /
                      </span>
                      <span>
                        <Translate text={"Total excl VAT"} />
                      </span>
                    </p>
                    <p>
                      Value Added Tax
                      <span
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          fontWeight: 700,
                          color: "red",
                        }}
                      >
                        /
                      </span>
                      <span>
                        <Translate text={"Value Added Tax"} />
                      </span>
                    </p>
                    <p>
                      Total With VAT
                      <span
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          fontWeight: 700,
                          color: "red",
                        }}
                      >
                        /
                      </span>
                      <span>
                        <Translate text={"Total With VAT"} />
                      </span>
                    </p>
                  </div>
                  <div
                    className="col-lg-4 col-md-6"
                    style={{ fontWeight: 900, fontSize: "18px" }}
                  >
                    <p>
                      {Number(state.exd_vat_total_amount)?.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </p>
                    <p>
                      {Number(state.vat_amount)?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p style={{ color: "#D0312D" }}>
                      <span style={{ fontSize: "12px" }}>
                        {state.invoice?.currency_sar}{" "}
                      </span>
                      {Number(state.total_amount)?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <hr style={{ border: "1px solid #000" }} />
                <div className="row">
                  <div className="col-lg-7">
                    <h4>
                      {state.invoice?.currency_sar} {state.word_amount}{" "}
                      <span
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        <Translate fontWeight={700} text={state.word_amount} />
                      </span>
                    </h4>
                  </div>
                  {/* <div className="col-lg-5">
                    <p></p>
                  </div> */}
                </div>
                <hr style={{ border: "1px solid #000" }} />
              </div>
            </div>
          </div>

          <div
            className="card mt-4"
            style={{ border: "1px solid #000", padding: "20px 10px" }}
          >
            <div className="row mt-2">
              <div className="col-lg-8 col-xs-12">
                <h5>
                  <Translate text={"Payment Method"} />
                </h5>
                <h5>Payment Method</h5>

                <h6 className="mt-3 mb-4">
                  Account Details
                  <span style={{ marginRight: "5px" }}>
                    <Translate text={"Account Details"} />
                  </span>
                  :
                </h6>
                <div>
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
                </div>

                <div>
                  <div
                    style={{
                      display: "inline-block",
                      width: "250px",
                    }}
                  >
                    Bank Name
                    <Translate text="Bank Name" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    : {state?.invoice?.company?.bank_name}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "inline-block",
                      width: "250px",
                    }}
                  >
                    Account No
                    <Translate text="Account No" />
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "5px" }}>
                    : {state?.invoice?.company?.account_number}
                  </div>
                </div>

                <div>
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
                </div>

                <div>
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
                </div>
              </div>
              <div className="col-lg-4 col-xs-12 d-flex justify-content-center align-items-center">
                <span className="p-2" style={{ display: "contents" }}>
                  <QRCode size={150} value={String(state.qrcodeString)} />
                </span>
              </div>
            </div>
          </div>

          <hr className="mt-5" style={{ border: "1px solid #000" }} />
          <div className="mt-2">
            <div className="row">
              <div className="col-lg-9 col-xs-12">
                <p>
                  This is a computer generated invoice doesn't require signature
                  or stamp
                </p>
                <p>
                  Any discrepancy must be notified within 7 days from the date
                  of invoice. Otherwise it shall be considered as confirmation
                  of correctness
                </p>
                {/* <p>
                <span style={{ fontWeight: 700 }}>Print Date </span>05-07-2023
                11:00 am
              </p> */}
              </div>
              <div className="col-lg-1 col-xs-12">
                <p>Email:</p>
                {/* <p>Phone:</p> */}
              </div>
              <div className="col-lg-2 col-xs-12">
                <p>info@adnovs.com</p>
                {/* <p>9999999999</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxInvoiceSecond;
