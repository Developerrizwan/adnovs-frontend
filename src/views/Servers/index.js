import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddServer from "./AddServer";
import { Colxx } from "../../components/Common/CustomBootstrap";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import ServerTable from "./ServerTable";
import NotificationManager from "../../components/Common/NotificationManager";

const Servers = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getServers();
  }, []);

  const getServers = () => {
    setLoading(true);
    apiAuth
      .get("/api/server")
      .then((response) => {
        let data = response.data;
        setServers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteServer = (id) => {
    let url = `/api/server/${id}/`;
    apiAuth
      .patch(url, { is_deleted: true })
      .then((response) => {
        NotificationManager.success(
          "",
          "Server Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getServers();
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
            title="Servers"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/servers/add"}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {servers.length > 0 ? (
              <>
                <Card>
                  <ServerTable
                    servers={servers}
                    getServers={getServers}
                    deleteServer={deleteServer}
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
          Add Server
        </ModalHeader>
        <ModalBody>
          <AddServer
            closeAddPopup={() => {
              setCreateModal(false);
              getServers();
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Servers;
