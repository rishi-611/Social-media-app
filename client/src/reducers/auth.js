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
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        token: payload.token,
        authenticated: true,
        loading: false,
        user: payload.user,
      };

    case types.REGISTRATION_FAILURE:
      localStorage.setItem("token", null);
      return {
        ...state,
        token: null,
        loading: true,
        user: null,
      };

    default:
      return state;
  }
};

export default authReducer;
