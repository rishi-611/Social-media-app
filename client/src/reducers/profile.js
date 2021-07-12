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
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case types.GET_PROFILE_ERROR:
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
        repose: [],
      };
    default:
      return state;
  }
};

export default profileReducer;
