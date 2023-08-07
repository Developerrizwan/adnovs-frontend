import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import DataTable from "react-data-table-component";
import { Button, Card, Label, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";

const GenerateInvoice = (props) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [job_no, setJob_no] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [state, setState] = useState({ checkedSalesBox: [] });

  const job_noStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "200px",
      background: "#EDEDED",
    }),
  };

  const checkedSalesValues = (value, all, data) => {
    let newStatus = [];
    if (all) {
      newStatus = state.checkedSalesAll
        ? []
        : invoiceData?.map((val) => val.id);
      setState({
        ...state,
        checkedSalesBox: newStatus,
        checkedSalesAll: !state.checkedSalesAll,
      });
    } else {
      if (state.checkedSalesBox.includes(value)) {
        newStatus = state.checkedSalesBox.filter((id) => id !== value);
      } else {
        newStatus = [...state.checkedSalesBox, value];
      }
      setState({
        ...state,
        checkedSalesBox: newStatus,
        checkedSalesAll: invoiceData?.length !== newStatus?.length,
      });
    }
  };

  const getInvoiceData = (job_no, startDate, endDate) => {
    apiAuth
      .get(
        `/api/get-costentry/?is_included=false&job_id=${
          job_no || ""
        }&start_date=${
          startDate ? moment(startDate).toISOString() : ""
        }&end_date=${endDate ? moment(endDate).toISOString() : ""}`
      )
      .then((response) => {
        let data = response.data;
        setInvoiceData(data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getJobOptions();
    getInvoiceData();
  }, []);

  const getJobOptions = (val) => {
    apiAuth
      .get(`/api/get-jobs/?&page=${1}&search=${val || ""}&type=Job`)
      .then((res) => {
        const { data } = res;
        let jobOpts = data.results.map((opt) => {
          return {
            label: opt?.job_number,
            value: opt?.id,
          };
        });
        setJobOptions(jobOpts);
      })
      .catch((err) => console.log(err));
  };

  const handleCosts = async () => {
    let costs = state.checkedSalesBox;
    let x = 0;
    for (let i = 0; i < costs.length; i++) {
      await apiAuth
        .patch(`/api/master/cost_entry/${costs[i]}/`, {
          invoice: props.invoice,
          is_included: true,
        })
        .then((res) => {
          let data = res.data;
        })
        .catch((err) => {
          console.log(err.response);
        });

      x = i;
    }

    if (x == costs.length - 1 || x == 0) {
      props.closeAddPopup(true);

      NotificationManager.success(
        "",
        "Invoice Generated Successfully",
        3000,
        null,
        null,
        ""
      );
    }
  };
  const filterData = (job) => {
    const data = invoiceData.filter(
      (item) => item?.job_no?.job_number === job.label
    );
    setFilteredInvoices(data);

    console.log("sss", invoiceData);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <Label htmlFor="job_no">Job No</Label>
          <Select
            name="type"
            placeholder={"Select"}
            styles={job_noStyles}
            options={jobOptions}
            onChange={(data) => {
              setJob_no(data.value);
              // console.log("dddd", data);
              setSelectedJob(data);
              getInvoiceData(data.value, startDate, endDate);
            }}
          />
        </div>

        <div>
          <Label htmlFor="to_date" className="form-label">
            From Date
          </Label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="d MMMM yyyy h:mm aa"
          />
        </div>
        <div>
          <Label htmlFor="to_date">To Date</Label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              getInvoiceData(job_no.value, startDate, date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="d MMMM yyyy h:mm aa"
          />
        </div>
      </div>
      <div>
        <p
          style={{
            background: "orange",
            color: "white",
            padding: "10px",
          }}
        >
          Sale Charge
        </p>
        <Card>
          <DataTable
            data={invoiceData.filter((item) => item.sale_cost === "Sale")}
            columns={[
              {
                name: (
                  <Input
                    className="form-check-input fs-15"
                    type="checkbox"
                    name="checkAll"
                    onClick={() => checkedSalesValues("", true)}
                    checked={state.checkedSalesAll}
                    readOnly
                  />
                ),
                cell: (value) => (
                  <input
                    className="form-check-input fs-15"
                    type="checkbox"
                    name="checkAll"
                    onClick={() => checkedSalesValues(value.id, null, value)}
                    checked={state.checkedSalesBox?.includes(value.id)}
                    readOnly
                  />
                ),
                width: "50px",
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
                name: (
                  <span className="font-weight-bold fs-13">Shipment No</span>
                ),
                selector: (row) => row.shipment_no,
                cell: (value) => {
                  return <div>{value.shipment_no}</div>;
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
                name: <span className="font-weight-bold fs-13">Charge</span>,
                selector: (row) => row.charge,
                cell: (value) => {
                  return (
                    <div>
                      {value.charge?.name}-{value.charge?.code}
                    </div>
                  );
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
                name: <span className="font-weight-bold fs-13">Dr Cr</span>,
                selector: (row) => row.dr_cr,
                cell: (value) => {
                  return <div>{value.dr_cr}</div>;
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
                name: (
                  <span className="font-weight-bold fs-13">Fcy Amount</span>
                ),
                selector: (row) => row.fcy_amount,
                cell: (value) => {
                  return <div>{value.fcy_amount}</div>;
                },
                sortable: true,
              },
              {
                name: (
                  <span className="font-weight-bold fs-13">Prorate Method</span>
                ),
                selector: (row) => row.prorate_method,
                cell: (value) => {
                  return <div>{value.prorate_method}</div>;
                },
                sortable: true,
              },
              {
                name: (
                  <span className="font-weight-bold fs-13">Tax Group Code</span>
                ),
                selector: (row) => row.tax_group_code,
                cell: (value) => {
                  return <div>{value.tax_group_code}</div>;
                },
                sortable: true,
              },
            ]}
          />
        </Card>
      </div>

      <p style={{ background: "blue", color: "white", padding: "10px" }}>
        {" "}
        Cost Charge
      </p>
      <div>
        <Card>
          <DataTable
            data={invoiceData.filter((item) => item.sale_cost === "Cost")}
            columns={[
              {
                name: (
                  <Input
                    className="form-check-input fs-15"
                    type="checkbox"
                    name="checkAll"
                    onClick={() => checkedSalesValues("", true)}
                    checked={state.checkedSalesAll}
                    readOnly
                  />
                ),
                cell: (value) => (
                  <input
                    className="form-check-input fs-15"
                    type="checkbox"
                    name="checkAll"
                    onClick={() => checkedSalesValues(value.id, null, value)}
                    checked={state.checkedSalesBox?.includes(value.id)}
                    readOnly
                  />
                ),
                width: "50px",
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
                name: (
                  <span className="font-weight-bold fs-13">Shipment No</span>
                ),
                selector: (row) => row.shipment_no,
                cell: (value) => {
                  return <div>{value.shipment_no}</div>;
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
                name: <span className="font-weight-bold fs-13">Charge</span>,
                selector: (row) => row.charge,
                cell: (value) => {
                  return (
                    <div>
                      {value.charge?.name} - {value.charge?.code}
                    </div>
                  );
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
                name: <span className="font-weight-bold fs-13">Dr Cr</span>,
                selector: (row) => row.dr_cr,
                cell: (value) => {
                  return <div>{value.dr_cr}</div>;
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
                name: (
                  <span className="font-weight-bold fs-13">Fcy Amount</span>
                ),
                selector: (row) => row.fcy_amount,
                cell: (value) => {
                  return <div>{value.fcy_amount}</div>;
                },
                sortable: true,
              },
              {
                name: (
                  <span className="font-weight-bold fs-13">Prorate Method</span>
                ),
                selector: (row) => row.prorate_method,
                cell: (value) => {
                  return <div>{value.prorate_method}</div>;
                },
                sortable: true,
              },
              {
                name: (
                  <span className="font-weight-bold fs-13">Tax Group Code</span>
                ),
                selector: (row) => row.tax_group_code,
                cell: (value) => {
                  return <div>{value.tax_group_code}</div>;
                },
                sortable: true,
              },
            ]}
          />
        </Card>
      </div>

      <div className="d-flex justify-content-between">
        <Button color="danger" onClick={() => props.closeAddPopup()}>
          {" "}
          Cancel
        </Button>
        <Button
          color="success"
          onClick={() => {
            handleCosts();
          }}
        >
          <span className="spinner d-inline-block">
            <span className="bounce1" />
            <span className="bounce2" />
            <span className="bounce3" />
          </span>
          <span className="float-right">Save</span>
        </Button>{" "}
      </div>
    </>
  );
};

export default GenerateInvoice;
