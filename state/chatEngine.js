import ChatItem from "../models/chatArray";
//import initialState from "./store";

import socket from "../components/socketInit";

const SEND_CHAT = "sendChat";
const RECV_CHAT = "receiveChat";

const initialState = {
  user: [],
  chatList: [],
};

let messageID = 0;

const getTime = () => {
  var hours = new Date().getHours(); //To get the Current Hours
  var min = new Date().getMinutes(); //To get the Current Minute
  if (min < 10) {
    min = "0" + min;
  }
  return hours + ":" + min;
};

export function sendchat(message) {
  return {
    type: SEND_CHAT,
    payload: {
      message,
    },
  };
}

export function receivechat(username, message, time, color) {
  return {
    type: RECV_CHAT,
    payload: {
      username,
      message,
      time,
      color,
    },
  };
}

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_CHAT:
      const newChat = new ChatItem(
        ++messageID,
        state.user.name,
        action.payload.message,
        getTime()
      );
      const dataToSend = [state.user.name, action.payload.message, getTime()];
      socket.emit("message", dataToSend);
      return {
        ...state,
        chatList: (chatList) => [newChat, ...chatList],
      };
  }
};

export default chatReducer;
