import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Colxx, Separator } from "./CustomBootstrap";
import BreadCrumb from "./BreadCrumb";

class PageHeader extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      display_type: props.display_type
        ? props.display_type
        : localStorage.getItem(props.heading)
        ? localStorage.getItem(props.heading)
        : "card",
    };

    localStorage.setItem(props.heading, this.state.display_type);
  }

  render() {
    return (
      <Fragment>
        <Row mt="4">
          <Colxx xxs="12">
            <BreadCrumb title={this.props.heading} match={this.props.match} />

            {this.props.back_button ? (
              <div className="top-right-button-container float-right">
                <Button
                  className="btn btn-light float-right"
                  onClick={this.props.history.goBack}
                >
                  Back
                </Button>
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.add_upload ? (
              <div className="top-right-button-container float-right ml-1">
                <NavLink
                  to={this.props.add_upload_url}
                  className="btn btn-sm btn-primary"
                >
                  {this.props.add_upload_name
                    ? this.props.add_upload_name
                    : "Upload"}
                </NavLink>
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.add_new ? (
              <div className="top-right-button-container float-right ml-1">
                {this.props.add_url_popup ? (
                  <Button onClick={() => this.props.createNew()}>Create</Button>
                ) : (
                  <NavLink
                    to={this.props.add_new_url}
                    className="btn btn-sm btn-primary"
                  >
                    {this.props.add_new_label
                      ? this.props.add_new_label
                      : "Create"}
                  </NavLink>
                )}
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.add_new_pre ? (
              <div className="ml-1 top-right-button-container float-right">
                {this.props.applianceList.length === 1 ? (
                  <Link
                    to={`/app/camera/dashboard/add/${this.props.applianceList[0].value[0].camera_id}`}
                    className="btn btn-sm btn-primary"
                  >
                    {this.props.add_new_pre_name}
                  </Link>
                ) : (
                  <Button
                    onClick={() => this.props.add_new_pre_function()}
                    className="btn btn-sm btn-primary"
                  >
                    {this.props.add_new_pre_name}
                  </Button>
                )}
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.displaySelector ? (
              <div
                role="group"
                className="btn-group-sm btn-group top-right-button-container float-right"
              >
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ display_type: "card" });
                    this.props.changeDisplay("card");
                    localStorage.setItem(this.props.heading, "card");
                  }}
                  className={`btn btn-light ${
                    this.state.display_type === "card" ? "active" : ""
                  }`}
                >
                  <i className="simple-icon-grid"> </i>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ display_type: "table" });
                    this.props.changeDisplay("table");
                    localStorage.setItem(this.props.heading, "table");
                  }}
                  className={`btn btn-light ${
                    this.state.display_type === "table" ? "active" : ""
                  }`}
                >
                  <i className="fa fa-table"> </i>
                </button>
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.is_filter ? (
              <div className="d-block mb-2 d-md-inline-block float-right mt-2 mr-2">
                <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                  <input
                    type="text"
                    placeholder="Search"
                    value={this.props.filter}
                    className="form-control"
                    onChange={(text) => {
                      this.props.filter_func(text.target.value);
                    }}
                  />
                </div>
              </div>
            ) : (
              <Fragment></Fragment>
            )}

            {this.props.custom_button ? this.props.custom_button : ""}

            {this.props.children}
          </Colxx>
        </Row>
        <Separator mb="4" />
      </Fragment>
    );
  }
}

PageHeader.defaultProps = {
  add_new_pre: null,
  add_new_pre_function: null,
  custom_button: null,
};

PageHeader.propTypes = {
  is_filter: PropTypes.bool,
  filter_func: PropTypes.func,
  heading: PropTypes.string,
  add_new: PropTypes.bool,
  add_new_url: PropTypes.string,
  add_new_pre: PropTypes.bool,
  add_new_pre_function: PropTypes.func,
  add_new_pre_name: PropTypes.string,
  back_button: PropTypes.bool,
  custom_button: PropTypes.object,
};

export default PageHeader;
