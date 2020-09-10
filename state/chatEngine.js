import ChatItem from "../models/chatArray";

import socket from "../components/socketInit";

const initialState = {
  user: {
    name:"Ali" ,
  },
  chatList: [],
};

const SEND_CHAT = "sendChat";
const RECV_CHAT = "receiveChat";

let messageID = 0;
const getID = () => {
  let newID = ++messageID;
  return newID.toString();
};

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
        getID(),
        state.user.name,
        action.payload.message,
        getTime()
      );
      console.log(state.user);
      const updatedTxList = [...state.chatList];
      updatedTxList.unshift(newChat);
      const dataToSend = [state.user.name, action.payload.message, getTime()];
      socket.emit("message", dataToSend);
      return { ...state, chatList: updatedTxList };

    case RECV_CHAT:
      const newRxChat = new ChatItem(
        getID(),
        action.payload.username.toString(),
        action.payload.message.toString(),
        action.payload.time.toString(),
        action.payload.color.toString()
      );
      const updatedRxList = [...state.chatList];
      updatedRxList.unshift(newRxChat);
      return { ...state, chatList: updatedRxList };

    default:
      return state;
  }
};

export default chatReducer;
