import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddProject from "./AddProject";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import ProjectTable from "./ProjectTable";
import Data from "./Testdata";

const Project = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProject();
  }, []);

  const getProject = () => {
    setLoading(true);
    apiAuth
      .get("/api/project")
      .then((response) => {
        let data = response.data;
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletProject = (id) => {
    let url = `/api/project/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Project Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getProject();
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        {/* <Container fluid>
          <BreadCrumb
            title="Project"
            pageTitle="Settings"
            add_new={true}
            // add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/project/add"}
          />
        </Container> */}

        <Row>
          <Colxx lg="12">
            {projects.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <ProjectTable
                    projects={projects}
                    deletProject={deletProject}
                    getProject={getProject}
                    history={props.history}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Project;
