import React, { useState, useEffect } from "react";

import { View, StyleSheet, TextInput, FlatList } from "react-native";
//import { CHATARRAY } from "../data/dummydata";
import ChatItem from "../models/chatArray";

import ChatBubbleSend from "../components/chatBubbleSend";
import ChatBubbleReceive from "../components/chatBubbleReceive";
import Button from "../components/Button";
import socket from "../components/socketInit";

const CHATARRAY = [];

/* var hours = new Date().getMinutes(); //To get the Current Hours
var min = new Date().getSeconds(); //To get the Current Minute */

export default function chatScreen(props) {
  const username = props.navigation.getParam("username");
  const [inputMessage, setInputMessage] = useState("");
  const [chatArray, addToChatArray] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      const receivedMessage = JSON.parse(data);
      //console.log(receivedMessage);

      const newChatBubble = new ChatItem(
        receivedMessage.id.toString(),
        receivedMessage.username.toString(),
        receivedMessage.message.toString(),
        receivedMessage.time.toString(),
        receivedMessage.color.toString()
        //receivedMessage.time.toString()
      );
      //CHATARRAY.unshift(newChatBubble);
      addToChatArray((chatArray) => [newChatBubble, ...chatArray]);
    });
  }, []);

  const textInputHandler = (inputText) => {
    setInputMessage(inputText);
  };

  var hours = new Date().getHours(); //To get the Current Hours
  var min = new Date().getMinutes(); //To get the Current Minute

  const getTime = () => {
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current Minute
    if (min < 10) {
      min = "0" + min;
    }
    return hours + ":" + min;
  };

  const sendHandler = () => {
    if (inputMessage !== "") {
      console.log("button preseed");
      const newChatBubble = new ChatItem(
        Math.random().toString(),
        username,
        inputMessage,
        getTime()
      );
      addToChatArray((chatArray) => [newChatBubble, ...chatArray]);
      //CHATARRAY.unshift(newChatBubble);
      //CHATARRAY=[newChatBubble,...CHATARRAY]
      setInputMessage("");
      const dataToSend = [username, inputMessage, hours + ":" + min];
      socket.emit("message", dataToSend);
    }
  };

  const renderChatItems = (itemData) => {
    if (itemData.item.sender === username) {
      return (
        <ChatBubbleSend
          content={itemData.item.content}
          timestamp={itemData.item.timestamp}
        />
      );
    } else if (itemData.item.sender != username) {
      return (
        <ChatBubbleReceive
          sender={itemData.item.sender}
          content={itemData.item.content}
          timestamp={itemData.item.timestamp}
          color={itemData.item.color}
        />
      );
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        renderItem={renderChatItems}
        data={chatArray}
        keyExtractor={(item, index) => item.id}
        inverted={true}
      />
      <View style={styles.inputRegion}>
        <View style={styles.rowise}>
          <View style={styles.inputHolder}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message"
              onChangeText={textInputHandler}
              value={inputMessage}
              multiline={true}
            />
          </View>
          <View style={styles.buttonHolder}>
            <Button title="SEND" onPress={sendHandler} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ff863b",
    flex: 1,
  },
  time: {
    alignItems: "flex-end",
  },
  timeText: {
    color: "grey",
  },
  inputRegion: {
    justifyContent: "flex-end",
    height: 50,
  },
  rowise: {
    flexDirection: "row",
    height: 50,
  },
  inputHolder: {
    flex: 3,
    backgroundColor: "white",
  },
  buttonHolder: {
    flex: 1,
  },
  textInput: {
    fontSize: 20,
    marginHorizontal: 10,
    marginTop: 5,
  },
  scrollView: {
    flexDirection: "column",
  },
});
