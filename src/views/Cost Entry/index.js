import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import CostEntryTable from "./CostEntryTable";

const CostEntry = (props) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getAccounts(pagination, searchValue);
  }, []);

  const getAccounts = (pgdata, val) => {
    apiAuth
      .get(`/api/get-costentry/`)
      .then((response) => {
        let data = response.data;
        // console.log("xswjhjwx", response);
        // setPagination({
        //   ...pgdata,
        //   totalRows: data.length,
        // });
        setAccounts(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteColumn = (id) => {
    let url = `/api/master/cost_entry/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          "Entry Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getAccounts(pagination, searchValue);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Cost Entry"
            pageTitle="Settings"
            add_new={true}
            add_new_url={"/cost-entry/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getAccounts(pagination, val);
            }}
          />
        </Container>
        <Row>
          <Colxx lg="12">
            <>
              {loading ? (
                <div className="loading"></div>
              ) : (
                <>
                  {" "}
                  <Card>
                    <CostEntryTable
                      accounts={accounts}
                      deleteColumn={(id) => deleteColumn(id)}
                      handlePagination={(data) => {
                        setPagination(data);
                        getAccounts(pagination, searchValue);
                      }}
                      getAccounts={() => {
                        getAccounts(pagination, searchValue);
                      }}
                    />
                  </Card>
                </>
              )}
            </>
          </Colxx>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default CostEntry;
