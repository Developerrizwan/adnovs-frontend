import { Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import { Label, Button } from "reactstrap";

const EditOrganization = (props) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#EDEDED",
    }),
  };
  const [coaOptions, setCoaOptions] = useState([]);

  const [selCoa, setSelCoa] = useState(null);

  const [typeValue, setTypevalue] = useState(null);

  const typeOptions = [
    {
      value: "Consignee",
      label: "Consignee",
    },
    {
      value: "Client",
      label: "Client",
    },
  ];

  const getCoaOptions = () => {
    apiAuth
      .get("api/master/coa/")
      .then((response) => {
        let {
          data: { results },
        } = response;
        results = results.map((rr) => {
          return {
            label: rr.code,
            value: rr.id,
          };
        });
        setCoaOptions(results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInitialValues = () => {
    const type = typeOptions.find(
      (item) => item.value === props.organizationData?.type
    );
    setTypevalue(type);

    const selectedCoa = coaOptions.find(
      (cur) => cur.value === props.organizationData?.coa
    );
    setSelCoa(selectedCoa);
  };

  useEffect(() => {
    getInitialValues();
    getCoaOptions();
  }, [coaOptions.length]);
  return (
    <React.Fragment>
      {props.organizationData ? (
        <Card className="p-3" style={{ background: "#EDEDED" }}>
          <Formik
            initialValues={{
              name: props?.organizationData?.name
                ? props?.organizationData?.name
                : "",
              type: props?.organizationData?.type
                ? props?.organizationData?.type
                : "",
              coa: "",
              language_name: props?.organizationData?.language_name
                ? props?.organizationData?.language_name
                : "",
              address: props?.organizationData?.address
                ? props?.organizationData?.address
                : "",
              vat_trn_number: props?.organizationData?.vat_trn_number
                ? props?.organizationData?.vat_trn_number
                : "",
              browse_logo: props?.organizationData?.browse_logo
                ? props?.organizationData?.browse_logo
                : "",
              website: props?.organizationData?.website
                ? props?.organizationData?.website
                : "",
              remarks: props?.organizationData?.remarks
                ? props?.organizationData?.remarks
                : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Name is Required"),
              language_name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Language Name is Required"),
              vat_trn_number: Yup.string()
                .max(20, "Must be 20 characters or less")
                .trim()
                .required("Vat Trn Number is Required"),
              website: Yup.string()
                // .url("Invalid URL format")
                .required("Website URL is required"),
              address: Yup.string()
                .max(400, "Must be 400 characters or less")
                .trim()
                .required("Remarks is Required"),
              remarks: Yup.string()
                .max(400, "Must be 400 characters or less")
                .trim()
                .required("Remarks is Required"),
              type: Yup.string().required("Type is Required"),
              coa: Yup.string().required("COA is Required"),
            })}
            onSubmit={(values, { reset }) => {
              const company = JSON.parse(
                localStorage.getItem("authUser")
              )?.company_id;
              values["company"] = company;
              const url = `/api/master/organization/${props.organizationData.id}/`;
              apiAuth
                .patch(url, values)
                .then((response) => {
                  if (response.status === 200) {
                    NotificationManager.success(
                      "",
                      ` Organization Updated Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    props.closeAddPopup();
                  } else {
                    NotificationManager.error(
                      "",
                      `Organization Update Error`,
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
                    `Organization Update Error`,
                    3000,
                    null,
                    null,
                    ""
                  );
                });
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="av-tooltip tooltip-label-bottom">
                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="name" className="form-label">
                        Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="name"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="name"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="type" className="form-label">
                        Type
                        <span className="text-danger">*</span>
                      </Label>
                      <Select
                        name="type"
                        placeholder={"Select"}
                        options={typeOptions}
                        value={typeValue}
                        styles={customStyles}
                        onChange={(data) => {
                          setTypevalue(data);
                          setFieldValue("type", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="type"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="language_name" className="form-label">
                        Language Name
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="language_name"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="language_name"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="address" className="form-label">
                        Address
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        as="textarea"
                        className="form-control"
                        name="address"
                        style={{ background: "#EDEDED" }}
                      />
                      <ErrorMessage
                        name="address"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="vat_trn_number" className="form-label">
                        Vat Trn Number
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="vat_trn_number"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="vat_trn_number"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="website" className="form-label">
                        Website
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="website"
                        style={{ background: "#EDEDED" }}
                      />

                      <ErrorMessage
                        name="website"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="browse_logo" className="form-label">
                        Browse Logo
                        <span className="text-danger">*</span>
                      </Label>
                      <Field
                        className="form-control"
                        name="browse_logo"
                        type="input"
                        fileType="image/*"
                        style={{ background: "#EDEDED" }}
                      />
                      <ErrorMessage
                        name="browse_logo"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <div className="mb-3">
                      <Label htmlFor="coa" className="form-label">
                        COA
                        <span className="text-danger">*</span>
                      </Label>
                      <Select
                        name="type"
                        placeholder={"Select"}
                        options={coaOptions}
                        value={selCoa}
                        styles={customStyles}
                        onChange={(data) => {
                          setFieldValue("coa", data.value);
                          setSelCoa(data);
                        }}
                      />
                      <ErrorMessage
                        name="coa"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Grid>
                </Grid>

                <div className="mb-3">
                  <Label htmlFor="remarks" className="form-label">
                    Remarks
                    <span className="text-danger">*</span>
                  </Label>
                  <Field
                    as="textarea"
                    className="form-control"
                    name="remarks"
                    style={{ background: "#EDEDED" }}
                  />
                  <ErrorMessage
                    name="remarks"
                    render={(msg) => <div className="text-danger">{msg}</div>}
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    color="success"
                    className={`btn btn-success  ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    // size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">Update</span>
                  </Button>{" "}
                  <Button
                    colo="success"
                    className="btn  float-right"
                    type="reset"
                    onClick={() => props.closeAddPopup()}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default EditOrganization;
