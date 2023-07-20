import React, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";

const BreadCrumb = ({
  title,
  pageTitle,
  add_new,
  add_new_label,
  add_new_url,
  add_url_popup,
  createNew,
  history,
  back_button,
  add_project,
  add_project_select,
  add_project_url,
  add_project_label,
  handleProjectChange,
  projects,
  invoiceTypes,
  setInvoiceType,
  add_invoice_select,
  add_invoices,
  handleInvoiceChange,
  add_job_select,
  add_jobs,
  handleJobChange,
  options,
  add_voucher_select,
  add_vouchers,
  handleVoucherChange,
  voucherOptions,
  selectedValue,
}) => {
  const excelStyles = {
    control: (styles) => ({
      ...styles,
      overflow: "hidden",
      color: "#000 !important",
      backgroundColor: "#f3f3f9",
    }),
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div
            className="page-title-box d-flex align-items-center justify-content-between"
            style={{ background: "#f3f3f9" }}
          >
            <h4 className="mb-sm-0">{title}</h4>

            <div className="page-title-right d-flex align-items-center justify-content-between">
              {/* <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">{pageTitle}</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol> */}

              {back_button ? (
                <div className="top-right-button-container float-right">
                  <Button
                    className="btn  float-right"
                    onClick={history.goBack}
                    style={{ background: "#1062fe" }}
                  >
                    Back
                  </Button>
                </div>
              ) : (
                <></>
              )}

              {add_project ? (
                <div
                  className="top-right-button-container float-right mr-5"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  {add_project_select ? (
                    <Select
                      name="project"
                      // placeholder={"Select Project"}
                      options={projects?.map((pj) => {
                        return {
                          label: pj.name,
                          value: pj.id,
                        };
                      })}
                      onChange={handleProjectChange}
                      value={selectedValue}
                      styles={excelStyles}
                    />
                  ) : (
                    // <select
                    //   value={selectedValue}
                    //   onChange={handleProjectChange}
                    //   style={{ height: "30px", width: "140px" }}
                    // >
                    //   {projects.map((pj) => (
                    //     <option key={pj.value} value={pj.value}>
                    //       {pj.name}.
                    //     </option>
                    //   ))}
                    // </select>
                    <NavLink
                      to={add_project_url}
                      className="btn btn-md btn-primary "
                    >
                      {add_project_label
                        ? add_project_label
                        : "ProjectDropdown"}
                    </NavLink>
                  )}
                </div>
              ) : (
                <></>
              )}

              {add_invoices ? (
                <div
                  className="top-right-button-container float-right mr-5"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  {add_invoice_select ? (
                    <Select
                      name="type"
                      placeholder={"Select"}
                      options={invoiceTypes}
                      onChange={handleInvoiceChange}
                      value={selectedValue}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}

              {add_jobs ? (
                <div
                  className="top-right-button-container float-right mr-5"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  {add_job_select ? (
                    <Select
                      name="type"
                      placeholder={"Select"}
                      options={options}
                      onChange={handleJobChange}
                      value={selectedValue}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}

              {add_vouchers ? (
                <div
                  className="top-right-button-container float-right mr-5"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  {add_voucher_select ? (
                    <Select
                      name="type"
                      placeholder={"Select"}
                      options={voucherOptions}
                      onChange={handleVoucherChange}
                      value={selectedValue}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}

              {add_new ? (
                <div className="top-right-button-container float-right ml-5">
                  {add_url_popup ? (
                    <Button
                      type="button"
                      className="btn"
                      onClick={() => createNew()}
                      style={{ background: "#1062fe" }}
                    >
                      Create
                    </Button>
                  ) : (
                    <NavLink
                      to={add_new_url}
                      className="btn btn-md btn-primary "
                    >
                      {add_new_label ? add_new_label : "Create"}
                    </NavLink>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
