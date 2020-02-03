import React, { Component } from "react";
import logo from "../../logo.png";
import "./sigin.css";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";

import { login } from "../../actions/authActions";
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.login(this.state.email, this.state.password);

    this.setState({
      email: "",
      password: ""
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { auth, history, errors } = nextProps;
    if (auth.isauthenticated) {
      history.push("/");
    }
    if (errors.err) {
      this.setState({
        err: errors.err.code
          .split("/")[1]
          .split("-")
          .join(" ")
      });
      setTimeout(() => this.setState({ err: "" }), 3000);
    }
  }

  componenWillMount() {
    const { auth, history } = this.props;
    if (auth.isauthenticated) {
      history.push("/");
    }
  }

  render() {
    const { email, password, err } = this.state;
    const { loading, isauthenticated } = this.props.auth;
    if (loading) {
      return <Spinner />;
    }
    if (isauthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <form onSubmit={this.onSubmit} className="form-signin">
        <img className="mb-4" src={logo} alt="" height="150em" />
        <h1 className="h3 mb-3 font-weight-normal">Log in</h1>
        <label htmlFor="inputemail" className="sr-only">
          username
        </label>
        <input
          type="email"
          id="inputemail"
          className="form-control"
          placeholder="email"
          name="email"
          value={email}
          onChange={this.onChange}
          required
        />
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          name="password"
          value={password}
          onChange={this.onChange}
          required
        />

        {err && (
          <div className="alert alert-danger" role="alert">
            {err}
          </div>
        )}

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Login
        </button>
        <p className="mt-5 mb-3 text-muted">
          © {new Date().getFullYear() - 1}-{new Date().getFullYear()}
        </p>
      </form>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { login })(Login);
