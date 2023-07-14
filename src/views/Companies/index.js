import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import AddCompany from "./AddCompany";
import { Colxx } from "../../components/Common/CustomBootstrap";
import DataTable from "react-data-table-component";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import NotificationManager from "../../components/Common/NotificationManager";

const Companies = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = () => {
    apiAuth
      .get("/api/company")
      .then((response) => {
        let data = response.data.map((loopData, index) => {
          loopData["address1"] = loopData?.address?.address1;
          loopData["address2"] = loopData?.address?.address2;
          loopData["address_type"] = loopData?.address?.address_type;
          loopData["city"] = loopData?.address?.city;
          loopData["state"] = loopData?.address?.state;
          loopData["country"] = loopData?.address?.country;
          loopData["zip_code"] = loopData?.address?.zip_code;
          loopData["account_id"] = `IN00${index + 1}`;
          return loopData;
        });
        setCompanies(data);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `Company Get Error`,
          3000,
          null,
          null,
          ""
        );
      });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Companies"
            pageTitle="Settings"
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/companies/add"}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {companies.length > 0 ? (
              <>
                <Card>
                  <DataTable
                    columns={[
                      {
                        name: (
                          <span className="font-weight-bold fs-13">
                            Account ID
                          </span>
                        ),
                        selector: (row) => row.account_id,
                        sortable: true,
                      },
                      {
                        name: (
                          <span className="font-weight-bold fs-13">Name</span>
                        ),
                        selector: (row) => row.company_name,
                        sortable: true,
                      },
                      {
                        name: (
                          <span className="font-weight-bold fs-13">
                            Short Name
                          </span>
                        ),
                        selector: (row) => row.short_name,
                        sortable: true,
                      },
                      {
                        name: (
                          <span className="font-weight-bold fs-13">
                            Tax Code
                          </span>
                        ),
                        selector: (row) => row.tax_code,
                        sortable: true,
                      },
                      {
                        name: (
                          <span className="font-weight-bold fs-13">
                            Address
                          </span>
                        ),
                        selector: (row) => {
                          return row ? (
                            <>
                              <div>
                                <p>
                                  {row.address1 ? <>{row.address1},</> : <></>}
                                  {row.address2}
                                </p>
                                <p>{row.address_type}</p>
                                <p>
                                  {row.city ? <>{row.city},</> : <></>}
                                  {row.state ? <>{row.state},</> : <></>}
                                  {row.country}
                                </p>
                                <p>{row.zip_code}</p>
                              </div>
                            </>
                          ) : (
                            <></>
                          );
                        },
                        sortable: true,
                      },
                      {
                        name: (
                          <span className="font-weight-bold fs-13">Action</span>
                        ),
                        sortable: true,
                        cell: () => {
                          return (
                            <UncontrolledDropdown className="dropdown d-inline-block">
                              <DropdownToggle
                                className="btn btn-soft-secondary btn-sm"
                                tag="button"
                              >
                                <i className="ri-more-fill align-middle"></i>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem className="edit-item-btn">
                                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                  Edit
                                </DropdownItem>
                                <DropdownItem className="remove-item-btn">
                                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                                  Delete{" "}
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          );
                        },
                      },
                    ]}
                    data={companies}
                    pagination
                  />
                </Card>
              </>
            ) : (
              <></>
            )}
          </Colxx>
        </Row>
      </div>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={createModal}
        toggle={() => {
          setCreateModal((prev) => !prev);
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setCreateModal((prev) => !prev);
          }}
        >
          Add Company
        </ModalHeader>
        <ModalBody>
          <AddCompany
            closeAddPopup={() => {
              setCreateModal(false);
              getCompanies();
            }}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default Companies;
