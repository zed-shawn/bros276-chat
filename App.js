import React from "react";
import { enableScreens } from "react-native-screens";
import ChatNavigator from "./navigation/main";
import socket from "./components/socketInit";

//import DeviceInfo from "react-native-device-info";

try {
  socket.on("connect", () => {
    if (socket.connected === true) {
      console.log("Connected to Anton");
    } // true
  });
} catch (error) {
  console.log("Could not connect", error);
}

socket.on("response", (data) => {
  console.log(data);
});

/* if (socket.connected === true) {
  socket.emit("identifier", identifier);
} */

enableScreens();

export default function App() {
  return <ChatNavigator />;
}
