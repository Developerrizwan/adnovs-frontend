import { useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditUser from "./EditUser";

const UserManagementTable = (props) => {
  const [displayModal, setDisplayModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13"> Name</span>,
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Mobile</span>,
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.groups,
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Action</span>,
    //   selector: (row) => row,
    //   cell: (value) => {
    //     return (
    //       <UncontrolledDropdown className="dropdown d-inline-block">
    //         <DropdownToggle
    //           className="btn btn-soft-secondary btn-sm"
    //           tag="button"
    //         >
    //           <i className="ri-more-fill align-middle"></i>
    //         </DropdownToggle>
    //         <DropdownMenu className="dropdown-menu-end">
    //           <DropdownItem
    //             className="edit-item-btn"
    //             onClick={() => {
    //               setSelectedUser(value);
    //               setEditModal(true);
    //             }}
    //           >
    //             <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
    //             Edit
    //           </DropdownItem>
    //           <DropdownItem
    //             className="remove-item-btn"
    //             onClick={() => props.deleteUser(value.id)}
    //           >
    //             <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
    //             Delete{" "}
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledDropdown>
    //     );
    //   },
    // },
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
        pagination
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
          Edit User
        </ModalHeader>
        <ModalBody>
          <EditUser
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedUser(null);
              props.getUser();
            }}
            userData={selectedUser}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserManagementTable;
