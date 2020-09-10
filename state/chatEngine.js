import ChatItem from "../models/chatArray";
import initialState from "../data/defState";

import socket from "../components/socketInit";

const SEND_CHAT = "sendChat";
const RECV_CHAT = "receiveChat";

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

export default function chatReducer(state = initialState, action) {
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
}

const newChatBubble = new ChatItem(
  Math.random().toString(),
  username,
  inputMessage,
  getTime()
);
addToChatArray((chatArray) => [newChatBubble, ...chatArray]);
setInputMessage("");
const dataToSend = [username, inputMessage, hours + ":" + min];
socket.emit("message", dataToSend);
