import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
// import AddUser from "./AddUser";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import AdminTable from "./AdminTable";
import Data from "./AdminData";
// import AddCoupon from "./AddCoupon";

const Admin = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [iotGroups, setIotGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getIotGroups();
    // getCompanies();
    // getGroups();
    // getUsers();
    setAdminData(Data);
  }, []);

  const getCompanies = () => {
    apiAuth
      .get("/api/company/")
      .then((response) => {
        let data = response.data;
        setCompanies(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getIotGroups = () => {
    apiAuth
      .get("/api/iotgroups/")
      .then((response) => {
        let data = response.data;
        setIotGroups(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGroups = () => {
    apiAuth
      .get("/api/admin/groups/")
      .then((response) => {
        let data = response.data;
        setGroups(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsers = () => {
    // setLoading(true);
    apiAuth
      .get("/api/admin/users/")
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
        setAdminData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
    let url = `/api/admin/users/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "User Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getUsers();
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
            title="Admin"
            pageTitle="Settings"
            history={props.history}
            // back_button={true}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {adminData.length > 0 ? (
              <>
                <Card  style={{boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)"}}>
                  <AdminTable
                    adminData={adminData}
                    // deleteUser={deleteUser}
                    // companies={companies}
                    // iotGroups={iotGroups}
                    // groups={groups}
                    // getUsers={getUsers}
                    history={props.history}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>

      {/* <Modal
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
          // closeAddPopup={() => {
          //   setCreateModal(false);
          //   getUsers();
          // }}
          // companies={companies}
          // iotGroups={iotGroups}
          // groups={groups}
          />
        </ModalBody>
      </Modal> */}
    </React.Fragment>
  );
};

export default Admin;
