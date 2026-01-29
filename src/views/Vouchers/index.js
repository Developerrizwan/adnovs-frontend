import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import VoucherTable from "./VoucherTable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";

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
    setLoading(true);
    apiAuth
      .get(
        `/api/get-voucher/?type=${type}&page=${pgdata?.currentPage}&search=${val}&page_size=${pgdata?.rowsPerPage || 10}`
      )
      .then((response) => {
        let data = response.data;

        // Handle both paginated {count, results} and direct array
        const voucherArray = data.results || data || [];

        setUsers(voucherArray); // Keep users as array like original code

        setPagination({
          ...pgdata,
          totalRows: data.count || voucherArray.length,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching vouchers:", err);
        setLoading(false);
      });
  };

  const deleteUser = (id) => {
    let url = `/api/master/voucher/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
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

  const exportData = () => {
    if (!users?.length) {
      NotificationManager.info("No vouchers to export", "", 3000);
      return;
    }

    const excelRows = [];

    users.forEach((voucher) => {
      const vNo = voucher.voucher_number || "—";
      const vDate = voucher.date ? moment(voucher.date).format("DD-MM-YYYY") : "—";
      const glDate = voucher.gl_date ? moment(voucher.gl_date).format("DD-MM-YYYY") : "—";
      const vType = voucher.voucher_type || "—";
      const branch = voucher.branch || "—";
      const narration = voucher.naration || voucher.remarks || "";
      const job = voucher.job?.job_number || "—";
      const invoice = voucher.invoice?.invoice_number || "—";

      // If no lines → fallback to single row (your old behavior)
      if (!voucher.lines || voucher.lines.length === 0) {
        excelRows.push({
          "Voucher Number": vNo,
          "Date": vDate,
          "G/L Date": glDate,
          "Voucher Type": vType,
          "Branch": branch,
          "Narration": narration,
          "Party A/C": voucher.party_account?.code || "",
          "Account Name": voucher.party_account?.name || "",
          "Debit": Number(voucher.amount_sar || 0).toFixed(2),
          "Credit": Number(voucher.amount_sar || 0).toFixed(2),
          "Job ID": job,
          "Invoice": invoice,
          "Remarks": voucher.remarks || "",
        });
        return;
      }

      // Show both debit and credit sides — one row per line
      voucher.lines.forEach((line) => {
        const acc = line.ac_name_resolved || {};
        const code = acc.type === "coa" ? (acc.code || "") : "";
        const name = acc.name || "—";

        let debit = "";
        let credit = "";

        const amount = Number(line.amount_sar || line.fcy_amount || 0);

        if (line.dr_cr === "Dr") {
          debit = amount.toFixed(2);
        } else if (line.dr_cr === "Cr") {
          credit = amount.toFixed(2);
        }

        excelRows.push({
          "Voucher Number": vNo,
          "Date": vDate,
          "G/L Date": glDate,
          "Voucher Type": vType,
          "Branch": branch,
          "Narration": line.narration || narration,
          "Account Code": code,
          "Account Name": name,
          "Debit": debit,
          "Credit": credit,
          "Job ID": job,
          "Invoice": invoice,
          "Charge": line.charge_name || "",
          "Remarks": line.remarks || voucher.remarks || "",
        });
      });
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = selectedVoucher?.value || "Vouchers";

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
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
          <Colxx lg="12" className="d-flex justify-content-end mb-2">
            <div>
              {users && users.length > 0 ? (
                <>
                  <button
                    className="btn"
                    type="button"
                    style={{
                      background: "#589662",
                      color: "white",
                    }}
                    onClick={exportData}
                  >
                    Excel Download (with Debit/Credit)
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </Colxx>
          <Colxx lg="12">
            <>
              {loading ? (
                <div className="loading"></div>
              ) : (
                <>
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