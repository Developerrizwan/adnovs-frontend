import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button, Card, Container, Dropdown, Row } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import apiAuth from "../../helpers/ApiAuth";
import { Alert, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import NotificationManager from "../../components/Common/NotificationManager";
import AddTicket from "./AddTicket";
import TicketTable from "./TicketTable";
import { Field } from "formik";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import SalesInvoice from "./SalesInvoice";
import PurchaseInvoice from "./PurchaseInvoice";

const Ticket = (props) => {
  const [createModal, setCreateModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [proId, setProId] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const getTickets = (id) => {
    apiAuth
      .get(`/api/ticket?project_id=` + id)
      .then((response) => {
        let data = response.data;
        console.log("ticket", data);
        setTickets(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProject = () => {
    // setLoading(true);
    apiAuth
      .get("/api/project")
      .then((response) => {
        let data = response.data;
        // console.log("project", data);
        setProjects(data);
        // setLoading(false);

        if (data.length > 0) {
          setSelectedValue({
            label: data[0]?.name,
            value: data[0]?.id,
          });

          getTickets(data[0]?.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProject();
  }, []);

  const handleProjectChange = (e) => {
    setSelectedValue(e);
    getTickets(e.value);
  };

  const deleteTicket = (id) => {
    let url = `/api/ticket/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        NotificationManager.success(
          "",
          "Ticket Deleted Successfully",
          3000,
          null,
          null,
          ""
        );
        getTickets(selectedValue?.value);
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
        {/* <Container fluid>
          <BreadCrumb
            title="Ticket"
            pageTitle="Settings"
            add_project={true}
            add_project_select={true}
            handleProjectChange={handleProjectChange}
            projects={projects}
            createNew={() => {
              setCreateModal(true);
            }}
            add_new={true}
            add_url_popup={true}
            selectedValue={selectedValue}
          />
        </Container> */}

        <Row>
          <Colxx lg="12">
            {/* {tickets.length > 0 ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <TicketTable
                    tickets={tickets}
                    getTickets={getTickets}
                    // getProject={getProject}
                    deleteTicket={deleteTicket}
                    history={props.history}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )} */}
            {/* <PurchaseInvoice /> */}
            <SalesInvoice />
          </Colxx>
        </Row>
      </div>

      {/* <Modal
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
          Add Ticket
        </ModalHeader>
        <ModalBody>
          <AddTicket
            closeAddPopup={() => {
              setCreateModal(false);
              getTickets(selectedValue?.value);
              // getProject();
            }}
          />
        </ModalBody>
      </Modal> */}
    </React.Fragment>
  );
};

export default Ticket;
