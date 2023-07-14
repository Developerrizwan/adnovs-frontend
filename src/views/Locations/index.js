import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddLocation from "./AddLocation";
import { Colxx } from "../../components/Common/CustomBootstrap";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import LocationTable from "./LocationTable";
import NotificationManager from "../../components/Common/NotificationManager";

const Locations = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies();
    getLocations();
    getServers();
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

  const getLocations = () => {
    setLoading(true);
    apiAuth
      .get("/api/location/view/")
      .then((response) => {
        let data = response.data;
        setLocations(data);
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getServers = () => {
    apiAuth
      .get("/api/server/")
      .then((response) => {
        let data = response.data;
        setServers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteLocation = (id) => {
    let url = `/api/location/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Location Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getLocations();
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
            title="Locations"
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
            {locations.length > 0 ? (
              <>
                <Card>
                  <LocationTable
                    locations={locations}
                    getLocations={getLocations}
                    deleteLocation={deleteLocation}
                    companies={companies}
                    servers={servers}
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
          Add Location
        </ModalHeader>
        <ModalBody>
          <AddLocation
            closeAddPopup={() => {
              setCreateModal(false);
              getLocations();
            }}
            companies={companies}
            servers={servers}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Locations;
