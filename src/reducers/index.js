import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import eventReducer from "./eventReducer";
import authReducer from "./authReducer";

export default combineReducers({
  errors: errorReducer,
  event: eventReducer,
  auth: authReducer
});
