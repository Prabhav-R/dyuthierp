import React, { Component } from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import { firebase } from "./firebase";

import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import ComingSoon from "./components/layout/ComingSoon";
import PageNotFound from "./components/layout/PageNotFound";

import Event from "./components/pages/Event";
import ParticipantList from "./components/pages/ParticipantList";
import EditEvent from "./components/pages/EditEvent";

import AdminPage from "./components/pages/AdminPage";

class App extends Component {
  constructor(props) {
    super(props);

    this.authListener = this.authListener.bind(this);

    this.state = {
      user: null,
      me: firebase.auth().currentUser
    };
  }

  componentDidMount() {
    this.authListener();
  }
  authListener() {
    firebase.auth().onAuthStateChanged(user => {
      const { auth, dispatch } = this.props;
      if (user) {
        if (!auth.isauthenticated) {
          dispatch({ type: "SET_AUTH", payload: user });
        }
        this.setState({ user });
      } else {
        if (auth.isauthenticated) {
          dispatch({ type: "UNSET_AUTH" });
        }
        this.setState({ user: null });
      }
    });
  }

  render() {
    const { user } = this.props.auth;

    if (user === "johndoe@gmail.com") {
      return (
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/login" component={Login} />

              <PrivateRoute exact path="/" component={AdminPage} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      );
    }

    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/login" component={Login} />

            <PrivateRoute exact user path="/" component={Event} />
            <PrivateRoute
              exact
              path="/participant-list"
              component={ComingSoon}
            />
            <PrivateRoute exact path="/edit-event" component={EditEvent} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(App);
