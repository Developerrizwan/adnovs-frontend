import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Container } from "reactstrap";

const AllVouchers = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState({
    value: "Journal",
    label: "Journal",
  });
  const [allVouchers, setAllVouchers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const history = useHistory();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const option = [
    { value: "all", label: "All" },
    { value: "option1", label: "Option1" },
  ];

  const options = [
    // { value: "vouchers", label: "All" },
    { value: "Journal", label: "Journal" },
    { value: "Payment", label: "Payment" },
    { value: "Receipt", label: "Receipt" },
    { value: "Debit Note", label: "Debit Note" },
    { value: "Credit Code", label: "Credit Note" },
  ];

  const handleOptionChange = (selectedOption) => {
    history.push(`/${selectedOption.value}`);
  };

  const getVouchers = () => {
    apiAuth
      .get("/api/get-voucher/")
      .then((response) => {
        let data = response.data;
        console.log("vouchers", data);
        setAllVouchers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getVouchers();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <div
          className="mb-3"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2 className="mx-5">All Vouchers</h2>
          <button className="btn btn-danger" onClick={() => history.goBack()}>
            Back
          </button>
        </div>
        {/* <h2 className="mb-5 mt-3 mx-5">All Vouchers</h2> */}
        <Grid container spacing={2}>
          <Grid item lg={11} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  //   fromDate: "",
                  //   toDate: "",
                  voucherType: undefined,
                  account: undefined,
                  status: "",
                  shipmentNo: "",
                  createdBranch: "",
                  coa: undefined,
                  controllingBranch: undefined,
                  book: undefined,
                  category: undefined,
                }}
                validationSchema={Yup.object({
                  status: Yup.string().required("Status is Required"),
                  shipmentNo: Yup.string().required(
                    "Shipment Number is Required"
                  ),
                  createdBranch: Yup.string().required(
                    "Created Branch is Required"
                  ),
                })}
                onSubmit={(values) => {
                  values.voucherType = values.voucherType
                    ? values.voucherType
                    : undefined;
                  values.account = values.account
                    ? values.voucherType
                    : undefined;
                  values.coa = values.coa ? values.coa : undefined;
                  values.book = values.book ? values.book : undefined;
                  values.category = values.category
                    ? values.category
                    : undefined;
                  console.log("values", values);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="blNumber" className="form-label">
                            From Date
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="fromDate"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.fromDate && touched.fromDate && (
                            <div className="invalid-feedback d-block">
                              {errors.fromDate}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="toDate" className="form-label">
                            To Date
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="toDate"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.toDate && touched.toDate && (
                            <div className="invalid-feedback d-block">
                              {errors.toDate}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="voucherType" className="form-label">
                            Voucher Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="type"
                            placeholder={"Select"}
                            styles={customStyles}
                            value={selectedVoucher}
                            options={options?.map((type) => {
                              return {
                                label: type.label,
                                value: type.label,
                              };
                            })}
                            onChange={(event) => {
                              if (event.value === "Journal") {
                                history.push("/journal-voucher");
                              } else if (event.value === "Payment") {
                                history.push("/payment-voucher");
                              } else {
                                history.push("/receipt-voucher");
                              }
                              setSelectedVoucher(event.value);
                            }}
                          />

                          {errors.voucherType && touched.voucherType && (
                            <div className="invalid-feedback d-block">
                              {errors.voucherType}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="account" className="form-label">
                            Account
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={option}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.account && touched.account && (
                            <div className="invalid-feedback d-block">
                              {errors.account}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            Status
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="status"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.status && touched.status && (
                            <div className="invalid-feedback d-block">
                              {errors.status}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="shipmentNo" className="form-label">
                            Shipment No
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="shipmentNo"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.shipmentNo && touched.shipmentNo && (
                            <div className="invalid-feedback d-block">
                              {errors.shipmentNo}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="createdBranch" className="form-label">
                            Created Branch
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="createdBranch"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.createdBranch && touched.createdBranch && (
                            <div className="invalid-feedback d-block">
                              {errors.createdBranch}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="coa" className="form-label">
                            COA
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={option}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.coa && touched.coa && (
                            <div className="invalid-feedback d-block">
                              {errors.coa}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="book" className="form-label">
                            Book
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            name="book"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.book && touched.book && (
                            <div className="invalid-feedback d-block">
                              {errors.book}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="controllingBranch"
                            className="form-label"
                          >
                            Controlling Branch
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={option}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.controllingBranch &&
                            touched.controllingBranch && (
                              <div className="invalid-feedback d-block">
                                {errors.controllingBranch}
                              </div>
                            )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={option}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            styles={customStyles}
                          />
                          {errors.category && touched.category && (
                            <div className="invalid-feedback d-block">
                              {errors.category}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6}></Grid>
                    </Grid>

                    <div className="mt-4 mb-3">
                      <button className="btn btn-success" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>
          {/* <Grid item lg={4} style={{ margin: "auto" }}>
            <img src={jobsImage} alt="" />
          </Grid> */}
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default AllVouchers;
