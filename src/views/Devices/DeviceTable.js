import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditDevice from "./EditDevice";

const DeviceTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <>
      <DataTable
        columns={[
          {
            name: <span className="font-weight-bold fs-13">Name</span>,
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Company</span>,
            selector: (row) => row.company,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Location</span>,
            selector: (row) => row.location,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Temperature</span>,
            selector: (row) => row.temperature,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">RSSI Value</span>,
            selector: (row) => row.rssi_value,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Acceleration</span>,
            selector: (row) => row.acceleration,
            sortable: true,
            // cell: (props) => {
            //   return (
            //     <span>
            //       {props.acceleration_x},{props.acceleration_y},
            //       {props.acceleration_z}
            //     </span>
            //   );
            // },
          },
          {
            name: <span className="font-weight-bold fs-13">GMT Time</span>,
            selector: (row) => row.gmt_tm,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Cutoff</span>,
            selector: (row) => row.cutoff,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">PIR</span>,
            selector: (row) => row.pir,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Beacon Type</span>,
            selector: (row) => row.beacon_type,
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-13">Transmission Power</span>
            ),
            selector: (row) => row.transmission_power,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Battery</span>,
            selector: (row) => row.battery,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Major</span>,
            selector: (row) => row.major,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Minor</span>,
            selector: (row) => row.minor,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">TLM</span>,
            selector: (row) => row.tlm,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Action</span>,
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
                        setSelectedDevice(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteDevice(value.id)}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                      Delete{" "}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              );
            },
          },
        ]}
        data={props.devices}
        pagination
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
          Edit Device
        </ModalHeader>
        <ModalBody>
          <EditDevice
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedDevice(null);
              props.getDevices();
            }}
            deviceData={selectedDevice}
            companies={props.companies}
            locations={props.locations}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default DeviceTable;
