import React from "react";
import { Row, Label } from "reactstrap";
import { Colxx } from "../../components/Common/CustomBootstrap";
import { Card } from "reactstrap";

const VictoriaMatrics = ({
  index,
  vm,
  vm_types,
  setVMTypes,
  openedVMSteps,
  handleVMSteps,
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
                    {index + 1}. {vm.server_url}
                  </div>
                  <div className="d-flex align-items-center">
                    <i
                      onClick={() => {
                        handleVMSteps(index);
                      }}
                      className={
                        openedVMSteps.includes(index)
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
                        let vms = [...vm_types];
                        vms.splice(index, 1);
                        setVMTypes([...vms]);
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

        {openedVMSteps.includes(index) ? (
          <Row className="mt-1 w-100 justify-content-center">
            <Colxx lg="11">
              <Row>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmport">PORT</Label>
                    <input
                      value={vm.port}
                      className="form-control"
                      name="vmport"
                      placeholder="PORT"
                      type="text"
                      onChange={(e) => {
                        let vms = [...vm_types];
                        vms[index]["port"] = e.target.value;
                        setVMTypes([...vms]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmurl">Server URL</Label>
                    <input
                      value={vm.server_url}
                      className="form-control"
                      name="vmurl"
                      placeholder="Server URL"
                      type="text"
                      onChange={(e) => {
                        let vms = [...vm_types];
                        vms[index]["server_url"] = e.target.value;
                        setVMTypes([...vms]);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmtoken">Token</Label>
                    <input
                      value={vm.token}
                      className="form-control"
                      name="vmtoken"
                      placeholder="Token"
                      type="text"
                      onChange={(e) => {
                        let vms = vm_types;
                        vms[index]["token"] = e.target.value;
                        setVMTypes(vms);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="vmbucket">Bucket</Label>
                    <input
                      value={vm.bucket}
                      className="form-control"
                      name="vmbucket"
                      placeholder="Bucket"
                      type="text"
                      onChange={(e) => {
                        let vms = vm_types;
                        vms[index]["bucket"] = e.target.value;
                        setVMTypes(vms);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="measurement">Measurement</Label>
                    <input
                      value={vm.measurement}
                      className="form-control"
                      name="measurement"
                      placeholder="Measurement"
                      type="text"
                      onChange={(e) => {
                        let vms = vm_types;
                        vms[index]["measurement"] = e.target.value;
                        setVMTypes(vms);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="future">Future</Label>
                    <input
                      value={vm.future}
                      className="form-control"
                      name="future"
                      placeholder="Future"
                      type="text"
                      onChange={(e) => {
                        let vms = vm_types;
                        vms[index]["future"] = e.target.value;
                        setVMTypes(vms);
                      }}
                    />
                  </div>
                </Colxx>
                <Colxx lg="4">
                  <div className="form-group mb-3">
                    <Label htmlFor="org">Org</Label>
                    <input
                      value={vm.org}
                      className="form-control"
                      name="org"
                      placeholder="ORG"
                      type="text"
                      onChange={(e) => {
                        let vms = vm_types;
                        vms[index]["org"] = e.target.value;
                        setVMTypes(vms);
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

export default VictoriaMatrics;
