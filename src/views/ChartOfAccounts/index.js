import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import CaoTable from "./CaoTable";

// ─── Only these two lines are newly added ────────────────────────────────
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ChartOfAccounts = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = () => {
    apiAuth
      .get(`/api/get-coa/`)
      .then((response) => {
        let data = response.data;
        // console.log("xswjhjwx", response);
        // setPagination({
        //   ...pgdata,
        //   totalRows: data.length,
        // });
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteAccount = (id) => {
    let url = `/api/master/coa/${id}/`;
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
        getAccounts();
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  // ─── Only this function is newly added ───────────────────────────────────
  const exportToExcel = () => {
    if (accounts.length === 0) return;

    const dataForExcel = accounts.map((acc) => ({
      Code: acc.code || "",
      Name: acc.name || "",
      "Language Name": acc.language_name || "",
      Type: acc.type || "",
      "Dr/Cr": acc.dr_cr || "",
      Group: acc.group?.name || acc.group || "",
      Subgroup: acc.subgroup?.name || acc.subgroup || "",
      Category: acc.category || "",
      "COA Type": acc.coa_type || "",
      "Direct/Indirect": acc.is_direct_indirect || "",
      "Subledger Req": acc.subledger_requried ? "Yes" : "No",
      "Charge Req": acc.charge_required ? "Yes" : "No",
      "Job Req": acc.job_required ? "Yes" : "No",
      "Asset Req": acc.asset_required ? "Yes" : "No",
      Currency: acc.currency || "",
      "Short Name": acc.short_name || "",
      Remarks: acc.remarks || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, "Chart_of_Accounts.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Chart of Accounts"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/coa/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
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
                  <Card>
                    {/* ─── Only this small block is newly added ──────── */}
                    {accounts.length > 0 && (
                      <div className="p-3 d-flex justify-content-end">
                        <button
                          className="btn"
                          style={{
                            background: "#589662",
                            color: "white",
                          }}
                          onClick={exportToExcel}
                        >
                          Excel Download
                        </button>
                      </div>
                    )}

                    <CaoTable
                      accounts={accounts.filter(
                        (item) =>
                          String(item.name)
                            ?.toLowerCase()
                            .includes(String(searchValue)?.toLowerCase()) ||
                          String(item.code)
                            ?.toLowerCase()
                            .includes(String(searchValue)?.toLowerCase())
                      )}
                      deleteAccount={(id) => deleteAccount(id)}
                      handlePagination={(data) => {
                        setPagination(data);
                        getAccounts();
                      }}
                      getAccounts={() => {
                        getAccounts();
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

export default ChartOfAccounts;
