import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditGroup from "./EditGroup";

const GroupTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <>
      <DataTable
        columns={[
          {
            name: <span className="font-weight-bold fs-13">Name</span>,
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Company</span>,
            selector: (row) => row.company,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Users</span>,
            selector: (row) => row,
            cell: (value) => {
              return (
                <div className="d-flex flex-column">
                  {value?.users?.length > 0 ? (
                    value.users.map((usr, index) => (
                      <span key={index}>{usr}</span>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              );
            },
          },
          {
            name: <span className="font-weight-bold fs-13">Devices</span>,
            selector: (row) => row.devices,
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
                        setSelectedGroup(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteGroup(value.id)}
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
        data={props.groups}
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
          Edit Group
        </ModalHeader>
        <ModalBody>
          <EditGroup
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedGroup(null);
              props.getGroups();
            }}
            groupData={selectedGroup}
            companies={props.companies}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default GroupTable;
