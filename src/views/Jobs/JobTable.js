import moment from "moment";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";
import EditJob from "./EditJob";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import CreateJob from "./CreateJob";
const JobTable = (props) => {
  // const [displayModal, setDisplayModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [jobTypeModal, setJobTypeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletId, setDeletId] = useState();
  const [selectedJob, setSelectedJob] = useState([]);
  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13"> BL Number</span>,
      selector: (row) => row.bl_number,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Consigee Name</span>,
      selector: (row) => row.consignee_name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Bayan Number</span>,
      selector: (row) => row.bayan_number,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipper Name</span>,
      selector: (row) => row.shipper_name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POD</span>,
      selector: (row) => row.pod,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Client Name</span>,
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POA</span>,
      selector: (row) => row.poa,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
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
                  setSelectedJob(value);
                  setJobTypeModal(true);
                }}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                Create Job
              </DropdownItem>

              {/*  */}
              {/*  */}

              <DropdownItem
                className="edit-item-btn"
                onClick={() => {
                  setSelectedJob(value);
                  setEditModal(true);
                }}
              >
                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                Edit
              </DropdownItem>
              <DropdownItem
                className="remove-item-btn"
                // onClick={() => props.deleteJob(value.id)}
                onClick={() => {
                  setDeleteModal(true);
                  setDeletId(value);
                }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ]);
  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={cols}
        data={props.allJobs}
        paginationPerPage={props.userPagination?.rowsPerPage}
        onChangePage={(p, t) => {
          props.handlePagination({
            ...props.userPagination,
            currentPage: p,
          });
        }}
        onChangeRowsPerPage={(c, t) => {
          props.handlePagination({
            ...props.userPagination,
            rowsPerPage: c,
            currentPage: t,
          });
        }}
        paginationServer
        paginationDefaultPage={props.userPagination?.currentPage}
        paginationTotalRows={props.userPagination?.totalRows}
        pagination={true}
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
          Edit Job
        </ModalHeader>
        <ModalBody>
          <EditJob
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedJob(null);
              props.getJobs();
            }}
            allJobs={selectedJob}
            history={props.history}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={jobTypeModal}
        toggle={() => {
          setJobTypeModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setJobTypeModal((prev) => !prev);
          }}
        >
          Create Job
        </ModalHeader>
        <ModalBody>
          <CreateJob
            closeAddPopup={() => {
              setJobTypeModal(false);
              setSelectedJob(null);
              props.getJobs();
            }}
            allJobs={selectedJob}
            history={props.history}
          />
        </ModalBody>
      </Modal>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={deleteModal}
        toggle={() => {
          setDeleteModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setDeleteModal((prev) => !prev);
          }}
        >
          Delete
        </ModalHeader>
        <ModalBody>
          <div>
            <h4>Are you sure you want to delete?</h4>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setDeleteModal((prev) => !prev);
              props.deleteJob(deletId.id);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setDeleteModal((prev) => !prev)}>No</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default JobTable;
