import * as types from "../actions/types";

const alertReducer = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SET_ALERT:
      return [...state, payload];
    case types.REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload.id);
    default:
      return state;
  }
};

export default alertReducer;
