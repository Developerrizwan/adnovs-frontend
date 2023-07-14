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
import EditTeamMember from "./EditTeamMember";
import apiAuth from "../../helpers/ApiAuth";
import ProjectDetailsTable from "../Client/ProjectsDetailsTable";
import { Divider } from "@mui/material";

const TeamTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [projectsModal, setProjectsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);

  const getProjects = (value) => {
    apiAuth
      .get(`/api/project/?client_id=${value.id}`)
      .then((res) => {
        setClientProjects(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Email</span>,
            selector: (row) => row.email_id,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Designation</span>,
            selector: (row) => row.designation,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Mobile</span>,
            selector: (row) => row.phone_number,
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
                        setSelectedTeam(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteTeam(value.id)}
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
        data={props.selectedTeamMembers}
        pagination={props.selectedTeamMembers.length > 10 ? true : false}
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
          Edit Team Member
        </ModalHeader>
        <ModalBody>
          <EditTeamMember
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedTeam(null);
              // props.getTeamMembers();
            }}
            selectedTeam={selectedTeam}
            history={props.history}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={projectsModal}
        toggle={() => {
          setProjectsModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setProjectsModal((prev) => !prev);
          }}
        >
          {selectedClient?.name} Projects
        </ModalHeader>
        <Divider sx={{ height: "2px", backgroundColor: "black" }} />
        <ModalBody>
          <ProjectDetailsTable
            closeAddPopup={() => {
              setProjectsModal(false);
              setClientProjects(null);
            }}
            clientProjects={clientProjects}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default TeamTable;
