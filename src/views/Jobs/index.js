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
import NotificationManager from "../../components/Common/NotificationManager";
import EnquiryTable from "./EnquiryTable";

const Jobs = (props) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("Enquiry");
  const [jobPagination, setJobPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const options = [
    {
      label: "Job",
      value: "Job",
    },
    {
      label: "Enquiry",
      value: "Enquiry",
    },
  ];

  const getJobs = (pgdata, val, type) => {
    setLoading(true);
    apiAuth
      .get(
        "/api/get-jobs/?" +
          "&page=" +
          pgdata?.currentPage +
          "&search=" +
          (val ? val : "") +
          "&type=" +
          type
      )

      .then((response) => {
        let data = response.data;
        setJobPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setAllJobs(data.results.filter((job) => job.job_type === type));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteJob = (id) => {
    let url = `/api/master/job/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "Job Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getJobs(jobPagination, searchValue);
        // setSelectedValue()
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  useEffect(() => {
    getJobs(jobPagination, searchValue, selectedValue);
  }, []);

  const handleJobChange = (e) => {
    setSelectedValue(e.value);
    getJobs(jobPagination, searchValue, e.value);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={selectedValue}
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
            handleJobChange={handleJobChange}
            add_jobs={true}
            add_job_select={true}
            options={options}
            selectedValue={{
              label: selectedValue,
              value: selectedValue,
            }}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {allJobs.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  {selectedValue === "Job" ? (
                    <JobTable
                      allJobs={allJobs}
                      deleteJob={deleteJob}
                      history={props.history}
                      jobPagination={{ ...jobPagination }}
                      handlePagination={(data) => {
                        setJobPagination(data);
                        getJobs(data);
                      }}
                      selectedValue={selectedValue}
                      getJobs={() => {
                        setAllJobs([]);
                        getJobs(jobPagination, searchValue);
                      }}
                    />
                  ) : (
                    <EnquiryTable
                      allJobs={allJobs}
                      deleteJob={deleteJob}
                      history={props.history}
                      jobPagination={{ ...jobPagination }}
                      handlePagination={(data) => {
                        setJobPagination(data);
                        getJobs(data);
                      }}
                      selectedValue={selectedValue}
                      getJobs={() => {
                        setAllJobs([]);
                        getJobs(jobPagination, searchValue);
                      }}
                    />
                  )}
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
