import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { View, StyleSheet, TextInput, FlatList } from "react-native";

import ChatBubbleSend from "../components/chatBubbleSend";
import ChatBubbleReceive from "../components/chatBubbleReceive";
import ChatBubbleTyping from "../components/chatBubbleTyping"
import Button from "../components/Button";
import socket from "../components/socketInit";
import store from "../state/store";
import { getName } from "../helpers/db";

import * as action from "../state/chatEngine";

/* function fetchName() {
  return async () => {
    try {
      const dbResult = await getName();
      console.log(dbResult);
      //let array = dbResult.rows._array;
      //username = array[0].name.toString();
      //console.log(username);
      //dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      console.log(err);
    }
  };
} */

export default function chatScreen(props) {
  const username = useSelector((state) => state.chat.user.name);
  //  const username = props.navigation.getParam("username");
  // console.log("From ChatScreen",username)
  /* fetchName() */
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatRepo = useSelector((state) => state.chat.chatList);
  //console.log(chatRepo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(action.loadChat());
  }, [dispatch]);

  /*  useEffect(() => {
    setTyping;
  }, [inputMessage]); */

  /*  const setTyping = () => {
    if (inputMessage !== "" && isTyping === false) {
      setIsTyping(true);
      socket.emit("typing", username);
      console.log("emitted typing 1");
    } else if (inputMessage === "" && isTyping === true) {
      setIsTyping(false);
      socket.emit("typing", username);
      console.log("emitted typing 2");
    }
  }; */

  const dispatchMessage = useCallback(
    (inputMessage) => {
      dispatch(action.sendchat(inputMessage));
    },
    [dispatch]
  );
  const dispatchConnected = useCallback(() => {
    dispatch(action.connected());
  }, [dispatch]);
  const dispatchRxMessage = useCallback(
    (username, message, time) => {
      dispatch(action.receivechat(username, message, time));
    },
    [dispatch]
  );

  const dispatchUnreadMessage = useCallback(
    (msgArray) => {
      dispatch(action.loadUnread(msgArray));
    },
    [dispatch]
  );

  const dispatchTypingHandler = useCallback(
    (name) => {
      dispatch(action.typingHandler(name));
    },
    [dispatch]
  );

  const dispatchReceipt = useCallback(
    (id) => {
      dispatch(action.receipt(id));
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on("message", (data) => {
      const receivedMessage = JSON.parse(data);
      // console.log(data);

      let username = receivedMessage.username.toString();
      let message = receivedMessage.message.toString();
      let time = receivedMessage.time.toString();
      //let color = receivedMessage.color.toString();

      dispatchRxMessage(username, message, time);
    });
    socket.on("json", (data) => {
      //console.log(data);
      dispatchUnreadMessage(data);
    });
    socket.on("typing", (data) => {
      console.log("TYPING RECEIVED", data);
      dispatchTypingHandler(data);
    });
    socket.on("receipt", (data) => {
      //console.log(data);
      dispatchReceipt(data);
    });
    socket.on("status", (data) => {
      console.log(data);
      if (data === 1) {
        dispatchConnected();
      }
    });
  }, []);

  const textInputHandler = (inputText) => {
    setInputMessage(inputText);

    if (inputText !== "" && isTyping === false) {
      setIsTyping(true);
      socket.emit("typing", username);
      console.log("emitted typing 1");
    } else if (inputText === "" && isTyping === true) {
      setIsTyping(false);
      socket.emit("typing", username);
      console.log("emitted typing 2");
    }
  };

  const sendHandler = () => {
    if (inputMessage !== "") {
      let message = inputMessage;
      setIsTyping(false);
      setInputMessage("");
      //console.log("button preseed");
      dispatchMessage(message);
    }
  };

  const renderChatItems = (itemData) => {
    if (itemData.item.sender === username) {
      return (
        <ChatBubbleSend
          content={itemData.item.content}
          timestamp={itemData.item.timestamp}
          sent={itemData.item.sent}
        />
      );
    } else if (itemData.item.sender === "typing") {
      //console.log("YAHAN TAK SAHI HAI");
      return (
        <ChatBubbleTyping
          sender={itemData.item.sender}
          content={itemData.item.content}
          timestamp={itemData.item.timestamp}
          // color={itemData.item.color}
        />
      );
    } else if (itemData.item.sender != username) {
      return (
        <ChatBubbleReceive
          sender={itemData.item.sender}
          content={itemData.item.content}
          timestamp={itemData.item.timestamp}
          // color={itemData.item.color}
        />
      );
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        renderItem={renderChatItems}
        data={chatRepo}
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
