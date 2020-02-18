import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.png";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick = e => {
    e.preventDefault();

    this.props.logout();
  };

  render() {
    const { isauthenticated, user } = this.props.auth;

    if (user === "lettertodyuthi@gmail.com") {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className="navbar-brand" to="/">
            <img
              style={{ marginRight: "6px" }}
              src={logo}
              width={15}
              height={28}
              className="d-inline-block align-top"
              alt="Dyuthi Logo"
            />
            Dyuthi
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {isauthenticated && (
                <li className="nav-item">
                  <a
                    href="#!"
                    className="nav-link"
                    onClick={this.onLogoutClick}
                  >
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      );
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <img
            style={{ marginRight: "6px" }}
            src={logo}
            width={15}
            height={28}
            className="d-inline-block align-top"
            alt="Dyuthi Logo"
          />
          Dyuthi
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {isauthenticated && (
              <React.Fragment>
                <li className="nav-item active">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-event">
                    Edit Event
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/participant-list">
                    Participant list
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="#!"
                    className="nav-link"
                    onClick={this.onLogoutClick}
                  >
                    Logout
                  </a>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
