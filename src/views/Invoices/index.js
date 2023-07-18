import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import Purchase from "./Purchase";
import Sales from "./Sales";

const Invoices = (props) => {
  const [invoiceType, setInvoiceType] = useState("Sales");
  const invoiceTypes = [
    {
      label: "Sales",
      value: "Sales",
    },
    {
      label: "Purchase",
      value: "Purchase",
    },
  ];
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  return (
    <>
      {/* <div className="page-content"> */}
        <Sales/>
      {/* </div> */}
    </>
  );
};

export default Invoices;
