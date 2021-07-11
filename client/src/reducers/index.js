import { combineReducers } from "redux";
import alertReducer from "./alerts";
import authReducer from "./auth";
import profileReducer from "./profile";

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  profile: profileReducer,
});

export default rootReducer;
