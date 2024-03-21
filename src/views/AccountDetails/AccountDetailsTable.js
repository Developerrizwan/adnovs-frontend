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
import AccountDetail from "./AccountDetail";

const AccountDetailsTable = (props) => {
  // console.log("props", props);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [deletId, setDeletId] = useState();

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">A/C Name</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.ac_name?.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.ac_name?.name}
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
            title={value.fcy_amount}
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
      name: <span className="font-weight-bold fs-13">Voucher Type</span>,
      selector: (row) => row.voucher_type,
      cell: (value) => {
        return (
          <div
            title={value.vouchers?.voucher_type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.vouchers?.voucher_type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount(SAR)</span>,
      selector: (row) => row.amount_sar,
      cell: (value) => {
        return (
          <div
            title={value.amount_sar}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.amount_sar}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">DR/CR(SAR)</span>,
      selector: (row) => row.dr_cr,
      cell: (value) => {
        return (
          <div
            title={value.dr_cr}
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
    {
      name: <span className="font-weight-bold fs-13">Charge</span>,
      selector: (row) => row.charge,
      cell: (value) => {
        return (
          <div
            title={value?.charge?.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.charge?.name}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Inter Branch</span>,
      selector: (row) => row.inter_branch,
      cell: (value) => {
        return (
          <div
            title={value.inter_branch}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.inter_branch}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Tax Amount</span>,
      selector: (row) => row.tax_amount,
      cell: (value) => {
        return (
          <div
            title={value.tax_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.tax_amount}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Tax Group Code</span>,
      selector: (row) => row.tax_group_code,
      cell: (value) => {
        return (
          <div
            title={value.tax_group_code}
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
      name: <span className="font-weight-bold fs-13">Taxable Amount</span>,
      selector: (row) => row.taxable_amount,
      cell: (value) => {
        return (
          <div
            title={value.taxable_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.taxable_amount}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Narration</span>,
      selector: (row) => row.narration,
      cell: (value) => {
        return (
          <div
            title={value.narration}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.narration}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      cell: (value) => {
        return (
          <div
            title={value.remarks}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.remarks}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">View</span>,
    //   selector: (row) => row.remarks,
    //   cell: (value) => {
    //     const type = localStorage.getItem("voucher-type");
    //     return (
    //       <div>
    //         {/* {console.log("typee", type)} */}
    //         <Link
    //           to={
    //             type === "Payment"
    //               ? `/voucher/payment-voucher/${value.id}`
    //               : type === "Receipt"
    //               ? `/voucher/receipt-voucher/${value.id}`
    //               : type === "Journal"
    //               ? `/journal/${value.id}`
    //               : type.includes("Note")
    //               ? `/tax-credit/${value.id}`
    //               : ""
    //           }
    //           className="btn btn-primary"
    //         >
    //           View
    //         </Link>
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
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
          Edit Account
        </ModalHeader>
        <ModalBody>
          <AccountDetail
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedAccount(null);

              if (props?.fromVoucherTable) {
                props.getAcctDetailsForVoucher();
              } else {
                props.getVouchers();
              }
            }}
            accountDetails={selectedAccount}
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

export default AccountDetailsTable;
