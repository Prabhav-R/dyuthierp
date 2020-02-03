import { SET_USERNAME_ERROR, CLEAR_ERR, SET_ERR } from "../actions/types";

const intialState = {
  err: ""
};

export default function(state = intialState, action) {
  switch (action.type) {
    case SET_USERNAME_ERROR:
      return {
        ...state,
        err: action.payload
      };
    case CLEAR_ERR:
      return {
        ...state,
        err: ""
      };
    case SET_ERR:
      return {
        ...state,
        err: action.payload
      };
    default:
      return state;
  }
}
