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
import { customStyles } from "../../assets/CustomTableStyles";
import AddOrganization from "./AddOrganization";
const OrganizationTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletId, setDeletId] = useState();
  const [selectedOrganization, setSelectedOrganization] = useState([]);

  const [cols, setCols] = useState([
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
      name: <span className="font-weight-bold fs-13">Language Name</span>,
      selector: (row) => row.language_name,
      cell: (value) => {
        return (
          <div
            title={value?.language_name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.language_name}
          </div>
        );
      },

      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Address</span>,
      selector: (row) => row.address,
      cell: (value) => {
        return (
          <div
            title={value?.address}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.address}
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
            title={value?.currency}
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
      name: <span className="font-weight-bold ">Gstin Registered</span>,
      selector: (row) => row.gstin_registered,
      cell: (value) => {
        return (
          <div
            title={value.gstin_registered ? "Yes" : "No"}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.gstin_registered ? "Yes" : "No"}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold ">Payment Terms</span>,
      selector: (row) => row.payment_terms,
      cell: (value) => {
        return (
          <div
            title={value.payment_terms}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.payment_terms}
          </div>
        );
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Vat Trn Number</span>,
      selector: (row) => row.vat_trn_number,
      cell: (value) => {
        return (
          <div
            title={value.vat_trn_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.vat_trn_number}
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
    {
      name: <span className="font-weight-bold fs-13">View Statement</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            <Link to={`/account-organizationstatement/${value.id}`}>
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
                  setSelectedOrganization(value);
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
        columns={cols}
        data={props.allOrganization}
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
          Edit Organization
        </ModalHeader>
        <ModalBody>
          <AddOrganization
            isEdit={true}
            closeAddPopup={() => {
              setEditModal(false);
              props.getOrganization();
            }}
            organizationData={selectedOrganization}
            selectedValue={props.selectedValue}
            history={props.history}
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
              setDeleteModal((prev) => !prev);
              props.deleteOrganization(deletId.id);
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

export default OrganizationTable;
