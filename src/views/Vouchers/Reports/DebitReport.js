import React, { useEffect, useState } from "react";

import apiAuth from "../../../helpers/ApiAuth";
import NotificationManager from "../../../components/Common/NotificationManager";
import ReportHeader from "./helpers/ReportHeader";
import ReportFooter from "./helpers/ReportFooter";
import DownloadReport from "./helpers/DownloadReport";
import QRCode from "react-qr-code";

const Content = () => {
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
          <QRCode size={150} value={String("voucher")} />
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

      {/* Computer generated Text */}
      <div className="d-flex justify-content-center align-items-center my-5">
        <p style={{ width: "45%", fontWeight: 600 }}>
          This is a computer generated document and does not require a signature
          Receipt issued for cheque payments will be subject to realization of
          the cheque
        </p>
      </div>
    </div>
  );
};

const DisplayItem = ({ label, value }) => {
  return (
    <>
      <div className="my-1">
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
  const [state, setState] = useState({ costs: [] });

  useEffect(() => {
    let id = Number(props.match.params.id);
    getVoucherData(id);
  }, []);

  const getVoucherData = (id) => {
    apiAuth
      .get(`/api/master/voucher/${id}`)
      .then((response) => {
        let data = response.data;
        setState({ ...state, invoice: data });
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error("", "Invalid Voucher.", 3000, null, null, "");
      });
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
        <div
          className="card reportdownproject"
          style={{
            border: "1px solid black",
            //   padding: "10px",
          }}
        >
          {/* Header */}
          <ReportHeader />

          {/* Content */}
          <Content />

          {/* Footer */}
          <ReportFooter />
        </div>
      </div>
    </div>
  );
};

export default DebitReport;
