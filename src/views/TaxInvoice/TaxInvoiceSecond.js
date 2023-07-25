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

          <hr style={{ border: "1px solid #000" }} />

          <div className="row">
            <div className="col-lg-2">
              <h5>Customer</h5>
            </div>
            <div className="col-lg-4" style={{ borderRight: "1px solid #000" }}>
              <p>:AL ASSAS SPECIALIZED CO.</p>
              <p>AL MUDUN, AL BAGDAHIYA AL GHARBIYA</p>
              <p>Phone: </p>
              <p>VAT No. : </p>
              <p>Credit Term: </p>
            </div>
            <div className="col-lg-4">
              <p>:AL ASSAS SPECIALIZED CO.</p>
              <p>AL MUDUN, AL BAGDAHIYA AL GHARBIYA</p>
              <p>Phone: </p>
              <p>VAT No. : </p>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <hr style={{ border: "1px solid #000" }} />

          <div style={{overflowX: "auto"}}>
          <table className="htmlTable mt-2 w-100">
            <tr style={{background: "#dadedf"}}>
              <th>Charge Description</th>
              <th>.Curr</th>
              <th>Rate Per Unit</th>
              <th>Unit</th>
              <th>Curr. Amount</th>
              <th>/ROE</th>
              <th>Total Price excl. VAT</th>
              <th>VAT%</th>
              <th>VAT Amount</th>
              <th>Total SAR</th>
            </tr>
            <tr>
              <td>SEA FREIGHT</td>
              <td>USD</td>
              <td>6,350.00</td>
              <td>1</td>
              <td>6,350.00</td>
              <td>3.760000</td>
              <td>23,876.00</td>
              <td>0</td>
              <td>0.00</td>
              <td>23,876.00</td>
            </tr>
            {/* <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr> */}
          </table>
          </div>

          

          <table className="htmlTable mt-2">
            <tr style={{background: "#dadedf"}}>
              <th>Container Details</th>
            </tr>
            <tr>
              <td>FCIU6538307, YMMU6330305</td>
            </tr>
          </table>

          <div className="row mt-4">
            <div className="col-lg-9">
              <h5>Terms & Conditions</h5>
              <p>
                If any discrepancy in the invoice must be notified within 7 days
                from the date of invoice. Otherwise, it shall be considered as
                acknowledged.
              </p>
              <h5 className="mt-4">BANK DETAILS</h5>
              <p>ACC NO :</p>
              <p>IBAN NO : </p>
              <p>SWIFT :</p>
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
