import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import axios from "axios";
import VoucherTable from "./VoucherTable";
// import AddUser from "./AddUser";
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";

const Vouchers = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [userPagination, setUserPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  // const FilteredUsers = users.filter((item) => {
  //   const values = Object.values(item);
  //   for (let i = 0; i < values.length; i++) {
  //     const value = values[i];
  //     if (
  //       typeof value === "string" &&
  //       value.toLowerCase().includes(searchValue.toLowerCase())
  //     ) {
  //       return true;
  //     } else if (
  //       typeof value === "number" &&
  //       value.toString().includes(searchValue)
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // });

  useEffect(() => {
    getUser(userPagination);
    // deleteUser();
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
    let url = `/api/deleteuser/${id}`;
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
  // const handleExportData = () => {
  //   let apiData = users.map((user) => {
  //     let newuser = {
  //       "User Name": user.name,
  //       Email: user.email,
  //       Mobile: user.mobile,
  //       Role: user.groups?.length > 0 ? user.groups.join(",") : "",
  //     };

  //     return newuser;
  //   });

  //   const fileType =
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //   const fileExtension = ".xlsx";
  //   const fileName = "UserData";
  //   const ws = XLSX.utils.json_to_sheet(apiData);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, fileName + fileExtension);
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
            // upload_new={true}
            // upload_new_url={"/user-management/upload"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getUser(userPagination, val);
            }}
            export_button={users.length > 0 ? true : false}
            exportData={() => {
              // handleExportData();
            }}
          />
        </Container>
        {/* <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Search..."
        /> */}
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
                      deleteUser={(val) => deleteUser(val)}
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
