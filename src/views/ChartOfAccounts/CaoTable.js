import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
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
import AddCOA from "./AddCOA";
import { Link } from "react-router-dom";

const CaoTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deletId, setDeletId] = useState();

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Code</span>,
      selector: (row) => row.code,
      cell: (value) => {
        return (
          <div
            title={value.code}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.code}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      cell: (value) => {
        return (
          <div
            title={value?.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.name}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (row) => row.status,
      cell: (value) => (
        <div
          title={value?.status ? "Active" : "Inactive"}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {value?.status ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">COA Type</span>,
      selector: (row) => row.coa_type,
      cell: (value) => {
        return (
          <div
            title={value?.coa_type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.coa_type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Category</span>,
      selector: (row) => row.category,
      cell: (value) => {
        return (
          <div
            title={value.category}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.category}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row) => row.type,
      cell: (value) => {
        return (
          <div
            title={value?.type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return (
          <div
            title={value.currency}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.currency}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Refernce Code</span>,
      selector: (row) => row.additional_reference_code,
      cell: (value) => {
        return (
          <div
            title={value.additional_reference_code}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.additional_reference_code}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: (
        <span className="font-weight-bold fs-13">View Ledger statement</span>
      ),
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            <Link to={`/ledger-statement/${value.id}`}>
              <Button color="secondary" className="btn btn-sm">
                {" "}
                View
              </Button>
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
                  setSelectedAccount(value);
                  // console.log("wwwwwwwww", value);
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
      {/* {console.log("eeeeee", props)} */}
      <DataTable
        customStyles={customStyles}
        columns={cols}
        data={props.accounts}
        // paginationPerPage={props.pagination?.rowsPerPage}
        // onChangePage={(p, t) => {
        //   props.handlePagination({
        //     ...props.pagination,
        //     currentPage: p,
        //   });
        // }}
        // onChangeRowsPerPage={(c, t) => {
        //   props.handlePagination({
        //     ...props.pagination,
        //     rowsPerPage: c,
        //     currentPage: t,
        //   });
        // }}
        // paginationServer
        // paginationDefaultPage={props.pagination?.currentPage}
        // paginationTotalRows={props.pagination?.totalRows}
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
          <AddCOA
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedAccount(null);
              props.getAccounts();
            }}
            account={selectedAccount}
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
              props.deleteAccount(deletId.id);
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

export default CaoTable;
