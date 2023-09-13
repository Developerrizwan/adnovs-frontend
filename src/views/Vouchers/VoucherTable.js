import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import Voucher from "./Voucher";

const VoucherTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [deletId, setDeletId] = useState();

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13"> Voucher Type</span>,
      selector: (row) => row.voucher_type,
      cell: (value) => {
        return <div>{value.voucher_type}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Branch</span>,
      selector: (row) => row.branch,
      cell: (value) => {
        return <div>{value.branch}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Job ID</span>,
      selector: (row) => row,
      cell: (value) => {
        return <div>{value.job?.job_number}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Book</span>,
    //   selector: (row) => row.book,
    //   cell: (value) => {
    //     return <div>{value.book}</div>;
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row,
      cell: (value) => <span>{moment(value?.date).format("MM/DD/YYYY")}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">G/L Date</span>,
      selector: (row) => row,
      cell: (value) => (
        <span>{moment(value?.gl_date).format("MM/DD/YYYY")}</span>
      ),
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
      name: <span className="font-weight-bold fs-13">Party A/C</span>,
      selector: (row) => row,
      cell: (value) => {
        return <div>{value.party_account?.code}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Against Concern</span>,
    //   selector: (row) => row.groups,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">naration</span>,
      selector: (row) => row.naration,
      cell: (value) => {
        return <div>{value.naration}</div>;
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Outstanding Amount</span>,
    //   selector: (row) => row.outstanding_amount,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      cell: (value) => {
        return <div>{value.remarks}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      selector: (row) => row.remarks,
      cell: (value) => {
        const type = localStorage.getItem("voucher-type");
        return (
          <div>
            {console.log("typee", type)}
            <Link
              to={
                type === "Payment"
                  ? `/voucher/payment/${value.id}`
                  : type === "Receipt"
                  ? `/voucher/receipt/${value.id}`
                  : type === "Journal"
                  ? `/voucher/journal/${value.id}`
                  : type === "DebitNote"
                  ? `/voucher/debit/${value.id}`
                  : type === "CreditNote"
                  ? `/voucher/credit/${value.id}`
                  : ""
              }
              className="btn btn-primary"
            >
              View
            </Link>
          </div>
        );
      },
      sortable: true,
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
                  setSelectedVoucher(value);
                  console.log("wwwwwwwww", value);
                  setEditModal(true);
                }}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                Edit
              </DropdownItem>
              <DropdownItem
                className="remove-item-btn"
                onClick={() => {
                  setDeleteModal(true);
                  setDeletId(value);
                }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                Delete{" "}
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
        columns={cols}
        data={props.users}
        paginationPerPage={props.pagination?.rowsPerPage}
        onChangePage={(p, t) => {
          props.handlePagination({
            ...props.pagination,
            currentPage: p,
          });
        }}
        onChangeRowsPerPage={(c, t) => {
          props.pagination({
            ...props.pagination,
            rowsPerPage: c,
            currentPage: t,
          });
        }}
        paginationServer
        paginationDefaultPage={props.pagination?.currentPage}
        paginationTotalRows={props.pagination?.totalRows}
        pagination={true}
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
          Edit Voucher
        </ModalHeader>
        <ModalBody>
          <Voucher
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedVoucher(null);
              props.getVouchers();
            }}
            voucherData={selectedVoucher}
            history={props.history}
            isEdit={true}
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
          Delete
        </ModalHeader>
        <ModalBody>
          <div>
            <h4>Are you sure you want to delete?</h4>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              props.deleteUser(deletId.id);
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

export default VoucherTable;
