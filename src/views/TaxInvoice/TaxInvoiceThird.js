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

const ShowDataWithTranslate = ({ label, value, width }) => {
  return (
    <p style={{ fontSize: "20px", display: "flex" }}>
      <div
        style={{
          display: "ruby",
          // width: width,
        }}
      >
        {label}
        {/* <Translate text={label} /> */}
      </div>
      <div style={{ display: "inline-block", marginLeft: "15px" }}>
        : {value ? value : ""}
      </div>
    </p>
  );
};

const ShowTableHeadWithTranslate = ({ label }) => {
  return (
    <>
      <th className="border-0 text-center">
        {label}
        <br />
        <span>{/* <Translate text={label} /> */}</span>
      </th>
    </>
  );
};

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
          let new_amount = Number(ct?.amount) * Number(ct?.quantity);
          ct.vat_amount = Number(
            (Number(ct?.amount) * Number(ct.tax_group_code)) / 100
          ).toFixed(2);
          ct.total_amount = Number(
            Number(ct?.amount) + Number(ct.vat_amount)
          ).toFixed(2);

          exd_vat_total_amount = Number(
            Number(exd_vat_total_amount) + Number(ct?.amount)
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

  const calculateAmount = (amount, quantity) => {
    let newamount;
    newamount = Number(amount) * Number(quantity);
    newamount = amount?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return newamount;
  };

  return (
    <>
      {/* {console.log("sssssss", state?.invoice)} */}
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
            <div className="col-lg-8 mb-4 d-flex">
              <img
                src={shipLogo}
                alt=""
                width={300}
                // style={{ margin: "auto" }}
                style={{ marginTop: "auto", marginBottom: "auto" }}
              />
            </div>
            <div className="col-lg-4 d-flex flex-column justify-content-end align-items-end">
              <h2
                className=""
                style={{
                  color: "#000",
                  fontWeight: "bold",
                  fontFamily: "Times New Roman",
                }}
              >
                {/* <Translate
                  text={String(state?.invoice?.company?.company_name_lang)}
                /> */}
                {String(state?.invoice?.company?.name)}
              </h2>
              <p className="text-end custom-font">
                {/* <Translate
                  text={
                    state?.invoice?.company?.address.length
                      ? state?.invoice?.company?.address
                      : ""
                  }
                /> */}
                {state?.invoice?.company?.address?.length
                  ? state?.invoice?.company?.address
                  : ""}
              </p>
              <p className="text-end custom-font">
                {state?.invoice?.company?.state} ,
                {state?.invoice?.company?.country}
              </p>
              {/* <p>
                <Translate text={state?.invoice?.company?.state} />
                <Translate text={state?.invoice?.company?.country} />
              </p> */}
              <p className="custom-font">
                <span style={{ marginRight: "5px" }}>
                  VAT NO
                  {/* <Translate text={"VAT NUMBER"} /> */}
                  {/* الرقم الضريبي */}
                </span>
                :
                <span style={{ marginLeft: "5px" }}>
                  {state?.invoice?.company?.vat_number}
                </span>
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
                marginBottom: "20px",
                // textDecoration: "underline",
              }}
            >
              <h2 style={{ color: "#000" }}>
                TAX INVOICE
                {/* / <Translate text={"TAX INVOICE"} /> */}
              </h2>
            </div>
          </div>
          <div className="row" style={{ marginBottom: "20px" }}>
            <div className="col-lg-4 custom-font">
              <ShowDataWithTranslate
                width={"200px"}
                label={"Job Number"}
                value={state.invoice?.job?.job_number}
              />
              <ShowDataWithTranslate
                width={"200px"}
                label={"Enquiry Number"}
                value={state.invoice?.job?.enquiry_no}
              />
              <ShowDataWithTranslate
                width={"200px"}
                label={"Client Vat Number"}
                value={state.invoice?.client_name?.vat_trn_number}
              />
              <ShowDataWithTranslate
                width={"200px"}
                label={"Client - Bill To"}
                value={""}
              />
              <div className="ms-3">
                <span>
                  {/* <Translate text={state.invoice?.client_name?.name} /> */}
                </span>
                <span>{state.invoice?.client_name?.name}</span> ,
              </div>
              <div className="ms-3">
                <span>
                  {/* <Translate text={state?.invoice?.client_name?.city} /> */}
                </span>
                <span>{state?.invoice?.client_name?.city}</span> ,
              </div>
              <div className="ms-3">
                <span>
                  {/* <Translate text={state?.invoice?.client_name?.state_code} /> */}
                </span>
                <span>{state?.invoice?.client_name?.state_code}</span> ,
              </div>
              <div className="ms-3">
                <span>
                  {/* <Translate text={state?.invoice?.client_name?.country} /> */}
                </span>
                <span>{state?.invoice?.client_name?.country}</span>
              </div>
            </div>
            <div className="col-lg-4 custom-font">
              <ShowDataWithTranslate
                width={"220px"}
                label={"Invoice Date"}
                value={moment(state.invoice?.date).format("DD/MM/YYYY")}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"Invoice Number"}
                value={state?.invoice?.invoice_number}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"BL Number"}
                value={state?.invoice?.bl_number}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"Bayan Number"}
                value={state?.invoice?.bayan_number}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"Client Ref / PO Number"}
                value={state.invoice?.job?.client_ref}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"ETA"}
                value={moment(state.invoice?.job?.eta).format("DD/MM/YYYY")}
              />
              <ShowDataWithTranslate
                width={"220px"}
                label={"ETD"}
                value={moment(state.invoice?.job?.etd).format("DD/MM/YYYY")}
              />
            </div>
            <div className="col-lg-4 custom-font">
              <div style={{ display: "flex" }}>
                <ShowDataWithTranslate
                  width={"180px"}
                  label={"Consignee"}
                  value={""}
                />
                <span>
                  {/* <Translate text={state.invoice?.consignee_name?.name} /> */}
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state.invoice?.consignee_name?.name}
                </span>
              </div>
              <div style={{ display: "flex" }}>
                <ShowDataWithTranslate
                  width={"180px"}
                  label={"Shipper Name"}
                  value={""}
                />
                <span>
                  {/* <Translate text={state.invoice?.shipper_name} /> */}
                </span>
                <span
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {state.invoice?.shipper_name}
                </span>
              </div>
              <ShowDataWithTranslate
                width={"180px"}
                label={"Notify"}
                value={state.invoice?.job?.notify?.name}
              />
              <ShowDataWithTranslate
                width={"180px"}
                label={"POL"}
                value={state.invoice?.job?.pol}
              />
              <ShowDataWithTranslate
                width={"180px"}
                label={"POD"}
                value={state.invoice?.pod}
              />
              <ShowDataWithTranslate
                width={"180px"}
                label={"POA"}
                value={state.invoice?.poa}
              />
              {/* <ShowDataWithTranslate
                width={"180px"}
                label={"Currency Amount"}
                value={state.invoice?.currency_sar}
              />
              <ShowDataWithTranslate
                width={"180px"}
                label={"Exchange Rate"}
                value={state.invoice?.ex_rate}
              /> */}
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
            <table className="htmlTable mt-2 w-100 custom-font">
              <tbody>
                <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
                  <th
                    className="border-0"
                    style={{
                      padding: "10px 0px",
                    }}
                  >
                    S.No
                  </th>
                  <ShowTableHeadWithTranslate label={"Description"} />
                  <ShowTableHeadWithTranslate label={"Currency Rate"} />
                  <ShowTableHeadWithTranslate label={"Currency Amount"} />
                  <ShowTableHeadWithTranslate label={"Quantity"} />
                  <ShowTableHeadWithTranslate label={"Currency"} />
                  <ShowTableHeadWithTranslate label={"Amount"} />
                  <ShowTableHeadWithTranslate label={"VAT%"} />
                  <ShowTableHeadWithTranslate label={"VAT"} />
                  <ShowTableHeadWithTranslate label={"Total"} />
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
                          className="border-0 text-center"
                          style={{
                            padding: "10px 0px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td className="border-0">
                          <div
                            className="text-left"
                            style={{ marginLeft: "5px" }}
                          >
                            {cost.charge?.name} /{" "}
                            {/* <Translate text={cost.charge?.name} /> */}
                            {cost.charge?.language_name}
                          </div>
                        </td>
                        <td className="border-0 text-center">{cost.ex_rate}</td>

                        <td className="border-0 text-center">
                          {cost.fcy_amount}
                        </td>
                        <td className="border-0 text-center">
                          {cost?.quantity}
                        </td>
                        <td className="border-0 text-center">
                          {cost.currency}
                        </td>
                        {/* <td className="border-0">1</td>
                      <td className="border-0">1,161.50</td> */}
                        <td
                          className="border-0 text-center"
                          style={{ textAlign: "center" }}
                        >
                          {/* {calculateAmount(cost?.amount, cost?.quantity)} */}
                          {Number(cost?.amount)?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-0 text-center">
                          {cost.tax_group_code}
                        </td>
                        <td className="border-0 text-center">
                          {Number(cost.vat_amount)?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-0 text-center">
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
              <div className="col-lg-5 col-xs-12 custom-font">
                <ShowDataWithTranslate
                  width={"150px"}
                  label={"Type"}
                  value={state?.invoice?.job?.type}
                />
                <ShowDataWithTranslate
                  width={"150px"}
                  label={"Container"}
                  value={state?.invoice?.job?.container_type}
                />
                <ShowDataWithTranslate
                  width={"150px"}
                  label={"Volume"}
                  value={state?.invoice?.job?.quantity_text}
                />
                <ShowDataWithTranslate
                  width={"150px"}
                  label={"Commodity"}
                  value={state?.invoice?.job?.commodity}
                />
                <ShowDataWithTranslate
                  width={"150px"}
                  label={"Remarks"}
                  value={state?.invoice?.remarks}
                />
              </div>
              <div
                style={{
                  borderLeft: "1px solid black",
                }}
                className="col-lg-7 col-xs-12 custom-font"
              >
                <div className="row">
                  <div className="col-lg-8 col-md-6">
                    <p className="custom-font">
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
                      <span>{/* <Translate text={"Total excl VAT"} /> */}</span>
                    </p>
                    <p className="custom-font">
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
                        {/* <Translate text={"Value Added Tax"} /> */}
                      </span>
                    </p>
                    <p className="custom-font">
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
                      <span>{/* <Translate text={"Total With VAT"} /> */}</span>
                    </p>
                  </div>
                  <div
                    className="col-lg-4 col-md-6"
                    style={{ fontWeight: 900, fontSize: "20px" }}
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
                        {/* <Translate fontWeight={700} text={state.word_amount} /> */}
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
              <div className="col-lg-8 col-xs-12 custom-font">
                <h4 style={{ color: "#000" }}>
                  {/* <Translate text={"Payment Method"} /> */}
                </h4>
                <h4 style={{ color: "#000" }}>Payment Method</h4>

                <h4 className="mt-3 mb-4" style={{ color: "#000" }}>
                  Account Details
                  <span style={{ marginRight: "5px" }}>
                    {/* <Translate text={"Account Details"} /> */}
                  </span>
                  :
                </h4>
                <ShowDataWithTranslate
                  width={"250px"}
                  label={"Account Name"}
                  value={state?.invoice?.company?.account_name}
                />
                <ShowDataWithTranslate
                  width={"250px"}
                  label={"Bank Name"}
                  value={state?.invoice?.company?.bank_name}
                />
                <ShowDataWithTranslate
                  width={"250px"}
                  label={"Account Number"}
                  value={state?.invoice?.company?.account_number}
                />
                <ShowDataWithTranslate
                  width={"250px"}
                  label={"IBAN Code"}
                  value={state?.invoice?.company?.iban_code}
                />
                <ShowDataWithTranslate
                  width={"250px"}
                  label={"Swift Code"}
                  value={state?.invoice?.company?.swift_code}
                />
              </div>
              <div className="col-lg-4 col-xs-12 d-flex justify-content-center align-items-center">
                <span className="p-2" style={{ display: "contents" }}>
                  {/* <QRCode size={150} value={String(state.qrcodeString)} /> */}
                </span>
              </div>
            </div>
          </div>

          <hr className="mt-5" style={{ border: "1px solid #000" }} />
          <div className="mt-2">
            <div className="row">
              <div className="col-lg-9 col-xs-12">
                <p className="custom-font">
                  This is a computer generated invoice doesn't require signature
                  or stamp
                </p>
                <p className="custom-font">
                  Any discrepancy must be notified within 7 days from the date
                  of invoice. Otherwise it shall be considered as confirmation
                  of correctness
                </p>
                {/* <p>
                <span style={{ fontWeight: 700 }}>Print Date </span>05-07-2023
                11:00 am
              </p> */}
              </div>
              <div className="col-lg-1 col-xs-12 custom-font">
                <p>Email:</p>
                {/* <p>Phone:</p> */}
              </div>
              <div className="col-lg-2 col-xs-12 custom-font">
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
