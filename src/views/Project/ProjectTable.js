import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditProject from "./EditProject";
import moment from "moment-timezone";
import { customStyles } from "../../assets/CustomTableStyles";
import { Link } from "react-router-dom";
import ProjectTeamMember from "./ProjectTeamMember";
import apiAuth from "../../helpers/ApiAuth";
import { MicrosoftTeams } from "react-bootstrap-icons";
import { People } from "react-bootstrap-icons";
import { PeopleFill } from "react-bootstrap-icons";

const ProjectTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [showTeamMember, setShowTeamMember] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedListProject, setSelectedListProject] = useState(null);
  const [teamMember, setTeamMember] = useState([]);
  const [projectId, setProjectId] = useState("");

  const getTeamMember = () => {
    apiAuth
      .get("/api/teams")
      .then((response) => {
        let data = response.data;
        setTeamMember(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("sashxwxi", teamMember);
  useEffect(() => {
    getTeamMember();
  }, []);

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
  const myStyle = {
    fontSize: "57px",
  };

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={[
          // {
          //   name: <span className="font-weight-bold fs-18">Project Logo</span>,
          //   // selector: (row) => "Image",
          //   sortable: true,
          //   cell: (value) => {
          //     return (
          //       <div className="d-flex justify-content-center align-items-center my-1">
          //         <img width="50px" height="50px" src={value.logo} alt="img" />
          //       </div>
          //     );
          //   },
          // },
          {
            name: <span className="font-weight-bold fs-18">Project Name</span>,
            selector: (row) => row.name,
            sortable: true,
            cell: (value) => {
              return (
                <>
                  <Link to={`/project/${value.id}`}>{value.name}</Link>
                </>
              );
            },
          },
          {
            name: <span className="font-weight-bold fs-18">Start Date</span>,
            selector: (row) =>
              moment.utc(row.start_date).local().format("DD-MM-YYYY"),
            sortable: true,
            sortFunction: (a, b) => {
              if (moment(a.start_date).isSameOrAfter(b.start_date)) {
                return -1;
              }
              return 1;
            },
          },
          {
            name: <span className="font-weight-bold fs-18">Status</span>,
            selector: (row) => (
              <>
                {row.status === "COMPLETED" ? (
                  <Badge color="success p-2" pill>
                    Completed
                  </Badge>
                ) : (
                  <Badge color="primary p-2" pill>
                    Pending
                  </Badge>
                )}
              </>
            ),

            sortable: true,
          },
          // {
          //   name: <span className="font-weight-bold fs-18">Type</span>,
          //   selector: (row) => row.type,
          //   sortable: true,
          // },
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
                        setSelectedProject(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deletProject(value.id)}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                      Delete{" "}
                    </DropdownItem>
                    <Link to={`/report/${value.id}`}>
                      <DropdownItem className="view-item-btn">
                        <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                        View Report
                      </DropdownItem>
                    </Link>
                    <DropdownItem
                      className="view-item-btn"
                      onClick={() => {
                        setShowTeamMember(true);
                        setProjectId(value.id);
                      }}
                    >
                      {/* <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "} */}
                      <PeopleFill className=" me-2 text-muted" />
                      Invite Team Member
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              );
            },
          },
        ]}
        data={props.projects}
        pagination={props.projects.length > 10 ? true : false}
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
          Edit Project
        </ModalHeader>
        <ModalBody>
          <EditProject
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedProject(null);
              props.getProject();
            }}
            projectData={selectedProject}
            // companies={props.companies}
            // iotGroups={props.iotGroups}
            // groups={props.groups}
            history={props.history}
          />
        </ModalBody>
      </Modal>

      {/* team member modal */}

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={showTeamMember}
        toggle={() => {
          setShowTeamMember((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setShowTeamMember((prev) => !prev);
          }}
        >
          Team Member
        </ModalHeader>
        <ModalBody>
          <ProjectTeamMember
            closeAddPopup={() => {
              setShowTeamMember(false);
            }}
            history={props.history}
            teamMember={teamMember}
            projectId={projectId}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProjectTable;
