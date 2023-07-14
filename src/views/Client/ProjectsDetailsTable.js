import { useState } from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import moment from "moment-timezone";

const ProjectDetailsTable = (props) => {
  const customProjectStyles = {
    headRow: {
      style: {
        color: "#fff",
        backgroundColor: "#1062fe",
      },
    },
    rows: {
      style: {
        color: "#000",
        backgroundColor: "#f3f3f9",
      },
    },
  };

  return (
    <>
      <DataTable
        customStyles={customProjectStyles}
        columns={[
          {
            name: <span className="font-weight-bold fs-18">Name</span>,
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Status</span>,
            selector: (row) => row.status,
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-18">
                Start Date of the Project
              </span>
            ),
            selector: (row) =>
              moment
                .utc(row.date_created)
                .local()
                .format("DD-MM-YYYY HH:mm:ss"),
            sortable: true,
            sortFunction: (a, b) => {
              if (moment(a.date_created).isSameOrAfter(b.date_created)) {
                return -1;
              }
              return 1;
            },
          },
        ]}
        data={props.clientProjects}
        pagination={props.clientProjects?.length < 10 ? false : true}
      />
    </>
  );
};

export default ProjectDetailsTable;
