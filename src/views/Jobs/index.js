import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Button, Label, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";

import * as Yup from "yup";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card, Grid } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import JobTable from "./JobTable";

const Jobs = (props) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [jobPagination, setJobPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const getJobs = (pgdata, val) => {
    setLoading(true);
    apiAuth
      .get(
        "/api/get-jobs/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "")
      )

      .then((response) => {
        let data = response.data;
        console.log("jobs", data);
        setJobPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setAllJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getJobs();
  }, []);

  const history = useHistory();

  useEffect(() => {
    getJobs(jobPagination);
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title=""
            pageTitle="Jobs"
            add_new={true}
            // add_url_popup={true}
            add_new_url={"/jobs/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getJobs(jobPagination, val);
            }}
            export_button={allJobs.length > 0 ? true : false}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {allJobs.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <JobTable
                    allJobs={allJobs}
                    history={props.history}
                    jobPagination={{ ...jobPagination }}
                    handlePagination={(data) => {
                      setJobPagination(data);
                      getJobs(data);
                    }}
                    getJobs={() => {
                      setAllJobs([]);
                      getJobs(jobPagination, searchValue);
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

export default Jobs;
