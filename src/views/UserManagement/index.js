import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import MemberTable from "./MemberTable";
import AddMember from "./AddMember";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const UserManagement = (props) => {
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [memberData, setMemberData] = useState([]);

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = () => {
    apiAuth
      .get("/api/user")
      .then((response) => {
        let data = response.data;
        setMemberData(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteMember = (id) => {
    let url = `/api/user/${id}/`;
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
        getMembers();
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
            title="User Management"
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
            {memberData.length > 0 ? (
              <>
                <Card style={{boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)"}}>
                  <MemberTable
                    memberData={memberData}
                    pagination
                    deleteMember={deleteMember}
                    getMembers={getMembers}
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
          Add Member
        </ModalHeader>
        <ModalBody>
          <AddMember
            closeAddPopup={() => {
              setCreateModal(false);
              getMembers();
            }}
            memberData={memberData}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;
