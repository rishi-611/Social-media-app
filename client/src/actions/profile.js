import axios from "axios";
import { setAlert } from "./alerts";
import {
  GET_PROFILE_ERROR,
  GET_PROFILE_SUCCESS,
  CLEAR_PROFILE,
  CREATE_PROFILE_SUCCESS,
  ADD_EDUCATION_SUCCESS,
  ADD_EXPERIENCE_SUCCESS,
  GET_PROFILES_SUCCESS,
  GET_PROFILES_FAILURE,
  GET_PROFILE_BYID_FAILURE,
  GET_PROFILE_BYID_SUCCESS,
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

export const getAllProfiles = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILES_FAILURE,
      payload: "could not fetch users",
    });
    dispatch(setAlert("danger", "failed to fetch profiles"));
  }
};

export const getProfileById = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/profile/${id}`);

    dispatch({
      type: GET_PROFILE_BYID_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE_BYID_FAILURE,
      payload: "could not fetch user",
    });
    dispatch(setAlert("danger", "failed to fetch profile"));
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

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/profile/me/experience",
      formData,
      config
    );

    dispatch({
      type: ADD_EXPERIENCE_SUCCESS,
      payload: data,
    });

    history.push("/dashboard");
    dispatch(setAlert("success", "Experience Added"));
  } catch (err) {
    console.log(err.response.data);
    err.reponse.data.errors.forEach((error) =>
      dispatch(setAlert("danger", error.msg))
    );
  }
};

export const deleteEducation = (educId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/me/education/${educId}`);
    // updated profile is received in data if success, hence we can update profile state directly
    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch(setAlert("success", "Education deleted"));
  } catch (err) {
    console.log(err.response.data);
    dispatch(setAlert("danger", "Failed to delete education"));
  }
};

export const deleteExperience = (expId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/profile/me/experience/${expId}`);
    // updated profile is received in data if success, hence we can update profile state directly
    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch(setAlert("success", "Experience deleted"));
  } catch (err) {
    console.log(err.response.data);
    dispatch(setAlert("danger", "Failed to delete experience"));
  }
};

export default getProfile;
