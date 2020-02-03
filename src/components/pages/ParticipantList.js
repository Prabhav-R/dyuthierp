import React, { Component } from "react";

class ParticipantList extends Component {
  confirm_close = () => {
    if (
      window.confirm("Are you sure to close this event? This can't be undone")
    ) {
      this.props.history.push("/");
    }
  };
  render() {
    return (
      <div className="container mb-3">
        <div className="row mt-3">
          <div className="col-md-12">
            <h2>Participant List</h2>
          </div>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-md-12 page-header">
            <span
              style={{
                width: "10px",
                height: "10px",
                background: "#34ed8e",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Reported
            <span
              style={{
                width: "10px",
                height: "10px",
                background: "#ff8360",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Not Paid
            <span
              style={{
                width: "10px",
                height: "10px",
                background: "#fff",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Paid
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button
              type="button"
              className="mt-2 mr-1 btn btn-danger"
              onClick={this.confirm_close}
            >
              Close Registration
            </button>
            <a href="/erp/participants/download/">
              <button type="button" className="mt-2 ml-1 btn btn-info">
                Download Reported Participants Details
              </button>
            </a>
          </div>
        </div>
        <ul className="list-group mt-4 mb-3">
          <li className="list-group-item list-group-item-success">
            <div className="row">
              <div className="col-sm-6 col-md-6">1127</div>
              <div className="col-sm-6 col-md-6">John Doe</div>
            </div>
          </li>
          <li className="list-group-item list-group-item-warning">
            <div className="row">
              <div className="col-sm-6 col-md-6">1128</div>
              <div className="col-sm-6 col-md-6">Benny Dit</div>
            </div>
          </li>
          <li className="list-group-item">
            <div className="row">
              <div className="col-sm-6 col-md-6">1128</div>
              <div className="col-sm-6 col-md-6">Benny Dit</div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default ParticipantList;
