import React, { useEffect, useState } from "react";
import { Row, Button, Label } from "reactstrap";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { Form } from "react-formik-ui";
import { Colxx, Separator } from "../../components/Common/CustomBootstrap";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import Select from "react-select";

const ProjectTeamMember = (props) => {
  const [selectedMember, setSelectedMember] = useState("");
  return (
    <>
      <Row mb="4">
        <Colxx lg="12">
          <Formik
            initialValues={{
              teamMember: "",
            }}
            onSubmit={(values, { resetForm }) => {
              const Obj = {
                project_id: props.projectId,
                user_id: selectedMember,
              };
              const url = "/api/teammember-invitation/";
              apiAuth
                .post(url, Obj)
                .then((response) => {
                  if (response.status === 200) {
                    NotificationManager.success(
                      "",
                      `Team Member Added Successfully`,
                      3000,
                      null,
                      null,
                      ""
                    );
                    props.closeAddPopup();
                  } else {
                    NotificationManager.error(
                      "",
                      `Team Member Add Error`,
                      3000,
                      null,
                      null,
                      ""
                    );
                  }
                })
                .catch((error) => {
                  NotificationManager.error(
                    "",
                    `Team Member Add Error`,
                    3000,
                    null,
                    null,
                    ""
                  );
                });
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="av-tooltip tooltip-label-bottom ">
                <Row>
                  <Colxx lg="8">
                    <div className="form-group mb-3">
                      <Label htmlFor="teamMember"></Label>
                      <Select
                        name="teamMember"
                        placeholder={"Select"}
                        options={props.teamMember.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        })}
                        onChange={(event) => {
                          setFieldValue("project", event.value);
                          setSelectedMember(event.value);
                        }}
                      />

                      <ErrorMessage
                        name="project"
                        render={(msg) => (
                          <div className="text-danger">{msg}</div>
                        )}
                      />
                    </div>
                  </Colxx>
                </Row>
                <Separator className="mb-4 mt-4" />
                <div className="d-flex justify-content-between">
                  <Button
                    type="submit"
                    color="primary"
                    className={`btn-shadow btn-multiple-state  ${
                      props.loading ? "show-spinner" : ""
                    }`}
                    size="lg"
                  >
                    <span className="spinner d-inline-block">
                      <span className="bounce1" />
                      <span className="bounce2" />
                      <span className="bounce3" />
                    </span>
                    <span className="label">Invite Team Member</span>
                  </Button>{" "}
                  <Button
                    className="btn btn-light float-right"
                    type="reset"
                    onClick={() => props.closeAddPopup()}
                  >
                    {" "}
                    Cancel{" "}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Colxx>
      </Row>
    </>
  );
};

export default ProjectTeamMember;
