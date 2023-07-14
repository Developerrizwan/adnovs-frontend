import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { customStyles } from "../../assets/CustomTableStyles";
import EditCoupon from "./EditCoupon";

const CouponManagementTable = (props) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // const customStyles = {
  //   headRow: {
  //     style: {
  //       color: "#fff",
  //       backgroundColor: "#1062fe",
  //     },
  //   },
  //   rows: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  // };

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={[
          {
            name: <span className="font-weight-bold fs-18">Name</span>,
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Code</span>,
            selector: (row) => row.code,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Status</span>,
            selector: (row) => row.status,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Action</span>,
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
                        setSelectedCoupon(value);
                        setEditModal(true);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="remove-item-btn"
                      onClick={() => props.deleteCoupon(value.id)}
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
        data={props.couponManagement}
        pagination={props.couponManagement.length > 10 ? true : false}
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
          Edit Coupon
        </ModalHeader>
        <ModalBody>
          <EditCoupon
            closeAddPopup={() => {
              setEditModal(false);
              setSelectedCoupon(null);
              props.getCoupon();
            }}
            couponData={selectedCoupon}
            history={props.history}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default CouponManagementTable;
