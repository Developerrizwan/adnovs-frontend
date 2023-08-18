import { Card, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import moment from "moment";
import NotificationManager from "../../components/Common/NotificationManager";
import { getAllISOCodes } from "iso-country-currency";

const AddCOA = (props) => {
  const history = useHistory();
  const [selStatus, setSelStatus] = useState({
    value: true,
    label: "Active",
  });
  const [isCoaBsorPL, setIsCoaBsorPL] = useState({
    value: "Balance Sheet",
    label: "Balance Sheet",
  });
  const [isDirect, setIsDirect] = useState({
    value: "Yes",
    label: "Yes",
  });
  const [isDRorCR, setIsDRorCR] = useState({
    value: "Dr",
    label: "Dr",
  });
  const [selCategory, setSelCategory] = useState({
    value: "ASSETS",
    label: "ASSETS",
  });
  const [selGroup, setSelGroup] = useState(null);
  const [selSubGroup, setSelSubGroup] = useState(null);
  const [selType, setSelType] = useState({
    value: "ASSET",
    label: "ASSET",
  });
  const [selCurrency, setSelCurrency] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [subGroupOptions, setSubGroupOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const coaTypeOptions = [
    {
      label: "Balance Sheet",
      value: "Balance Sheet",
    },
    { label: "Profit/Loss", value: "Profit/Loss" },
  ];

  const directOrIndirectOptions = [
    {
      label: "Yes",
      value: "Yes",
    },
    { label: "No", value: "No" },
  ];

  const drOrCrOptions = [
    {
      label: "Dr",
      value: "Dr",
    },
    { label: "Cr", value: "Cr" },
  ];

  const TypeOptions = [
    { value: "ASSET", label: "ASSET" },
    { value: "EQUITY", label: "EQUITY" },
    { value: "EXPENSE", label: "EXPENSE" },
    { value: "INCOME", label: "INCOME" },
    { value: "LIABILITY", label: "LIABILITY" },
  ];

  const getAllCurrencyCodes = () => {
    let allCurrencies = getAllISOCodes();
    allCurrencies = allCurrencies.map((cur) => {
      return {
        label: cur.currency + "  -  " + cur.countryName,
        value: cur.currency + "  -  " + cur.countryName,
      };
    });
    setCurrencyOptions(allCurrencies);
  };

  useEffect(() => {
    getCategoryOptions();
    getGroupOptions();
    getAllCurrencyCodes();
  }, []);

  useEffect(() => {
    if (
      props.isEdit &&
      categoryOptions.length &&
      groupOptions.length &&
      currencyOptions.length
    ) {
      getInitialValues();
    }
  }, [categoryOptions.length, groupOptions.length, currencyOptions.length]);

  const getInitialValues = () => {
    const selectedStatus = props.account.status
      ? { label: "Active", value: true }
      : { label: "Inactive", value: false };
    setSelStatus(selectedStatus);

    const selCoaType = coaTypeOptions.find(
      (dd) => dd.value === props.account?.coa_type
    );
    setIsCoaBsorPL(selCoaType);

    const selDirectOrIndirect = directOrIndirectOptions.find(
      (dd) => dd.value === props.account?.is_direct_indirect
    );
    setIsDirect(selDirectOrIndirect);

    const drOrCr = drOrCrOptions.find(
      (dd) => dd.value === props.account?.dr_cr
    );
    setIsDRorCR(drOrCr);

    const selGrp = groupOptions.find((ct) => ct.value === props.account?.group);
    setSelGroup(selGrp);

    const selSubGrp = subGroupOptions.find(
      (ct) => ct.value === props.account?.subgroup
    );
    setSelSubGroup(selSubGrp);

    const selCat = categoryOptions.find(
      (ct) => ct.value === props.account?.category
    );
    setSelCategory(selCat);

    const selType = TypeOptions.find((ty) => ty.value === props.account?.type);
    setSelType(selType);

    const selCurr = currencyOptions.find(
      (cur) => cur.value === props.account?.currency
    );
    setSelCurrency(selCurr);
  };

  const getCategoryOptions = () => {
    apiAuth
      .get("/api/master/coacategory/")
      .then((res) => {
        const { data } = res;
        const catOptions = data.results.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.name,
          };
        });
        setCategoryOptions(catOptions);
      })
      .catch((err) => console.log(err));
  };

  const getGroupOptions = () => {
    apiAuth
      .get("/api/master/coagroup/")
      .then((res) => {
        const { data } = res;
        const grpOptions = data.results.map((dd) => {
          return {
            label: dd?.name,
            value: dd?.id,
            value: dd?.id,
          };
        });
        setSubGroupOptions(grpOptions);
        setGroupOptions(grpOptions);
      })
      .catch((err) => console.log(err));
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const goBack = () => {
    history.push("/coa");
  };

  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Create Account</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              {/* {console.log(
                "wwwwwwww",
                JSON.parse(localStorage.getItem("authUser"))
              )} */}
              <Formik
                initialValues={{
                  company: JSON.parse(localStorage.getItem("authUser"))
                    .company_id,
                  code: props.account?.code || "",
                  name: props.account?.name || "",
                  status: props.account?.status || false,
                  subledger_requried:
                    props.account?.subledger_requried || false,
                  charge_required: props.account?.charge_required || false,
                  job_required: props.account?.job_required || false,
                  asset_required: props.account?.asset_required || false,
                  coa_type: props.account?.coa_type || "Balance Sheet",
                  is_direct_indirect:
                    props.account?.is_direct_indirect || "Yes",
                  dr_cr: props.account?.dr_cr || "Dr",
                  category: props.account?.category || "category 1",
                  group: props.account?.group || "",
                  subgroup: props.account?.subgroup || "",
                  type: props.account?.type || "",
                  short_name: props.account?.short_name || "",
                  long_name: props.account?.long_name || "",
                  language_name: props.account?.language_name || "",
                  currency: props.account?.currency || "curr 1",
                  additional_reference_code:
                    props.account?.additional_reference_code || "",
                  remarks: props.account?.remarks || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is Required"),
                  name: Yup.string().required("Name is Required"),
                  status: Yup.boolean().required("Status is Required"),
                  // subledger_requried: Yup.string()
                  //   .ensure()
                  //   .required("Required!"),
                  // // .required("Required!"),
                  // charge_required: Yup.string().ensure().required("Required!"),
                  // job_required: Yup.string().ensure().required("Required!"),
                  // asset_required: Yup.string().ensure().required("Required!"),
                  coa_type: Yup.string().ensure().required("Required!"),
                  is_direct_indirect: Yup.string()
                    .ensure()
                    .required("Required!"),
                  dr_cr: Yup.string().ensure().required("Required!"),
                  category: Yup.string().ensure().required("Required!"),
                  group: Yup.string().ensure().required("Required!"),
                  subgroup: Yup.string().ensure().required("Required!"),
                  type: Yup.string().ensure().required("Required!"),
                  short_name: Yup.string(),
                  long_name: Yup.string(),
                  language_name: Yup.string(),
                })}
                onSubmit={(values) => {
                  if (props.isEdit && props.account) {
                    apiAuth
                      .patch(`/api/master/coa/${props.account?.id}/`, values)
                      .then((res) => {
                        NotificationManager.success(
                          "Chart of accounts",
                          "Account Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "Chart of accounts",
                          "Account Update Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    apiAuth
                      .post("/api/master/coa/", values)
                      .then((res) => {
                        NotificationManager.success(
                          "Chart of accounts",
                          "Account Created Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        history.push("/coa");
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "Chart of accounts",
                          "Account Create Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  }
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="code" className="form-label">
                            Code
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            placeholder="Code"
                            className="form-control"
                            name="code"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.code && touched.code && (
                            <div className="invalid-feedback d-block">
                              {errors.code}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Name
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            placeholder="Name"
                            className="form-control"
                            name="name"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.name && touched.name && (
                            <div className="invalid-feedback d-block">
                              {errors.name}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            Status
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="status"
                            styles={customStyles}
                            value={selStatus}
                            options={[
                              { label: "Active", value: true },
                              { label: "Inactive", value: false },
                            ]}
                            onChange={(data) => {
                              setFieldValue("status", data.value);
                              setSelStatus(data);
                            }}
                          />
                          {errors.status && touched.status && (
                            <div className="invalid-feedback d-block">
                              {errors.status}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="coa_type" className="form-label">
                            Is COA BS/PL
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="coa_type"
                            styles={customStyles}
                            value={isCoaBsorPL}
                            options={coaTypeOptions}
                            onChange={(data) => {
                              setFieldValue("coa_type", data.label);
                              setIsCoaBsorPL(data);
                            }}
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
                          <label
                            htmlFor="is_direct_indirect"
                            className="form-label"
                          >
                            Is Direct/Indirect
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="is_direct_indirect"
                            styles={customStyles}
                            value={isDirect}
                            options={directOrIndirectOptions}
                            onChange={(data) => {
                              setFieldValue("is_direct_indirect", data.label);
                              setIsDirect(data);
                            }}
                          />
                          {errors.is_direct_indirect &&
                            touched.is_direct_indirect && (
                              <div className="invalid-feedback d-block">
                                {errors.is_direct_indirect}
                              </div>
                            )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ marginBottom: "10px" }} spacing={4}>
                      <Grid className="" item sx={12} lg={3}>
                        <div className="mb-3 d-flex flex-column">
                          <label
                            htmlFor="subledger_requried"
                            className="form-label "
                          >
                            Subledger Required?
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <ToggleButtonGroup
                            color="success"
                            sx={{
                              marginLeft: "10px",
                            }}
                            value={values["subledger_requried"]}
                            exclusive
                            onChange={(e, data) => {
                              setFieldValue("subledger_requried", data);
                            }}
                            aria-label="Platform"
                          >
                            <ToggleButton
                              sx={{
                                backgroundColor: values["subledger_requried"]
                                  ? "white"
                                  : "green",
                              }}
                              value={false}
                            >
                              No
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                backgroundColor: values["subledger_requried"]
                                  ? "green"
                                  : "white",
                              }}
                              value={true}
                            >
                              Yes
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Grid>
                      <Grid className="" item sx={12} lg={3}>
                        <div className="mb-3 d-flex flex-column">
                          <label
                            htmlFor="charge_required"
                            className="form-label "
                          >
                            Charge Required?
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <ToggleButtonGroup
                            color="success"
                            sx={{
                              marginLeft: "10px",
                            }}
                            value={values["charge_required"]}
                            exclusive
                            onChange={(e, data) => {
                              setFieldValue("charge_required", data);
                            }}
                            aria-label="Platform"
                          >
                            <ToggleButton
                              sx={{
                                backgroundColor: values["charge_required"]
                                  ? "white"
                                  : "green",
                              }}
                              value={false}
                            >
                              No
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                backgroundColor: values["charge_required"]
                                  ? "green"
                                  : "white",
                              }}
                              value={true}
                            >
                              Yes
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Grid>
                      <Grid className="" item sx={12} lg={3}>
                        <div className="mb-3 d-flex flex-column">
                          <label htmlFor="job_required" className="form-label ">
                            Job Required?
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <ToggleButtonGroup
                            color="success"
                            sx={{
                              marginLeft: "10px",
                            }}
                            value={values["job_required"]}
                            exclusive
                            onChange={(e, data) => {
                              setFieldValue("job_required", data);
                            }}
                            aria-label="Platform"
                          >
                            <ToggleButton
                              sx={{
                                backgroundColor: values["job_required"]
                                  ? "white"
                                  : "green",
                              }}
                              value={false}
                            >
                              No
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                backgroundColor: values["job_required"]
                                  ? "green"
                                  : "white",
                              }}
                              value={true}
                            >
                              Yes
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Grid>
                      <Grid className="" item sx={12} lg={3}>
                        <div className="mb-3 d-flex flex-column">
                          <label
                            htmlFor="subledger_requried"
                            className="form-label "
                          >
                            Asset Required
                            {/* <span className="text-danger">*</span> */}
                          </label>

                          <ToggleButtonGroup
                            color="success"
                            sx={{
                              marginLeft: "10px",
                            }}
                            value={values["asset_required"]}
                            exclusive
                            onChange={(e, data) => {
                              setFieldValue("asset_required", data);
                            }}
                            aria-label="Platform"
                          >
                            <ToggleButton
                              sx={{
                                backgroundColor: values["asset_required"]
                                  ? "white"
                                  : "green",
                              }}
                              value={false}
                            >
                              No
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                backgroundColor: values["asset_required"]
                                  ? "green"
                                  : "white",
                              }}
                              value={true}
                            >
                              Yes
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="dr_cr" className="form-label">
                            Is Dr/Cr?
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="dr_cr"
                            value={isDRorCR}
                            options={drOrCrOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("dr_cr", data.label);
                              setIsDRorCR(data);
                            }}
                          />
                          {errors.dr_cr && touched.dr_cr && (
                            <div className="invalid-feedback d-block">
                              {errors.dr_cr}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <div className="mb-3">
                          <label htmlFor="category" className="form-label">
                            Category
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="category"
                            value={selCategory}
                            options={categoryOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("category", data.label);
                              setSelCategory(data);
                            }}
                          />
                          {errors.category && touched.category && (
                            <div className="invalid-feedback d-block">
                              {errors.category}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <div className="mb-3">
                          <label htmlFor="group" className="form-label">
                            Group
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="group"
                            value={selGroup}
                            options={groupOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("group", data.value);
                              setSelGroup(data);
                            }}
                          />
                          {errors.group && touched.group && (
                            <div className="invalid-feedback d-block">
                              {errors.group}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <div className="mb-3">
                          <label htmlFor="subgroup" className="form-label">
                            Sub Group
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="subgroup"
                            value={selSubGroup}
                            options={subGroupOptions}
                            styles={customStyles}
                            onChange={(data) => {
                              setFieldValue("subgroup", data.value);
                              setSelSubGroup(data);
                            }}
                          />
                          {errors.subgroup && touched.subgroup && (
                            <div className="invalid-feedback d-block">
                              {errors.subgroup}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="short_name" className="form-label">
                            Short Name
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="Short Name"
                            name="short_name"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.short_name && touched.short_name && (
                            <div className="invalid-feedback d-block">
                              {errors.short_name}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="type" className="form-label">
                            Type
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="type"
                            styles={customStyles}
                            value={selType}
                            options={TypeOptions}
                            onChange={(data) => {
                              setFieldValue("type", data.label);
                              setSelType(data);
                            }}
                          />
                          {errors.type && touched.type && (
                            <div className="invalid-feedback d-block">
                              {errors.type}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="long_name" className="form-label">
                            Long Name
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="Long Name"
                            name="long_name"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.long_name && touched.long_name && (
                            <div className="invalid-feedback d-block">
                              {errors.long_name}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="language_name" className="form-label">
                            Language Name
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="Language Name"
                            name="language_name"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.language_name && touched.language_name && (
                            <div className="invalid-feedback d-block">
                              {errors.language_name}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="currency" className="form-label">
                            Currency
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="currency"
                            styles={customStyles}
                            value={selCurrency}
                            options={currencyOptions}
                            onChange={(data) => {
                              setFieldValue("currency", data.value);
                              setSelCurrency(data);
                            }}
                          />
                          {errors.currency && touched.currency && (
                            <div className="invalid-feedback d-block">
                              {errors.currency}
                            </div>
                          )}
                        </div>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label
                            htmlFor="additional_reference_code"
                            className="form-label"
                          >
                            Additional Reference Code
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            className="form-control"
                            placeholder="Additional Reference Code"
                            name="additional_reference_code"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.additional_reference_code &&
                            touched.additional_reference_code && (
                              <div className="invalid-feedback d-block">
                                {errors.additional_reference_code}
                              </div>
                            )}
                        </div>
                      </Grid>
                    </Grid>

                    <div className="mb-3">
                      <label htmlFor="remarks" className="form-label">
                        Remarks
                        {/* <span className="text-danger">*</span> */}
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

                    <div className="mt-4 mb-3">
                      <button className="btn btn-success" type="submit">
                        {props.isEdit ? "Update" : "Submit"}
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

export default AddCOA;
