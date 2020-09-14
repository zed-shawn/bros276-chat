import ChatItem from "../models/chatArray";

import socket from "../components/socketInit";
import { getName, addChatTile, getChats, getRowNum } from "../helpers/db";

var username;

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
const LOAD_CHAT = "loadChat";

let messageIdChat = 0;
let messageIdScreen = 0;
const getIdChat = () => {
  let newID = ++messageIdChat;
  return newID;
};
const getIdScreen = () => {
  let newID = ++messageIdScreen;
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
      console.log(err);
    }
  };
}

export function sendchat(message) {
  return async (dispatch) => {
    try {
      await addChatTile(getIdChat(), username, message, getTime());
      //console.log(userDbResult);
    } catch (error) {
      console.log(error);
    }
    dispatch({
      type: SEND_CHAT,
      payload: {
        message,
      },
    });
  };
}

export function receivechat(username, message, time, color) {
  return async (dispatch) => {
    try {
      await addChatTile(getIdChat(), username, message, time, color);
      //console.log(userDbResult);
    } catch (error) {
      console.log(error);
    }
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

export function loadChat() {
  return async (dispatch) => {
    try {
      const dbChatRaw = await getChats();
      const dbChat = dbChatRaw.rows._array;
      console.log(dbChat);

      const rowNumRaw = await getRowNum();
      // socket.emit("rowNum", rowNum);
      const rowNum = rowNumRaw.rows._array[0]["COUNT (id)"]
      console.log(rowNum);

      messageIdScreen = rowNum ;
      messageIdChat = rowNum;

      const dbName = await getName();

      let array = dbName.rows._array;
      username = array[0].name.toString();
      console.log(username);
      dispatch({
        type: LOAD_CHAT,
        payload: {
          dbChat,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
}

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_CHAT:
      const newChat = new ChatItem(
        getIdScreen(),
        state.user.name,
        action.payload.message,
        getTime()
      );
      const updatedTxList = [...state.chatList];
      updatedTxList.unshift(newChat);
      const dataToSend = [username, action.payload.message, getTime()];
      //console.log(dataToSend);
      socket.emit("message", dataToSend);
      return { ...state, chatList: updatedTxList };

    case RECV_CHAT:
      const newRxChat = new ChatItem(
        getIdScreen(),
        action.payload.username.toString(),
        action.payload.message.toString(),
        action.payload.time.toString(),
        action.payload.color.toString()
      );
      const updatedRxList = [...state.chatList];
      updatedRxList.unshift(newRxChat);
      return { ...state, chatList: updatedRxList };

    case LOAD_CHAT:
      return {
        ...state,
        chatList: action.payload.dbChat.map(
          (ch) =>
            new ChatItem(ch.id.toString(), ch.sender, ch.content, ch.timestamp)
        ),
      };

    default:
      return state;
  }
};

export default chatReducer;
