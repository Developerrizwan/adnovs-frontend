import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import VoucherTable from "./VoucherTable";

const Vouchers = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [userPagination, setUserPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit", label: "Debit" },
    { value: "Credit", label: "Credit" },
  ];

  useEffect(() => {
    getUser(userPagination);
  }, []);

  const getUser = (pgdata, val) => {
    apiAuth
      .get(
        "/api/master/voucher/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "")
      )
      .then((response) => {
        let data = response.data;
        console.log("xswjhjwx", response);
        setUserPagination({
          ...pgdata,
          totalRows: data.length,
        });
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
    let url = `/api/master/voucher/${id}`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "User Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getUser(userPagination);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  const handleVoucherChange = (e) => {
    setSelectedValue(e.value);
    getUser(e.value);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Vouchers"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/journal-voucher"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getUser(userPagination, val);
            }}
            add_vouchers={true}
            add_voucher_select={true}
            voucherOptions={voucherOptions}
            handleVoucherChange={handleVoucherChange}
          />
        </Container>
        <Row>
          <Colxx lg="12">
            <>
              {loading ? (
                <div className="loading"></div>
              ) : (
                <>
                  {" "}
                  <Card>
                    <VoucherTable
                      users={users}
                      deleteUser={deleteUser}
                      userPagination={{ ...userPagination }}
                      handlePagination={(data) => {
                        setUserPagination(data);
                        getUser(data);
                      }}
                      getUser={() => {
                        setUsers([]);
                        getUser(userPagination, searchValue);
                      }}
                    />
                  </Card>
                </>
              )}
            </>
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
          Add User
        </ModalHeader>
        <ModalBody>
          {/* <AddUser
            closeAddPopup={() => {
              setCreateModal(false);
              //   getUser();
            }}
          /> */}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Vouchers;
