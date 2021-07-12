import * as types from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  authenticated: null,
  loading: true,
  user: null,
};
// registration sucess will be called when a user tries to signup and gets a token back successfully
// in this case we update the auth state, and local storage token
const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.REGISTRATION_SUCCESS:
    case types.LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        token: payload.token,
        authenticated: true,
        loading: false,
      };

    case types.REGISTRATION_FAILURE:
    case types.LOGIN_FAILURE:
    case types.LOG_OUT:
    case types.USER_DELETED:
    case types.AUTH_FAILURE:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        loading: false,
        user: null,
        authenticated: false,
      };

    case types.USER_LOADED:
      return {
        ...state,
        user: payload,
        loading: false,
        authenticated: true,
      };

    default:
      return state;
  }
};

export default authReducer;
