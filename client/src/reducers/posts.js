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
      return {
        ...state,
        loading: false,
        error: null,
        posts: [...state.posts, payload],
      };

    case types.CREATE_POST_FAILURE:
    case types.GET_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        post: null,
      };

    case types.ADD_LIKE_SUCCESS:
    case types.REMOVE_LIKE_SUCCESS:
      // for the updated post in posts array, replace the old post with the new post
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === payload._id ? { ...post, likes: payload.likes } : post
        ),
      };

    case types.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) =>
          post._id === payload._id
            ? { ...post, comments: payload.comments }
            : post
        ),
        post: { ...state.post, comments: payload.comments },
      };

    case types.GET_POST_SUCCESS:
      return {
        ...state,
        post: payload,
        error: null,
        loading: false,
      };

    case types.DELETE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload._id),
      };
    default:
      return state;
  }
};

export default postsReducer;
