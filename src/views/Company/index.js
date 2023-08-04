import React, { useEffect, useState } from "react";
import { Row, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { Card } from "@mui/material";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import CompanyTable from "./CompanyTable";

const Company = (props) => {
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [companyPagination, setCompanyPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const getCompany = (pgdata, val) => {
    setLoading(true);
    apiAuth
      .get(
        "/api/master/company/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "")
      )

      .then((response) => {
        let data = response.data;
        setCompanyPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setCompany(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || ` Company Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getCompany(companyPagination, searchValue);
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={"Company"}
            pageTitle="Jobs"
            // add_new={true}
            // add_new_url={"/jobs/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getCompany(companyPagination, val);
            }}
            export_button={company.length > 0 ? true : false}
            // add_type={true}
            // add_type_select={true}
            // options={options}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {company?.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <CompanyTable
                    company={company}
                    history={props.history}
                    companyPagination={{ ...companyPagination }}
                    handlePagination={(data) => {
                      setCompanyPagination(data);
                      getCompany(data);
                    }}
                    getCompany={() => {
                      setCompany([]);
                      getCompany(companyPagination, searchValue);
                    }}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>
    </>
  );
};

export default Company;
