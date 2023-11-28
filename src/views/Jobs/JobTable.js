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

const getImageSource = (jobType) => {
  switch (jobType) {
    case "Air Freight":
      return "/aeroplane.png";

    case "Sea Freight":
      return "/ship.png";

    case "Land Freight":
      return "/truck.png";

    default:
      return "/truck.png";
  }
};

const JobTable = (props) => {
  // const [displayModal, setDisplayModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletId, setDeletId] = useState();
  const [selectedJob, setSelectedJob] = useState([]);
  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Mode</span>,
      selector: (row) => row.type,
      cell: (value) => {
        const imageSrc = getImageSource(value?.type);

        return (
          <div>
            <img src={imageSrc} height="25px" width="25px" alt={value?.type} />
          </div>
        );
      },
      sortable: true,
      width: "85px",
    },
    {
      name: <span className="font-weight-bold fs-13">Job Number</span>,
      selector: (row) => row.job_number,
      cell: (value) => {
        return (
          <>
            <Link to={`/job/${value?.job_number}`}>
              <div
                title={value.job_number}
                style={{
                  whiteSpace: "nowrap",
                  // overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "250px",
                }}
              >
                {value.job_number}
              </div>
            </Link>
          </>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">BL Number</span>,
      selector: (row) => row.bl_number,
      cell: (value) => {
        return (
          <div
            title={value.bl_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.bl_number}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Consigee Name</span>,
      selector: (row) => row.consignee_name?.name,
      cell: (value) => {
        return (
          <div
            title={value.consignee_name?.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.consignee_name?.name}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Bayan Number</span>,
      selector: (row) => row.bayan_number,
      cell: (value) => {
        return (
          <div
            title={value.bayan_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.bayan_number}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enquiry Number</span>,
      selector: (row) => row.enquiry_number,
      cell: (value) => {
        return (
          <div
            title={value.enquiry_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.enquiry_number}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Shipper Name</span>,
      selector: (row) => row.shipper_name,
      cell: (value) => {
        return (
          <div
            title={value.shipper_name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.shipper_name}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POD</span>,
      selector: (row) => row.pod,
      cell: (value) => {
        return (
          <div
            title={value.pod}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.pod}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Client Name</span>,
      selector: (row) => row.client_name?.name,
      cell: (value) => {
        return (
          <div
            title={value.client_name?.name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.client_name?.name}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">ETA</span>,
      selector: (row) => moment(row.eta).format("DD-MM-YYYY HH:mm:ss"),
      cell: (value) => {
        return (
          <div
            title={moment(value.eta).format("DD-MM-YYYY HH:mm:ss")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "220px",
            }}
          >
            {moment(value.eta).format("DD-MM-YYYY HH:mm:ss")}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">ETD</span>,
      selector: (row) => moment(row.etd).format("DD-MM-YYYY HH:mm:ss"),
      cell: (value) => {
        return (
          <div
            title={moment(value.etd).format("DD-MM-YYYY HH:mm:ss")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {moment(value.etd).format("DD-MM-YYYY HH:mm:ss")}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Organization Type</span>,
      selector: (row) => row.organization_type,
      cell: (value) => {
        return (
          <div
            title={value.organization_type.join(",")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.organization_type.join(",")}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Scope Of Work</span>,
      selector: (row) => row.scope_of_work,
      cell: (value) => {
        return (
          <div
            title={value.scope_of_work}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.scope_of_work}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Place Of Receipt</span>,
      selector: (row) => row.por,
      cell: (value) => {
        return (
          <div
            title={value.por}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.por}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Container</span>,
      selector: (row) => row.container_type,
      cell: (value) => {
        return (
          <div
            title={value.container_type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.container_type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">POA</span>,
      selector: (row) => row.poa,
      cell: (value) => {
        return (
          <div
            title={value.poa}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.poa}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Remarks</span>,
      selector: (row) => row.remarks,
      cell: (value) => {
        return (
          <div
            title={value.remarks}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.remarks}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View Statement</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <div>
            <Link to={`/account-statement/${value.id}`}>
              <Button color="secondary" className="btn btn-sm">
                {" "}
                View
              </Button>
            </Link>
          </div>
        );
      },
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

  console.log("all jobs", props.allJobs);
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
            selectedValue={props.selectedValue}
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
