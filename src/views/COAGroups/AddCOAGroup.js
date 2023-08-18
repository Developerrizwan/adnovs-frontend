import { Card, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const AddCOAGroup = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [isDRorCR, setIsDRorCR] = useState({
    value: "Dr",
    label: "Dr",
  });
  const [selType, setSelType] = useState({
    value: "ASSET",
    label: "ASSET",
  });

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

  useEffect(() => {
    if (props.isEdit) {
      getInitialValues();
    }
  }, []);

  const getInitialValues = () => {
    const drOrCr = drOrCrOptions.find(
      (dd) => dd.value === props.account?.dr_cr
    );
    setIsDRorCR(drOrCr);
    const selType = TypeOptions.find((ty) => ty.value === props.account?.type);
    setSelType(selType);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const goBack = () => {
    history.push("/coag");
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
                  coa_type: props.account?.coa_type || "Balance Sheet",
                  dr_cr: props.account?.dr_cr || "Dr",
                  type: props.account?.type || "",
                  language_name: props.account?.language_name || "",
                  currency: props.account?.currency || "curr 1",
                  remarks: props.account?.remarks || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is Required"),
                  name: Yup.string().required("Name is Required"),
                  // coa_type: Yup.string().ensure().required("Required!"),
                  dr_cr: Yup.string().ensure().required("Required!"),
                  type: Yup.string().ensure().required("Required!"),
                  language_name: Yup.string(),
                  remarks: Yup.string().required("Remarks is Required"),
                })}
                onSubmit={(values) => {
                  setLoading(true);
                  if (props.isEdit && props.account) {
                    apiAuth
                      .patch(
                        `/api/master/coagroup/${props.account?.id}/`,
                        values
                      )
                      .then((res) => {
                        setLoading(false);
                        NotificationManager.success(
                          "Chart of accounts",
                          "Group Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        setLoading(false);
                        NotificationManager.error(
                          "Chart of accounts",
                          "Group Update Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    apiAuth
                      .post("/api/master/coagroup/", values)
                      .then((res) => {
                        setLoading(false);
                        NotificationManager.success(
                          "Chart of accounts",
                          "Group Created Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        history.push("/coag");
                      })
                      .catch((err) => {
                        setLoading(false);
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

                    {loading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <div className="mt-4 mb-3">
                        <button className="btn btn-success" type="submit">
                          {props.isEdit ? "Update" : "Submit"}
                        </button>
                      </div>
                    )}
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

export default AddCOAGroup;
