import ChatItem from "../models/chatArray";
import socket from "../components/socketInit";
import { useDispatch } from "react-redux";
import {
  getHashAndName,
  addChatTile,
  getChats,
  getRowNum,
  addToTemp,
  removeFromTemp,
  getRowFromTemp,
  getRowNumTemp,
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
const CHANGE_SENT = "changeSent";
const SEND_UNSENT = "sendUnsent";
const RECEIPT = "receipt";

//Connection & State functions

var retrySendingRow = false;
var retryFetchingUnread = false;
var retrySendingUndelivered = false;

var messagesFromDbLoaded = true;
var unreadFromServerLoaded = false;
var tempDbIsEmpty = true;

var unreadAddedToDb = false;

//Chat Functions

let messageIdDb = 0;
let messageIdScreen = 0;
let tempDbId = 0;
let idForCallback = 0;
const getIdDb = () => {
  let newID = ++messageIdDb;
  return newID;
};
const getIdScreen = () => {
  let newID = ++messageIdScreen;
  return newID.toString();
};
const getTempDbId = () => {
  let newID = ++tempDbId;
  return newID;
};
const getIdForCallback = () => {
  let newID = ++idForCallback;
  return newID;
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

/* const loadUnreadRetry = (msgArray) => {
  if (messagesFromDbLoaded === true) {
    addUnreadToDb(msgArray);
  } else setTimeout(loadUnreadRetry(msgArray), 2000);
}; */

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
  //console.log(msgArray);
  const newArray = msgArray.reverse();
  newArray.map((ch) => pushToDb(ch.username, ch.message, ch.time));
  unreadAddedToDb = true;
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
  //console.log(dbChatOrg);
  console.log(dbChatOrg);
  const dbChat = dbChatOrg.reverse(); // reverse this
  return dbChat;
};

const addChatToTemp = async (id, username, message, time) => {
  /* addToTemp,
  removeFromTemp,
  getRowFromTemp, */
  await addToTemp(id, username, message, time);
};

const emitUnsent = async () => {};

const getRowFromTempFN = async (id) => {
  const dbChatRaw = await getRowFromTemp(id);
  const data = dbChatRaw.rows._array;
  return data;
};

//--
const emitMessageToServer = async (id, username, message, time) => {
  const dataToSend = [id, username, message, time];
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
    if (unreadAddedToDb === true) {
      try {
        const rowNum = await getLastRow();
        //console.log("Rownum",rowNum);
        //const rowNumToSend = rowNum + 1;
        emitRowNum(rowNum);
        messageIdDb = rowNum;
        const hash = await getHashFromDb();
        emitHash(hash);
        //
        const rowNumRaw = await getRowNumTemp();
        const rowNumTemp = rowNumRaw.rows._array[0]["COUNT (id)"];
        if (rowNumTemp > 0) {
          for (let i = 0; i < rowNumTemp; i++) {
            const dbChatRaw = await getRowFromTemp(i + 1);
            const data = dbChatRaw.rows._array;
            emitMessageToServer(
              data.id,
              data.sender,
              data.content,
              data.timestamp
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
}

export function sendUnsent() {
  return async (dispatch) => {
    try {
      const rowNumRaw = await getRowNumTemp();
      const rowNum = rowNumRaw.rows._array[0]["COUNT (id)"];
      if (rowNum > 0) {
        for (let i = 0; i < rowNum; i++) {
          const dbChatRaw = await getRowFromTemp(i + 1);
          const data = dbChatRaw.rows._array;
          emitMessageToServer(
            data.id,
            data.sender,
            data.content,
            data.timestamp
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function receipt(id) {
  return async (dispatch) => {
    try {
      const data = await getRowFromTempFN(id);
      await pushToDb(data[0].sender, data[0].content, data[0].timestamp);
      /*       console.log("id from server", id);*/
      //console.log("from temp db sender", data[0].sender);
      removeFromTemp(id);

      dispatch({
        type: RECEIPT,
        payload: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function loadChat() {
  return async (dispatch) => {
    try {
      const dbChat = await getChatsFromDb();
      //console.log("Chat from DB", dbChat);
      const rowNum = await getLastRow();
      console.log("Rownum", rowNum);
      emitRowNum(rowNum);
      messageIdDb = rowNum;
      const username = await getNameFromDb();
      //console.log(username);
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
    const dbChat = msgArray; //.reverse(); //reverse this
    const dbChatRev = msgArray.reverse();
    console.log("unread from server",dbChatRev);
    const unreadLength = dbChat.length;
    if (unreadLength != 0) {
      addUnreadToDb(dbChat);
    } else unreadAddedToDb = true;
    //messageIdScreen = messageIdScreen + unreadLength;
    //messageIdChat = messageIdChat + unreadLength;
    ////////console.log("Unread from server", dbChat);

    dispatch({
      type: GET_UNREAD,
      payload: {
        dbChat,
      },
    });
  };
}

export function receivechat(username, message, time) {
  return async (dispatch) => {
    try {
      await pushToDb(username, message, time);
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
      },
    });
  };
}

export function sendchat(message) {
  return async (dispatch) => {
    try {
      const demmitID = new Date().getTime();
      const id = demmitID;
      await addChatToTemp(id, username, message, getTime());
      // await pushToDb(username, message, getTime());
      await emitMessageToServer(id, username, message, getTime());
      //console.log(userDbResult);
      dispatch({
        type: SEND_CHAT,
        payload: {
          message,
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
}

//-------------------------------------------------------------------------
//Reducer ahead//
//

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHAT:
      //console.log(messageIdDb);
      const updatedUser = {
        name: `${action.payload.username}`,
        identifier: "",
      };
      const listFromDb = action.payload.dbChat.map(
        (ch) =>
          new ChatItem(getIdScreen(), ch.sender, ch.content, ch.timestamp, 1)
      );
      const updatedlistFromDb = [...state.chatList, ...listFromDb];
      return {
        ...state,
        user: updatedUser,
        chatList: updatedlistFromDb,
      };
    case GET_UNREAD:
      //console.log("UNREAD", action.payload.dbChat);
      const chatUnreadRev = action.payload.dbChat.reverse();
      const listFromUnread = chatUnreadRev.map(
        (ch) => new ChatItem(getIdScreen(), ch.username, ch.message, ch.time, 1)
      );
      const updatedlistFromUnread = [...listFromUnread, ...state.chatList];
      return {
        ...state,
        chatList: updatedlistFromUnread,
      };
    case RECV_CHAT:
      const newRxChat = new ChatItem(
        getIdScreen(),
        action.payload.username.toString(),
        action.payload.message.toString(),
        action.payload.time.toString(),
        1
      );
      const updatedRxList = [...state.chatList];
      updatedRxList.unshift(newRxChat);
      return { ...state, chatList: updatedRxList };
    case SEND_CHAT:
      const newChat = new ChatItem(
        action.payload.id.toString(),
        state.user.name,
        action.payload.message,
        getTime(),
        0
      );
      //console.log(state.user.name);
      const updatedTxList = [...state.chatList];
      updatedTxList.unshift(newChat);
      return { ...state, chatList: updatedTxList };
    case RECEIPT:
      const id = action.payload.id.toString();
      //console.log("state", state);
      //console.log(state.user.name);
      const index = state.chatList.findIndex((el) => el.id === id);
      console.log("index", index);
      const updatedTxListUnsent = [...state.chatList];
      const copyName = updatedTxListUnsent[index].sender;
      const copyMessage = updatedTxListUnsent[index].content;
      const copyTime = updatedTxListUnsent[index].timestamp;
      updatedTxListUnsent.splice(index, 1);
      /* console.log("updated tx list", updatedTxListUnsent);
      return { ...state, chatList: updatedTxListUnsent }; */
      //////////////////////////////
      const newChatUnsent = new ChatItem(
        getIdScreen(),
        copyName,
        copyMessage,
        copyTime,
        1
      );
      updatedTxListUnsent.unshift(newChatUnsent);
      return { ...state, chatList: updatedTxListUnsent };
    default:
      return state;
  }
};

export default chatReducer;
