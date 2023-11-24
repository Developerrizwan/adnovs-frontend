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
import CostEntry from "./CostEntry";

const CostEntryTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deletId, setDeletId] = useState();

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Charge</span>,
      selector: (row) => row.charge,
      cell: (value) => {
        return (
          <div
            title={value.charge?.code}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.charge?.code}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Voucher</span>,
    //   selector: (row) => row.voucher_type,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Job No</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return (
          <div
            title={value.job_no?.job_number}
            style={{
              whiteSpace: "nowrap",
              // overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.job_no?.job_number}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return (
          <div
            title={value.amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.amount}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Shipment No</span>,
      selector: (row) => row.shipment_no,
      cell: (value) => {
        return (
          <div
            title={value.shipment_no}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.shipment_no}
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
      name: <span className="font-weight-bold fs-13">Ex Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return (
          <div
            title={value.ex_rate}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.ex_rate}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Is Invoiced</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return (
          <div
            title={value?.is_included ? "Yes" : "No"}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.is_included ? "Yes" : "No"}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">FCY Amount</span>,
      selector: (row) => row.fcy_amount,
      cell: (value) => {
        return (
          <div
            title={value?.fcy_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.fcy_amount}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Description</span>,
      selector: (row) => row.description,
      cell: (value) => {
        return (
          <div
            title={value?.description}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.description}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return (
          <div
            title={value?.amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.amount}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Sale/Cost</span>,
      selector: (row) => row.sale_cost,
      cell: (value) => {
        return (
          <div
            title={value?.sale_cost}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.sale_cost}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr/Cr</span>,
      selector: (row) => row.dr_cr,
      cell: (value) => {
        return (
          <div
            title={value?.dr_cr}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.dr_cr}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Prorate Method</span>,
    //   selector: (row) => row.prorate_method,
    //   cell: (value) => {
    //     return <div>{value.prorate_method}</div>;
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Tax Method</span>,
      selector: (row) => row.tax_group_code,
      cell: (value) => {
        return (
          <div
            title={value?.tax_group_code}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.tax_group_code}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Quantity</span>,
      selector: (row) => row.quantity,
      cell: (value) => {
        return (
          <div
            title={value?.quantity}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.quantity}
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
          props.handlePagination({
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
          <CostEntry
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedAccount(null);
              props.getAccounts();
            }}
            entry={selectedAccount}
            history={props.history}
            isEdit={true}
            title={selectedAccount?.sale_cost}
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
