import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

import AddTeamMember from "./AddTeamMember";
import TeamTable from "./TeamTable";

const Team = (props) => {
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    // getTeamMembers();
    getProject();
  }, []);

  const getTeamMembers = () => {
    apiAuth
      .get("/api/teams")
      .then((response) => {
        let data = response.data;
        setTeamData(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTeam = (id) => {
    let url = `/api/teams/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "User Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getProjectTeamMember();
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };
  const getProject = () => {
    // setLoading(true);
    apiAuth
      .get("/api/project")
      .then((response) => {
        let data = response.data;
        setProjects(data);
        // setLoading(false);

        if (data.length > 0) {
          setSelectedValue({
            label: data[0]?.name,
            value: data[0]?.id,
          });

          getProjectTeamMember(data[0]?.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getProjectTeamMember = (id) => {
    apiAuth
      .get(`/api/teams?project_id=` + id)
      .then((response) => {
        let data = response.data;
        setSelectedTeamMembers(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleProjectChange = (e) => {
    setSelectedValue(e);
    getProjectTeamMember(e.value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Teams"
            pageTitle="Settings"
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_project={true}
            add_project_select={true}
            handleProjectChange={handleProjectChange}
            projects={projects}
            selectedValue={selectedValue}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {selectedTeamMembers.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <TeamTable
                    // teamData={teamData}
                    pagination
                    deleteTeam={deleteTeam}
                    // getTeamMembers={() => getTeamMembers()}
                    selectedTeamMembers={selectedTeamMembers}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={createModal}
        toggle={() => {
          setCreateModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setCreateModal((prev) => !prev);
          }}
        >
          Add Team Member
        </ModalHeader>
        <ModalBody>
          <AddTeamMember
            closeAddPopup={() => {
              setCreateModal(false);
              getProjectTeamMember(selectedValue?.value);
            }}
            teamData={teamData}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Team;
