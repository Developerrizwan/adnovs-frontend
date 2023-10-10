import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import Select from "react-select";
import NotificationManager from "../../components/Common/NotificationManager";

const OrganizationAccountStatement = (props) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedOrganizationLedger, setSelectedOrganizationLedger] = useState({
    label: "ACCOUNTS RECEIVABLE STATEMENT",
    value: "receive",
  });

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Account</span>,
      selector: (row) => row.account,
      cell: (value) => {
        return (
          <div
            title={value.account}
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "250px",
            }}
          >
            {value.account}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => moment(row.date).format("DD-MM-YYYY HH:mm:ss"),
      cell: (value) => {
        return (
          <div
            title={moment(value.date).format("DD-MM-YYYY HH:mm:ss")}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "220px",
            }}
          >
            {moment(value.date).format("DD-MM-YYYY HH:mm:ss")}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return (
          <div
            title={value.currency}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.currency}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Voucher Number</span>,
      selector: (row) => row.voucher_number,
      cell: (value) => {
        return (
          <div
            title={value.voucher_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.voucher_number}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Dr Amount</span>,
    //   selector: (row) => row.dr_amount,
    //   cell: (value) => {
    //     return (
    //       <div
    //         title={value.dr_amount}
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           maxWidth: "200px",
    //         }}
    //       >
    //         {value.dr_amount}
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Cr Amount</span>,
    //   selector: (row) => row.cr_amount,
    //   cell: (value) => {
    //     return (
    //       <div
    //         title={value.cr_amount}
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //           maxWidth: "200px",
    //         }}
    //       >
    //         {value.cr_amount}
    //       </div>
    //     );
    //   },
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Total Amount</span>,
      selector: (row) => row.net_amount,
      cell: (value) => {
        return (
          <div
            title={value.net_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value.net_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Invoice Number</span>,
      selector: (row) => row.invoice_number,
      cell: (value) => {
        return (
          <div
            title={value.invoice_number}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.invoice_number}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Party Account</span>,
      selector: (row) => row.party_account,
      cell: (value) => {
        return (
          <div
            title={value.party_account}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.party_account}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">JOB</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return (
          <div
            title={value.job_no}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.job_no}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Naration</span>,
      selector: (row) => row.narrations,
      cell: (value) => {
        return (
          <div
            title={value.narrations}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.narrations}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Branch</span>,
      selector: (row) => row.branch,
      cell: (value) => {
        return (
          <div
            title={value.branch}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.branch}
          </div>
        );
      },
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Actions</span>,
    //   selector: (row) => row,
    //   cell: (value) => {
    //     return (
    //       <UncontrolledDropdown className="dropdown d-inline-block">
    //         <DropdownToggle
    //           className="btn btn-soft-secondary btn-sm"
    //           tag="button"
    //         >
    //           <i className="ri-more-fill align-middle"></i>
    //         </DropdownToggle>
    //         <DropdownMenu className="dropdown-menu-end">
    //           <DropdownItem
    //             className="edit-item-btn"
    //             // onClick={() => exportProjectToPdf()}
    //           >
    //             <i className="ri-download-2-fill align-bottom me-2 text-muted"></i>
    //             PDF Download
    //           </DropdownItem>
    //           <DropdownItem
    //             className="remove-item-btn"
    //             // onClick={() => exportData()}
    //           >
    //             <i className="ri-file-excel-2-fill align-bottom me-2 text-muted"></i>
    //             Excel Download
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledDropdown>
    //     );
    //   },
    // },
  ]);

  const history = useHistory();
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [selectOrganization, setSelectedOrganization] = useState({});
  console.log("selectOrganization", selectOrganization);
  const LedgerOrganizationOptions = [
    { label: "ACCOUNTS RECEIVABLE STATEMENT", value: "receive" },
    { label: "ACCOUNTS PAYABLE STATEMENT", value: "pay" },
  ];

  const exportProjectToPdf = () => {
    const doc = new jsPDF();
    // const reportObject = reports[0];
    doc.text(selectedOrganizationLedger?.label, 60, 10);
    doc.text(`Account: ${selectOrganization?.label}`, 12, 22);
    doc.text(`Total Amount: ${totalAmount}`, 12, 32);

    const data = reports;
    const allKeys = Array.from(
      new Set(data.flatMap((obj) => Object.keys(obj)))
    );

    const customHeaderTitles = [
      // "Account",
      "Date",
      "Currency",
      "Voucher Number",
      "Total Amount",
      "Invoice Number",
      "Party Account",
      "Job No",
      "Narrations",
      "Branch",
    ];

    const columns = allKeys.map((key, index) => ({
      header: customHeaderTitles[index],
      dataKey: key,
    }));

    doc.autoTable({
      head: [columns.map((column) => column.header)],
      body: data.map((row) => {
        return [
          // row?.account,
          moment(row?.date).format("DD-MM-YYYY"),
          row?.currency,
          row?.Voucher_number,
          Number(row?.net_amount).toFixed(2),
          row?.invoice_number,
          row?.party_account,
          row?.job_no,
          row?.narrations,
          row?.branch,
        ];
      }),
      startY: 36,
      styles: {
        font: "Arial",
        fontSize: 11,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
        7: { cellWidth: 22 },
        8: { cellWidth: 20 },
      },
      margin: { left: 10, right: 10 },
    });

    doc.save("account_statement.pdf");
  };

  const exportData = () => {
    let apiData = reports.map((report) => {
      let dataReport = {
        // Account: report?.account,
        Date: moment(report?.date).format("DD-MM-YYYY"),
        Currency: report?.currency,
        "Voucher Number": Number(report?.voucher_number).toFixed(),
        "Total Amount": Number(report?.net_amount).toFixed(),
        "Invoice Number": report?.invoice_number,
        "Party Account": report?.party_account,
        "Job No": report?.job_no,
        Narrations: report?.narrations,
        Branch: report?.branch,
      };
      return dataReport;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "Account Statement Data";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const getOrganization = (opts) => {
    setLoading(true);
    apiAuth
      .get(`/api/master/organization/`)
      .then((response) => {
        // console.log("dd", response);
        let data = response.data;
        let organizationOpts = data.map((account, index) => {
          return {
            label: account.name,
            value: account.id,
          };
        });
        // const finalOpts = organizationOpts.concat(opts);
        setOrganizationOptions(organizationOpts);
        // setAllOrganization(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const getReport = (id, type, st, et) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/account/statement/?organization=${id}&type=${type}&start_date=${st}&end_date=${et}`
      )
      .then((res) => {
        const { data } = res;
        let total_amount = data.reduce((x, y) => {
          return Number(x) + Number(y.net_amount);
        }, 0);

        setTotalAmount(total_amount);
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    const formattedDate = parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return formattedDate;
  };

  return (
    <React.Fragment>
      <div className={"page-content"}>
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Accounts Statement</h2>

          <button className="btn btn-danger" onClick={() => history.goBack()}>
            Back
          </button>
        </div>

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <div className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  start_time: new Date() || "",
                  end_time: new Date() || "",
                  organizationLedger: selectedOrganizationLedger?.value || "",
                  organization: "",
                }}
                validationSchema={Yup.object({
                  organizationLedger: Yup.string()
                    .ensure()
                    .required("Required"),
                  organization: Yup.string()
                    .ensure()
                    .required("Organization is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const st = changeDateFormat(values.start_time);
                  const et = changeDateFormat(values.end_time);
                  // const id = Number(props.match.params.organizationId);
                  const type = values?.organizationLedger;
                  getReport(values.organization, type, st, et);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="organization" className="form-label">
                            Organization
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="organization"
                            styles={customStyles}
                            value={selectOrganization}
                            options={organizationOptions}
                            onChange={(data) => {
                              setFieldValue("organization", data.value);
                              // setCoaOptions(data);
                              setSelectedOrganization(data);
                            }}
                            placeholder="Select Organization..."
                          />
                          {errors.organization && touched.organization && (
                            <div className="invalid-feedback d-block">
                              {errors.organization}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3" style={{ zIndex: 200 }}>
                          <label
                            htmlFor="organizationLedger"
                            className="form-label"
                          >
                            Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={LedgerOrganizationOptions}
                            value={selectedOrganizationLedger}
                            onChange={(data) => {
                              setFieldValue("organizationLedger", data.value);
                              setSelectedOrganizationLedger(data);
                            }}
                          />
                          <ErrorMessage
                            name="organizationLedger"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="start_time" className="form-label">
                            Start Time
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["start_time"]}
                              onChange={(date) => {
                                setFieldValue("start_time", date);
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="d MMMM yyyy h:mm aa"
                            />
                            <div
                              style={{
                                position: "relative",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="end_time" className="form-label">
                            End Time
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <DatePicker
                              selected={values["end_time"]}
                              onChange={(date) => {
                                setFieldValue("end_time", date);
                              }}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="d MMMM yyyy h:mm aa"
                            />
                            <div
                              style={{
                                position: "relative",
                              }}
                            >
                              <span
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 10,
                                  fill: "red",
                                }}
                              >
                                <img
                                  src="/calendar.svg"
                                  alt="calendar"
                                  width="20px"
                                  height="20px"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>

                    <div style={{ marginTop: "40px" }}>
                      {loading ? (
                        <div
                          className="spinner-border text-success"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <div className="mt-4 mb-3 ">
                          <button className="btn btn-success" type="submit">
                            {"Generate"}
                          </button>{" "}
                          {reports && reports.length > 0 ? (
                            <>
                              <button
                                className="btn"
                                type="button"
                                style={{
                                  background: "#3d78e3",
                                  color: "white",
                                  marginRight: "5px",
                                }}
                                onClick={exportProjectToPdf}
                              >
                                PDF Download
                              </button>
                              <button
                                className="btn"
                                type="button"
                                style={{
                                  background: "#3d78e3",
                                  color: "white",
                                }}
                                onClick={exportData}
                              >
                                Excel Download
                              </button>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          style={{
            marginTop: "5px",
          }}
        >
          {reports?.length > 0 ? (
            <Grid
              itm
              lg="12"
              style={{
                marginLeft: "20px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Total Amount - {totalAmount}
            </Grid>
          ) : (
            <></>
          )}
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            {" "}
            <DataTable
              customStyles={customStyles}
              columns={cols}
              data={reports}
              pagination={true}
            />
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default OrganizationAccountStatement;
