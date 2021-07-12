import axios from "axios";
import { setAlert } from "./alerts";
import {
  GET_PROFILE_ERROR,
  GET_PROFILE_SUCCESS,
  CLEAR_PROFILE,
  CREATE_PROFILE_SUCCESS,
  ADD_EDUCATION_SUCCESS,
  ADD_EXPERIENCE_SUCCESS,
} from "./types";

const getProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE_ERROR,
      payload: {
        status: err.response.status,
        msg: err.response.statusText,
      },
    });
  }
};

// called when profile form is submitted
// edit=true will be sent if the user is trying to edit an existing form
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      console.log(formData);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/profile", formData, config);
      dispatch({
        type: CREATE_PROFILE_SUCCESS,
        payload: data,
      });

      // programmatic navigation to dashbaord, only when profile successfully completed
      history.push("/dashboard");

      // different msg based on edit or not
      const msg = `Your Profile has been ${
        edit ? "updated" : "created"
      } successfully`;
      dispatch(setAlert("success", msg));
    } catch (err) {
      err.response.data.errors.forEach((error) => {
        console.log(error.msg);
        dispatch(setAlert("danger", error.msg));
      });
    }
  };

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/profile/me/education",
      formData,
      config
    );

    dispatch({
      type: ADD_EDUCATION_SUCCESS,
      payload: data,
    });

    history.push("/dashboard");
    dispatch(setAlert("success", "Education Added"));
  } catch (err) {
    console.log(err.response.data);
    err.reponse.data.errors.forEach((error) =>
      dispatch(setAlert("danger", error.msg))
    );
  }
};

export default getProfile;
