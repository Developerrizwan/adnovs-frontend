import moment from "moment";
import { useEffect, useState, useMemo } from "react";
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
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import Voucher from "./Voucher";
import AccountDetail from "../AccountDetails/AccountDetail";
import AccountDetailsTable from "../AccountDetails/AccountDetailsTable";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const VoucherTable = (props) => {
  const [searchText, setSearchText] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [deletId, setDeletId] = useState(null);
  const [acctId, setAcctId] = useState(null);
  const [accountDetailsModal, setAccountDetailsModal] = useState(false);
  const [acctDetModal, setAcctDetModal] = useState(false);
  const [acctDetData, setAcctDetData] = useState([]);

  // Filtered Data with Search
  const filteredData = useMemo(() => {
    if (!searchText || searchText.trim() === "") {
      return props.users || [];
    }

    const searchLower = searchText.toLowerCase().trim();

    return (props.users || []).filter((item) => {
      return (
        (item.voucher_number && item.voucher_number.toLowerCase().includes(searchLower)) ||
        (item.voucher_type && item.voucher_type.toLowerCase().includes(searchLower)) ||
        (item.branch && item.branch.toLowerCase().includes(searchLower)) ||
        (item.job?.job_number && item.job.job_number.toLowerCase().includes(searchLower)) ||
        (item.naration && item.naration.toLowerCase().includes(searchLower)) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchLower)) ||
        (item.party_account?.name && item.party_account.name.toLowerCase().includes(searchLower)) ||
        (item.party_account?.code && item.party_account.code.toLowerCase().includes(searchLower)) ||
        (item.invoice?.invoice_number && item.invoice.invoice_number.toLowerCase().includes(searchLower)) ||
        (item.voucher_for && item.voucher_for.toLowerCase().includes(searchLower)) ||
        moment(item.date).format("DD/MM/YYYY").includes(searchText) ||
        moment(item.gl_date).format("DD/MM/YYYY").includes(searchText)
      );
    });
  }, [props.users, searchText]);

  const getAccountDetails = (id) => {
    apiAuth
      .get(`/api/master/accountdetails/?voucher=${id}`)
      .then((res) => {
        let { data } = res;
        setAcctDetData(data?.results || []);
        setAcctDetModal(true);
      })
      .catch((err) => console.log(err));
  };

  const deleteAccount = (id) => {
    apiAuth
      .delete(`/api/master/accountdetails/${id}/`)
      .then((response) => {
        NotificationManager.success(
          "",
          "Account Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getAccountDetails(acctId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Voucher Number</span>,
      selector: (row) => row.voucher_number,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.voucher_number}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row?.voucher_number}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Voucher Type</span>,
      selector: (row) => row.voucher_type,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.voucher_type}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.voucher_type}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Branch</span>,
      selector: (row) => row.branch,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.branch}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.branch}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Job ID</span>,
      selector: (row) => row.job?.job_number,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.job?.job_number}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.job?.job_number || "-"}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => (
        <div
          title={moment(row?.date).format("DD/MM/YYYY")}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {moment(row?.date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">G/L Date</span>,
      selector: (row) => row.gl_date,
      sortable: true,
      cell: (row) => (
        <div
          title={moment(row?.gl_date).format("DD/MM/YYYY")}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {moment(row?.gl_date).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">FC Amount</span>,
      selector: (row) => row.fc_amount,
      sortable: true,
      cell: (row) => (
        <div
          title={row.fc_amount}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.fc_amount}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Amount(SAR)</span>,
      selector: (row) => row.amount_sar,
      sortable: true,
      cell: (row) => (
        <div
          title={row.amount_sar}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.amount_sar}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Party A/C</span>,
      selector: (row) => row.party_account?.name || row.party_account?.code,
      sortable: true,
      cell: (row) => (
        <div
          title={
            row.party_account_type === "organization"
              ? row.party_account?.name
              : row.party_account?.code
          }
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.party_account_type === "organization"
            ? row.party_account?.name
            : row.party_account?.code || "-"}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice</span>,
      selector: (row) => row.invoice?.invoice_number,
      sortable: true,
      omit: !["DebitNote", "CreditNote"].includes(props.curVoucher),
      cell: (row) => (
        <div
          title={row?.invoice?.invoice_number}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.invoice?.invoice_number || "-"}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Voucher For</span>,
      selector: (row) => row.voucher_for,
      sortable: true,
      omit: !["DebitNote", "CreditNote"].includes(props.curVoucher),
      cell: (row) => (
        <div
          title={row?.voucher_for}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row?.voucher_for || "-"}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Naration</span>,
      selector: (row) => row.naration,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.naration}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.naration}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      sortable: true,
      cell: (row) => (
        <div
          title={row?.remarks}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {row.remarks}
        </div>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">View Account Details</span>,
      cell: (row) => (
        <Button
          color="primary"
          className="btn btn-primary btn-sm"
          onClick={() => {
            getAccountDetails(row?.id);
            setAcctId(row?.id);
          }}
        >
          View
        </Button>
      ),
      ignoreRowClick: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      cell: (row) => {
        const type = localStorage.getItem("voucher-type") || props.curVoucher;
        let path = "";

        if (type === "Payment") path = `/voucher/payment/${row.id}`;
        else if (type === "Receipt") path = `/voucher/receipt/${row.id}`;
        else if (type === "Journal") path = `/voucher/journal/${row.id}`;
        else if (type === "DebitNote") path = `/voucher/debit/${row.id}`;
        else if (type === "CreditNote") path = `/voucher/credit/${row.id}`;

        return (
          <Link to={path} className="btn btn-primary btn-sm">
            View
          </Link>
        );
      },
      ignoreRowClick: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      cell: (row) => (
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
                setSelectedVoucher(row);
                setAccountDetailsModal(true);
              }}
            >
              <i className="ri-file-add-fill align-bottom me-2 text-muted"></i>
              Add Account
            </DropdownItem>
            <DropdownItem
              className="edit-item-btn"
              onClick={() => {
                setSelectedVoucher(row);
                setEditModal(true);
              }}
            >
              <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
              Edit
            </DropdownItem>
            <DropdownItem
              className="remove-item-btn text-danger"
              onClick={() => {
                setDeletId(row);
                setDeleteModal(true);
              }}
            >
              <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      {/* Search Box */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Voucher Number, Type, Job, Party, Naration..."
          style={{ width: "320px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        highlightOnHover
        responsive
        noDataComponent={
          <div className="p-5 text-center text-muted">
            There are no records to display
          </div>
        }
      />

      {/* Edit Voucher Modal */}
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={editModal}
        toggle={() => setEditModal(false)}
      >
        <ModalHeader toggle={() => setEditModal(false)}>
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

      {/* Add Account Modal */}
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={accountDetailsModal}
        toggle={() => setAccountDetailsModal(false)}
      >
        <ModalHeader toggle={() => setAccountDetailsModal(false)}>
          Add Account
        </ModalHeader>
        <ModalBody>
          <AccountDetail
            fromVoucher={true}
            voucherId={selectedVoucher?.id}
            closeAddPopup={() => {
              setAccountDetailsModal(false);
            }}
          />
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        id="signupModals"
        tabIndex="-1"
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
      >
        <ModalHeader toggle={() => setDeleteModal(false)}>Delete</ModalHeader>
        <ModalBody>
          <div>
            <h4>Are you sure you want to delete this voucher?</h4>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              props.deleteUser(deletId?.id);
              setDeleteModal(false);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setDeleteModal(false)}>No</Button>
        </ModalFooter>
      </Modal>

      {/* Account Details View Modal */}
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={acctDetModal}
        toggle={() => setAcctDetModal(false)}
      >
        <ModalHeader toggle={() => setAcctDetModal(false)}>
          Account Details
        </ModalHeader>
        <ModalBody>
          <AccountDetailsTable
            users={acctDetData}
            fromVoucherTable={true}
            getAcctDetailsForVoucher={() => {
              getAccountDetails(acctId);
            }}
            deleteAccount={(val) => deleteAccount(val)}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default VoucherTable;