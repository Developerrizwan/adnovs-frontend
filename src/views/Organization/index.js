import React, { useEffect, useState } from "react";
import { Row, Container } from "reactstrap";
import BreadCrumb from "../../components/Common/BreadCrumb";
import { Colxx } from "../../components/Common/CustomBootstrap";

import { Card } from "@mui/material";
import apiAuth from "../../helpers/ApiAuth";
import NotificationManager from "../../components/Common/NotificationManager";
import OrganizationTable from "./Organizationtable";
import useDebounce from "../../components/Hooks/UseDebounce";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const Organization = (props) => {
  const [allOrganization, setAllOrganization] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("Consignee");
  const [organizationPagination, setOrganizationPagination] = useState({
    rowsPerPage: 10,
    totalRows: 0,
    currentPage: 1,
  });

  const options = [
    {
      value: "Consignee",
      label: "Consignee",
    },
    {
      value: "Client",
      label: "Client",
    },
    {
      value: "Supplier",
      label: "Supplier",
    },
    {
      value: "Shipper",
      label: "Shipper",
    },
    {
      value: "Notify",
      label: "Notify",
    },
    {
      value: "Counterpart",
      label: "Counterpart",
    },
    {
      value: "Broker",
      label: "Broker",
    },
    {
      value: "Agents",
      label: "Agents",
    },
    {
      value: "Others",
      label: "Others",
    },
  ];

  const debouncedSearch = useDebounce(searchValue, 1500);

  useEffect(() => {
    getOrganization(organizationPagination, searchValue, selectedValue);
  }, [debouncedSearch]);

  const getOrganization = (pgdata, val, type) => {
    setLoading(true);
    apiAuth
      .get(
        `/api/get-organization/?page=${pgdata?.currentPage}&search=${
          val || ""
        }&type=${type}`
      )
      .then((response) => {
        console.log("dd", response);
        let data = response.data;
        setOrganizationPagination({
          ...pgdata,
          totalRows: response.data.count,
        });
        setAllOrganization(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || `Organization Get Error`}`,
          3000,
          null,
          null,
          ""
        );
        setLoading(false);
      });
  };

  const deleteOrganization = (id) => {
    let url = `/api/master/organization/${id}/`;
    apiAuth
      .delete(url)
      .then((response) => {
        const newdata = response.data;
        NotificationManager.success(
          "",
          `${selectedValue} Deleted Successfully`,
          3000,
          null,
          null,
          ""
        );
        getOrganization(organizationPagination, searchValue, selectedValue);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.response?.headers);
        NotificationManager.error(
          "",
          `${error.response?.data?.Error || "Job Delete Error"}`,
          3000,
          null,
          null,
          ""
        );
      });
  };

  const handleOrganizationChange = (e) => {
    setSelectedValue(e.value);
    getOrganization(organizationPagination, searchValue, e.value);
  };

  const exportData = (arr) => {
    let apiData = arr.map((org) => {
      let dataOrg = {
        "Name": org?.name,
        "Type": org?.type.join(", "),
        "Language Name": org?.language_name,
        "Address": org?.address,
        "Currency": org?.currency,
        "GSTIN Registered": org?.gstin_registered ? "Yes" : "No",
        "Payment Terms": org?.payment_terms,
        "VAT TRN Number": org?.vat_trn_number,
        "COA": org?.coa?.name,
      };
      return dataOrg;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = selectedValue;
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={"Organization"}
            pageTitle="Organization"
            add_new={true}
            add_new_url={"/organization/add"}
            search_functionality={true}
            searchValue={searchValue}
            setSearchValue={(val) => {
              setSearchValue(val);
              // getOrganization(organizationPagination, val, selectedValue);
            }}
            export_button={allOrganization?.length > 0 ? true : false}
            handleTypeChange={handleOrganizationChange}
            add_type={true}
            add_type_select={true}
            options={options}
            selectedValue={{
              label: selectedValue,
              value: selectedValue,
            }}
          />
        </Container>

        <Row>
          <Colxx lg="12">
            {allOrganization?.length > 0 && selectedValue ? (
              <>
                <Card style={{ boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)" }}>
                  <div className="d-flex justify-content-start align-items-center p-3">
                    {/* <h5 className="mx-2">Filters :</h5>
                    <div className="d-flex gap-1 mx-2">
                      {options.map((opt, i) => (
                        <div key={i}>
                          <button
                            className={`btn ${selectedValue === opt.value ? "btn-primary" : "btn-light"}`}
                            onClick={() => setSelectedValue(opt.value)}
                          >
                            {opt.label}
                          </button>
                        </div>
                      ))}
                    </div> */}
                    <div>
                      {allOrganization.length > 0 ? (
                        <>
                          <button
                            className="btn"
                            type="button"
                            style={{
                              background: "#589662",
                              color: "white",
                            }}
                            onClick={() => {
                              exportData(allOrganization);
                            }}
                          >
                            Excel Download
                          </button>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <OrganizationTable
                    allOrganization={allOrganization}
                    deleteOrganization={deleteOrganization}
                    history={props.history}
                    organizationPagination={{ ...organizationPagination }}
                    handlePagination={(data) => {
                      setOrganizationPagination(data);
                      getOrganization(data, searchValue, selectedValue);
                    }}
                    selectedValue={selectedValue}
                    getOrganization={() => {
                      setAllOrganization([]);
                      getOrganization(
                        organizationPagination,
                        searchValue,
                        selectedValue
                      );
                    }}
                  />
                </Card>
              </>
            ) : (
              <>{loading ? <div className="loading"></div> : <></>}</>
            )}
          </Colxx>
        </Row>
      </div>
    </>
  );
};

export default Organization;