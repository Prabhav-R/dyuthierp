import {
  SET_LOADING,
  ADD_EVENT,
  GET_EVENTS,
  GET_EVENT,
  DEL_EVENT,
  SET_POSTER,
  GET_USERS,
  UPD_EVENT,
  UPD_ROUNDS,
  UPD_USER
} from "../actions/types";

const initialState = {
  events: [],
  users: [],
  event: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
      return {
        ...state,
        events: [action.payload.newEvent, ...state.events],
        users: [action.payload.newUser, ...state.users]
      };
    case UPD_EVENT:
      return {
        ...state,
        events: [
          action.payload,
          ...state.events.filter(e => e.eid !== action.payload.eid)
        ]
      };
    case UPD_USER:
      return {
        ...state,
        users: [
          action.payload,
          ...state.users.filter(user => user.eid !== action.payload.eid)
        ]
      };
    case DEL_EVENT:
      return {
        ...state,
        events: state.events.filter(e => e.eid !== action.payload.eid),
        users: state.users.filter(
          user => user.username !== action.payload.username
        )
      };
    case GET_EVENTS:
      return {
        ...state,
        events: Object.values(action.payload)
      };
    case GET_EVENT:
      return {
        ...state,
        event: {
          ...action.payload,
          rounds: Object.values(action.payload.rounds)
        }
      };
    case UPD_ROUNDS:
      return {
        ...state,
        event: { ...state.event, rounds: action.payload }
      };
    case GET_USERS: {
      return {
        ...state,
        users: Object.values(action.payload)
      };
    }
    case SET_LOADING:
      return {
        ...state,
        loading: !state.loading
      };
    case SET_POSTER:
      return {
        ...state,
        event: { ...state.event, posterUrl: action.payload }
      };
    default:
      return state;
  }
}
