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
import AccountDetail from "../AccountDetails/AccountDetail";
import AccountDetailsTable from "../AccountDetails/AccountDetailsTable";
import apiAuth from "../../helpers/ApiAuth";

const VoucherTable = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [deletId, setDeletId] = useState();
  const [accountDetailsModal, setAccountDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [acctDetModal, setAcctDetModal] = useState(false);
  const [acctDetData, setAcctDetData] = useState([]);

  const getAccountDetails = (id) => {
    apiAuth
      .get(`/api/master/accountdetails/?voucher=${id}`)
      .then((res) => {
        let {
          data: { results },
        } = res;
        // console.log("dataaa", results);
        setAcctDetData(results);
        setAcctDetModal(true);
      })
      .catch((err) => console.log(err));
  };

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Voucher Type</span>,
      selector: (row) => row.voucher_type,
      cell: (value) => {
        return (
          <div
            title={value?.voucher_type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.voucher_type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Branch</span>,
      selector: (row) => row.branch,
      cell: (value) => {
        return (
          <div
            title={value?.branch}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.branch}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Job ID</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.job?.job_number}
            style={{
              whiteSpace: "nowrap",
              // overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.job?.job_number}
          </div>
        );
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
      name: <span className="font-weight-bold fs-13">G/L Date</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={moment(value?.gl_date).format("MM/DD/YYYY")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {moment(value?.gl_date).format("MM/DD/YYYY")}
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">FC Amount</span>,
      selector: (row) => row.fc_amount,
      cell: (value) => {
        return (
          <div
            title={value.fc_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.fc_amount}
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
      name: <span className="font-weight-bold fs-13">Party A/C</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value.party_account?.code}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.party_account_type === "organization"
              ? value.party_account?.name
              : value.party_account?.code}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.invoice?.invoice_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.invoice?.invoice_number}
          </div>
        );
      },
      sortable: true,
      checkHide: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Voucher For</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div
            title={value?.voucher_for}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.voucher_for}
          </div>
        );
      },
      sortable: true,
      checkHide: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Naration</span>,
      selector: (row) => row.naration,
      cell: (value) => {
        return (
          <div
            title={value?.naration}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.naration}
          </div>
        );
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
    {
      name: (
        <span className="font-weight-bold fs-13">View Account Details</span>
      ),
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            <Button
              color="primary"
              className="btn btn-primary"
              onClick={() => {
                getAccountDetails(value?.id);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      selector: (row) => row.remarks,
      cell: (value) => {
        const type = localStorage.getItem("voucher-type");
        return (
          <div>
            {/* {console.log("typee", type)} */}
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
                  setSelectedAccount(value);
                  setAccountDetailsModal(true);
                }}
              >
                <i className="ri-file-add-fill align-bottom me-2 text-muted"></i>
                Add Account
              </DropdownItem>
              <DropdownItem
                className="edit-item-btn"
                onClick={() => {
                  console.log("voucherType", value);
                  setSelectedVoucher(value);
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
        columns={[...cols].filter((col) => {
          if (col.checkHide) {
            if (
              props.curVoucher === "DebitNote" ||
              props.curVoucher === "CreditNote"
            )
              return true;
            else return false;
          }

          return true;
        })}
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
        isOpen={accountDetailsModal}
        toggle={() => {
          setAccountDetailsModal(false);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setAccountDetailsModal(false);
          }}
        >
          Add Account
        </ModalHeader>
        <ModalBody>
          <AccountDetail
            fromVoucher={true}
            voucherId={selectedAccount?.id}
            closeAddPopup={() => {
              setAccountDetailsModal(false);
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
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={acctDetModal}
        toggle={() => {
          setAcctDetModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setAcctDetModal((prev) => !prev);
          }}
        >
          Account Details
        </ModalHeader>
        <ModalBody>
          {/* {console.log("dddddddd", acctDetData)} */}
          <AccountDetailsTable users={acctDetData} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default VoucherTable;
