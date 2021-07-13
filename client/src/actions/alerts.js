import { v4 as uuidv4 } from "uuid";
import { REMOVE_ALERT, SET_ALERT } from "./types";

const setAlert =
  (type, message, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: {
        id,
        type,
        message,
      },
    });
    // since we did not call return with dispatch, we can perform further actions and then dispatch something again
    // here we dispatch remove timer after 5 seconds
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: {
          id,
        },
      });
    }, timeout);
  };

export { setAlert };
