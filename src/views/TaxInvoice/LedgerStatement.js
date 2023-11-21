import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import Select from "react-select";

const ProfitAndLoss = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [coaOptions, setCoaOptions] = useState([]);
  const [selectCoa, setSelectedCoa] = useState({});
  const [params, setParams] = useState(null);
  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Account</span>,
      selector: (row) => row.account,
      cell: (value) => {
        return (
          <div
            title={value.account}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
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
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row) => row?.type,
      cell: (value) => {
        return (
          <div
            title={value?.type}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.type}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Voucher</span>,
      selector: (row) => row?.voucher,
      cell: (value) => {
        return (
          <div
            title={value?.voucher}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.voucher}
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
      name: <span className="font-weight-bold fs-13">Tax Code</span>,
      selector: (row) => row?.vat_percent,
      cell: (value) => {
        return (
          <div
            title={value?.vat_percent}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value?.vat_percent).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fcy Amount</span>,
      selector: (row) => row?.fcy_amount,
      cell: (value) => {
        return (
          <div
            title={value?.fcy_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value?.fcy_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Vat Amount</span>,
      selector: (row) => row?.vat_amount,
      cell: (value) => {
        return (
          <div
            title={value?.vat_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value?.vat_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row?.amount,
      cell: (value) => {
        return (
          <div
            title={value?.amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value?.amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr Amount</span>,
      selector: (row) => row.dr_amount,
      cell: (value) => {
        return (
          <div
            title={value?.dr_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value.dr_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Cr Amount</span>,
      selector: (row) => row.cr_amount,
      cell: (value) => {
        return (
          <div
            title={value.cr_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value.cr_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Net Amount</span>,
      selector: (row) => row?.net_amount,
      cell: (value) => {
        return (
          <div
            title={value?.net_amount}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {Number(value?.net_amount).toFixed(2)}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Party Account</span>,
      selector: (row) => row?.party_account,
      cell: (value) => {
        return (
          <div
            title={value?.party_account}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.party_account}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">JOB</span>,
      selector: (row) => row?.job_no,
      cell: (value) => {
        return (
          <div
            title={value?.job_no}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.job_no}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Narrations</span>,
      selector: (row) => row?.narrations,
      cell: (value) => {
        return (
          <div
            title={value?.narrations}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value?.narrations}
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
    {
      name: <span className="font-weight-bold fs-13">Language Name</span>,
      selector: (row) => row.language_name,
      cell: (value) => {
        return (
          <div
            title={value.language_name}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {value.language_name}
          </div>
        );
      },
      sortable: true,
    },
  ]);

  const exportProjectToPdf = () => {
    const doc = new jsPDF();

    doc.text("General Ledger Statement", 70, 10);

    const data = reports;
    const allKeys = Array.from(
      new Set(data.flatMap((obj) => Object.keys(obj)))
    );

    const customHeaderTitles = [
      "Account",
      "Date",
      // "Type",
      "Voucher",
      "Invoice Number",
      // "Currency",
      "Tax Code",
      "Fcy Amount",
      "Vat Amount",
      "Amount",
      "Dr Amount",
      "Cr Amount",
      // "Net Amount",
      "Party Account",
      "Job No",
      // "Narrations",
      // "Branch",
      // "Language Name",
    ];
    const columns = allKeys.map((key, index) => ({
      header: customHeaderTitles[index],
      dataKey: key,
    }));
    doc.autoTable({
      head: [columns.map((column) => column.header)],
      body: data.map((row) => {
        return [
          row?.account,
          moment(row?.date).format("DD-MM-YYYY"),
          // row?.type,
          row?.voucher,
          row?.invoice_number,
          // row?.currency,
          row?.vat_percent,
          row?.fcy_amount,
          Number(row?.vat_amount).toFixed(2),
          Number(row?.amount).toFixed(2),
          Number(row?.dr_amount).toFixed(2),
          Number(row?.cr_amount).toFixed(2),
          // Number(row?.net_amount).toFixed(2),
          row?.party_account,
          row?.job_no,
          // row?.narrations,
          // row?.branch,
          // row?.language_name,
        ];
      }),
      // startY: 25,
      // styles: {
      //   font: "Arial",
      //   fontSize: 11,
      // },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 15 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 15 },
        10: { cellWidth: 18 },
        11: { cellWidth: 15 },
      },
      // margin: { left: 10, right: 10 },
    });
    doc.save("ledger_statement.pdf");
  };

  const exportData = () => {
    let apiData = reports.map((report) => {
      let dataReport = {
        Account: report?.account,
        Date: moment(report?.date).format("DD-MM-YYYY"),
        Type: report?.type,
        Voucher: report?.voucher,
        "Invoice Numer": report?.invoice_number,
        Currency: report?.currency,
        "Tax Code": report?.vat_percent,
        "Fcy Amount": Number(report?.fcy_amount).toFixed(),
        "Vat Amount": Number(report?.vat_amount).toFixed(),
        Amount: Number(report?.amount).toFixed(),
        "Dr Amount": Number(report?.dr_amount).toFixed(),
        "Cr Amount": Number(report?.cr_amount).toFixed(),
        "Net Amount": Number(report?.net_amount).toFixed(),
        "Party Account": report?.party_account,
        "Job No": report?.job_no,
        Narrations: report?.narrations,
        Branch: report?.branch,
        // "Language Name": report?.language_name,
      };
      return dataReport;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "Ledger Statement Data";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const getReport = (id, st, et) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/general/ledger/?coa=${
          id ? id : ""
        }&start_date=${st}&end_date=${et}`
      )
      .then((res) => {
        const { data } = res;
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const changeDateFormat = (time) => {
    const parsedDate = moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT] ZZ (z)");
    const formattedDate = parsedDate.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return formattedDate;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const coa = searchParams.get("coa") || null;
    const st = searchParams.get("st");
    const et = searchParams.get("et");
    const dd = {
      coa: coa,
      st: st,
      et: et,
    };
    setParams(dd);
    getAccounts(coa);

    setTimeout(() => {
      if (coa) {
        getReport(coa, st, et);
      }
    }, 500);
  }, []);

  const getAccounts = (coa = null) => {
    apiAuth
      .get(`/api/master/coa/`)
      .then((response) => {
        let data = response.data;
        let CoaOpts = data.map((account, index) => {
          return {
            label: `${account.code}-${account.name} `,
            value: account.id,
          };
        });
        if (coa) {
          const sel = CoaOpts.find((dd) => dd?.value === Number(coa));
          setSelectedCoa(sel);
        }
        setCoaOptions(CoaOpts);
        // setAccounts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className={"page-content"}>
        <div
          className="mb-5 mt-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-3">Ledger Statement</h2>

          <button className="btn btn-danger" onClick={() => history.goBack()}>
            Back
          </button>
        </div>

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <div className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                enableReinitialize={params?.coa !== null ? true : false}
                initialValues={{
                  start_time: params?.st ? new Date(params?.st) : new Date(),
                  end_time: params?.et ? new Date(params?.et) : new Date(),
                  coa_type: params?.coa || "",
                }}
                validationSchema={Yup.object({
                  coa_type: Yup.string().ensure().required("COA is Required"),
                })}
                onSubmit={(values, { reset }) => {
                  const st = changeDateFormat(values.start_time);
                  const et = changeDateFormat(values.end_time);
                  // let coa = Number(props.match.params.coaId);
                  getReport(values.coa_type, st, et);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="coa_type" className="form-label">
                            COA
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="coa_type"
                            styles={customStyles}
                            value={selectCoa}
                            options={coaOptions}
                            onChange={(data) => {
                              setFieldValue("coa_type", data.value);
                              // setCoaOptions(data);
                              setSelectedCoa(data);
                            }}
                            placeholder="Select Coa..."
                          />
                          {errors.coa_type && touched.coa_type && (
                            <div className="invalid-feedback d-block">
                              {errors.coa_type}
                            </div>
                          )}
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
                                // cursor: "pointer",
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
                                {/* <i className="bi bi-calendar4-week"></i> */}
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
                                // cursor: "pointer",
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
                                {/* <i className="bi bi-calendar4-week"></i> */}
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
                        <div className="d-flex">
                          <div>
                            <button className="btn btn-success" type="submit">
                              {"Generate"}
                            </button>
                          </div>
                          <div>
                            {reports && reports.length > 0 ? (
                              <>
                                <button
                                  className="btn"
                                  type="button"
                                  style={{
                                    background: "#3d78e3",
                                    color: "white",
                                    margin: "0px 5px",
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

export default ProfitAndLoss;
