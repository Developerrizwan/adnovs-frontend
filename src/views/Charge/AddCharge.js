import { Card, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "../../App.css";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const AddCharge = (props) => {
  const history = useHistory();
  const [selStatus, setSelStatus] = useState(null);
  const [selType, setSelType] = useState(null);
  const [selCoa, setSelCoa] = useState(null);
  const [tax, setTax] = useState(null);

  const [coaOptions, setCoaOptions] = useState([]);
  const taxOptions = [
    {
      label: "VAT 0%",
      value: 0,
    },
    { label: "VAT 5%", value: 5 },
    { label: "VAT 10%", value: 10 },
    { label: "VAT 15%", value: 15 },
  ];

  useEffect(() => {
    if (props.isEdit) {
      getInitialValues();
    }
    getCoaOptions();
  }, [props.isEdit, coaOptions.length]);

  const getCoaOptions = () => {
    apiAuth
      .get(`/api/get-coa/`)
      .then((res) => {
        let results = res?.data?.map((rr) => {
          return {
            label: `${rr.code}-${rr.name}`,
            value: rr.id,
          };
        });
        setCoaOptions(results);
      })
      .catch((err) => console.log(err));
  };

  const getInitialValues = () => {
    const selectedStatus = props.charge.status
      ? { label: "Active", value: true }
      : { label: "Inactive", value: false };
    setSelStatus(selectedStatus);

    const selectedCoa = coaOptions.find(
      (cur) => cur.value === props.charge?.coa
    );
    setSelCoa(selectedCoa);

    const selectedTax = taxOptions.find(
      (cur) => cur.value === Number(props.charge?.tax)
    );
    setTax(selectedTax);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };

  const goBack = () => {
    history.push("/charge");
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
              <h2 className="mx-5">Charge</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}
        {/* {console.log("wwwwwww", props.charge)} */}
        <Grid container spacing={2}>
          <Grid item lg={12} style={{ placeItems: "center", margin: "auto" }}>
            <Card className="p-3" style={{ background: "#EDEDED" }}>
              <Formik
                initialValues={{
                  code: props.charge?.code || "",
                  name: props.charge?.name || "",
                  status: props.charge?.status || false,
                  iata_code: props.charge?.iata_code || "",
                  type: props.charge?.type || "",
                  language_name: props.charge?.language_name || "",
                  description: props.charge?.description || "",
                  remarks: props.charge?.remarks || "",
                  coa: props.charge?.coa?.id || "",
                  tax: props.charge?.tax || 0,
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is Required"),
                  name: Yup.string().required("Name is Required"),
                  status: Yup.boolean().required("Status is Required"),
                  coa: Yup.string().required("COA is Required"),
                  // iata_code: Yup.string().required("Required!"),
                })}
                onSubmit={(values) => {
                  console.log("values", values);
                  if (props.isEdit && props.charge) {
                    apiAuth
                      .patch(`/api/master/charge/${props.charge?.id}/`, values)
                      .then((res) => {
                        NotificationManager.success(
                          "Charge",
                          "Updated Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        props.closeAddPopup();
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "Charge",
                          "Update Error",
                          3000,
                          null,
                          null,
                          ""
                        );
                      });
                  } else {
                    apiAuth
                      .post("/api/master/charge/", values)
                      .then((res) => {
                        NotificationManager.success(
                          "Charge",
                          "Created Successfully",
                          3000,
                          null,
                          null,
                          ""
                        );
                        history.push("/charge");
                      })
                      .catch((err) => {
                        NotificationManager.error(
                          "Charge",
                          "Create Error",
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
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="iata_code" className="form-label">
                            IATA Code
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            placeholder="IATA Code"
                            className="form-control"
                            name="iata_code"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.iata_code && touched.iata_code && (
                            <div className="invalid-feedback d-block">
                              {errors.iata_code}
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="coa" className="form-label">
                            COA
                          </label>
                          <span className="text-danger">*</span>
                          <Select
                            name="type"
                            styles={customStyles}
                            value={selCoa}
                            options={coaOptions}
                            onChange={(data) => {
                              setFieldValue("coa", data.value);
                              setSelCoa(data);
                            }}
                          />
                          {errors.coa && touched.coa && (
                            <div className="invalid-feedback d-block">
                              {errors.coa}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="tax" className="form-label">
                            Tax Group Code
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            name="tax"
                            styles={customStyles}
                            value={tax}
                            options={taxOptions}
                            onChange={(data) => {
                              setFieldValue("tax", data.value);
                              setTax(data);
                            }}
                          />
                          {errors.tax && touched.tax && (
                            <div className="invalid-feedback d-block">
                              {errors.tax}
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
                            placeholder="Rate"
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
                          <label htmlFor="description" className="form-label">
                            Description
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            as="textarea"
                            className="form-control"
                            placeholder="Description..."
                            name="description"
                            style={{ background: "#EDEDED" }}
                          />
                          {errors.description && touched.description && (
                            <div className="invalid-feedback d-block">
                              {errors.description}
                            </div>
                          )}
                        </div>
                      </Grid>
                      <Grid item lg={6} xs={12}>
                        <div className="mb-3">
                          <label htmlFor="remarks" className="form-label">
                            Remarks
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            as="textarea"
                            className="form-control"
                            placeholder="Remarks..."
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
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default AddCharge;
