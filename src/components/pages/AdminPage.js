import React, { Component } from "react";
import uuid from "uuid";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";

import {
  addevent,
  fetchevents,
  fetchusers,
  updevent,
  delevent
} from "../../actions/eventActions";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.setDetails = this.setDetails.bind(this);
    this.validate = this.validate.bind(this);

    this.closeModalRef = React.createRef();

    this.state = {
      eventname: "",
      username: "",
      usernameError: "",
      password: "",
      eventnameError: "",
      currEvent: null,
      loading: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors.err) {
      this.setState({ usernameError: true, err: nextProps.errors.err });
    }
  }

  componentDidMount() {
    this.props.fetchusers();
    this.props.fetchevents();
  }

  setDetails = eid => {
    const { events, users } = this.props.event;
    const currEvent = events.filter(ev => ev.eid === eid)[0];
    const currUser = users.filter(user => user.eid === eid)[0];
    const { password } = currUser;
    const { eventname, username } = currEvent;
    this.setState({ eventname, username, password, currEvent });
  };

  validate = (eventname, username, ceid) => {
    const { users, events } = this.props.event;

    if (
      users.filter(user => user.username === username && user.eid !== ceid)
        .length > 0
    ) {
      return { type: "usernameError", err: "usermail already exists" };
    }

    if (
      events.filter(e => e.eventname === eventname && e.eid !== ceid).length > 0
    ) {
      return { type: "eventnameError", err: "eventname already exists" };
    }
    return null;
  };

  updateEvent = e => {
    e.preventDefault();
    const { currEvent, eventname, username, password } = this.state;
    const { users } = this.props.event;

    const { eid } = currEvent;

    const dup = this.validate(eventname, username, eid);

    if (dup) {
      this.setState({ [dup.type]: dup.err });
      return;
    }

    const currUser = users.filter(user => user.eid === eid)[0];

    if (
      username === currEvent.username &&
      eventname === currEvent.eventname &&
      password === currUser.password
    ) {
      this.closeModalRef.current.click();
      return;
    }

    this.props.updevent({ eventname, username, password }, currEvent, currUser);

    this.closeModalRef.current.click();
  };

  addEvent = e => {
    e.preventDefault();

    const { eventname, username, password } = this.state;

    const eid = uuid();
    const dup = this.validate(eventname, username, eid);

    if (dup) {
      this.setState({ [dup.type]: dup.err });
      return;
    }

    const desc = "",
      rounds = "",
      is_department = "",
      department = "",
      fee = "",
      type = "",
      teamStrength = "",
      posterUrl = "";

    const newEvent = {
      desc,
      rounds,
      is_department,
      department,
      fee,
      type,
      teamStrength,
      eid,
      eventname,
      posterUrl,
      username
    };

    const newUser = {
      username,
      eid,
      password
    };

    this.props.addevent(newEvent, newUser);
    this.handleModalClose();
  };

  handleModalClose = () => {
    this.setState({
      eventname: "",
      username: "",
      password: "",
      eventnameError: "",
      usernameError: "",
      currEvent: null,
      loading: false
    });
  };

  deleteEvent = e => {
    const { currEvent } = this.state;
    const { username, eid, posterUrl } = currEvent;
    const { users } = this.props.event;
    const currUser = users.filter(user => user.eid === eid)[0];
    const { password } = currUser;

    this.props.delevent(username, password, eid, posterUrl);
  };

  onChange(e) {
    if (this.state[`${e.target.name}Error`]) {
      this.setState({ [`${e.target.name}Error`]: "" });
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      eventname,
      eventnameError,
      username,
      usernameError,
      password
    } = this.state;

    const { loading, events } = this.props.event;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 mt-5" style={{ textAlign: "center" }}>
            <h2>Admin Page</h2>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12" style={{ textAlign: "center" }}>
            <button
              data-toggle="modal"
              data-target="#exampleModal"
              className="btn btn-primary"
              style={{ width: "45%" }}
              onClick={this.handleModalClose}
            >
              Add Event
            </button>
          </div>
        </div>
        <ul className="list-group mt-5 mb-5">
          <li className="list-group-item">
            <div className="row">
              <div className="col-sm-6 col-md-8">Event Name</div>
              <div className="col-sm-6 col-md-4">Usermail</div>
            </div>
          </li>
          {!loading ? (
            events.map(event => (
              <li
                style={{ cursor: "pointer", userSelect: "none" }}
                key={event.eid}
                data-toggle="modal"
                data-target="#exampleModal2"
                className="list-group-item"
                onClick={() => this.setDetails(event.eid)}
              >
                <div className="row">
                  <div className="col-sm-6 col-md-8">{event.eventname}</div>
                  <div className="col-sm-6 col-md-4">{event.username}</div>
                </div>
              </li>
            ))
          ) : (
            <Spinner />
          )}
        </ul>

        <div>
          {/*  DETAILS MODAL */}
          <div
            className="modal fade"
            id="exampleModal2"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Details
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    ref={this.closeModalRef}
                    onClick={this.handleModalClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.updateEvent}>
                    <div className="form-group">
                      <label htmlFor="eventname1" className="col-form-label">
                        Event Name:
                      </label>
                      <input
                        type="text"
                        className={classnames("form-control", {
                          "is-invalid": eventnameError
                        })}
                        id="eventname1"
                        name="eventname"
                        minLength="5"
                        value={eventname}
                        onChange={this.onChange}
                        required
                      />
                      {eventnameError && (
                        <div
                          style={{ width: "100%" }}
                          className="alert alert-danger mt-2"
                          role="alert"
                        >
                          {eventnameError}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="username1" className="col-form-label">
                        Usermail :
                      </label>
                      <input
                        type="email"
                        className={classnames("form-control", {
                          "is-invalid": usernameError
                        })}
                        id="username1"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        minLength="5"
                        required
                      />
                      {usernameError && (
                        <div
                          style={{ width: "100%" }}
                          className="alert alert-danger mt-2"
                          role="alert"
                        >
                          {usernameError}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="password1" className="col-form-label">
                        Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="password1"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        minLength="8"
                        required
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-dismiss="modal"
                        onClick={this.deleteEvent}
                      >
                        Delete
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/*  DETAILS MODAL */}

          {/* ADD EVENT MODAL */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add New Event
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={this.handleModalClose}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  {loading ? (
                    <Spinner />
                  ) : (
                    <form onSubmit={this.addEvent}>
                      <div className="form-group">
                        <label htmlFor="eventnameId" className="col-form-label">
                          Event Name:
                        </label>
                        <input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": eventnameError
                          })}
                          id="eventnameId"
                          name="eventname"
                          value={eventname}
                          onChange={this.onChange}
                          minLength="5"
                          required
                        />

                        {eventnameError && (
                          <div
                            style={{ width: "100%" }}
                            className="alert alert-danger mt-2"
                            role="alert"
                          >
                            {eventnameError}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="usernameId" className="col-form-label">
                          Usermail:
                        </label>
                        <input
                          type="email"
                          className={classnames("form-control", {
                            "is-invalid": usernameError
                          })}
                          id="usernameId"
                          name="username"
                          value={username}
                          onChange={this.onChange}
                          minLength="5"
                          required
                        />
                        {usernameError && (
                          <div
                            style={{ width: "100%" }}
                            className="alert alert-danger mt-2"
                            role="alert"
                          >
                            {usernameError}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="passwordId" className="col-form-label">
                          Password
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="passwordId"
                          name="password"
                          value={password}
                          onChange={this.onChange}
                          minLength="8"
                          required
                        />
                      </div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-dismiss="modal"
                          onClick={this.handleModalClose}
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Create Event
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ADD EVENT MODAL*/}
        </div>
      </div>
    );
  }
}

AdminPage.propTypes = {
  event: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addevent: PropTypes.func.isRequired,
  fetchevents: PropTypes.func.isRequired,
  fetchusers: PropTypes.func.isRequired,
  delevent: PropTypes.func.isRequired,
  updevent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});

export default connect(mapStateToProps, {
  addevent,
  fetchevents,
  fetchusers,
  updevent,
  delevent
})(AdminPage);
