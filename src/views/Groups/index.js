import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddGroup from "./AddGroup";
import { Colxx } from "../../components/Common/CustomBootstrap";
import GroupTable from "./GroupTable";
import NotificationManager from "../../components/Common/NotificationManager";

const Groups = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies();
    getGroups();
  }, []);

  const getCompanies = () => {
    apiAuth
      .get("/api/company/")
      .then((response) => {
        let data = response.data;
        setCompanies(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGroups = () => {
    setLoading(true);
    apiAuth
      .get("/api/iotgroups/view/")
      .then((response) => {
        let data = response.data;
        setGroups(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteGroup = (id) => {
    let url = `/api/iotgroups/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Group Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getGroups();
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
        <Container fluid>
          <BreadCrumb
            title="Groups"
            pageTitle="Settings"
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {groups.length > 0 ? (
              <>
                <Card>
                  <GroupTable
                    groups={groups}
                    getGroups={getGroups}
                    companies={companies}
                    deleteGroup={deleteGroup}
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
          Add Group
        </ModalHeader>
        <ModalBody>
          <AddGroup
            closeAddPopup={() => {
              setCreateModal(false);
              getGroups();
            }}
            companies={companies}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Groups;
