import moment from "moment";
import { useState } from "react";
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
import JournalVoucher from "./JournalVoucher";

const VoucherTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13"> Voucher Type</span>,
      selector: (row) => row.voucher_type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Branch</span>,
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Book</span>,
      selector: (row) => row.book,
      sortable: true,
    },
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
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount(SAR)</span>,
      selector: (row) => row.amount_sar,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Party A/C</span>,
      selector: (row) => row.party_account,
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
                  setSelectedUser(value);
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
        columns={cols}
        data={props.users}
        paginationPerPage={props.userPagination?.rowsPerPage}
        onChangePage={(p, t) => {
          props.handlePagination({
            ...props.userPagination,
            currentPage: p,
          });
        }}
        onChangeRowsPerPage={(c, t) => {
          props.handlePagination({
            ...props.userPagination,
            rowsPerPage: c,
            currentPage: t,
          });
        }}
        paginationServer
        paginationDefaultPage={props.userPagination?.currentPage}
        paginationTotalRows={props.userPagination?.totalRows}
        pagination={props.users.length > 10 ? true : false}
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
          <JournalVoucher
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedUser(null);
              props.getUser();
            }}
            userData={selectedUser}
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
              props.deleteUser();
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
