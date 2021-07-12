import axios from "axios";
import setAuthToken from "../utils";
import { setAlert } from "./alerts";
import { clearProfile } from "./profile";
import {
  REGISTRATION_FAILURE,
  REGISTRATION_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  AUTH_FAILURE,
  LOG_OUT,
  USER_DELETED,
} from "./types";

// will be called when app first loads
// sets up global axios header if localstorage already has token
// fetches user data=>will fail if no token
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/users/me");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_FAILURE,
    });
  }
};

// is called when a registration form is submitted
// is supposed to send post request to /api/users to create user
const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
    };
    const body = {
      name,
      email,
      password,
    };

    try {
      const userData = await axios.post("/api/users", body, config);
      if (!userData) {
        return console.log("no data received");
      }
      //  if token received
      dispatch({
        type: REGISTRATION_SUCCESS,
        payload: {
          token: userData.data.token,
        },
      });
      // load the user to state when registerrations succeeds
      dispatch(loadUser());
    } catch (err) {
      // errors will be an array of objs

      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert("danger", error.msg));
        });
      }
      dispatch({
        type: REGISTRATION_FAILURE,
      });
    }
  };

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "Application/json",
      },
    };
    const body = {
      email,
      password,
    };

    try {
      const userData = await axios.post("/api/users/login", body, config);
      if (!userData) {
        return console.log("no data received");
      }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: userData.data.token,
        },
      });

      dispatch(loadUser());
    } catch (err) {
      // errors will be an array of objs
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(setAlert("danger", error.msg));
        });
      }
      dispatch({
        type: LOGIN_FAILURE,
      });
    }
  };

export const logout = () => async (dispatch) => {
  try {
    await axios.post("/api/users/logout");
    dispatch({
      type: LOG_OUT,
    });
  } catch (err) {
    console.log("some error");
  }
};
export const deleteAccount = (history) => async (dispatch) => {
  try {
    await axios.delete("/api/users/me");

    history.push("/");
    dispatch(clearProfile());
    dispatch({
      type: USER_DELETED,
    });
    dispatch(setAlert("danger", "Your account was removed permanently"));
  } catch (err) {
    err.resonse.data.errors.forEach((error) =>
      dispatch(setAlert("danger", error.msg))
    );
  }
};

export default register;
