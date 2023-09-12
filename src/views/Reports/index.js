import React from "react";
import { Link } from "react-router-dom";
import profitLoss from "../../assets/images/profit-loss.png";
import trial from "../../assets/images/trial.png";
import balanceSheet from "../../assets/images/balance-sheet.png";

const Reports = () => {
  return (
    <div className="page-content mt-5 p-5">
      <div className="row mt-5 gap-5">
        <div className="col-lg-3 mb-2">
          <Link to="/profit-loss">
            <div className="card p-5 m-auto rounded-5">
              <img
                className="m-auto mb-4"
                src={profitLoss}
                alt=""
                width={100}
              />
              <h4 className="text-center" style={{ fontFamily: "sans-serif" }}>PROFIT & LOSS</h4>
            </div>
          </Link>
        </div>

        <div className="col-lg-3 mb-2">
          <Link to="/trail">
            <div className="card p-5 rounded-5">
              <img className="m-auto mb-4" src={trial} alt="" width={100} />
              <h4 className="text-center" style={{ fontFamily: "sans-serif" }}>TRIAL BALANCE</h4>
            </div>
          </Link>
        </div>

        <div className="col-lg-3">
          <Link to="">
            <div className="card p-5 rounded-5">
              <img
                className="m-auto mb-4"
                src={balanceSheet}
                alt=""
                width={100}
              />
              <h4 className="text-center" style={{ fontFamily: "sans-serif" }}>BALANCE SHEET</h4>
            </div>
          </Link>
        </div>
    
      </div>
    </div>
  );
};

export default Reports;
