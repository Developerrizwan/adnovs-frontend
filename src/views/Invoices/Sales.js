import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label, Modal, ModalHeader, ModalBody } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Card, Grid } from "@mui/material";
import Select from "react-select";
import moment from "moment";
import DatePicker from "react-datepicker";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import GenerateInvoice from "./GenerateInvoice";

const Sales = (props) => {
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [is_password_hidden, set_is_password_hidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const [generateInvoiceModal, setGenerateInvoiceModal] = useState(false);

  const [invoiceType, setInvoiceType] = useState({
    label: "Sales",
    value: "Sales",
  });

  const [branchValue, setBranchValue] = useState("JEDDHA");

  const branchOptions = [{ label: "JEDDHA", value: "JEDDHA" }];

  const invoiceTypes = [
    {
      label: "Sales",
      value: "Sales",
    },
    {
      label: "Purchase",
      value: "Purchase",
    },
  ];

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  useEffect(() => {
    getJobs();
    if (props?.isEdit) {
      const selType = invoiceTypes.find(
        (opt) => opt?.value === props.data?.invoice_type
      );
      setInvoiceType(selType);

      const selJob = jobOptions.find((opt) => opt?.value === props.data?.job);
      setSelectedJob(selJob);
    }
  }, []);

  const getJobs = () => {
    apiAuth
      .get("/api/master/job/")
      .then((res) => {
        const { data } = res;
        let opts = data.map((dd) => {
          return {
            label: `${dd?.bl_number} - ${dd?.consignee_name}`,
            value: dd?.id,
          };
        });

        setJobOptions(opts);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-5 mt-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Sales Invoice</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}
        <Grid container spacing={2}>
          <Grid item lg={11} style={{ margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  bl_number: props.isEdit ? props.data?.bl_number : "",
                  consignee_name: props.isEdit
                    ? props.data?.consignee_name
                    : "",
                  date: props.isEdit ? props.data?.date : "",
                  currency_sar: props.isEdit ? props.data?.currency_sar : "",
                  bayan_Number: props.isEdit ? props.data?.bayan_Number : "",
                  shipper_name: props.isEdit ? props.data?.shipper_name : "",
                  branch: props.isEdit ? props.data?.branch : "JEDDAH",
                  ex_rate: props.isEdit ? props.data?.ex_rate : "",
                  pod: props.isEdit ? props.data?.pod : "",
                  client_name: props.isEdit ? props.data?.client_name : "",
                  fc_amount: props.isEdit ? props.data?.fc_amount : "",
                  amount_sar: props.isEdit ? props.data?.amount_sar : "",
                  poa: props.isEdit ? props.data?.poa : "",
                  remarks: props.isEdit ? props.data?.remarks : "",
                  invoice_type: props.isEdit
                    ? props.data?.invoice_type
                    : "Sales",
                }}
                validationSchema={Yup.object({
                  //   bl_number: Yup.string().required("BL Number is Required"),
                  //   consignee_name: Yup.string().required("Consignee Name is Required"),
                  // date: Yup.string().required("Date is Required"),
                  //   currency_sar: Yup.string().required("Currency is Required"),
                  //   bayan_Number: Yup.string().required("Bayan Number is Required"),
                  //   shipper_name: Yup.string().required("Shipper Name is Required"),
                  // branch: Yup.string().required("Branch is Required"),
                  //   ex_rate: Yup.string().required("Rate is Required"),
                  //   pod: Yup.string().required("POD is Required"),
                  //   client_name: Yup.string().required("Client Name is Required"),
                  //   fc_amount: Yup.string().required("FC Amount is Required"),
                  //   poa: Yup.string().required("POA is Required"),
                  //   remarks: Yup.string().required("Remarks is Required"),
                })}
                onSubmit={(values, reset) => {
                  values["date"] = moment(date).format("YYYY-MM-DDTHH:mm:ss");
                  values["job"] = selectedJob.value;
                  const company = JSON.parse(
                    localStorage.getItem("authUser")
                  )?.company_id;
                  values["company"] = company;
                  console.log("values", values);

                  props.isEdit
                    ? apiAuth
                        .patch(`/api/master/invoice/${props.data?.id}/`, values)
                        .then((response) => {
                          NotificationManager.success(
                            "",
                            `Invoice Updated Successfully`,
                            3000,
                            null,
                            null,
                            ""
                          );
                          props.isEdit
                            ? props.closeAddPopup()
                            : props?.history?.push("/invoices");
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Invoice Update Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        })
                    : apiAuth
                        .post("/api/master/invoice/", values)
                        .then((response) => {
                          if (response.status === 201) {
                            NotificationManager.success(
                              "",
                              `Invoice Created Successfully`,
                              3000,
                              null,
                              null,
                              ""
                            );
                            props?.history?.push("/invoices");
                          } else {
                            NotificationManager.error(
                              "",
                              `Invoice Create Error`,
                              3000,
                              null,
                              null,
                              ""
                            );
                          }
                        })
                        .catch((error) => {
                          NotificationManager.error(
                            "",
                            `Invoice Create Error`,
                            3000,
                            null,
                            null,
                            ""
                          );
                        });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="bl_number" className="pe-2 w-50">
                              {" "}
                              BL Number
                            </Label>
                            <Field
                              className="form-control"
                              name="bl_number"
                              style={{ background: "#EDEDED" }}
                              // placeholder="bl_number"
                              type="text"
                            />
                          </div>
                          {errors.bl_number && touched.bl_number && (
                            <div className="invalid-feedback d-block">
                              {errors.bl_number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="consignee_name">
                              Consignee Name
                            </Label>
                            <Field
                              className="form-control"
                              name="consignee_name"
                              // placeholder="Consignee Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.consignee_name && touched.consignee_name && (
                            <div className="invalid-feedback d-block">
                              {errors.consignee_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            style={{
                              position: "relative",
                              // cursor: "pointer",
                            }}
                          >
                            <DatePicker
                              selected={date}
                              onChange={(date) => setDate(date)}
                            />
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

                          {errors.date && touched.date && (
                            <div className="invalid-feedback d-block">
                              {errors.date}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="currency_sar" className="pe-2 w-50">
                              Currency (SAR)
                            </Label>
                            <Field
                              className="form-control "
                              name="currency_sar"
                              // placeholder="Currency"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayan_Number && touched.bayan_Number && (
                            <div className="invalid-feedback d-block">
                              {errors.bayan_Number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="bayan_Number"
                              className="  w-50 pe-2"
                            >
                              Bayan Number
                            </Label>
                            <Field
                              className="form-control"
                              name="bayan_Number"
                              // placeholder="Bayan Number"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.bayan_Number && touched.bayan_Number && (
                            <div className="invalid-feedback d-block">
                              {errors.bayan_Number}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="shipper_name"
                              className=" w-50 p e-2"
                            >
                              Shipper Name
                            </Label>
                            <Field
                              className="form-control "
                              name="shipper_name"
                              // placeholder="shipper Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.shipper_name && touched.shipper_name && (
                            <div className="invalid-feedback d-block">
                              {errors.shipper_name}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <Label htmlFor="branch" className="form-label">
                            Branch
                            <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={branchOptions}
                            defaultValue={{
                              label: branchValue,
                              value: branchValue,
                            }}
                            onChange={(data) => {
                              setFieldValue("branch", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="branch"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="ex_rate" className="pe-2 w-50">
                              Ex. Rate
                            </Label>
                            <Field
                              className="form-control "
                              name="ex_rate"
                              // placeholder="EX Rate"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.ex_rate && touched.ex_rate && (
                            <div className="invalid-feedback d-block">
                              {errors.ex_rate}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="pod" className="pe-2 w-50">
                              POD
                            </Label>
                            <Field
                              className="form-control "
                              name="pod"
                              // placeholder="pod"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.pod && touched.pod && (
                            <div className="invalid-feedback d-block">
                              {errors.pod}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label
                              htmlFor="consignee_name"
                              className=" w-50 pe-2"
                            >
                              Client Name
                            </Label>
                            <Field
                              className="form-control "
                              name="client_name"
                              // placeholder="Client Name"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.client_name && touched.client_name && (
                            <div className="invalid-feedback d-block">
                              {errors.client_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="fc_amount" className="pe-2 w-50">
                              FC Amount
                            </Label>
                            <Field
                              className="form-control"
                              name="fc_amount"
                              // placeholder="FC Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.fc_amount && touched.fc_amount && (
                            <div className="invalid-feedback d-block">
                              {errors.fc_amount}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="amount_sar" className="pe-2 w-50">
                              {" "}
                              Amount (SAR)
                            </Label>
                            <Field
                              className="form-control"
                              name="amount_sar"
                              // placeholder="Amount"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          {errors.amount_sar && touched.amount_sar && (
                            <div className="invalid-feedback d-block">
                              {errors.amount_sar}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <div>
                            <Label htmlFor="poa" className="pe-2  w-50">
                              POA
                            </Label>
                            <Field
                              className="form-control"
                              name="poa"
                              // placeholder="POA"
                              type="text"
                              style={{ background: "#EDEDED" }}
                            />
                          </div>
                          <ErrorMessage
                            name="poa"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="form-group mb-3">
                          <Label htmlFor="invoice_type">Invoice Type</Label>
                          <Select
                            // name="invoice_type"
                            placeholder={"Select"}
                            styles={customStyles}
                            options={invoiceTypes}
                            value={invoiceType}
                            onChange={(data) => {
                              setInvoiceType(data);
                              setFieldValue("invoice_type", data.value);
                            }}
                          />
                          <ErrorMessage
                            name="invoice_type"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="job_type" className="form-label">
                            Job Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="job"
                            options={jobOptions}
                            value={selectedJob}
                            onChange={(data) => {
                              setFieldValue("job", data.label);
                              setSelectedJob(data);
                            }}
                            styles={customStyles}
                          />
                          {errors.job_type && touched.job_type && (
                            <div className="invalid-feedback d-block">
                              {errors.job_type}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="remarks" className="form-label">
                            Remarks
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            className="form-control"
                            name="remarks"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.remarks && touched.remarks && (
                            <div className="invalid-feedback d-block">
                              {errors.remarks}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className="d-flex justify-content-between">
                      {/* <Button
                        className="btn btn-warning float-right"
                        type="reset"
                        onClick={() => props.closeAddPopup()}
                      >
                        {" "}
                        Back{" "}
                      </Button> */}
                      <Button
                        type="submit"
                        // color="primary"
                        className={`btn btn-success  ${
                          props.loading ? "show-spinner" : ""
                        }`}
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">
                          {props.isEdit ? "Update" : "Save"}
                        </span>
                      </Button>{" "}
                      <Button
                        className="btn btn-info float-right"
                        onClick={() => setGenerateInvoiceModal(true)}
                      >
                        {" "}
                        Generate Invoice
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={generateInvoiceModal}
        toggle={() => {
          setGenerateInvoiceModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setGenerateInvoiceModal((prev) => !prev);
          }}
        >
          Invoice
        </ModalHeader>
        <ModalBody>
          <GenerateInvoice />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Sales;
