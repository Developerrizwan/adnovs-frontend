import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../../App.css";
import CostEntry from "./CostEntry";

const AddCostEntry = (props) => {
  const history = useHistory();

  const goBack = () => {
    history.push("/cost-entry");
  };
  return (
    <React.Fragment>
      <div className={props.isEdit ? "" : "page-content"}>
        {props.isEdit ? (
          <></>
        ) : (
          <>
            <div
              className="mb-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="mx-5">Cost Entry</h2>
              <button className="btn btn-danger" onClick={goBack}>
                Back
              </button>
            </div>
          </>
        )}

        <CostEntry props={props} title={"Sale"} />
        <CostEntry props={props} title={"Cost"} />
      </div>
    </React.Fragment>
  );
};

export default AddCostEntry;
