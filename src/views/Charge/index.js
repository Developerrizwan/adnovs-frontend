import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import ChargeTable from "./ChargeTable";

const Charge = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [chargeData, setChargeData] = useState([]);
  const [filteredChargeData, setFilteredChargeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getChargeData(pagination, searchValue);
  }, []);

  const getChargeData = (pgdata, val) => {
    apiAuth
      .get(`/api/get-charge/`)
      .then((response) => {
        let data = response.data;
        // setPagination({
        //   ...pgdata,
        //   totalRows: data.length,
        // });
        setFilteredChargeData(data);
        setChargeData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteColumn = (id) => {
    let url = `/api/master/charge/${id}/`;
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
        getChargeData(pagination, searchValue);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
      });
  };

  const getFilteredCharge = (val) => {
    let dd = [...chargeData];
    dd = dd.filter((d) => d?.name.toLowerCase().includes(val.toLowerCase()));
    setFilteredChargeData(dd);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Charge"
            pageTitle="Settings"
            add_new={true}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new_url={"/charge/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              getFilteredCharge(val);
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
                    <ChargeTable
                      chargeData={filteredChargeData}
                      deleteColumn={(id) => deleteColumn(id)}
                      handlePagination={(data) => {
                        setPagination(data);
                        getChargeData(pagination, searchValue);
                      }}
                      getChargeData={() => {
                        getChargeData(pagination, searchValue);
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

export default Charge;
