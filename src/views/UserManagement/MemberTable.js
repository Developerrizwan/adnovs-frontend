import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import EditUser from "./EditMember";

const MemberTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // const customStyles = {
  //   headRow: {
  //     style: {
  //       color: "#fff",
  //       backgroundColor: "#1062fe",
  //     },
  //   },
  //   rows: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  // };

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={[
          {
            name: <span className="font-weight-bold fs-18">Name</span>,
            selector: (row) => row.username,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Email</span>,
            selector: (row) => row.email,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Country</span>,
            selector: (row) => row.country,
            sortable: true,
          },
          // {
          //   name: <span className="font-weight-bold fs-18">Password</span>,
          //   selector: (row) => row.password,
          //   sortable: true,
          // },
          {
            name: <span className="font-weight-bold fs-18">Status</span>,
            selector: (row) => "Active",
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Role</span>,
            selector: (row) => row.groups[0],
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Action</span>,
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
                        setSelectedMember(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteMember(value.id)}
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
        data={props.memberData}
        pagination={props.memberData.length > 10 ? true : false}
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
          Edit Member
        </ModalHeader>
        <ModalBody>
          <EditUser
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedMember(null);
              props.getMembers();
            }}
            selectedMember={selectedMember}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default MemberTable;
