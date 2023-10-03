import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const UpdateVoucherStatus = (props) => {
  const UpdateInvoiceStatus = (id, invoiceStatus, amountPaid) => {
    const values = {
      payment_status: invoiceStatus || "",
      paid_amount: amountPaid,
    };
    apiAuth
      .patch(`/api/master/invoice/${id}/`, values)
      .then((res) => {
        NotificationManager.success(
          "Invoice Updated Successfully",
          3000,
          null,
          null,
          ""
        );
      })
      .catch((err) => {
        NotificationManager.error(
          "Journal Voucher",
          "Invoice Updat Error",
          3000,
          null,
          null,
          ""
        );
      });
  };

  const StatusCell = ({ value, selectedInvoiceStatus }) => {
    return (
      <div title={value?.payment_status}>
        <select
          onChange={(e) => {
            // setSelectedInvoiceStatus(e.target.value);
            UpdateInvoiceStatus(value?.id, e.target.value, value?.paid_amount);
          }}
          // value={selectedInvoiceStatus}
        >
          <option defaultValue={value?.payment_status}>
            {value?.payment_status}
          </option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Partial Paid">Partial Paid</option>
        </select>
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
        }}
      >
        <input
          type="text"
          value={amountPaid1}
          onChange={(e) => {
            setAmountPaid1(e.target.value);
          }}
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
              maxWidth: "200px",
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
