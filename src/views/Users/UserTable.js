import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditUser from "./EditUser";

const UserTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const customStyles = {
    headRow: {
      style: {
        color: "#fff",
        backgroundColor: "#1062fe",
      },
    },
    rows: {
      style: {
        color: "#000",
        backgroundColor: "#f3f3f9",
      },
    },
    pagination: {
      style: {
        color: "#000",
        backgroundColor: "#f3f3f9",
      },
    },
  };

  return (
    <>
      <DataTable
      customStyles={customStyles}
        columns={[
          {
            name: <span className="font-weight-bold fs-13">Name</span>,
            selector: (row) => row.first_name,
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
            name: <span className="font-weight-bold fs-13">Company</span>,
            selector: (row) => row.company_name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Groups</span>,
            selector: (row) => row.itgps_name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Action</span>,
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
                      onClick={() => props.deleteUser(value.id)}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                      Delete{" "}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              );
            },
          },
        ]}
        data={props.users}
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
              props.getUsers();
            }}
            userData={selectedUser}
            companies={props.companies}
            iotGroups={props.iotGroups}
            groups={props.groups}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserTable;
