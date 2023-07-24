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
  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "All",
    label: "All",
  });
  const [voucherPagination, setVoucherPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const voucherOptions = [
    { value: "All", label: "All" },
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit", label: "Debit" },
    { value: "Credit", label: "Credit" },
  ];

  useEffect(() => {
    if (selectedVoucher.value === "All") getVouchers(voucherPagination);
    else {
      getSelVoucherData(selectedVoucher.value);
    }
  }, [selectedVoucher.value]);

  // useEffect(() => {
  //   getSelVoucherData();
  // }, []);

  const getSelVoucherData = (type) => {
    apiAuth
      .get(`/api/get-voucher/?type=${type}`)
      .then((response) => {
        let data = response.data;
        console.log("xswjhjwx", response);
        setVoucherPagination({
          ...data,
          totalRows: data.count,
        });
        setUsers(data.results);
        // setLoading(false);
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const getVouchers = (pgdata, val, type) => {
    apiAuth
      .get(
        "/api/master/voucher/?" +
          "&type=" +
          type +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "")
      )
      .then((response) => {
        let data = response.data;
        console.log("xswjhjwx", response);
        setVoucherPagination({
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
    let url = `/api/master/voucher/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "Voucher Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getVouchers(voucherPagination);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  // const handleVoucherChange = (e) => {
  //   setSelectedValue(e.value);
  //   getVouchers(voucherPagination, searchValue, e.value);
  // };

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
              getVouchers(voucherPagination, val);
            }}
            add_vouchers={true}
            add_voucher_select={true}
            selectedValue={selectedVoucher}
            voucherOptions={voucherOptions}
            handleVoucherChange={(data) => {
              console.log("ddddddd", data);
              setSelectedVoucher(data);
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
                    <VoucherTable
                      users={users}
                      deleteUser={deleteUser}
                      voucherPagination={{ ...voucherPagination }}
                      handlePagination={(data) => {
                        setVoucherPagination(data);
                        getVouchers(data);
                      }}
                      getVouchers={() => {
                        setUsers([]);
                        getVouchers(
                          voucherPagination,
                          searchValue,
                          selectedVoucher
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

export default Vouchers;
