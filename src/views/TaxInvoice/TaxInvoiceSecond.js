import { Grid } from "@mui/material";
import React from "react";
import { Card } from "reactstrap";
import shipLogo from "../../assets/images/ship-logo.png";
import "./table.css";

const TaxInvoiceSecond = () => {
  return (
    <>
      <div style={{ padding: "25px" }}>
        <div
          className="card"
          style={{ padding: "20px" }}
        >
          <div className="row" style={{ placeItems: "center" }}>
            <div className="col-lg-3">
              <img src={shipLogo} alt="" width={200} />
            </div>
            <div className="col-lg-5" style={{ textAlign: "left" }}>
              <h2 style={{ color: "#000" }}>Younis Tantawi For Customs Clearance Est. YCC</h2>
              <p>Al Boughdadia</p>
              <p>Jeddah, Saudi Arabia - 22234</p>
              <p style={{fontWeight: 600}}>VAT NO : </p>
              <p style={{fontWeight: 600}}>CR NO : </p>
            </div>
            <div className="col-lg-4">
            <p>Al Boughdadia</p>
              <p>Jeddah, Saudi Arabia - 22234</p>
              <p style={{fontWeight: 600}}></p>
              <p style={{fontWeight: 600}}></p>
            </div>
          </div>
          <hr style={{ border: "1px solid #000" }} />
          <div className="row">
            <div className="col-lg-4">
              <h3 style={{color: "#3cb043"}}>TAX INVOICE</h3>
              <h6>To :</h6>
              <h5>ADNOV Shipping & Logistics</h5>
              <p>(CS230011)</p>
              <p>JEDDAH,</p>
              <p>Saudi Arabia</p>
            </div>
            <div className="col-lg-4">
            <p style={{color: "#3cb043"}}>Invoice No :</p>
            <p>Due Date : </p>
            <p>Delivery Date : </p>
            <p>Job No : </p>
            <p>Consignee</p>
            <p>Client Re/PO No : </p>
            <p>POL</p>
            </div>
            <div className="col-lg-4">
            <p>Invoice Date :</p>
            <p>BL/AWB :</p>
            <p>Bayan No : </p>
            <p>Activity : </p>
            </div>
          </div>

          {/* <hr style={{ border: "1px solid #000" }} /> */}

          <div style={{overflowX: "auto"}}>
          <table className="htmlTable mt-2 w-100">
            <tr style={{borderBottom: "1px solid #d3d3d3"}}>
              <th className="border-0">#</th>
              <th className="border-0">Description</th>
              <th className="border-0">Comments</th>
              <th className="border-0">Quantity</th>
              <th className="border-0">Rate</th>
              <th className="border-0">Amount</th>
              <th className="border-0">VAT%</th>
              <th className="border-0">VAT</th>
              <th className="border-0">Total</th>
            </tr>
            <tr style={{borderBottom: "1px solid #d3d3d3"}}>
              <td className="border-0">1</td>
              <td className="border-0">Port Charges</td>
              <td className="border-0"></td>
              <td className="border-0">1</td>
              <td className="border-0">1,161.50</td>
              <td className="border-0">1,161.50</td>
              <td className="border-0">0.00%</td>
              <td className="border-0">0.00</td>
              <td className="border-0">1,161.50</td>
            </tr>
            <tr style={{borderBottom: "1px solid #d3d3d3"}}>
              <td className="border-0">1</td>
              <td className="border-0">Port Charges</td>
              <td className="border-0"></td>
              <td className="border-0">1</td>
              <td className="border-0">1,161.50</td>
              <td className="border-0">1,161.50</td>
              <td className="border-0">0.00%</td>
              <td className="border-0">0.00</td>
              <td className="border-0">1,161.50</td>
            </tr>
          </table>
          </div>

         <hr className="mt-5" style={{ border: "1px solid #000" }} />

         <div className="card" style={{border: "1px solid #000"}}>
         <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-6">
                <p>Total excl VAT</p>
                <p>Value Added Tax</p>
                <p>Total With VAT</p>
            </div>
            <div className="col-lg-4">
                <p>2,518.05</p>
                <p>45.00</p>
                <p>2,563.05</p>
            </div>
         </div>
         </div>

          <div className="row mt-2">
            <div className="col-lg-9">
              <h5>Payment Method</h5>
              <p>SAR Account Details:</p>
              
              <p>Account Name :</p>
              <p>Bank Name : </p>
              <p>Account No :</p>
              <p>IBAN cod :</p>
              <p>Swift Code :</p>
            </div>
            <div className="col-lg-3"></div>
          </div>

          <div className="mt-5 text-center">
            This is a computer generated document and does not require a
            signature
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxInvoiceSecond;
