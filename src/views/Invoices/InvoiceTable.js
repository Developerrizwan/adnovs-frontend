import { useState } from "react";
import moment from "moment";
import DataTable from "react-data-table-component";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import Sales from "./Sales";

const InvoiceTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState([]);
  const [salesCols, setSalesCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">BL Number</span>,
      selector: (row) => row.bl_number,
      cell: (value) => {
        return <div>{value.bl_number}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Consignee Name</span>,
      selector: (row) => row.consignee_name?.name,
      cell: (value) => {
        return <div>{value.consignee_name?.name}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row,
      cell: (value) => <span>{moment(value?.date).format("MM/DD/YYYY")}</span>,
    },

    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency_sar,
      cell: (value) => {
        return <div>{value.currency_sar}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">G/L Date</span>,
    //   selector: (row) => row,
    //   cell: (value) => (
    //     <span>{moment(value?.gl_date).format("MM/DD/YYYY")}</span>
    //   ),
    // },
    {
      name: <span className="font-weight-bold fs-13">Bayan Number</span>,
      selector: (row) => row.bayan_number,
      cell: (value) => {
        return <div>{value.bayan_number}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipper Name</span>,
      selector: (row) => row.shipper_name,
      cell: (value) => {
        return <div>{value.shipper_name}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Branch</span>,
      selector: (row) => row.branch,
      cell: (value) => {
        return <div>{value.job?.branch}</div>;
      },
      sortable: true,
    },

    // {
    //   name: <span className="font-weight-bold fs-13">Against Concern</span>,
    //   selector: (row) => row.groups,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Ex. Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return <div>{value.ex_rate}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POD</span>,
      selector: (row) => row.pod,
      cell: (value) => {
        return <div>{value.pod}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Client Name</span>,
      selector: (row) => row.client_name?.name,
      cell: (value) => {
        return <div>{value?.client_name?.name}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">FC Amount</span>,
      selector: (row) => row.fc_amount,
      cell: (value) => {
        return <div>{value.fc_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount_sar,
      cell: (value) => {
        return <div>{value.amount_sar}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POA</span>,
      selector: (row) => row.poa,
      cell: (value) => {
        return <div>{value.poa}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Type</span>,
      selector: (row) => row.invoice_type,
      cell: (value) => {
        return <div>{value.invoice_type}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      cell: (value) => <div>{value.remarks}</div>,
    },
    {
      name: <span className="font-weight-bold fs-13">Language Address</span>,
      selector: (row) => row.language_address,
      cell: (value) => <div>{value?.language_address}</div>,
    },
    {
      name: <span className="font-weight-bold fs-13">View Invoice</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            {/* <Link to={`/tax-invoice/${value.id}`}> */}
            <Link to={`/tax-invoice-second/${value.id}`}>
              <Button color="secondary" className="btn btn-sm">
                {" "}
                View
              </Button>
            </Link>
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <UncontrolledDropdown className="dropdown d-inline-block">
            <DropdownToggle
              className="btn btn-soft-secondary btn-sm"
              tag="button"
            >
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="edit-item-btn"
                onClick={() => {
                  setSelectedInvoice(value);
                  setEditModal(true);
                }}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                Edit
              </DropdownItem>
              <DropdownItem
                className="remove-item-btn"
                // onClick={() => props.deleteJob(value.id)}
                onClick={() => {
                  setSelectedInvoice(value);
                  setDeleteModal(true);
                }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ]);

  const [purchaseCols, setPurchaseCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">BL Number</span>,
      selector: (row) => row.bl_number,
      cell: (value) => {
        return <div>{value.bl_number}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Consignee Name</span>,
      selector: (row) => row.consignee_name?.name,
      cell: (value) => {
        return <div>{value.consignee_name?.name}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row,
      cell: (value) => <span>{moment(value?.date).format("MM/DD/YYYY")}</span>,
    },

    {
      name: <span className="font-weight-bold fs-13">Currency SAR</span>,
      selector: (row) => row.currency_sar,
      cell: (value) => {
        return <div>{value.currency_sar}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">G/L Date</span>,
    //   selector: (row) => row,
    //   cell: (value) => (
    //     <span>{moment(value?.gl_date).format("MM/DD/YYYY")}</span>
    //   ),
    // },
    {
      name: <span className="font-weight-bold fs-13">Bayan Number</span>,
      selector: (row) => row.bayan_number,
      cell: (value) => {
        return <div>{value.bayan_number}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipper Name</span>,
      selector: (row) => row.shipper_name,
      cell: (value) => {
        return <div>{value.shipper_name}</div>;
      },
      sortable: true,
    },

    // {
    //   name: <span className="font-weight-bold fs-13">Against Concern</span>,
    //   selector: (row) => row.groups,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Ex. Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return <div>{value.ex_rate}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POD</span>,
      selector: (row) => row.pod,
      cell: (value) => {
        return <div>{value.pod}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Client Name</span>,
      selector: (row) => row.client_name?.name,
      cell: (value) => {
        return <div>{value?.client_name?.name}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">FC Amount</span>,
      selector: (row) => row.fc_amount,
      cell: (value) => {
        return <div>{value.fc_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount(SAR)</span>,
      selector: (row) => row.amount_sar,
      cell: (value) => {
        return <div>{value.amount_sar}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POA</span>,
      selector: (row) => row.poa,
      cell: (value) => {
        return <div>{value.poa}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Type</span>,
      selector: (row) => row.invoice_type,
      cell: (value) => {
        return <div>{value.invoice_type}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Vendor Name</span>,
    //   selector: (row) => row.vendor_name,
    //   cell: (value) => {
    //     return <div>{value.vendor_name}</div>;
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Narration</span>,
      selector: (row) => row.narration,
      cell: (value) => {
        return <div>{value.narration}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Bill Amount</span>,
      selector: (row) => row.bill_amount,
      cell: (value) => {
        return <div>{value.bill_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ref Date</span>,
      selector: (row) => row,
      cell: (value) => <span>{moment(value?.date).format("MM/DD/YYYY")}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">Due Date</span>,
      selector: (row) => row,
      cell: (value) => <span>{moment(value?.date).format("MM/DD/YYYY")}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      cell: (value) => <div>{value.remarks}</div>,
    },
    {
      name: <span className="font-weight-bold fs-13">View Invoice</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            <Link to={`/tax-invoice-second/${value.id}`}>
              <Button color="secondary" className="btn btn-sm">
                {" "}
                View
              </Button>
            </Link>
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <UncontrolledDropdown className="dropdown d-inline-block">
            <DropdownToggle
              className="btn btn-soft-secondary btn-sm"
              tag="button"
            >
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="edit-item-btn"
                onClick={() => {
                  setSelectedInvoice(value);
                  setEditModal(true);
                }}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                Edit
              </DropdownItem>
              <DropdownItem
                className="remove-item-btn"
                // onClick={() => props.deleteJob(value.id)}
                onClick={() => {
                  setSelectedInvoice(value);
                  setDeleteModal(true);
                }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ]);

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={
          (props.selectedValue === "Sales" && salesCols) ||
          (props.selectedValue === "Purchase" && purchaseCols)
        }
        data={props.invoices}
        paginationPerPage={props.invoicePagination?.rowsPerPage}
        onChangePage={(p, t) => {
          props.handlePagination({
            ...props.invoicePagination,
            currentPage: p,
          });
        }}
        onChangeRowsPerPage={(c, t) => {
          props.handlePagination({
            ...props.invoicePagination,
            rowsPerPage: c,
            currentPage: t,
          });
        }}
        paginationServer
        paginationDefaultPage={props.invoicePagination?.currentPage}
        paginationTotalRows={props.invoicePagination?.totalRows}
        pagination={props.invoices.length > 10 ? true : false}
      />
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={editModal}
        toggle={() => {
          setEditModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setEditModal((prev) => !prev);
          }}
        >
          Edit Invoice
        </ModalHeader>
        <ModalBody>
          <Sales
            isEdit={true}
            data={selectedInvoice}
            closeAddPopup={() => {
              props.getInvoices();
              setEditModal(false, () => {
                props.getInvoices();
              });
            }}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={deleteModal}
        toggle={() => {
          setDeleteModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setDeleteModal((prev) => !prev);
          }}
        >
          Delete Invoice
        </ModalHeader>
        <ModalBody>
          <div>
            <h4>Are you sure you want to delete?</h4>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              props.deleteInvoice(selectedInvoice?.id);
              setDeleteModal((prev) => !prev);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setDeleteModal((prev) => !prev)}>No</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default InvoiceTable;
