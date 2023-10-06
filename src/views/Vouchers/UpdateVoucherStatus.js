import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { MenuItem, Select, TextField } from "@mui/material";

const UpdateVoucherStatus = (props) => {
  const UpdateInvoiceStatus = (id, invoiceStatus, amountPaid) => {
    const values = {
      payment_status: invoiceStatus || "",
      paid_amount: amountPaid,
    };
    apiAuth
      .patch(`/api/master/invoice/${id}/`, values)
      .then((res) => {
        // NotificationManager.success(
        //   "Invoice Updated Successfully",
        //   3000,
        //   null,
        //   null,
        //   ""
        // );
      })
      .catch((err) => {
        // NotificationManager.error(
        //   "Journal Voucher",
        //   "Invoice Updat Error",
        //   3000,
        //   null,
        //   null,
        //   ""
        // );
      });
  };

  const StatusCell = ({ value, selectedInvoiceStatus }) => {
    return (
      <div title={value?.payment_status}>
        {/* <select
          onChange={(e) => {
            // setSelectedInvoiceStatus(e.target.value);
            UpdateInvoiceStatus(value?.id, e.target.value, value?.paid_amount);
          }}
          defaultValue={value?.payment_status}
          style={{ background: "#f3f3f9" }}
        >
          
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Partial Paid">Partial Paid</option>
        </select> */}
        <div
          style={{
            width: "100px",
          }}
        >
          <Select
            // labelId="demo-simple-select-label"
            // id="demo-simple-select"
            defaultValue={value?.payment_status}
            // label="Age"
            onChange={(e) => {
              // setSelectedInvoiceStatus(e.target.value);
              UpdateInvoiceStatus(
                value?.id,
                e.target.value,
                value?.paid_amount
              );
            }}
            style={{
              background: "#f3f3f9",
              margin: "10px 0px",
              width: "150px",
              padding: "0px !important",
            }}
          >
            <MenuItem value="Unpaid" className="py-1">
              Unpaid
            </MenuItem>
            <MenuItem value="Paid" className="py-1">
              Paid
            </MenuItem>
            <MenuItem value="Partial Paid" className="py-1">
              Partial Paid
            </MenuItem>
          </Select>
        </div>
      </div>
    );
  };
  const AmountPaidCell = ({ value }) => {
    const [amountPaid1, setAmountPaid1] = useState(value?.paid_amount || "");

    return (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px",
          marginLeft: "15px",
        }}
      >
        {/* <input
          type="text"
          value={amountPaid1}
          onChange={(e) => {
            setAmountPaid1(e.target.value);
          }}
          style={{ background: "#f3f3f9" }}
          onBlur={(e) => {
            UpdateInvoiceStatus(value?.id, value?.payment_status, amountPaid1);
          }}
        /> */}
        <TextField
          // id="outlined-basic"
          // label="Outlined"
          // variant="outlined"
          value={amountPaid1}
          onChange={(e) => {
            setAmountPaid1(e.target.value);
          }}
          style={{ background: "#f3f3f9" }}
          onBlur={(e) => {
            UpdateInvoiceStatus(value?.id, value?.payment_status, amountPaid1);
          }}
        />
      </div>
    );
  };

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Invoice</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.invoice_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.invoice_number}
          </div>
        );
      },
      sortable: true,
      checkHide: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Amount</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px",
            }}
          >
            {Number(value?.amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
      // checkHide: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={moment(value?.date).format("MM/DD/YYYY")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px",
            }}
          >
            {moment(value?.date).format("MM/DD/YYYY")}
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Status</span>,
      selector: (row) => row,
      cell: (value) => (
        <StatusCell
          value={value}
          // selectedInvoiceStatus={selectedInvoiceStatus}
        />
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Amount Paid</span>,
      selector: (row) => row,
      cell: (value) => <AmountPaidCell value={value} />,
    },
  ]);

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={cols}
        data={props?.data}
        // paginationPerPage={props?.pagination?.rowsPerPage}
        // onChangePage={(p, t) => {
        //   props.handlePagination({
        //     ...props.pagination,
        //     currentPage: p,
        //   });
        // }}
        // onChangeRowsPerPage={(c, t) => {
        //   props.pagination({
        //     ...props.pagination,
        //     rowsPerPage: c,
        //     currentPage: t,
        //   });
        // }}
        // paginationServer
        // // paginationDefaultPage={props.pagination?.currentPage}
        // // paginationTotalRows={props.pagination?.totalRows}
        pagination={true}
      />
    </>
  );
};

export default UpdateVoucherStatus;
