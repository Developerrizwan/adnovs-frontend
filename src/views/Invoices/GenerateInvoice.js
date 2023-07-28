import React, { useState } from "react";
import moment from "moment";
import DataTable from "react-data-table-component";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Label,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";

import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import Sales from "./Sales";
import { ErrorMessage, Field, Formik } from "formik";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Grid } from "react-bootstrap-icons";
import SalesInvoice from "../Ticket/SalesInvoice";
import InvoiceForm from "./InvoiceForm";

const GenerateInvoice = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState([]);

  const saledata = [
    {
      job_no: "123",
      shipment_no: "11",
      mawb_mbl_no: "test",
      date_filter: "date",
      from_date: "07/25/2023",
      to_date: "07/29/2023",
      selectedSale: "testSale",
      selectedCost: "testCost",
      net_total: "testsale",
    },
  ];

  const costSale = [
    {
      job_no: "123",
      shipment_no: "11",
      mawb_mbl_no: "test",
      date_filter: "date",
      from_date: "07/25/2023",
      to_date: "07/29/2023",
      selectedSale: "testSale",
      selectedCost: "testCost",
      net_total: "testsale",
    },
  ];

  const [sale_cols, setSale_Cols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Job No</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return <div>{value.job_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipment No</span>,
      selector: (row) => row.shipment_no,
      cell: (value) => {
        return <div>{value.shipment_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">MAWB MBL No</span>,
      selector: (row) => row.mawb_mbl_no,
      cell: (value) => {
        return <div>{value.mawb_mbl_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Filter</span>,
      selector: (row) => row.date_filter,
      cell: (value) => {
        return <div>{value.date_filter}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">From Date</span>,
      selector: (row) => row.from_date,
      cell: (value) => {
        return <div>{value.from_date}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">To Date</span>,
      selector: (row) => row.to_date,
      cell: (value) => {
        return <div>{value.to_date}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Selected Sale</span>,
      selector: (row) => row.selectedSale,
      cell: (value) => {
        return <div>{value.selectedSale}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Selected Cost</span>,
      selector: (row) => row.selectedCost,
      cell: (value) => {
        return <div>{value.selectedCost}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Net Total</span>,
      selector: (row) => row.net_total,
      cell: (value) => {
        return <div>{value.net_total}</div>;
      },
      sortable: true,
    },
  ]);

  const [cost_cols, setCost_Cols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Job No</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return <div>{value.job_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipment No</span>,
      selector: (row) => row.shipment_no,
      cell: (value) => {
        return <div>{value.shipment_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">MAWB MBL No</span>,
      selector: (row) => row.mawb_mbl_no,
      cell: (value) => {
        return <div>{value.mawb_mbl_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date Filter</span>,
      selector: (row) => row.date_filter,
      cell: (value) => {
        return <div>{value.date_filter}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">From Date</span>,
      selector: (row) => row.from_date,
      cell: (value) => {
        return <div>{value.from_date}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">To Date</span>,
      selector: (row) => row.to_date,
      cell: (value) => {
        return <div>{value.to_date}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Selected Sale</span>,
      selector: (row) => row.selectedSale,
      cell: (value) => {
        return <div>{value.selectedSale}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Selected Cost</span>,
      selector: (row) => row.selectedCost,
      cell: (value) => {
        return <div>{value.selectedCost}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Net Total</span>,
      selector: (row) => row.net_total,
      cell: (value) => {
        return <div>{value.net_total}</div>;
      },
      sortable: true,
    },
  ]);

  return (
    <>
      <div>
        {" "}
        <InvoiceForm />{" "}
      </div>
      <div>
        <p
          style={{ background: "orange", color: "white", paddingLeft: "10px" }}
        >
          Sale Charge
        </p>
        <Card>
          <DataTable
            columns={sale_cols}
            data={saledata}
            // paginationPerPage={props.invoicePagination?.rowsPerPage}
            // onChangePage={(p, t) => {
            //   props.handlePagination({
            //     ...props.invoicePagination,
            //     currentPage: p,
            //   });
            // }}
            // onChangeRowsPerPage={(c, t) => {
            //   props.handlePagination({
            //     ...props.invoicePagination,
            //     rowsPerPage: c,
            //     currentPage: t,
            //   });
            // }}
            paginationServer
            // paginationDefaultPage={props.invoicePagination?.currentPage}
            // paginationTotalRows={props.invoicePagination?.totalRows}
            // pagination={props.invoices.length > 10 ? true : false}
          />
        </Card>
      </div>

      <p style={{ background: "blue", color: "white", paddingLeft: "10px" }}>
        {" "}
        cost Charge
      </p>
      <div>
        <Card>
          <DataTable
            columns={sale_cols}
            data={costSale}
            // paginationPerPage={props.invoicePagination?.rowsPerPage}
            // onChangePage={(p, t) => {
            //   props.handlePagination({
            //     ...props.invoicePagination,
            //     currentPage: p,
            //   });
            // }}
            // onChangeRowsPerPage={(c, t) => {
            //   props.handlePagination({
            //     ...props.invoicePagination,
            //     rowsPerPage: c,
            //     currentPage: t,
            //   });
            // }}
            paginationServer
            // paginationDefaultPage={props.invoicePagination?.currentPage}
            // paginationTotalRows={props.invoicePagination?.totalRows}
            // pagination={props.invoices.length > 10 ? true : false}
          />
        </Card>
      </div>
    </>
  );
};

export default GenerateInvoice;
