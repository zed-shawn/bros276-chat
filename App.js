import React from "react";
import { enableScreens } from "react-native-screens";
import ChatNavigator from "./navigation/main";
import socket from "./components/socketInit";
import store from "./state/store";
import { Provider } from "react-redux";
import { init } from "./helpers/db";

import { getHashAndName, getRowNum } from "./helpers/db";
//console.log(FileSystem.documentDirectory);

init()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.log("Database initialization failed.");
    console.log(err);
  });

try {
  socket.on("connect", () => {
    if (socket.connected === true) {
      console.log("Connected to Anton");
      reconnectionData();
    } // true
  });
} catch (error) {
  console.log("Could not connect", error);
}

socket.on("response", (data) => {
  console.log(data);
});

async function reconnectionData() {
  try {
    const dbResult = await getHashAndName();
    let array = dbResult.rows._array;
    hash = array[0].hashID;

    const rowNumRaw = await getRowNum();
    const rowNum = rowNumRaw.rows._array[0]["COUNT (id)"];
    //console.log(rowNum);
    //const rowNumToSend = rowNum + 1;
    if (typeof hash === "string") {
      socket.emit("user", hash);
      socket.emit("rowNum", rowNum);
    }
    //console.log(username);
  } catch (error) {
    console.log(error);
  }
}

/* if (socket.connected === true) {
  socket.emit("identifier", identifier);
} */

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <ChatNavigator />
    </Provider>
  );
}
