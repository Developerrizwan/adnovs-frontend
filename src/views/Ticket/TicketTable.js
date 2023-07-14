import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import EditTicket from "./EditTicket";
import { customStyles } from "../../assets/CustomTableStyles";

const TicketTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // const customStyles = {
  //   headRow: {
  //     style: {
  //       color:'#fff',
  //       backgroundColor: '#1062fe'
  //     },
  //   },
  //   rows: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9"
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  // }

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={[
          {
            name: (
              <span
                className="font-weight-bold fs-18"
                style={{ fontSize: "18px", fontWeight: 700 }}
              >
                Title
              </span>
            ),
            selector: (row) => row.title,
            sortable: true,
          },
          {
            name: (
              <span
                className="font-weight-bold fs-18"
                style={{ fontSize: "18px", fontWeight: 700 }}
              >
                Comment
              </span>
            ),
            selector: (row) => row.description,
            sortable: true,
          },
          // {
          //   name: <span className="font-weight-bold fs-18"  style={{fontSize: "18px", fontWeight: 700}}>Project</span>,
          //   selector: (row) => row.project,
          //   sortable: true,
          // },
          // {
          //   name: <span className="font-weight-bold fs-18">Mobile</span>,
          //   selector: (row) => row.mobile,
          //   sortable: true,
          // },
          // {
          //   name: <span className="font-weight-bold fs-18">Company</span>,
          //   selector: (row) => row.company_name,
          //   sortable: true,
          // },
          // {
          //   name: <span className="font-weight-bold fs-18">Groups</span>,
          //   selector: (row) => row.itgps_name,
          //   sortable: true,
          // },
          {
            name: (
              <span
                className="font-weight-bold fs-18"
                style={{ fontSize: "18px", fontWeight: 700 }}
              >
                Action
              </span>
            ),
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
                        setSelectedTicket(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteTicket(value.id)}
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
        data={props.tickets}
        pagination={props.tickets.length > 10 ? true : false}
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
          Edit Ticket
        </ModalHeader>
        <ModalBody>
          <EditTicket
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedTicket(null);
              props.getTickets();
            }}
            ticketData={selectedTicket}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default TicketTable;
