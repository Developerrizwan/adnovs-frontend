import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ClientTable from "./ClientTable";
import AddClient from "./AddClient";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const Client = (props) => {
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [clientData, setClientData] = useState([]);

  const getClient = () => {
    apiAuth
      .get("/api/client")
      .then((response) => {
        // console.log("client-data", response.data);
        setClientData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteClient = (id) => {
    let url = `/api/client/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Client Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getClient();
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  useEffect(() => {
    getClient();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        {/* <Container fluid>
          <BreadCrumb
            title="Clients"
            pageTitle="Settings"
            history={props.history}
            // back_button={true}
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
          />
        </Container> */}

        <Row>
          <Colxx lg="12">
            {clientData.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <ClientTable
                    clientData={clientData}
                    pagination
                    getClient={() => getClient()}
                    deleteClient={deleteClient}
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
          Add Client
        </ModalHeader>
        <ModalBody>
          <AddClient
            closeAddPopup={() => {
              setCreateModal(false);
              getClient();
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Client;
