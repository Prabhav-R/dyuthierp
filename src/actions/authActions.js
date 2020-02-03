import {
  LOGIN_LOADING,
  SET_AUTH,
  UNSET_AUTH,
  SET_ERR,
  CLEAR_ERR
} from "./types";
import { firebase } from "../firebase";

export const login = (email, password) => dispatch => {
  dispatch(setloading());

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(u => {
      const { user } = u;
      dispatch({
        type: SET_AUTH,
        payload: user
      });
      dispatch(clearerror());
      dispatch(setloading());
    })
    .catch(err => {
      dispatch({
        type: SET_ERR,
        payload: err
      });
      dispatch(setloading());
    });
};

export const logout = () => dispatch => {
  dispatch(setloading());
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(setloading());
      dispatch({
        type: UNSET_AUTH
      });
    })
    .catch(err => dispatch(setloading()));
};

export const clearerror = () => {
  return {
    type: CLEAR_ERR
  };
};

export const setloading = () => {
  return {
    type: LOGIN_LOADING
  };
};
