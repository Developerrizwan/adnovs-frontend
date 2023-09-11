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

const OrganizationStatement = (props) => {
  const [state, setState] = useState({ costs: [] });
  const [objData, setObjData] = useState({});
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);

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
    getOrganization(jobId);
  }, []);

  const getOrganization = (id) => {
    apiAuth
      .get(`/api/master/organization/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, organization: data });
        getInvoices(id);
        setObjData(data);
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error(
          "",
          "Invalid Organization.",
          3000,
          null,
          null,
          ""
        );
      });
  };

  const getInvoices = (id) => {
    setLoading(true);
    apiAuth
      .get("/api/get-invoices/")
      .then((response) => {
        let {
          data: { results },
        } = response;
        results = results.filter((dd) => dd.party_account?.id === id);
        setInvoices(results);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Invoice Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
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
                {state?.organization?.company?.name}
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
                  {state?.organization?.consignee_name?.mobile}
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
                  {/* {state?.organization?.consignee_name?.mobile} */}
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
                  {/* {state?.organization?.consignee_name?.mobile} */}
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
                <p className="mb-1 ms-1">
                  {state?.organization?.company?.email}
                </p>
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
                  {state?.organization?.company?.vat_number}
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
                <Translate text={state?.organization?.company?.name} />
              </h4>
              <p>
                <Translate text={state?.organization?.consignee_name?.mobile} />
              </p>
              <p>
                {/* <Translate text={state?.organization?.consignee_name?.mobile} /> */}
                {/* fax */}
              </p>
              <p>
                {/* <Translate text={state?.organization?.consignee_name?.mobile} /> */}
                {/* cr no */}
              </p>
              <p>
                <Translate text={state?.organization?.company?.email} />
              </p>
              <p>
                {state?.invoice?.narration ? (
                  <Translate
                    text={state?.organization?.consignee_name?.vat_trn_number}
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
                  <td>{state?.organization?.company?.account_number}</td>
                  <td className="fw">From Date</td>
                  <td>
                    {moment(state.organization?.created_at).format(
                      "MM/DD/YYYY"
                    )}
                  </td>
                  <td>
                    {moment(state.organization?.created_at).format(
                      "MM/DD/YYYY"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="fw">Account Name</td>
                  <td>{state?.organization?.company?.account_name}</td>
                  <td className="fw">To Date</td>
                  <td>30/12/2020</td>
                  <td>14/08/2018</td>
                </tr>
                <tr>
                  <td className="fw">
                    CURRENCY IN: {state?.organization?.consignee_name?.currency}
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
                {/* {console.log("sssssssss", invoices)} */}
                {invoices.map((dd) => (
                  <>
                    <tr>
                      <td className="fw">
                        {moment(dd?.date).format("DD/MM/YYYY")}
                      </td>
                      <td>Invoice for afg737873</td>
                      <td className="fw">Invoice</td>
                      <td>60</td>
                      <td>
                        {dd?.invoice_type === "Purchase"
                          ? dd?.amount_sar
                          : "0.00"}
                      </td>
                      <td>
                        {dd?.invoice_type === "Sales" ? dd?.amount_sar : "0.00"}
                      </td>
                      <td>{dd?.amount_sar}</td>
                    </tr>
                  </>
                ))}
                <tr>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw" style={{ background: "#d3d3d3" }}>
                    {" "}
                    Period Total:{" "}
                  </td>
                  <td className="p-1" style={{ background: "#d3d3d3" }}>
                    5,042.42
                  </td>
                  <td className="p-1" style={{ background: "#d3d3d3" }}>
                    0.00
                  </td>
                  <td
                    rowSpan="2"
                    className="p-1"
                    style={{ background: "#d3d3d3" }}
                  >
                    5,042.42
                  </td>
                </tr>
                <tr>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw"> </td>
                  <td className="p-1 fw" style={{ background: "#d3d3d3" }}>
                    {" "}
                    Total:{" "}
                  </td>
                  <td className="p-1" style={{ background: "#d3d3d3" }}>
                    5,042.42
                  </td>
                  <td className="p-1" style={{ background: "#d3d3d3" }}>
                    0.00
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div
            className="mb-5"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div className="p-2" style={{ overflowX: "auto" }}>
              {/* <table className="htmlTable mt-2">
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
              </table> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationStatement;
