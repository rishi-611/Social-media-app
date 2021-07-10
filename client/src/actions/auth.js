import axios from "axios";
import { setAlert } from "./alerts";
import { REGISTRATION_FAILURE, REGISTRATION_SUCCESS } from "./types";

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
    console.log("register");
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
      dispatch({
        type: REGISTRATION_SUCCESS,
        payload: {
          token: userData.data.token,
          user: userData.data.user,
        },
      });
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

export default register;
