import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddDevice from "./AddDevice";
import { Colxx } from "../../components/Common/CustomBootstrap";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import DeviceTable from "./DeviceTable";

const Devices = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCompanies();
    getDevices();
    getLocations();
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

  const getDevices = () => {
    setLoading(true);
    apiAuth
      .get("/api/device/view")
      .then((response) => {
        let data = response.data.map((device) => {
          device.acceleration = `${device.acceleration_x},${device.acceleration_y},${device.acceleration_z}`;
          return device;
        });
        setDevices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLocations = () => {
    apiAuth
      .get("/api/location/view/")
      .then((response) => {
        let data = response.data;
        setLocations(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteDevice = (id) => {
    let url = `/api/device/${id}/`;
    apiAuth
      .patch(url, { is_deleted: true })
      .then((response) => {
        NotificationManager.success(
          "",
          "Device Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getDevices();
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
            title="Devices"
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
            {devices.length > 0 ? (
              <>
                <Card>
                  <DeviceTable
                    devices={devices}
                    deleteDevice={deleteDevice}
                    getDevices={getDevices}
                    companies={companies}
                    locations={locations}
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
          Add Device
        </ModalHeader>
        <ModalBody>
          <AddDevice
            closeAddPopup={() => {
              setCreateModal(false);
              getDevices();
            }}
            companies={companies}
            locations={locations}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Devices;
