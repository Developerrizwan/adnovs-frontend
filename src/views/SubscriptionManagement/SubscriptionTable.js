import moment from "moment";
import DataTable from "react-data-table-component";
import { customStyles } from "../../assets/CustomTableStyles";

const SubscriptionTable = (props) => {
  // const customStyles = {
  //   headRow: {
  //     style: {
  //       color: "#fff",
  //       backgroundColor: "#1062fe",
  //     },
  //   },
  //   rows: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  //   pagination: {
  //     style: {
  //       color: "#000",
  //       backgroundColor: "#f3f3f9",
  //     },
  //   },
  // };

  return (
    <>
      <DataTable
        customStyles={customStyles}
        columns={[
          {
            name: <span className="font-weight-bold fs-18">User Name</span>,
            selector: (row) => row.user_id.username,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Plan Name</span>,
            selector: (row) => row.plan_id.name,
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-18">Subscription Date </span>
            ),
            selector: (row) =>
              moment
                .utc(row.subscription_date)
                .local()
                .format("DD-MM-YYYY HH:mm:ss"),
            sortable: true,
          },
          {
            name: (
              <span className="font-weight-bold fs-18">Last upgraded </span>
            ),
            selector: (row) =>
              moment
                .utc(row.last_updated)
                .local()
                .format("DD-MM-YYYY HH:mm:ss"),
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Amount Paid </span>,
            selector: (row) => row.plan_id.cost,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Status</span>,
            selector: (row) => row.status,
            sortable: true,
          },
          {
            name: <span className="font-weight-bold fs-18">Paid Until</span>,
            selector: (row) => row.paid_until,
            sortable: true,
          },
          // {
          //   name: <span className="font-weight-bold fs-18">Invoice</span>,
          //   selector: (row) => row.invoice,
          //   sortable: true,
          // },
        ]}
        data={props.subscriptions}
        pagination={props.subscriptions.length > 10 ? true : false}
      />
    </>
  );
};

export default SubscriptionTable;
