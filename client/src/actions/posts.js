import * as types from "./types";
import { setAlert } from "./alerts";
import axios from "axios";

export const createPost = (formData) => async (dispatch) => {
  console.log("posting");
  try {
    const { data } = await axios.post("/api/posts", formData);
    console.log(data);
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

export const addLike = (postId) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/posts/like/${postId}`);
    dispatch({
      type: types.ADD_LIKE_SUCCESS,
      payload: { _id: postId, likes: data },
    });
    dispatch(setAlert("success", "Post Liked"));
  } catch (err) {
    dispatch({
      type: types.ADD_LIKE_FAILURE,
    });
  }
};

export const removeLike = (postId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/posts/like/${postId}`);
    dispatch({
      type: types.REMOVE_LIKE_SUCCESS,
      payload: { _id: postId, likes: data },
    });
    dispatch(setAlert("success", "Post unliked"));
  } catch (err) {
    dispatch({
      type: types.REMOVE_LIKE_FAILURE,
    });
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/api/posts/${postId}`);

    dispatch({
      type: types.DELETE_POST_SUCCESS,
      payload: { _id: postId, post: data },
    });
    dispatch(setAlert("success", "Post was removed permanently"));
  } catch (error) {
    console.log(error.response);
    dispatch(setAlert("danger", "failed to delete the post"));
  }
};
