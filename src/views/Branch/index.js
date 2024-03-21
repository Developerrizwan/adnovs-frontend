import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import BranchTable from "./BranchTable";
import AddBranch from "./AddBranch";

const Branch = (props) => {
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ state: false, type: "" });
  const [branchData, setBranchData] = useState([]);
  const [pagination, setPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  useEffect(() => {
    getBranchData();
  }, []);

  const getBranchData = (pgdata, val) => {
    apiAuth
      .get(`/api/master/branch`)
      .then((response) => {
        let data = response.data;
        setBranchData(data);
      })
      .catch((err) => console.log(err));
  };

  const deleteColumn = (id) => {
    let url = `/api/master/branch/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        getBranchData();
        NotificationManager.success(
          "",
          "Branch Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
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
            title="Branch"
            pageTitle="Settings"
            add_new={true}
            add_url_popup={true}
            createNew={() => {
              setModal((prev) => ({
                ...prev,
                state: true,
                type: "Add",
                value: null,
              }));
            }}
            search_functionality={true}
            searchValue={filter}
            setSearchValue={(val) => {
              setFilter(val);
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
                  <Card>
                    <BranchTable
                      branchData={branchData}
                      deleteColumn={(id) => deleteColumn(id)}
                      handlePagination={(data) => {
                        setPagination(data);
                        getBranchData(pagination, filter);
                      }}
                      getBranchData={() => {
                        getBranchData(pagination, filter);
                      }}
                      modal={modal}
                      setModal={setModal}
                    />
                  </Card>
                </>
              )}
            </>
          </Colxx>
        </Row>
      </div>

      <Modal
        id="signupModals"
        tabIndex="-1"
        className="modal-lg"
        isOpen={modal.state}
        toggle={() => {
          setModal((prev) => ({ ...prev, state: false, type: "" }));
        }}
      >
        <ModalHeader
          className="p-3"
          toggle={() => {
            setModal((prev) => ({ ...prev, state: false, type: "" }));
          }}
        >
          {modal.type + " Branch"}
        </ModalHeader>
        <ModalBody>
          {modal.type === "Delete" ? (
            <>
              <h4>Are you sure you want to delete?</h4>
            </>
          ) : (
            <AddBranch
              close={() => {
                setModal((prev) => ({ ...prev, state: false, type: "" }));
                getBranchData();
              }}
              modal={modal}
              history={props.history}
            />
          )}
        </ModalBody>
        {modal.type === "Delete" ? (
          <ModalFooter>
            <Button
              onClick={() => {
                deleteColumn(modal.value?.id);
                setModal((prev) => ({ ...prev, state: false, type: "" }));
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() =>
                setModal((prev) => ({ ...prev, state: false, type: "" }))
              }
            >
              No
            </Button>
          </ModalFooter>
        ) : (
          <></>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default Branch;
