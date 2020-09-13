import socket from "../components/socketInit";
import { addUserDetails } from "../helpers/db";

const initialState = {
  user: {
    name: "",
    identifier: "",
  },
  chatList: [],
};

const ADD_NAME = "addName";

export function addName(identifier, username) {
  return async (dispatch) => {
    try {
      await addUserDetails(identifier, username);
      //console.log(userDbResult);
    } catch (error) {
      throw (error);
    }

    dispatch({
      type: ADD_NAME,
      payload: {
        identifier,
        username,
      },
    });
  };
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NAME:
      const sendFromUserDetails = [
        action.payload.identifier,
        action.payload.username,
      ];
      socket.emit("identifier", sendFromUserDetails);
      //console.log(sendFromUserDetails);
      return state;
    default:
      return state;
  }
};

export default userReducer;
