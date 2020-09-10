import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { useDispatch} from "react-redux";

import { addName } from "../state/userDetail";

import socket from "../components/socketInit";

const identifier = Math.random().toString();
//console.log(identifier);

export default function userDetailsScreen(props) {
  const [enteredName, setEnteredName] = useState("");
  const dispatch = useDispatch();

  const textInputHandler = (inputText) => {
    setEnteredName(inputText);
  };

  const dispatchUsername = useCallback(
    (username) => {
      dispatch(addName(username));
    },
    [dispatch]
  );

  const inputButtonHandler = () => {
    const sendFromUserDetails = [identifier, enteredName];
    socket.emit("identifier", sendFromUserDetails);
    dispatchUsername(enteredName);

    props.navigation.navigate({
      routeName: "Chat",
      params: {
        username: enteredName,
      },
    });
  };
  return (
    <View style={styles.root}>
      <View style={styles.title}>
        <Text style={styles.titleText}>bros 276pp</Text>
      </View>
      <View style={styles.inputButton}>
        <TextInput
          style={styles.textInput}
          placeholder="     Enter Name     "
          placeholderTextColor="white"
          onChangeText={textInputHandler}
          value={enteredName}
        />
      </View>
      <View>
        <Button onPress={inputButtonHandler} title="Join Chat!" color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ff863b",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-around",
    width: "100%",
  },
  titleText: {
    fontSize: 50,
    fontWeight: "bold",
  },
  textInput: {
    width: "60%",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  inputButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
