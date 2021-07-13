import * as types from "./types";
import { setAlert } from "./alerts";
import axios from "axios";

export const createPost = (formData) => async (dispatch) => {
  try {
    const { data } = await axios.post("/api/posts", formData);
    dispatch({
      type: types.CREATE_POST_SUCCESS,
      payload: data,
    });
    dispatch(setAlert("success", "Your post was added to the community feed!"));
  } catch (err) {
    dispatch(setAlert("danger", "failed to post"));
    dispatch({
      type: types.CREATE_POST_FAILURE,
      dispatch: "failed to post",
    });
  }
};

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await axios.get("api/posts");
    dispatch({
      type: types.GET_POSTS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch(setAlert("danger", "failed to fetch posts"));
    dispatch({
      type: types.GET_POSTS_FAILURE,
      dispatch: "failed to fetch posts",
    });
  }
};

export const getPostById = (postId) => async (dispatch) => {
  try {
    const { data } = await axios.get("api/posts/" + postId);
    dispatch({
      type: types.GET_POST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    dispatch(setAlert("danger", "failed to fetch post"));
    dispatch({
      type: types.GET_POST_FAILURE,
      dispatch: "failed to fetch post",
    });
  }
};
