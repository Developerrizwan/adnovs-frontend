import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
// import AddTicket from "./AddTicket";
import SubscriptionTable from "./SubscriptionTable";
// import TicketTable from "./SubscriptionTable";
import Data from "./SubscriptionData";
const SubscriptionManagement = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [iotGroups, setIotGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSubscribedUsers();
  }, []);

  const getSubscribedUsers = () => {
    apiAuth
      .get("/api/usersubscription/")
      .then((response) => {
        let data = response.data;
        console.log(response.data);
        setSubscriptions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
    let url = `/api/admin/users/${id}/`;
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
        // getUsers();
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
            add_new_label="Upgrade"
            title=" Subscription Management"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/plans"}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {subscriptions.length > 0 ? (
              <>
                <Card style={{boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)"}}>
                  <SubscriptionTable
                    subscriptions={subscriptions}
                    // deleteUser={deleteUser}
                    // companies={companies}
                    // iotGroups={iotGroups}
                    // groups={groups}
                    // getUsers={getUsers}
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
          Add Ticket
        </ModalHeader>
        <ModalBody>
          {/* <AddTicket
            closeAddPopup={() => {
              setCreateModal(false);
              getUsers();
            }}
            companies={companies}
            iotGroups={iotGroups}
            groups={groups}
          /> */}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default SubscriptionManagement;
