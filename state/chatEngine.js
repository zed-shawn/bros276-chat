import ChatItem from "../models/chatArray";
import socket from "../components/socketInit";
import {
  getHashAndName,
  addChatTile,
  getChats,
  getRowNum,
} from "../helpers/db";

var username;

const initialState = {
  user: {
    name: "",
    identifier: "",
  },
  chatList: [],
};

const SEND_CHAT = "sendChat"; //Sends chat from chat screen to the server
const RECV_CHAT = "receiveChat"; //Displays chat from server to the chat screen
const LOAD_CHAT = "loadChat"; // Loads chat from db, triggers only when screen loads
const GET_UNREAD = "loadUnread"; // Displays chat from server, unread
const CONNECTED = "connected"; // When connection is estabished,Sends hash & lastRow to server in case of reconnection

//Connection & State functions

var retrySendingRow = false;
var retryFetchingUnread = false;
var retrySendingUndelivered = false;

var messagesFromDbLoaded = false;
var unreadFromServerLoaded = false;
var tempDbIsEmpty = true;

//Chat Functions

let messageIdDb = 0;
let messageIdScreen = 0;
const getIdDb = () => {
  let newID = ++messageIdDb;
  return newID;
};
const getIdScreen = () => {
  let newID = ++messageIdScreen;
  return newID.toString();
};

const getTime = () => {
  var hours = new Date().getHours(); //To get the Current Hours
  var min = new Date().getMinutes(); //To get the Current Minute
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (min < 10) {
    min = "0" + min;
  }
  return hours + ":" + min;
};

const loadUnreadRetry = (msgArray) => {
  if (messagesFromDbLoaded === true) {
    addUnreadToDb(msgArray);
  } else setTimeout(loadUnreadRetry(msgArray), 2000);
};

//-------------------------------------------------------------------------
// Functions for CRUD on db, and emitting to server//
//

const getLastRow = async () => {
  const rowNumRaw = await getRowNum();
  const rowNum = rowNumRaw.rows._array[0]["COUNT (id)"];
  return rowNum;
};

const pushToDb = async (sender, content, time) => {
  try {
    await addChatTile(getIdDb(), sender, content, time);
  } catch (error) {
    console.log(error);
  }
};

const addUnreadToDb = async (msgArray) => {
  msgArray.map((ch) => pushToDb(ch.username, ch.message, ch.time));
};

const getNameFromDb = async () => {
  try {
    const dbResult = await getHashAndName();
    let array = dbResult.rows._array;
    username = array[0].name.toString();
    return username;
    //console.log(username);
  } catch (err) {
    console.log(err);
  }
};

const getHashFromDb = async () => {
  try {
    const dbResult = await getHashAndName();
    let array = dbResult.rows._array;
    const hash = array[0].hashID;
    return hash;
  } catch (err) {
    console.log(err);
  }
};

const getChatsFromDb = async () => {
  const dbChatRaw = await getChats();
  const dbChatOrg = dbChatRaw.rows._array;
  const dbChat = dbChatOrg.reverse();
  return dbChat;
};
//--
const emitMessageToServer = async (username, message, time) => {
  const dataToSend = [username, message, time];
  //console.log(dataToSend);
  socket.emit("message", dataToSend);
};

const emitRowNum = async (rowNum) => {
  socket.emit("rowNum", rowNum);
};

const emitHash = async (hash) => {
  socket.emit("user", hash);
};

//-------------------------------------------------------------------------
// Action Logic//
//

export function connected() {
  return async (dispatch) => {
    try {
      const rowNum = await getLastRow();
      console.log(rowNum);
      //const rowNumToSend = rowNum + 1;
      emitRowNum(rowNum);
      messageIdDb = rowNum;
      const hash = await getHashFromDb();
      emitHash(hash);
    } catch (error) {
      console.log(error);
    }
  };
}

export function loadChat() {
  return async (dispatch) => {
    try {
      const dbChat = await getChatsFromDb();
      console.log("Chat from DB", dbChat);
      const rowNum = await getLastRow();
      emitRowNum(rowNum);
      messageIdDb = rowNum;
      const username = await getNameFromDb();
      messagesFromDbLoaded = true;
      //console.log(username);
      dispatch({
        type: LOAD_CHAT,
        payload: {
          dbChat,
          username,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function loadUnread(msgArray) {
  return (dispatch) => {
    const dbChat = msgArray.reverse();
    if (messagesFromDbLoaded === true) {
      addUnreadToDb(msgArray);
    } else setTimeout(loadUnreadRetry(msgArray), 2000);
    //const unreadLength = dbChat.length;
    //messageIdScreen = messageIdScreen + unreadLength;
    //messageIdChat = messageIdChat + unreadLength;
    console.log("Unread from server", dbChat);

    dispatch({
      type: GET_UNREAD,
      payload: {
        dbChat,
      },
    });
  };
}

export function receivechat(username, message, time, color) {
  return async (dispatch) => {
    try {
      await pushToDb(username, message, time); //color here as sending id is useless
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

export function sendchat(message) {
  return async (dispatch) => {
    try {
      await pushToDb(username, message, getTime());
      await emitMessageToServer(username, message, getTime());
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

//-------------------------------------------------------------------------
//Reducer ahead//
//

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHAT:
      return {
        ...state,
        name: action.payload.username,
        chatList: action.payload.dbChat.map(
          (ch) =>
            new ChatItem(getIdScreen(), ch.sender, ch.content, ch.timestamp)
        ),
      };
    case GET_UNREAD:
      return {
        ...state,
        chatList: action.payload.dbChat.map(
          (ch) => new ChatItem(getIdScreen(), ch.username, ch.message, ch.time)
        ),
      };
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
    case SEND_CHAT:
      const newChat = new ChatItem(
        getIdScreen(),
        state.user.name,
        action.payload.message,
        getTime()
      );
      //console.log(state.user.name);
      const updatedTxList = [...state.chatList];
      updatedTxList.unshift(newChat);
      return { ...state, chatList: updatedTxList };
    default:
      return state;
  }
};

export default chatReducer;
