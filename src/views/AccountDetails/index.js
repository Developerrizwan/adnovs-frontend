import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import AccountDetailsTable from "./AccountDetailsTable";

const AccountDetails = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("/journal-voucher");
  const [searchValue, setSearchValue] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "Journal",
    label: "Journal",
  });
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit Note", label: "Debit Note" },
    { value: "Credit Note", label: "Credit Note" },
  ];

  const voucherMap = {
    Journal: "",
    Payment: "payment-voucher",
    Receipt: "receipt-voucher",
    "Credit Note": "",
    "Debit Note": "",
  };

  useEffect(() => {
    getAccountData(pagination, searchValue, selectedVoucher.value);
    if (!localStorage.getItem("voucher-type")) {
      localStorage.setItem("voucher-type", selectedVoucher.value);
    }
  }, []);

  const getAccountData = (pgdata, val, type) => {
    apiAuth
      .get(`/api/master/accountdetails/`)
      .then((response) => {
        let data = response.data;
        console.log("xswjhjwx", response);
        setPagination({
          ...pgdata,
          totalRows: data.count,
        });
        setUsers(data.results);
        setLoading(false);
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const deleteAccount = (id) => {
    let url = `/api/master/accountdetails/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "Account Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getAccountData(pagination, searchValue, selectedVoucher.value);
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
            title="Account Details"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={`/account_detail`}
            // search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getAccountData(pagination, val, selectedVoucher.value);
            }}
            add_type={true}
            // add_type_select={true}
            selectedValue={selectedVoucher}
            options={voucherOptions}
            handleTypeChange={(data) => {
              setSelectedVoucher(data);
              // localStorage.setItem("voucher-type", data.value);
              getAccountData(pagination, searchValue, data.value);
            }}
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
                    <AccountDetailsTable
                      curVoucher={selectedVoucher?.value}
                      users={users}
                      deleteAccount={deleteAccount}
                      pagination={{ ...pagination }}
                      handlePagination={(data) => {
                        setPagination(data);
                        getAccountData(
                          data,
                          searchValue,
                          selectedVoucher.value
                        );
                      }}
                      getVouchers={() => {
                        getAccountData(
                          pagination,
                          searchValue,
                          selectedVoucher.value
                        );
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
              //   getVouchers();
            }}
          /> */}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default AccountDetails;
