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
      const userDbResult = await addUserDetails(identifier, username);
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

export function sendchat(message) {
  return (dispatch) => {
    const dataToSend = [message, message, getTime()];
    socket.emit("message", dataToSend);
    dispatch({
      type: SEND_CHAT,
      payload: {
        message,
      },
    });
  };
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NAME:
      /* const sendFromUserDetails = [
        action.payload.identifier,
        action.payload.username,
      ];
      socket.emit("identifier", sendFromUserDetails);
      console.log(sendFromUserDetails);
      const updatedUser = {
        name: action.payload.username,
        identifier: action.payload.identifier,
      };
      return { ...state, user: updatedUser }; */
      return state;
    default:
      return state;
  }
};

export default userReducer;
