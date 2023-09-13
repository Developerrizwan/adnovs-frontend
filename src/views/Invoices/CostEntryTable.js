import moment from "moment";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";
import apiAuth from "../../helpers/ApiAuth";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const CostEntryTable = (props) => {
  const [accounts, setAccounts] = useState([]);

  const [cols, setCols] = useState([
    {
      name: <span className="font-weight-bold fs-13">Charge</span>,
      selector: (row) => row.charge,
      cell: (value) => {
        return <div>{value.charge?.code}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Job No</span>,
      selector: (row) => row.job_no,
      cell: (value) => {
        return <div>{value.job_no?.job_number}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return <div>{value.amount}</div>;
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Shipment No</span>,
      selector: (row) => row.shipment_no,
      cell: (value) => {
        return <div>{value.shipment_no}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Currency</span>,
      selector: (row) => row.currency,
      cell: (value) => {
        return <div>{value.currency}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ex Rate</span>,
      selector: (row) => row.ex_rate,
      cell: (value) => {
        return <div>{value.ex_rate}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">FCY Amount</span>,
      selector: (row) => row.fcy_amount,
      cell: (value) => {
        return <div>{value.fcy_amount}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Description</span>,
      selector: (row) => row.description,
      cell: (value) => {
        return <div>{value.description}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row) => row.amount,
      cell: (value) => {
        return <div>{value.amount}</div>;
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Sale/Cost</span>,
      selector: (row) => row.sale_cost,
      cell: (value) => {
        return <div>{value.sale_cost}</div>;
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Dr/Cr</span>,
      selector: (row) => row.dr_cr,
      cell: (value) => {
        return <div>{value.dr_cr}</div>;
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Tax Method</span>,
      selector: (row) => row.tax_group_code,
      cell: (value) => {
        return <div>{value.tax_group_code}</div>;
      },
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      selector: (row) => row,
      cell: (value) => {
        return (
          <UncontrolledDropdown className="dropdown d-inline-block">
            <DropdownToggle
              className="btn btn-soft-secondary btn-sm"
              tag="button"
            >
              <i className="ri-more-fill align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                className="remove-item-btn"
                onClick={() => {
                  deleteCostEntry(value.id);
                }}
              >
                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                Remove{" "}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        );
      },
    },
  ]);

  useEffect(() => {
    getCostEntries();
  }, []);

  const deleteCostEntry = (id) => {
    let url = `/api/master/cost_entry/${id}/`;
    apiAuth
      .patch(url, { invoice: "", is_included: false })
      .then((response) => {
        console.log("response", response);
        getCostEntries();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCostEntries = () => {
    apiAuth
      .get(`/api/get-costentry/?invoice_id=${props.id}`)
      .then((response) => {
        let data = response.data;
        console.log("response", response);
        setAccounts(data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <DataTable customStyles={customStyles} columns={cols} data={accounts} />
    </>
  );
};

export default CostEntryTable;
