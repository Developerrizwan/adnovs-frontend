import { Card, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import NotificationManager from "../../components/Common/NotificationManager";
import { getAllISOCodes } from "iso-country-currency";
import CostEntry from "./CostEntry";

const AddCostEntry = (props) => {
  const history = useHistory();

  const goBack = () => {
    history.push("/cost-entry");
  };
  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Cost Entry</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <CostEntry props={props} title={"Sale"} />
        <div className="mt-3">
          <CostEntry props={props} title={"Cost"} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddCostEntry;
