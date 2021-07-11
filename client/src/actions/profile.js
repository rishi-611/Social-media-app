import axios from "axios";
import { GET_PROFILE_ERROR, GET_PROFILE_SUCCESS, CLEAR_PROFILE } from "./types";

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

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

export default getProfile;
