import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { useDispatch } from "react-redux";
import MD5 from "../helpers/md5";
import * as Notifications from "expo-notifications";

import { addName } from "../state/userDetail";

export default function userDetailsScreen(props) {
  const [enteredName, setEnteredName] = useState("");
  const [pushToken, setPushToken] = useState("skrrrt");

  const dispatch = useDispatch();

  const textInputHandler = (inputText) => {
    setEnteredName(inputText);
  };

  useEffect(() => {
    Notifications.getExpoPushTokenAsync()
      .then((response) => {
        const token = response.data;
        setPushToken(token);
        console.log(token);
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  }, []);

  const dispatchUsername = useCallback(
    (identifier, username) => {
      dispatch(addName(identifier, username));
    },
    [dispatch]
  );

  //console.log(tokenFirstRem);
  const inputButtonHandler = () => {
    /*   const userToLower = enteredName.toLowerCase();
    const identifier = MD5(`${userToLower}`); */

    dispatchUsername(pushToken, enteredName);
    console.log("state log", pushToken);

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
        <Text style={styles.titleText}>B R O S</Text>
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
      <View>
        <Text>VER 2.3.0</Text>
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
