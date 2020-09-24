import React from "react";
import { enableScreens } from "react-native-screens";
import ChatNavigator from "./navigation/main";
import socket from "./components/socketInit";
import store from "./state/store";
import { Provider } from "react-redux";
import { init } from "./helpers/db";
//import * as Notifications from "expo-notifications";
//import {Notifications} from "expo";

//console.log(FileSystem.documentDirectory);

//db initialize
init()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.log("Database initialization failed.");
    console.log(err);
  });

//socket initialize
try {
  socket.on("connect", () => {
    if (socket.connected === true) {
      console.log("Connected to Anton");
    } // true
  });
} catch (error) {
  console.log("Could not connect", error);
}


/* // Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
}); */

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
