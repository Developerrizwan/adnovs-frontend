import React, { useEffect, useState } from "react";
import { Row, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card } from "@mui/material";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import OrganizationTable from "./Organizationtable";

const Organization = (props) => {
  const [allOrganization, setAllOrganization] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("Consignee");
  const [organizationPagination, setOrganizationPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const options = [
    {
      label: "Consignee",
      value: "Consignee",
    },
    {
      label: "Client",
      value: "Client",
    },
  ];

  const getOrganization = (pgdata, val, type) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/get-organization/?page=${pgdata?.currentPage}&search=${val || ""}&type=${type}`
      )

      .then((response) => {
        console.log("dd", response);
        let data = response.data;
        setOrganizationPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setAllOrganization(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Organization Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getOrganization(organizationPagination, searchValue, selectedValue);
  }, []);

  const deleteOrganization = (id) => {
    let url = `/api/master/organization/${id}/`;
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
        getOrganization(organizationPagination, searchValue, selectedValue);
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

  const handleOrganizationChange = (e) => {
    setSelectedValue(e.value);
    getOrganization(organizationPagination, searchValue, e.value);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={"Organization"}
            pageTitle="Organization"
            add_new={true}
            add_new_url={"/organization/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getOrganization(organizationPagination, val, selectedValue);
            }}
            export_button={allOrganization?.length > 0 ? true : false}
            handleTypeChange={handleOrganizationChange}
            add_type={true}
            add_type_select={true}
            options={options}
            selectedValue={{
              label: selectedValue,
              value: selectedValue,
            }}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {allOrganization?.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <OrganizationTable
                    allOrganization={allOrganization}
                    deleteOrganization={deleteOrganization}
                    history={props.history}
                    organizationPagination={{ ...organizationPagination }}
                    handlePagination={(data) => {
                      setOrganizationPagination(data);
                      getOrganization(data);
                    }}
                    selectedValue={selectedValue}
                    getOrganization={() => {
                      setAllOrganization([]);
                      getOrganization(
                        organizationPagination,
                        searchValue,
                        selectedValue
                      );
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

export default Organization;
