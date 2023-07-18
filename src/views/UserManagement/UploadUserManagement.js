/* eslint-disable no-undef */
import React, { Fragment, useEffect, useState } from "react";
import apiAuth from "../../helpers/ApiAuth";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { ExportToExcel } from "../../common/ExportToExcel";
import { Card, Container, Input, Row } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import DataTable from "react-data-table-component";

const UploadUserManagement = (props) => {
  const [columns, setCoumns] = useState([
    {
      name: <span className="font-weight-bold fs-13"> Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> Password</span>,
      selector: (row) => row.password,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Username</span>,
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Mobile</span>,
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Workshop Code</span>,
      selector: (row) => row.workshop_code,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Contact Center Code</span>,
      selector: (row) => row.contact_center_code,
      sortable: true,
    },
    {
      name: "Error",
      selector: (row) => row.error,
      cell: (value) => (
        <>
          <p className="text-danger">{value?.error}</p>
        </>
      ),
    },
  ]);
  const [state, setState] = useState({
    file: "",
    picfile: null,
    data: null,
    dataSuccess: 0,
    dataUpdate: [],
    dataAdd: [],
    dataFailed: [],
    dataDeleted: [],
    progress: false,
    showData: null,
    failed: false,
    loaded: true,
  });

  const [loading, setLoading] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [contactCode, setContactCode] = useState([]);

  const handleChange = (event) => {
    setState({
      ...state,
      file: URL.createObjectURL(event.target.files[0]),
      picfile: event.target.files[0],
      dataSuccess: 0,
      dataUpdate: 0,
      dataAdd: 0,
      dataFailed: 0,
      dataDeleted: 0,
      showData: null,
      progress: false,
    });
  };
  console.log("state", state);
  const handleFileData = async () => {
    if (state.picfile) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(state.picfile);

      fileReader.onload = async (event) => {
        let data = event.target.result;
        let workbook = XLSX?.read(data, { type: "binary" });
        // console.log(workbook);
        // workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX?.utils.sheet_to_row_object_array(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        const db = new Map();

        const contactdb = new Map();

        await workshops.forEach((emp) => {
          db.set(String(emp.short_code), emp.id);
        });

        await contactCode.forEach((item) => {
          contactdb.set(String(item.code), item.id);
        });

        let empData = rowObject.map((emp) => {
          if (String(emp.role).toLowerCase().includes("workshop")) {
            emp.role = "workshop";
            if (db.has(String(emp.workshop_code))) {
              emp["wid"] = db.get(String(emp.workshop_code));
              emp["cid"] = "";
            } else {
              emp["error"] = "Incorrect Workshop Code.";
              let fds = state.dataFailed ? state.dataFailed : [];
              fds.push(emp);
              setState({
                ...state,
                dataFailed: fds,
                dataSuccess: state.dataSuccess + 1,
              });
            }
          } else if (String(emp.role).toLowerCase().includes("center")) {
            if (String(emp.role).toLowerCase().includes("admin")) {
              emp.role = "contact_center_admin";
            } else {
              emp.role = "contact_center_agent";
            }

            if (contactdb.has(String(emp.contact_center_code))) {
              emp["cid"] = contactdb.get(String(emp.contact_center_code));
              emp["wid"] = "";
            } else {
              emp["error"] = "Incorrect Center Code.";
              let fds = state.dataFailed ? state.dataFailed : [];
              fds.push(emp);
              setState({
                ...state,
                dataFailed: fds,
                dataSuccess: state.dataSuccess + 1,
              });
            }
          }

          return emp;
        });
        setState({ ...state, data: empData, showData: empData });
        // });
      };
    }
  };

  const saveFileData = async () => {
    if (state.data && state.data?.length > 0) {
      setState({ ...state, progress: true });
      await state.data.forEach(async (emp) => {
        if (!emp.error) await addUser(emp);
      });
    }
  };

  const addUser = async (user) => {
    const url = "/api/createuser/";
    const formData = new FormData();
    if (user.name) formData.append("name", user.name);
    if (user.password) formData.append("password", user.password);
    if (user.email) formData.append("email", user.email);
    if (user.username) formData.append("user_name", user.username);
    if (user.mobile) formData.append("mobile", user.mobile);
    if (user.role) formData.append("role", user.role);
    if (user.wid) formData.append("workshop_id", user.wid);
    if (user.cid) formData.append("contact_center_id", user.cid);
    formData.append("company", "66548c7c-6cd2-4bdc-bace-ac1c0128327c");

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    await apiAuth
      .post(url, formData, config)
      .then((response) => {
        // console.log(response);
        // console.log("response", response.data);
        if (response.status === 200) {
          let ads = state.dataAdd ? state.dataAdd : [];
          ads.push(user);
          setState({
            ...state,
            dataAdd: ads,
            dataSuccess: state.dataSuccess + 1,
          });
          console.log("data", state);
        } else {
          let fds = state.dataFailed ? state.dataFailed : [];
          fds.push(user);
          setState({
            ...state,
            dataFailed: fds,
            dataSuccess: state.dataSuccess + 1,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        let err = "";
        if (error.response?.data) {
          Object.keys(error.response?.data).forEach((key) => {
            err =
              err +
              " \n" +
              key.toUpperCase().replace("_", " ") +
              ": " +
              error.response?.data[key];
          });
        }
        user["error"] = err;
        let fds = state.dataFailed ? state.dataFailed : [];
        fds.push(user);
        setState({
          ...state,
          dataFailed: fds,
          dataSuccess: state.dataSuccess + 1,
        });
      });
  };

  const downloadFileData = () => {
    let apiData = [
      {
        name: "demoworkshop",
        email: "demoworkshop@demo.com",
        username: "demoworkshop",
        password: "demoworkshop@123",
        mobile: "9876543210",
        role: "workshop",
        workshop_code: "Wcode",
        contact_center_code: "",
      },
      {
        name: "democenteradmin",
        email: "democenteradmin@demo.com",
        username: "democenteradmin",
        password: "democenteradmin@123",
        mobile: "9876543210",
        role: "conatct_center_admin",
        workshop_code: "",
        contact_center_code: "Ccode",
      },
      {
        name: "democenteragent",
        email: "democenteragent@demo.com",
        username: "democenteragent",
        password: "democenteragent@123",
        mobile: "9876543210",
        role: "conatct_center_agent",
        workshop_code: "",
        contact_center_code: "Ccode",
      },
    ];

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "UsermanagementUploadTemplate";
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  useEffect(() => {
    getworkshops();
    getContactCenter();
  }, []);

  const getworkshops = () => {
    apiAuth
      .get("/api/workshop/")
      .then((response) => {
        let data = response.data.filter(
          (ws) =>
            String(ws.company) ===
            String("66548c7c-6cd2-4bdc-bace-ac1c0128327c")
        );
        setWorkshops(data);
        // setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getContactCenter = () => {
    setLoading(true);
    apiAuth
      .get("/api/contact_center/")
      .then((response) => {
        let data = response.data.filter(
          (ws) =>
            String(ws.company) ===
            String("66548c7c-6cd2-4bdc-bace-ac1c0128327c")
        );
        setContactCode(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title=""
            pageTitle="Settings"
            back_button={true}
            history={props.history}
          />
        </Container>
        {/* {state.loaded && loading ? ( */}
        <Row className="m-1">
          <Colxx sm="12">
            <Row mb="4">
              <Colxx lg="9">
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="card-subtitle">
                      <div className="input-group">
                        <div className="my-1">
                          <Input
                            className="form-control"
                            type="file"
                            id="formFile"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group-prepend mx-1 my-1">
                          <span
                            className="btn btn-primary"
                            onClick={() => {
                              handleFileData();
                            }}
                          >
                            Show
                          </span>
                        </div>
                        <div className="input-group-prepend mx-1 my-1">
                          <span
                            className="btn btn-primary"
                            onClick={() => {
                              saveFileData();
                            }}
                          >
                            Save
                          </span>
                        </div>
                        <div className="input-group-prepend mx-1 my-1">
                          <span
                            className="btn btn-primary"
                            onClick={() => {
                              downloadFileData();
                            }}
                          >
                            Download Template File
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Colxx>
            </Row>
            {state.dataSuccess === state.data?.length || state.error ? (
              <Row className="mt-4">
                <Colxx md="3">
                  <Card className="d-flex flex-column text-center rounded-lg pb-0">
                    <p
                      className="mt-1 font-weight-bold text-danger cursor-pointer"
                      onClick={() =>
                        setState({
                          ...state,
                          failed: true,
                          showData: state.dataFailed,
                        })
                      }
                    >
                      Failed
                    </p>
                    <p className="font-weight-bold h4 text-danger">
                      {state.dataFailed?.length || 0}
                    </p>
                  </Card>
                </Colxx>
                <Colxx md="3">
                  <Card className="d-flex flex-column text-center rounded-lg pb-0">
                    <p
                      className="mt-1 font-weight-bold text-success cursor-pointer"
                      onClick={() =>
                        setState({
                          ...state,
                          failed: false,
                          showData: state.dataAdd,
                        })
                      }
                    >
                      Added
                    </p>
                    <p className="font-weight-bold h4 text-success">
                      {state.dataAdd?.length || 0}
                    </p>
                  </Card>
                </Colxx>
                <Colxx md="3">
                  <Card className="d-flex flex-column text-center rounded-lg pb-0">
                    <p
                      className="mt-1 font-weight-bold cursor-pointer"
                      onClick={() =>
                        setState({
                          ...state,
                          failed: false,
                          showData: state.data,
                        })
                      }
                    >
                      Total
                    </p>
                    <p className="font-weight-bold h4">
                      {state.data?.length || 0}
                    </p>
                  </Card>
                </Colxx>
              </Row>
            ) : (
              <></>
            )}
            {state?.showData && state.showData?.length > 0 ? (
              <>
                <Row className="d-flex justify-content-end mt-4 mr-2">
                  <Colxx sm={1}>
                    <ExportToExcel
                      apiData={state.showData.map((report) => {
                        const {
                          name,
                          email,
                          mobile,
                          user_name,
                          password,
                          role,
                          workshop_code,
                          contact_center_code,
                        } = report;

                        let returnObj = {
                          name: name,
                          email: email,
                          mobile: mobile,
                          password: password,
                          user_name: user_name,
                          role: role,
                          workshop_code: workshop_code,
                          contact_center_code: contact_center_code,
                        };

                        if (state?.failed) {
                          returnObj["Error"] = error;
                        }
                        return returnObj;
                      })}
                      fileName={"UsersUploadData"}
                    />
                  </Colxx>
                </Row>
                <Row>
                  <Card className="mt-2">
                    <DataTable
                      columns={state?.failed ? columns : columns.slice(0, -1)}
                      data={state?.showData}
                      pagination={state?.showData?.length > 10 ? true : false}
                    />
                  </Card>
                </Row>
              </>
            ) : (
              <></>
            )}
          </Colxx>
        </Row>
      </div>
    </Fragment>
  );
};

export default UploadUserManagement;
