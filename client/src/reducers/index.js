import { combineReducers } from "redux";
import alertReducer from "./alerts";
import authReducer from "./auth";
import profileReducer from "./profile";
import postsReducer from "./posts";

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  profile: profileReducer,
  posts: postsReducer,
});

export default rootReducer;
