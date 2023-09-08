import React from "react";
import { Link } from "react-router-dom";

const Reports = () => {
  return (
    <div className="page-content">
      <div className="d-flex justify-content-around">
        <Link to="/profit-loss">
          <div className="card p-5">
            <h4 style={{ fontFamily: "sans-serif" }}>PROFIT & LOSS</h4>
          </div>
        </Link>
        <Link to="/trail">
          <div className="card p-5">
            <h4 style={{ fontFamily: "sans-serif" }}>TRIAL BALANCE</h4>
          </div>
        </Link>

        <Link to="">
          <div className="card p-5">
            <h4 style={{ fontFamily: "sans-serif" }}>BALANCE SHEET</h4>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Reports;
