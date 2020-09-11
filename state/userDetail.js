import socket from "../components/socketInit";

const initialState = {
  user: {
    name: "",
    identifier: "",
  },
  chatList: [],
};

const ADD_NAME = "addName";

export function addName(identifier, username) {
  return {
    type: ADD_NAME,
    payload: {
      identifier,
      username,
    },
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
      console.log(sendFromUserDetails);
      const updatedUser = {
        name: action.payload.username,
        identifier: action.payload.identifier,
      };
      return { ...state, user: updatedUser };
    default:
      return state;
  }
};

export default userReducer;
