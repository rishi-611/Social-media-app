import * as types from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

const profileReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.GET_PROFILE_SUCCESS:
    case types.CREATE_PROFILE_SUCCESS:
    case types.GET_PROFILE_BYID_SUCCESS:
    case types.ADD_EDUCATION_SUCCESS:
    case types.ADD_EXPERIENCE_SUCCESS:
      return {
        ...state,
        profile: payload,
        loading: false,
        error: {},
      };
    case types.GET_PROFILE_ERROR:
    case types.GET_PROFILE_BYID_FAILURE:
      return {
        ...state,
        profile: null,
        loading: false,
        error: payload,
      };
    case types.CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        error: {},
        repos: [],
      };

    case types.GET_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case types.GET_PROFILES_FAILURE:
      return {
        ...state,
        profiles: [],
        loading: false,
        error: payload,
      };
    case types.GET_GITHUB_REPOS_SUCCESS:
      return {
        ...state,
        repos: payload,
        loading: false,
        error: {},
      };
    case types.GET_GITHUB_REPOS_FAILURE:
      return {
        ...state,
        repos: [],
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default profileReducer;
