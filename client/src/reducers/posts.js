import * as types from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  error: null,
  loading: true,
};

const postsReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: payload,
        error: null,
      };
    case types.GET_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        posts: [],
        error: payload,
      };

    case types.CREATE_POST_SUCCESS:
    case types.GET_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        post: payload,
      };

    case types.CREATE_POST_FAILURE:
    case types.GET_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        post: null,
      };

    default:
      return state;
  }
};

export default postsReducer;
