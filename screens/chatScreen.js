import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { View, StyleSheet, TextInput, FlatList } from "react-native";
import ChatItem from "../models/chatArray";

import ChatBubbleSend from "../components/chatBubbleSend";
import ChatBubbleReceive from "../components/chatBubbleReceive";
import Button from "../components/Button";
import socket from "../components/socketInit";

import * as action from "../state/chatEngine";

export default function chatScreen(props) {
  const username = props.navigation.getParam("username");
  const [inputMessage, setInputMessage] = useState("");
  const [chatArray, addToChatArray] = useState([]);

  const dispatch = useDispatch();

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
      );
      addToChatArray((chatArray) => [newChatBubble, ...chatArray]);
    });
  }, []);

  const textInputHandler = (inputText) => {
    setInputMessage(inputText);
  };

  const getTime = () => {
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current Minute
    if (min < 10) {
      min = "0" + min;
    }
    return hours + ":" + min;
  };

  const dispatchMessage = useCallback(
    (inputMessage) => {
      dispatch(action.sendchat(inputMessage));
    },
    [dispatch]
  );

  const sendHandler = () => {
    if (inputMessage !== "") {
      let message = inputMessage;
      setInputMessage("");
      console.log("button preseed");
      dispatchMessage(message);
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
