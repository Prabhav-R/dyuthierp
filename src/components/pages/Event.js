import React, { Component } from "react";
import { storage } from "../../firebase";
import { fetchevent } from "../../actions/eventActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Spinner from "../layout/Spinner";

import {
  updatePosterUrl,
  deletePoster,
  addRound
} from "../../actions/eventActions";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      isUploading: false,
      err: "",
      progress: "",
      roundname: "",
      date: "",
      time: "",
      venue: "",
      currRound: null,
      currIndex: "",
      roundnameError: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.setDetails = this.setDetails.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.closeModalRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.addRound = this.addRound.bind(this);
    this.updRound = this.updRound.bind(this);
    this.validate = this.validate.bind(this);
    this.deleteRound = this.deleteRound.bind(this);
  }

  addRound = e => {
    e.preventDefault();

    const { roundname, date, time, venue } = this.state;
    const { eid, rounds } = this.props.event.event;

    const dup = this.validate(roundname);

    if (dup) {
      this.setState({ [dup.type]: dup.err });
      return;
    }

    const newRound = { roundname, date, time, venue };

    let newRounds = Object.values(rounds);
    newRounds.push(newRound);
    this.props.addRound(eid, newRounds);
    document.querySelector(".modal-backdrop").classList = "";
    document.querySelector("body").classList.remove("modal-open");
  };

  updRound = e => {
    e.preventDefault();
    const { roundname, date, time, venue, currRound, currIndex } = this.state;

    const dup = this.validate(roundname);

    if (dup) {
      this.setState({ [dup.type]: dup.err });
      return;
    }

    if (
      roundname === currRound.roundname &&
      date === currRound.date &&
      time === currRound.time &&
      venue === currRound.venue
    ) {
      this.closeModalRef.current.click();
      return;
    }
    const { eid, rounds } = this.props.event.event;
    const newRound = { roundname, date, time, venue };
    let newRounds = Object.values(rounds);

    newRounds[currIndex] = newRound;
    this.props.addRound(eid, newRounds);

    // this.closeModalRef.current.click();
  };

  deleteRound = index => {
    const { eid, rounds } = this.props.event.event;
    let newRounds = Object.values(rounds);
    newRounds.splice(index, 1);
    if (newRounds.length === 0) {
      newRounds = "";
    }
    this.props.addRound(eid, newRounds);
  };

  handleModalClose = () => {
    this.setState({
      roundname: "",
      date: "",
      time: "",
      venue: "",
      currRound: null,
      currIndex: "",
      roundnameError: ""
    });
  };

  validate = roundname => {
    const { rounds } = this.props.event.event;
    if (
      rounds !== "" &&
      rounds.filter(round => round.roundname === roundname).length > 0
    ) {
      return {
        type: "roundnameError",
        err: "Roundname already exists"
      };
    }
    return null;
  };

  setDetails = index => {
    const { rounds } = this.props.event.event;
    this.setState({
      ...rounds[index],
      currRound: rounds[index],
      currIndex: index
    });
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  onChange = e => {
    if (this.state[`${e.target.name}Error`]) {
      this.setState({ [`${e.target.name}Error`]: "" });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpload = e => {
    const { image } = this.state;

    const { posterUrl } = this.props.event.event;

    if (image) {
      if (Math.floor(image.size / 1024) > 200) {
        this.setState({
          err: "Image size is greater than 200kb!",
          image: null
        });

        setTimeout(() => {
          this.setState({ err: "" });
        }, 2500);
      } else {
        if (posterUrl) {
          this.props.deletePoster(posterUrl);
        }
        this.setState({ isUploading: true });
        const uploadTask = storage.ref(`${image.name}`).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {
            // progrss function ....
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            this.setState({ progress });
          },
          error => {
            // error function ....
            console.log(error);
          },
          () => {
            // complete function ....
            storage
              .ref()
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                const { event } = this.props.event;
                this.props.updatePosterUrl(event.eid, url);
                this.setState({
                  isUploading: false,
                  progress: "",
                  image: null
                });
              });
          }
        );
      }
    } else {
      this.setState({ err: "Please select an image to upload" });
      setTimeout(() => {
        this.setState({ err: "" });
      }, 2500);
    }
  };

  componentDidMount() {
    this.props.fetchevent(this.props.auth.user.split("@")[0]);
  }

  render() {
    const {
      image,
      isUploading,
      progress,
      err,
      roundname,
      date,
      time,
      venue,
      roundnameError
    } = this.state;
    const { event, loading } = this.props.event;
    const {
      posterUrl,
      eventname,
      department,
      rounds,
      fee,
      type,
      desc,
      teamStrength
    } = event;

    function formatDate(input) {
      var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1],
        day = datePart[2];

      return day + "/" + month + "/" + year;
    }

    if (loading && !isUploading) {
      return <Spinner />;
    }
    return (
      <React.Fragment>
        {/* JUMBOTRON */}

        <div className="container mt-3">
          <div
            className="jumbotron"
            style={{
              textAlign: "center",
              height: "25rem",
              backgroundColor: `${posterUrl ? "#fff" : ""}`
            }}
          >
            {posterUrl && (
              <img
                src={posterUrl}
                className="mb-5"
                style={{
                  height: "20rem",
                  width: "20em",
                  backgroundSize: "cover"
                }}
                alt="Event poster"
              />
            )}
          </div>
          {/* JUMBOTRON */}

          {/* FILE INPUT */}

          <div
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              fontSize: "medium"
            }}
            className="input-group"
          >
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
                onChange={this.handleChange}
                required={true}
              />
              <label
                className="pr-5 custom-file-label"
                htmlFor="inputGroupFile04"
              >
                {posterUrl
                  ? image
                    ? image.name
                    : "Change poster"
                  : image
                  ? image.name
                  : "Choose poster"}
              </label>
            </div>
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="inputGroupFileAddon04"
                onClick={this.handleUpload}
              >
                Upload
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {err && (
            <div className="alert alert-danger" role="alert">
              {err}
            </div>
          )}

          {/* ERROR MESSAGE */}

          {/* PROGRESS BAR */}

          {isUploading && (
            <div className="mt-4 mb-3">
              <progress style={{ width: "100%" }} max="100" value={progress} />
            </div>
          )}

          {/* PROGRESS BAR */}

          {/* FILE INPUT */}

          {/* INFO */}

          <div className="row">
            <div className="col-md-12">
              <h2>{eventname}</h2>
            </div>
          </div>

          {type === "Individual" || !type ? (
            <div className="row">
              <div className="col-md-12">
                <h5>
                  {type ? type : <Link to="/edit-event">Set Event Type</Link>}
                </h5>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <h5>Team of {teamStrength}</h5>
              </div>
            </div>
          )}

          {department !== "" && (
            <div className="row">
              <div className="col-md-12">
                <h6>{`(${department})`}</h6>
              </div>
            </div>
          )}

          {fee !== "" && (
            <div className="row mt-2">
              <div className="col-md-12">
                <h5>{`Fee: ${fee}`}</h5>
              </div>
            </div>
          )}

          <div className="row mt-3">
            <div className="col-md-12">
              <h2>Event Description</h2>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <p>
                {desc ? (
                  desc
                ) : (
                  <Link to="/edit-event">Set Event Description</Link>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ROUNDS */}

        <div className="row mb-2 mt-3">
          <div className="col-8">
            <h2>Rounds</h2>
          </div>
          <div style={{ textAlign: "left" }} className="col-4">
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#roundModal"
            >
              Add Round
            </button>
          </div>
        </div>

        {rounds && rounds.length > 0 ? (
          rounds.map((round, index) => (
            <div key={index} className="card mb-4 text-center container">
              <div className="card-header">{round.roundname}</div>
              <div className="card-body">
                <div className="row card-text mb-2">
                  <div className="col-4">
                    <h6>Date : {formatDate(round.date)}</h6>
                  </div>
                  <div className="col-3">
                    <h6>
                      Time :{" "}
                      {new Date(
                        "1970-01-01T" + round.time + "Z"
                      ).toLocaleTimeString(
                        {},
                        {
                          timeZone: "UTC",
                          hour12: true,
                          hour: "numeric",
                          minute: "numeric"
                        }
                      )}
                    </h6>
                  </div>
                  <div className="col-5">
                    <h6>Venue : {round.venue}</h6>
                  </div>
                </div>
                <button
                  onClick={() => this.setDetails(index)}
                  data-toggle="modal"
                  data-target="#updateroundModal"
                  className="btn btn-primary mr-1"
                >
                  Update
                </button>
                <button
                  onClick={() => this.deleteRound(index)}
                  href="#"
                  className="btn btn-danger ml-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="row">
            <div className="col-md-12">
              <h4>No Rounds Added Yet </h4>
            </div>
          </div>
        )}

        {/* ROUNDS */}

        {/* INFO */}

        {/*ADD ROUND MODAL */}

        <div
          className="modal fade"
          id="roundModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="roundModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="roundModalLabel">
                  Add Round
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
                <form onSubmit={this.addRound}>
                  <div className="form-group">
                    <label htmlFor="roundname" className="col-form-label">
                      Round Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ADD_roundname"
                      onChange={this.onChange}
                      name="roundname"
                      value={roundname}
                      required
                      minLength="5"
                    />
                    {roundnameError && (
                      <div
                        style={{ width: "100%" }}
                        className="alert alert-danger mt-2"
                        role="alert"
                      >
                        {roundnameError}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="date" className="col-form-label">
                          Date:
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="ADD_date"
                          name="date"
                          onChange={this.onChange}
                          value={date}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="time" className="col-form-label">
                          Time:
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          id="ADD_time"
                          name="time"
                          onChange={this.onChange}
                          value={time}
                          required
                        />
                        <small id="ADD_time" className="form-text text-muted">
                          Enter time in 24 hour format
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="venue" className="col-form-label">
                      Venue:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="venue"
                      id="ADD_venue"
                      minLength="5"
                      onChange={this.onChange}
                      value={venue}
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
                      Add Round
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/*ADD ROUND MODAL */}

        {/* UPDATE ROUND MODAL */}

        <div
          className="modal fade"
          id="updateroundModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="updateroundModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateroundModalLabel">
                  Update Round
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
                <form onSubmit={this.updRound}>
                  <div className="form-group">
                    <label htmlFor="roundname" className="col-form-label">
                      Round Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="UPD_roundname"
                      onChange={this.onChange}
                      name="roundname"
                      value={roundname}
                      required
                      minLength="5"
                    />
                    {roundnameError && (
                      <div
                        style={{ width: "100%" }}
                        className="alert alert-danger mt-2"
                        role="alert"
                      >
                        {roundnameError}
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="date" className="col-form-label">
                          Date:
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="UPD_date"
                          name="date"
                          onChange={this.onChange}
                          value={date}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="time" className="col-form-label">
                          Time:
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          id="UPD_time"
                          name="time"
                          onChange={this.onChange}
                          value={time}
                          required
                        />
                        <small id="UPD_time" className="form-text text-muted">
                          Enter time in 24 hour format
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="venue" className="col-form-label">
                      Venue:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="venue"
                      id="UPD_venue"
                      minLength="5"
                      onChange={this.onChange}
                      value={venue}
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
                      Update Round
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* UPDATE ROUND MODAL */}
      </React.Fragment>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  fetchevent: PropTypes.func.isRequired,
  addRound: PropTypes.func.isRequired,
  updatePosterUrl: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, {
  fetchevent,
  updatePosterUrl,
  deletePoster,
  addRound
})(Event);
