import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const PurchaseInvoice = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <Formik
            initialValues={{
              blNumber: "",
              consigneeName: "",
              date: "",
              poa: "",
              // status: "",
              // resolved_by: "",
              // resolution: "",
              project: "",
              // raised_by: 1,
            }}
            // validationSchema={Yup.object({
            //   blNumber: Yup.string()
            //     .max(100, "Must be 50 characters or less")
            //     .trim()
            //     .required("Required"),
            // })}
            onSubmit={(values, { resetForm }) => {
              const url = "/api/ticket/";
              apiAuth
                .post(url, values)
                .then((response) => {
                  console.log(response.data);
                  if (response.status === 201) {
                    NotificationManager.success(
                      "",
                      `Ticket Added Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    props.closeAddPopup();
                  } else {
                    NotificationManager.error(
                      "",
                      `Ticket Add Error`,
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
                    `Ticket Add Error`,
                    3000,
                    null,
                    null,
                    ""
                  );
                });
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="av-tooltip tooltip-label-bottom ">
                <Row>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="blNumber" className="pe-2 w-50">
                          {" "}
                          BL Number
                        </Label>
                        <Field
                          className="form-control"
                          name="blNumber"
                          // placeholder="blNumber"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="blNumber"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="consigneeName" className="w-50 pe-2">
                          Consignee Name
                        </Label>
                        <Field
                          className="form-control"
                          name="consigneeName"
                          // placeholder="Consignee Name"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="consigneeName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="consigneeName" className=" pe-2 w-50">
                          <span style={{ color: "red" }}>*</span> Date
                        </Label>
                        <Field
                          className="form-control "
                          name="date"
                          // placeholder="date"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="consigneeName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="currency" className="pe-2 w-50">
                          Currency (SAR)
                        </Label>
                        <Field
                          className="form-control "
                          name="currency"
                          // placeholder="Currency"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="currency"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="bayanNumber" className="  w-50 pe-2">
                          Bayan Number
                        </Label>
                        <Field
                          className="form-control"
                          name="bayanNumber"
                          // placeholder="Bayan Number"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="bayanNumber"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="shipperName" className=" w-50 p e-2">
                          Shipper Name
                        </Label>
                        <Field
                          className="form-control "
                          name="shipperName"
                          // placeholder="shipper Name"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="shipperName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>

                <Row>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="consigneeName" className="pe-2 w-50">
                          <span style={{ color: "red" }}>*</span>
                          Vendor Name
                        </Label>
                        <Field
                          className="form-control"
                          name="date"
                          placeholder="date"
                          type="text"
                          value="TEMP"
                        />
                      </div>

                      <ErrorMessage
                        name="consigneeName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="rate" className="pe-2 w-50">
                          Ex. Rate
                        </Label>
                        <Field
                          className="form-control "
                          name="rate"
                          // placeholder="EX Rate"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="rate"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="pod" className="pe-2 w-50">
                          POD
                        </Label>
                        <Field
                          className="form-control "
                          name="pod"
                          // placeholder="pod"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="pod"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>

                <Row>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="consigneeName" className=" w-50 pe-2">
                          Client Name
                        </Label>
                        <Field
                          className="form-control "
                          name="clientName"
                          // placeholder="Client Name"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="clientName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="fcAmount" className="pe-2 w-50">
                          FC Amount
                        </Label>
                        <Field
                          className="form-control"
                          name="fcAmount"
                          // placeholder="FC Amount"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="consigneeName"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="amount" className="pe-2 w-50">
                          {" "}
                          Amount (SAR)
                        </Label>
                        <Field
                          className="form-control"
                          name="amount"
                          // placeholder="Amount"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="currency"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx lg="4">
                    {" "}
                    <div className="form-group mb-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="poa" className="pe-2  w-50">
                          POA
                        </Label>
                        <Field
                          className="form-control"
                          name="poa"
                          // placeholder="POA"
                          type="text"
                        />
                      </div>
                      <ErrorMessage
                        name="poa"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx lg="6">
                    {" "}
                    <div className="form-group my-3">
                      <div className="d-flex  align-items-center">
                        <Label htmlFor="blNumber" className="pe-2 ">
                          Remarks
                        </Label>
                        <Field
                          name="remarks"
                          className="form-control"
                          placeholder="Remarks"
                          // type="text"
                          as="textarea"
                        />
                      </div>
                      <ErrorMessage
                        name="blNumber"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                  <Colxx lg="6">
                    <Row>
                      <Colxx>
                        <div className="form-group mb-3">
                          <div className="d-flex  align-items-center">
                            <Label htmlFor="blNumber" className="pe-2 ">
                              Ref Date
                            </Label>
                            <Field
                              name="remarks"
                              className="form-control"
                              // placeholder="Remarks"
                              type="text"
                            />
                          </div>
                          <ErrorMessage
                            name="blNumber"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className="form-group mb-3">
                          <div className="d-flex  align-items-center">
                            <Label htmlFor="blNumber" className="pe-2 ">
                              Bill Amount
                            </Label>
                            <Field
                              name="remarks"
                              className="form-control"
                              // placeholder="Remarks"
                              type="text"
                            />
                          </div>
                          <ErrorMessage
                            name="blNumber"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx>
                        <div className="form-group mb-3">
                          <div className="d-flex  align-items-center">
                            <Label htmlFor="blNumber" className="pe-2 ">
                              Due Date
                            </Label>
                            <Field
                              name="remarks"
                              className="form-control"
                              // placeholder="Remarks"
                              type="text"
                            />
                          </div>
                          <ErrorMessage
                            name="blNumber"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                      <Colxx>
                        <div className="form-group mb-3">
                          <div className="d-flex  align-items-center">
                            <Label htmlFor="blNumber" className="pe-2 ">
                              Narration
                            </Label>
                            <Field
                              name="remarks"
                              className="form-control"
                              // placeholder="Remarks"
                              type="text"
                            />
                          </div>
                          <ErrorMessage
                            name="blNumber"
                            render={(msg) => (
                              <div className="text-danger">{msg}</div>
                            )}
                          />
                        </div>
                      </Colxx>
                    </Row>
                  </Colxx>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button
                    className="btn btn-light float-right"
                    type="reset"
                    onClick={() => props.closeAddPopup()}
                  >
                    {" "}
                    Back{" "}
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    className={`btn-shadow btn-multiple-state  ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">Save</span>
                  </Button>{" "}
                </div>
              </Form>
            )}
          </Formik>
        </Colxx>
      </Row>
    </>
  );
};

export default PurchaseInvoice;
