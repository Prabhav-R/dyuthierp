import React from "react";
import pagenotfound from "./pagenotfound.gif";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          <h2>There no such thing</h2>
          <Link to="/">Go Back</Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mt-4">
          <img
            src={pagenotfound}
            alt="page not found"
            style={{
              width: "45%",
              height: "90%",
              margin: "auto",
              display: "block"
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
