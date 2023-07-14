import { useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";

const ServerTable = (props) => {
    
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  return (
    <>
      <DataTable
        columns={[
          {
            name: <span className="font-weight-bold fs-13">Server Name</span>,
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Server IP</span>,
            selector: (row) => row.server_ip,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Server PORT</span>,
            selector: (row) => row.port,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Username</span>,
            selector: (row) => row.username,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-13">Server TALK</span>,
            selector: (row) => row.talk,
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-13">Influx Servers</span>
            ),
            selector: (row) => row.influx,
            sortable: true,
            cell: (value) => {
              return <p className="cursor-pointer">{value.influx?.length}</p>;
            },
          },
          {
            name: <span className="font-weight-bold fs-13">MQTT Servers</span>,
            selector: (row) => row.mqtts,
            sortable: true,
            cell: (value) => {
              return <p className="cursor-pointer">{value.mqtts?.length}</p>;
            },
          },
          {
            name: <span className="font-weight-bold fs-13">VM Servers</span>,
            selector: (row) => row.victoriamatrics,
            sortable: true,
            cell: (value) => {
              return (
                <p className="cursor-pointer">
                  {value.victoriamatrics?.length}
                </p>
              );
            },
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
                    <DropdownItem className="edit-item-btn">
                      <Link
                        to={`/servers/edit/${value.id}/`}
                        className="text-black"
                      >
                        <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                        Edit
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteServer(value.id)}
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
        data={props.servers}
        pagination
      />
      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={displayModal}
        toggle={() => {
          setDisplayModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setDisplayModal((prev) => !prev);
          }}
        >
          Server Details
        </ModalHeader>
        <ModalBody></ModalBody>
      </Modal>
    </>
  );
};

export default ServerTable;
