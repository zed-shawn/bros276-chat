import ChatItem from "../models/chatArray";

import socket from "../components/socketInit";
import { getName } from "../helpers/db";

var username = "null";

const initialState = {
  user: {
    name: "",
    identifier: "",
  },
  chatList: [],
};

const SEND_CHAT = "sendChat";
const RECV_CHAT = "receiveChat";
const GET_NAME = "fetchName";

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

export function fetchName() {
  return async (dispatch) => {
    try {
      const dbResult = await getName();
      //console.log(dbResult);
      let array = dbResult.rows._array;
      username = array[0].name.toString();
      //console.log(username);
      //dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
}

export function sendchat(message) {
  return (dispatch) => {
    /* const dataToSend = [username, message, getTime()];
    console.log(username);
    socket.emit("message", dataToSend); */
    dispatch({
      type: SEND_CHAT,
      payload: {
        message,
      },
    });
  };
}

export function receivechat(username, message, time, color) {
  return (dispatch) => {
    //add async code
    dispatch({
      type: RECV_CHAT,
      payload: {
        username,
        message,
        time,
        color,
      },
    });
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
      const updatedTxList = [...state.chatList];
      updatedTxList.unshift(newChat);
      const dataToSend = [username, action.payload.message, getTime()];
      console.log(dataToSend);
      socket.emit("message", dataToSend);
      /* const dataToSend = [username, action.payload.message, getTime()];
      console.log(dataToSend);
      socket.emit("message", dataToSend); */
      //console.log(state.user);


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
