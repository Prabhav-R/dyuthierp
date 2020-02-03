import {
  SET_LOADING,
  ADD_EVENT,
  CLEAR_ERR,
  DEL_EVENT,
  GET_EVENTS,
  GET_EVENT,
  GET_USERS,
  SET_POSTER,
  UPD_EVENT,
  UPD_ROUNDS,
  UPD_USER
} from "./types";
import { firebase, storage, secondaryApp } from "../firebase";

export const addRound = (eid, newRounds) => dispatch => {
  dispatch(setloading());
  firebase
    .database()
    .ref("events/" + eid + "/rounds")
    .set(newRounds)
    .then(() => {
      dispatch({
        type: UPD_ROUNDS,
        payload: newRounds
      });
      dispatch(setloading());
    })
    .catch(err => {
      console.log(err);
      dispatch(setloading());
    });
};

export const delevent = (username, password, eid, url) => dispatch => {
  dispatch(setloading());
  if (url) {
    deletePoster(url);
  }

  secondaryApp
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then(u => {
      const sec = secondaryApp.auth().currentUser;
      sec
        .delete()
        .then(() => {
          firebase
            .database()
            .ref("events/" + eid)
            .remove()
            .then(() => {
              firebase
                .database()
                .ref("users/" + username.split("@")[0])
                .remove()
                .then(() => {
                  dispatch({
                    type: DEL_EVENT,
                    payload: { eid, username }
                  });
                  dispatch(setloading());
                });
            });
        })
        .catch(function(error) {
          dispatch(setloading());
          console.log(error);
        });
    })
    .catch(err => {
      console.log(err);
      dispatch(setloading());
    });
};

export const fetchevents = () => dispatch => {
  dispatch(setloading());
  firebase
    .database()
    .ref("events")
    .once("value")
    .then(snapshot => {
      dispatch({
        type: GET_EVENTS,
        payload: snapshot.val()
      });
      dispatch(setloading());
    })
    .catch(error => {
      console.log("Synchronization failed");
      dispatch(setloading());
    });
};

export const fetchevent = username => dispatch => {
  dispatch(setloading());

  firebase
    .database()
    .ref("users/" + username)
    .once("value")
    .then(snapshot => {
      const { eid } = snapshot.val();
      firebase
        .database()
        .ref("events/" + eid)
        .once("value")
        .then(snapshot => {
          dispatch({
            type: GET_EVENT,
            payload: snapshot.val()
          });
          dispatch(setloading());
        });
    });
};

export const fetchusers = () => dispatch => {
  firebase
    .database()
    .ref("users")
    .once("value")
    .then(snapshot => {
      dispatch({
        type: GET_USERS,
        payload: snapshot.val()
      });
    })
    .catch(err => {
      console.log("Synchronization failed");
      console.log(err);
    });
};

export const updevent = (
  { eventname, username, password },
  currEvent,
  currUser
) => dispatch => {
  const {
    eid,
    rounds,
    is_department,
    department,
    fee,
    type,
    teamStrength,
    desc,
    posterUrl
  } = currEvent;

  const newEvent = {
    eid,
    rounds,
    fee,
    type,
    teamStrength,
    desc,
    posterUrl,
    is_department,
    department,
    eventname,
    username
  };

  const newUser = {
    eid,
    username,
    password
  };

  if (eventname !== currEvent.eventname) {
    dispatch(setloading());

    firebase
      .database()
      .ref("events/" + eid + "/eventname")
      .set(eventname)
      .then(() => {
        dispatch({
          type: UPD_EVENT,
          payload: newEvent
        });
        dispatch(setloading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setloading());
      });
  }

  if (username !== currEvent.username && password !== currUser.password) {
    dispatch(setloading());
    secondaryApp
      .auth()
      .signInWithEmailAndPassword(currUser.username, currUser.password)
      .then(u => {
        const user = secondaryApp.auth().currentUser;

        user
          .updatePassword(password)
          .then(() => {
            user
              .updateEmail(username)
              .then(() => {
                firebase
                  .database()
                  .ref("events/" + eid + "/username")
                  .set(username)
                  .then(() => {
                    dispatch({
                      type: UPD_EVENT,
                      payload: newEvent
                    });

                    firebase
                      .database()
                      .ref("users/" + currUser.username.split("@")[0])
                      .remove()
                      .then(() => {
                        firebase
                          .database()
                          .ref("users/" + username.split("@")[0])
                          .set(newUser)
                          .then(() => {
                            dispatch({
                              type: UPD_USER,
                              payload: newUser
                            });
                            dispatch(setloading());
                          })
                          .catch(err => {
                            console.log(err);
                            dispatch(setloading());
                          });
                      })
                      .catch(err => {
                        console.log(err);
                        dispatch(setloading());
                      });
                  })
                  .catch(err => {
                    console.log(err);
                    dispatch(setloading());
                  });
              })
              .catch(err => {
                console.log(err);
                dispatch(setloading());
              });
          })
          .catch(err => {
            console.log(err);
            dispatch(setloading());
          });
      })
      .catch(err => {
        console.log(err);
        dispatch(setloading());
      });
  } else {
    dispatch(setloading());
    secondaryApp
      .auth()
      .signInWithEmailAndPassword(currUser.username, currUser.password)
      .then(u => {
        const user = secondaryApp.auth().currentUser;

        dispatch(setloading());

        if (username !== currUser.username) {
          dispatch(setloading());
          user
            .updateEmail(username)
            .then(() => {
              firebase
                .database()
                .ref("events/" + eid + "/username")
                .set(username)
                .then(() => {
                  dispatch({
                    type: UPD_EVENT,
                    payload: newEvent
                  });
                  firebase
                    .database()
                    .ref("users/" + currUser.username.split("@")[0])
                    .remove()
                    .then(() => {
                      firebase
                        .database()
                        .ref("users/" + username.split("@")[0])
                        .set(newUser)
                        .then(() => {
                          dispatch({
                            type: UPD_USER,
                            payload: newUser
                          });
                          dispatch(setloading());
                        })
                        .catch(err => {
                          console.log(err);
                          dispatch(setloading());
                        });
                    })
                    .catch(err => {
                      console.log(err);
                      dispatch(setloading());
                    });
                })
                .catch(err => {
                  console.log(err);
                  dispatch(setloading());
                });
            })
            .catch(err => {
              console.log(err);
              dispatch(setloading());
            });
        } else if (password !== currUser.password) {
          console.log(user.email);
          dispatch(setloading());
          user
            .updatePassword(password)
            .then(() => {
              firebase
                .database()
                .ref("users/" + username.split("@")[0] + "/password")
                .set(password)
                .then(() => {
                  dispatch({
                    type: UPD_USER,
                    payload: newUser
                  });
                  dispatch(setloading());
                })
                .catch(err => {
                  console.log(err);
                  dispatch(setloading());
                });
            })
            .catch(err => {
              console.log(err);
              dispatch(setloading());
            });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(setloading());
      });
  }
};

export const updateEvent = (event, history) => dispatch => {
  dispatch(setloading());
  firebase
    .database()
    .ref("events/" + event.eid)
    .set(event)
    .then(() => {
      dispatch({
        type: GET_EVENT,
        payload: event
      });
      dispatch(setloading());
      history.push("/");
    });
};

export const deletePoster = url => dispatch => {
  storage
    .refFromURL(url)
    .delete()
    .then(() => {})
    .catch(err => console.log(err));
};

export const updatePosterUrl = (eid, url) => dispatch => {
  dispatch(setloading());
  firebase
    .database()
    .ref("events/" + eid + "/posterUrl")
    .set(url)
    .then(() => {
      dispatch({
        type: SET_POSTER,
        payload: url
      });
      dispatch(setloading());
    })
    .catch(err => {
      console.log(err);
      dispatch(setloading());
    });
};

export const addevent = (newEvent, newUser) => dispatch => {
  dispatch(setloading());

  secondaryApp
    .auth()
    .createUserWithEmailAndPassword(newUser.username, newUser.password)
    .then(u => {
      const { user } = u;
      firebase
        .database()
        .ref("events/" + newEvent.eid)
        .set(newEvent)
        .then(() => {
          firebase
            .database()
            .ref("users/" + user.email.split("@")[0])
            .set(newUser)
            .then(() => {
              dispatch(setloading());
              dispatch({
                type: ADD_EVENT,
                payload: { newEvent, newUser }
              });
              dispatch(clearerror());
            });
        })
        .catch(error => {
          console.log("Synchronization failed", error);
          dispatch(setloading());
        });
    })
    .catch(error => {
      console.log(error);
      dispatch(setloading());
    });
};

export const setloading = () => {
  return {
    type: SET_LOADING
  };
};

export const clearerror = () => {
  return {
    type: CLEAR_ERR
  };
};
