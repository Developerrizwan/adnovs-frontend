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
  const [url, setUrl] = useState("/journal-voucher");
  const [searchValue, setSearchValue] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState();
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const voucherOptions = [
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "DebitNote", label: "Debit Note" },
    { value: "CreditNote", label: "Credit Note" },
  ];

  useEffect(() => {
    const fetchVoucherData = async () => {
      if (localStorage.getItem("voucher-type")) {
        const voucher = localStorage.getItem("voucher-type");
        setSelectedVoucher({
          label: voucher,
          value: voucher,
        });
      } else {
        localStorage.setItem("voucher-type", "Journal");
        setSelectedVoucher({ label: "Journal", value: "Journal" });
      }
    };

    fetchVoucherData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (selectedVoucher) {
        getSelVoucherData(pagination, searchValue, selectedVoucher?.value);
      }
    }, 1000);
  }, [selectedVoucher]);

  const getSelVoucherData = (pgdata, val, type) => {
    apiAuth
      .get(
        `/api/get-voucher/?type=${type}&page=${pgdata?.currentPage}&search=${val}`
      )
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
        getSelVoucherData(pagination, searchValue, selectedVoucher.value);
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
            title="Vouchers"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={`/voucher/${selectedVoucher?.value}`}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getSelVoucherData(pagination, val, selectedVoucher.value);
            }}
            add_type={true}
            add_type_select={true}
            selectedValue={selectedVoucher}
            options={voucherOptions}
            handleTypeChange={(data) => {
              setSelectedVoucher(data);
              localStorage.setItem("voucher-type", data.value);
              getSelVoucherData(pagination, searchValue, data.value);
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
                      curVoucher={selectedVoucher?.value}
                      users={users}
                      deleteUser={deleteUser}
                      pagination={{ ...pagination }}
                      handlePagination={(data) => {
                        setPagination(data);
                        getSelVoucherData(
                          data,
                          searchValue,
                          selectedVoucher.value
                        );
                      }}
                      getVouchers={() => {
                        getSelVoucherData(
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

export default Vouchers;
