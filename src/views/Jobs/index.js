import React, { useEffect, useState } from "react";
import { Row, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card } from "@mui/material";
import apiAuth from "../../helpers/ApiAuth";
import JobTable from "./JobTable";
import NotificationManager from "../../components/Common/NotificationManager";
import EnquiryTable from "./EnquiryTable";

const Tab = ({ label, setSelectedValue, selected, count }) => {
  return (
    <div
      className={`btn ${selected ? "btn-primary" : "btn-light"}`}
      onClick={() => setSelectedValue(label)}
    >
      {label}{" "}
      <span
        className={`${
          selected ? "text-primary bg-white" : "text-light bg-dark"
        } `}
        style={{
          padding: "3px",
          borderRadius: "50%",
        }}
      >
        {count}
      </span>
    </div>
  );
};

const Jobs = (props) => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [count, setCount] = useState(null);
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
        let data = response.data.results;
        setJobPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setCount((prev) => ({ ...prev, [type]: response?.data?.count }));
        setAllJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `${selectedValue} Get Error`}`,
          3000,
          null,
          null,
          ""
        );
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
          `${selectedValue} Deleted Successfully`,
          3000,
          null,
          null,
          ""
        );
        getJobs(jobPagination, searchValue, selectedValue);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || "Job Delete Error"}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  useEffect(() => {
    let val;
    [1, 2].forEach((dd) => {
      if (dd === 1) {
        val = "Job";
      } else {
        val = "Enquiry";
      }
      getJobs(jobPagination, searchValue, val);
    });
  }, []);

  // const onTabSelect = (val) => {
  //   setSelectedValue(val);
  // };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={selectedValue}
            pageTitle="Jobs"
            add_new={true}
            add_new_url={
              selectedValue === "Job" ? "/jobs/createjob" : "/jobs/add"
            }
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getJobs(jobPagination, val, selectedValue);
            }}
            export_button={allJobs.length > 0 ? true : false}
            // handleTypeChange={handleJobChange}
            // add_type={true}
            // add_type_select={true}
            // options={options}
            // selectedValue={{
            //   label: selectedValue,
            //   value: selectedValue,
            // }}
          />
        </Container>

        {allJobs.length > 0 ? (
          <>
            <Card
              style={{
                boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
                marginBottom: "12px",
              }}
            >
              <div className="d-flex justify-content-start align-items-center p-3">
                <h5 className="mx-2">Filters :</h5>
                <div className="d-flex gap-1 mx-2">
                  {["Job", "Enquiry"].map((dd, i) => (
                    <div key={i}>
                      <Tab
                        label={dd}
                        setSelectedValue={(val) => setSelectedValue(val)}
                        selected={selectedValue === dd}
                        count={count[dd]}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {selectedValue === "Job" ? (
                <JobTable
                  allJobs={allJobs}
                  deleteJob={deleteJob}
                  history={props.history}
                  jobPagination={{ ...jobPagination }}
                  handlePagination={(data) => {
                    setJobPagination(data);
                    getJobs(data, searchValue, selectedValue);
                  }}
                  userPagination={{ ...jobPagination }}
                  selectedValue={selectedValue}
                  getJobs={() => {
                    setAllJobs([]);
                    getJobs(jobPagination, searchValue, selectedValue);
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
                    getJobs(data, searchValue, selectedValue);
                  }}
                  userPagination={{ ...jobPagination }}
                  selectedValue={selectedValue}
                  getJobs={() => {
                    setAllJobs([]);
                    getJobs(jobPagination, searchValue, selectedValue);
                  }}
                />
              )}
            </Card>
          </>
        ) : (
          <>{loading ? <div className="loading"></div> : <></>}</>
        )}
      </div>
    </>
  );
};

export default Jobs;
