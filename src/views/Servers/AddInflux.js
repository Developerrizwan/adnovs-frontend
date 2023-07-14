import React from "react";
import { Row, Label } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { Card } from "reactstrap";

const AddInflux = ({
  index,
  influx,
  influx_types,
  setInfluxTypes,
  openedInfluxSteps,
  handleInfluxSteps,
}) => {
  return (
    <>
      <Colxx
        lg="12"
        className="d-flex flex-column align-items-center my-2"
        key={index}
      >
        <Row className="w-100">
          <Colxx lg="12">
            <Card className="p-2">
              <Row>
                <Colxx
                  lg="12"
                  className="d-flex justify-content-between align-items-center px-3"
                >
                  <div>
                    {index + 1}. {influx.server_url}
                  </div>
                  <div className="d-flex align-items-center">
                    <i
                      onClick={() => {
                        handleInfluxSteps(index);
                      }}
                      className={
                        openedInfluxSteps.includes(index)
                          ? "ri-arrow-up-s-line float-left cursor-pointer text-primary fa-2x"
                          : "ri-arrow-down-s-line float-left cursor-pointer text-primary fa-2x"
                      }
                      style={{
                        fontSize: "24px",
                        //   color: "#e2863b",
                      }}
                    ></i>
                    <i
                      className="ri-delete-bin-5-line float-right cursor-pointer ml-2"
                      onClick={() => {
                        let infs = [...influx_types];
                        infs.splice(index, 1);
                        setInfluxTypes([...infs]);
                      }}
                      style={{
                        fontSize: "18px",
                        //   color: "#e2863b",
                      }}
                    ></i>
                  </div>
                </Colxx>
              </Row>
            </Card>
          </Colxx>
        </Row>

        {openedInfluxSteps.includes(index) ? (
          <Row className="mt-1 w-100 justify-content-center">
            <Colxx lg="11">
              <Row>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmport">PORT</Label>
                    <input
                      value={influx.port}
                      className="form-control"
                      name="vmport"
                      placeholder="PORT"
                      type="text"
                      onChange={(e) => {
                        let infs = [...influx_types];
                        infs[index]["port"] = e.target.value;
                        setInfluxTypes([...infs]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmurl">Server URL</Label>
                    <input
                      value={influx.server_url}
                      className="form-control"
                      name="vmurl"
                      placeholder="Server URL"
                      type="text"
                      onChange={(e) => {
                        let infs = [...influx_types];
                        infs[index]["server_url"] = e.target.value;
                        setInfluxTypes([...infs]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmtoken">Token</Label>
                    <input
                      value={influx.token}
                      className="form-control"
                      name="vmtoken"
                      placeholder="Token"
                      type="text"
                      onChange={(e) => {
                        let infs = influx_types;
                        infs[index]["token"] = e.target.value;
                        setInfluxTypes(infs);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmbucket">Bucket</Label>
                    <input
                      value={influx.bucket}
                      className="form-control"
                      name="vmbucket"
                      placeholder="Bucket"
                      type="text"
                      onChange={(e) => {
                        let infs = influx_types;
                        infs[index]["bucket"] = e.target.value;
                        setInfluxTypes(infs);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="measurement">Measurement</Label>
                    <input
                      value={influx.measurement}
                      className="form-control"
                      name="measurement"
                      placeholder="Measurement"
                      type="text"
                      onChange={(e) => {
                        let infs = influx_types;
                        infs[index]["measurement"] = e.target.value;
                        setInfluxTypes(infs);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="future">Future</Label>
                    <input
                      value={influx.future}
                      className="form-control"
                      name="future"
                      placeholder="Future"
                      type="text"
                      onChange={(e) => {
                        let infs = influx_types;
                        infs[index]["future"] = e.target.value;
                        setInfluxTypes(infs);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="org">Org</Label>
                    <input
                      value={influx.org}
                      className="form-control"
                      name="org"
                      placeholder="ORG"
                      type="text"
                      onChange={(e) => {
                        let infs = influx_types;
                        infs[index]["org"] = e.target.value;
                        setInfluxTypes(infs);
                      }}
                    />
                  </div>
                </Colxx>
              </Row>
            </Colxx>
          </Row>
        ) : (
          <></>
        )}
      </Colxx>
    </>
  );
};

export default AddInflux;
