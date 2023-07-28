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
import AddCostEntry from "./AddCostEntry";

const CostEntryTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deletId, setDeletId] = useState();

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13"> Charge</span>,
      selector: (row) => row.charge,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Voucher</span>,
      selector: (row) => row.voucher_type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Job No</span>,
      selector: (row) => row.job_no,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Shipment No</span>,
      selector: (row) => row.shipment_no,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ex Rate</span>,
      selector: (row) => row.ex_rate,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">FCY Amount</span>,
      selector: (row) => row.fcy_amount,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount(SAR)</span>,
      selector: (row) => row.amount,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Sale/Cost</span>,
      selector: (row) => row.sale_cost,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr/Cr</span>,
      selector: (row) => row.dr_cr,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prorate Method</span>,
      selector: (row) => row.prorate_method,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Tax Method</span>,
      selector: (row) => row.tax_group_code,
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
      {/* {console.log("eeeeee", props)} */}
      <DataTable
        customStyles={customStyles}
        columns={cols}
        data={props.accounts}
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
          Edit Cost Entry
        </ModalHeader>
        <ModalBody>
          <AddCostEntry
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedAccount(null);
              props.getAccounts();
            }}
            entry={selectedAccount}
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
              props.deleteColumn(deletId.id);
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

export default CostEntryTable;
