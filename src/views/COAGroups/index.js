import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import CaoGroupTable from "./CaoGroupTable";
import { CheckLg } from "react-bootstrap-icons";
import useDebounce from "../../components/Hooks/UseDebounce";

const COAGroup = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const debouncedSearch = useDebounce(searchValue, 1500);

  useEffect(() => {
    getAccounts(pagination, searchValue);
  }, [debouncedSearch]);

  const getAccounts = (pgdata, val) => {
    apiAuth
      .get(
        `/api/master/coagroup?page=${pgdata?.currentPage}&search=${searchValue}`
      )
      .then((response) => {
        let data = response?.data?.results;
        const totalRows = response?.data?.count;
        setPagination({
          ...pgdata,
          totalRows: totalRows,
        });
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteAccount = (id) => {
    let url = `/api/master/coagroup/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "Group Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getAccounts(pagination, searchValue);
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
            title="COA Groups"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/coag/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              // getAccounts(pagination, val);
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
                    <CaoGroupTable
                      pagination={pagination}
                      accounts={accounts}
                      deleteAccount={(id) => deleteAccount(id)}
                      handlePagination={(data) => {
                        setPagination(data);
                        getAccounts(data, searchValue);
                      }}
                      getAccounts={() => {
                        getAccounts(pagination, searchValue);
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

export default COAGroup;
