import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditLocation from "./EditLocation";

const LocationTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
            name: <span className="font-weight-bold fs-13">Server</span>,
            selector: (row) => row.server,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Latitude</span>,
            selector: (row) => row.location_x,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Longitude</span>,
            selector: (row) => row.location_y,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">TimeZone</span>,
            selector: (row) => row.timezone,
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
                        setSelectedLocation(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteLocation(value.id)}
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
        data={props.locations}
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
          Edit Location
        </ModalHeader>
        <ModalBody>
          <EditLocation
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedLocation(null);
              props.getLocations();
            }}
            locationData={selectedLocation}
            companies={props.companies}
            servers={props.servers}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default LocationTable;
