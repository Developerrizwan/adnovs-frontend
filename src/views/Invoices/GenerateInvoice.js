import React, { useEffect, useState } from "react";
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
  Input,
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
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [job_no, setJob_no] = useState("");
  const [invoiceData, SetInvoiceData] = useState([]);

  const dateOptions = [{ label: "test", value: "test" }];

  const job_noStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "200px",
      background: "#EDEDED",
    }),
  };

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
      name: (
        <Input
          className="form-check-input fs-15"
          type="checkbox"
          name="checkAll"
          value="option1"
          onClick={() => props.checkedValues("", true)}
          checked={props.checkedAll}
        />
      ),
      cell: (value) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          name="checkAll"
          onClick={() => props.checkedValues(value.id, null, value)}
          checked={props.checkedBox?.includes(value.id)}
        />
      ),
      width: "50px",
    },
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
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return <div>{value.amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Charge</span>,
      selector: (row) => row.charge,
      cell: (value) => {
        return <div>{value.charge}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return <div>{value.currency}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr Cr</span>,
      selector: (row) => row.dr_cr,
      cell: (value) => {
        return <div>{value.dr_cr}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ex Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return <div>{value.ex_rate}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fcy Amount</span>,
      selector: (row) => row.fcy_amount,
      cell: (value) => {
        return <div>{value.fcy_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prorate Method</span>,
      selector: (row) => row.prorate_method,
      cell: (value) => {
        return <div>{value.prorate_method}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Tax Group Code</span>,
      selector: (row) => row.tax_group_code,
      cell: (value) => {
        return <div>{value.tax_group_code}</div>;
      },
      sortable: true,
    },
  ]);

  const [cost_cols, setCost_Cols] = useState([
    {
      name: (
        <Input
          className="form-check-input fs-15"
          type="checkbox"
          name="checkAll"
          value="option1"
          onClick={() => props.checkedValues("", true)}
          checked={props.checkedAll}
        />
      ),
      cell: (value) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          name="checkAll"
          onClick={() => props.checkedValues(value.id, null, value)}
          checked={props.checkedBox?.includes(value.id)}
        />
      ),
      width: "50px",
    },
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
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return <div>{value.amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Charge</span>,
      selector: (row) => row.charge,
      cell: (value) => {
        return <div>{value.charge}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return <div>{value.currency}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr Cr</span>,
      selector: (row) => row.dr_cr,
      cell: (value) => {
        return <div>{value.dr_cr}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ex Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return <div>{value.ex_rate}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fcy Amount</span>,
      selector: (row) => row.fcy_amount,
      cell: (value) => {
        return <div>{value.fcy_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prorate Method</span>,
      selector: (row) => row.prorate_method,
      cell: (value) => {
        return <div>{value.prorate_method}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Tax Group Code</span>,
      selector: (row) => row.tax_group_code,
      cell: (value) => {
        return <div>{value.tax_group_code}</div>;
      },
      sortable: true,
    },
  ]);

  const getInvoiceData = () => {
    apiAuth
      .get(
        `/api/master/cost_entry/`
        // ?page=${pgdata?.currentPage
      )
      .then((response) => {
        let data = response.data;
        // console.log("xswjhjwx", response);
        console.log("deed", data);

        SetInvoiceData(data.results);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getInvoiceData();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {" "}
        {/* <InvoiceForm />{" "} */}
        <div>
          <Label htmlFor="job_no">Job No</Label>
          <Select
            name="type"
            placeholder={"Select"}
            styles={job_noStyles}
            options={dateOptions}
            onChange={(data) => {
              setJob_no("date_filter", data.value);
            }}
          />
        </div>
        <div>
          <Label htmlFor="to_date">To Date</Label>
          <DatePicker
            selected={toDate}
            onChange={(date) => {
              setToDate(date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="d MMMM yyyy h:mm aa"
          />
        </div>
        <div>
          <Label htmlFor="to_date" className="form-label">
            From Date
          </Label>
          <DatePicker
            selected={toDate}
            onChange={(date) => {
              SetFromDate(date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="d MMMM yyyy h:mm aa"
          />
        </div>
      </div>
      <div>
        <p
          style={{
            background: "orange",
            color: "white",
            padding: "10px",
          }}
        >
          Sale Charge
        </p>
        <Card>
          <DataTable
            columns={sale_cols}
            data={invoiceData.filter((item) => item.sale_cost === "Sale")}
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

      <p style={{ background: "blue", color: "white", padding: "10px" }}>
        {" "}
        Cost Charge
      </p>
      <div>
        <Card>
          <DataTable
            columns={sale_cols}
            data={invoiceData.filter((item) => item.sale_cost === "Cost")}
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

      <div className="d-flex justify-content-between">
        {/* <Button
                        className="btn btn-warning float-right"
                        type="reset"
                        onClick={() => props.closeAddPopup()}
                      >
                        {" "}
                        Back{" "}
                      </Button> */}
        <Button color="danger" onClick={() => props.closeAddPopup()}>
          {" "}
          Cancel
        </Button>
        <Button color="success">
          <span className="spinner d-inline-block">
            <span className="bounce1" />
            <span className="bounce2" />
            <span className="bounce3" />
          </span>
          <span className="float-right">Save</span>
        </Button>{" "}
      </div>
    </>
  );
};

export default GenerateInvoice;
