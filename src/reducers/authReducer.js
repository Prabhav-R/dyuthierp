import { LOGIN_LOADING, UNSET_AUTH, SET_AUTH } from "../actions/types";

const intialState = {
  isauthenticated: false,
  userid: "",
  user: "",
  loading: false
};

export default function(state = intialState, action) {
  switch (action.type) {
    case LOGIN_LOADING:
      return {
        ...state,
        loading: !state.loading
      };
    case SET_AUTH:
      return {
        ...state,
        isauthenticated: true,
        userid: action.payload.uid,
        user: action.payload.email
      };
    case UNSET_AUTH:
      return {
        ...state,
        isauthenticated: false,
        userid: "",
        user: ""
      };
    default:
      return state;
  }
}
