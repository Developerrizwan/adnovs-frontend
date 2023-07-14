import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
// import AddUser from "./AddUser";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import CouponManagementTable from "./CouponManagementTable";
// import Data from "./CouponManagementData";
import AddCoupon from "./AddCoupon";

const CouponManagement = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [couponManagement, setCouponManagement] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCoupon();
  }, []);

  const getCoupon = () => {
    // setLoading(true);
    apiAuth
      .get("/api/coupon")
      .then((response) => {
        let data = response.data.map((user) => {
          user.groups_name =
            user.groups?.length > 0 ? user.groups.join(",") : "";
          user.company_name =
            user.company?.length > 0 ? user.company.join(",") : "";
          user.itgps_name =
            user.iotgroups_name?.length > 0
              ? user.iotgroups_name.join(",")
              : "";
          return user;
        });
        setCouponManagement(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCoupon = (id) => {
    let url = `/api/coupon/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Coupon Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getCoupon();
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
            title="Coupon Management"
            pageTitle="Settings"
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/couponmanagement/add"}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {couponManagement.length > 0 ? (
              <>
                <Card style={{boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)"}}>
                  <CouponManagementTable
                    couponManagement={couponManagement}
                    deleteCoupon={deleteCoupon}
                    history={props.history}
                    getCoupon={() => getCoupon()}
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
          Add Coupon
        </ModalHeader>
        <ModalBody>
          <AddCoupon
            closeAddPopup={() => {
              setCreateModal((prev) => !prev);
              getCoupon();
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CouponManagement;
