import socket from "../components/socketInit";
import { addUserDetails, getRowNum } from "../helpers/db";

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
      console.log(error);
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

export function sendChatStatus() {
  return async (dispatch) => {
    try {
      const rowNum = await getRowNum();
      //console.log(userDbResult);
      socket.emit("rowNum", rowNum);
    } catch (error) {
      console.log(error);;
    }

    /* dispatch({
      type: ADD_NAME,
      payload: {
        identifier,
        username,
      },
    }); */
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
