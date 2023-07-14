import { useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Divider } from "@mui/material";
import ProjectDetailsTable from "./ProjectsDetailsTable";
import { customStyles } from "../../assets/CustomTableStyles";
import moment from "moment-timezone";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import EditClient from "./EditClient";
import apiAuth from "../../helpers/ApiAuth";

const ClientTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [projectsModal, setProjectsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  // console.log(props, "props");

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
          // {
          //   id: <span className="font-weight-bold fs-18">Id</span>,
          //   selector: (row) => (row?.id ? row.id : ""),
          //   sortable: true,
          // },
          {
            name: <span className="font-weight-bold fs-18">Name</span>,
            selector: (row) => (row?.name ? row.name : ""),
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Email</span>,
            selector: (row) => (row?.name ? row.email_id : ""),
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Mobile</span>,
            selector: (row) => (row?.name ? row.phone_number : ""),
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-18">Date of Creation</span>
            ),
            selector: (row) =>
              row?.name
                ? moment
                    .utc(row.date_created)
                    .local()
                    .format("DD-MM-YYYY HH:mm:ss")
                : "",
            sortable: true,
            sortFunction: (a, b) => {
              if (moment(a.date_created).isSameOrAfter(b.date_created)) {
                return -1;
              }
              return 1;
            },
          },
          {
            name: (
              <span className="font-weight-bold fs-18">No of Projects</span>
            ),
            selector: (row) => row?.project_count,
            sortable: true,
            cell: (value) => {
              return (
                <div
                  style={{
                    cursor: "pointer",
                    border: "1px solid grey",
                    padding: "2px 5px",
                    borderRadius: "3px",
                  }}
                  onClick={() => {
                    setProjectsModal(true);
                    setSelectedClient(value);
                    getProjects(value);
                  }}
                >
                  {value.project_count}
                </div>
              );
            },
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
                        setSelectedClient(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteClient(value.id)}
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
        data={props.clientData}
        pagination={props.clientData.length < 10 ? false : true}
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
          Edit Client Member
        </ModalHeader>
        <ModalBody>
          <EditClient
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedClient(null);
              props.getClient();
            }}
            selectedClient={selectedClient}
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

export default ClientTable;
