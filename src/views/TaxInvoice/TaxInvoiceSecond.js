import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import shipLogo from "../../assets/images/ship-logo.png";
import "./table.css";
import apiAuth from "../../helpers/ApiAuth";

const TaxInvoiceSecond = () => {
  const [accounts, setAccounts] = useState([]);

  const getAccounts = (pgdata, val) => {
    apiAuth
      .get(`/api/get-costentry/`)
      .then((response) => {
        let data = response.data;

        setAccounts(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccounts();
  }, []);
  return (
    <>
      <div style={{ padding: "25px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div className="row">
            <div className="col-lg-3 mb-4 d-flex">
              <img
                src={shipLogo}
                alt=""
                width={200}
                style={{ margin: "auto" }}
              />
            </div>
            <div className="col-lg-6">
              <h2 style={{ color: "#000" }}>
                Younis Tantawi For Customs Clearance Est. YCC
              </h2>
              <p>Al Boughdadia</p>
              <p>Jeddah, Saudi Arabia - 22234</p>
              <p style={{ fontWeight: 600 }}>VAT NO : </p>
              <p style={{ fontWeight: 600 }}>CR NO : </p>
            </div>
            <div className="col-lg-3">
              <p>Al Boughdadia</p>
              <p>Jeddah, Saudi Arabia - 22234</p>
              <p style={{ fontWeight: 600 }}></p>
              <p style={{ fontWeight: 600 }}></p>
            </div>
          </div>
          <hr style={{ border: "1px solid #000" }} />
          <div className="row">
            <div className="col-lg-4">
              <h3 style={{ color: "#3cb043" }}>TAX INVOICE</h3>
              <h6>To :</h6>
              <h5>ADNOV Shipping & Logistics</h5>
              <p>(CS230011)</p>
              <p>JEDDAH,</p>
              <p>Saudi Arabia</p>
            </div>
            <div className="col-lg-4">
              <p style={{ color: "#3cb043" }}>Invoice No :</p>
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

          <div style={{ overflowX: "auto" }}>
            <table className="htmlTable mt-2 w-100">
              <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
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
              <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
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
              <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
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
              <tr style={{ borderBottom: "1px solid #d3d3d3" }}>
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

          <div
            className="card mt-2"
            style={{ border: "1px solid #000", padding: "10px" }}
          >
            <div className="row">
              <div className="col-lg-4 col-xs-12"></div>
              <div className="col-lg-8 col-xs-12">
                <div className="row">
                  <div
                    className="col-lg-8 col-md-6"
                    style={{ fontSize: "16px" }}
                  >
                    <p>Total excl VAT</p>
                    <p>Value Added Tax</p>
                    <p>Total With VAT</p>
                  </div>
                  <div
                    className="col-lg-4 col-md-6"
                    style={{ fontWeight: 900, fontSize: "18px" }}
                  >
                    <p>2,518.05</p>
                    <p>45.00</p>
                    <p style={{ color: "#D0312D" }}>
                      <span style={{ fontSize: "12px" }}>SAR </span>2,563.05
                    </p>
                  </div>
                </div>
                <hr style={{ border: "1px solid #000" }} />
                <div className="row">
                  <div className="col-lg-7">
                    <h6>
                      SAR Two Thousand Five Hundred Sixty Three Riyals and Five
                      Halalah Only
                    </h6>
                  </div>
                  <div className="col-lg-5">
                    <p></p>
                  </div>
                </div>
                <hr style={{ border: "1px solid #000" }} />
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-lg-9 col-xs-12">
              <h5 style={{ color: "#3cb043" }}>Payment Method</h5>
              <h6 className="mt-3 mb-4" style={{ color: "#3d78e3" }}>
                SAR Account Details:
              </h6>

              <p>Account Name :</p>
              <p>Bank Name : </p>
              <p>Account No :</p>
              <p>IBAN code :</p>
              <p>Swift Code :</p>
            </div>
            <div className="col-lg-3 col-xs-12"></div>
          </div>

          <hr className="mt-5" style={{ border: "1px solid #000" }} />
          <div className="mt-2">
            <div className="row">
              <div className="col-lg-8 col-xs-12">
                <p>
                  This is a computer generated invoice doesn't require signature
                  or stamp
                </p>
                <p>
                  Any discrepancy must be notified within 7 days from the date
                  of invoice. Otherwise it shall be considered as confirmation
                  of correctness
                </p>
                <p>
                  <span style={{ fontWeight: 700 }}>Print Date </span>05-07-2023
                  11:00 am
                </p>
              </div>
              <div className="col-lg-2 col-xs-12">
                <p>Email:</p>
                <p>Phone:</p>
              </div>
              <div className="col-lg-2 col-xs-12">
                <p>y.tantawi@yy-cc.com</p>
                <p>9999999999</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxInvoiceSecond;
