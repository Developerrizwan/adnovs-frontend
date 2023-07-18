import React from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer
        className="footer"
        style={{
          background: "#f3f3f9",
          boxShadow: "0 5px 5px rgba(56, 65, 74, 0.15)",
        }}
      >
        <Container fluid>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © ADNOV.</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                ADNOV SHIPPING & LOGISTICS
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
