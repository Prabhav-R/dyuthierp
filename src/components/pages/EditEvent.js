import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { updateEvent } from "../../actions/eventActions";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import * as draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import sanitizeHtml from "sanitize-html";

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: "",
      teamStrength: "",
      fee: "",
      type: "Individual",
      is_department: false,
      department: "",
      editorState: EditorState.createEmpty()
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    const { event } = this.props.event;
    const { desc, type, teamStrength, fee, is_department, department } = event;

    const contentBlock = htmlToDraft(desc);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState
      });
    }

    this.setState({ desc, type, teamStrength, fee, is_department, department });
  }

  onEditorStateChange: Function = editorState => {
    this.setState({
      editorState
    });
  };

  onSubmit(e) {
    e.preventDefault();
    // HANDLE FORM SUBMISSION

    const { teamStrength, fee } = this.state;
    let { desc, is_department, department, type, editorState } = this.state;

    const op = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    desc = sanitizeHtml(op);

    if (type === "") {
      type = "Individual";
    }

    if (department === "") {
      department = "GENERAL EVENT";
    }

    if (department === "GENERAL EVENT") {
      is_department = false;
    } else {
      is_department = true;
    }

    const { eid, eventname, username, posterUrl } = this.props.event.event;
    let { rounds } = this.props.event.event;
    if (rounds.length === 0) {
      rounds = "";
    }
    const newEvent = {
      desc,
      fee,
      type,
      teamStrength,
      rounds,
      is_department,
      department,
      eid,
      eventname,
      posterUrl,
      username
    };

    this.props.updateEvent(newEvent, this.props.history);
  }

  render() {
    let w;
    if (this.state.type === "Individual" || this.state.type === "") {
      w = 5;
    } else {
      w = 3;
    }
    const { eventname } = this.props.event.event;

    return (
      <form
        className="container text-center border border-light p-4"
        onSubmit={this.onSubmit}
      >
        <p className="h2 mb-4">{eventname}</p>
        <p className="h4 mb-4">Edit Event</p>
        <div className="form-group row">
          <label className="col-sm-1 col-form-label">Type</label>
          <select
            placeholder="Event type"
            name="type"
            value={this.state.type}
            onChange={this.onChange}
            className={`col-sm-${w} browser-default custom-select`}
            required
          >
            <option value disabled>
              Choose option
            </option>

            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>

          {w === 3 ? (
            <React.Fragment>
              <label
                htmlFor="strengthInput"
                className="col-sm-1 col-form-label"
              >
                Strength
              </label>
              <div className={`col-sm-${w}`}>
                <input
                  type="number"
                  className="form-control"
                  id="strengthInput"
                  name="teamStrength"
                  placeholder="Team Strength"
                  value={this.state.teamStrength}
                  onChange={this.onChange}
                  required
                />
              </div>
            </React.Fragment>
          ) : null}

          <label htmlFor="feesInput" className="col-sm-1 col-form-label">
            Fees
          </label>
          <div className={`col-sm-${w}`}>
            <input
              type="number"
              className="form-control"
              name="fee"
              id="feesInput"
              value={this.state.fee}
              onChange={this.onChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <select
            name="department"
            value={this.state.department}
            onChange={this.onChange}
            className="browser-default custom-select"
            required
          >
            <option value disabled>
              Choose department
            </option>

            <option value="GENERAL EVENT">GENERAL EVENT</option>
            <option value="CSE">CSE</option>
            <option value="MECH">MECH</option>
            <option value="EC">EC</option>
            <option value="ARCH">ARCH</option>
            <option value="PROD">PROD</option>
            <option value="CHEM">CHEM</option>
            <option value="EEE">EEE</option>
            <option value="CE">CE</option>
            <option value="MCA">MCA</option>
          </select>
        </div>
        <div className="form-group">
          <Editor
            editorState={this.state.editorState}
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>

        <button className="btn btn-info btn-block" type="submit">
          Submit
        </button>
      </form>
    );
  }
}

EditEvent.propTypes = {
  event: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});

export default connect(mapStateToProps, { updateEvent })(withRouter(EditEvent));
