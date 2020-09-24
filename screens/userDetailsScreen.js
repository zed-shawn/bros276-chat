import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { useDispatch } from "react-redux";
import MD5 from "../helpers/md5";
import { Notifications } from "expo";

import { addName } from "../state/userDetail";

export default function userDetailsScreen(props) {
  const [enteredName, setEnteredName] = useState("");
  const [pushToken, setPushToken] = useState("Awaiting token");

  const dispatch = useDispatch();

  const textInputHandler = (inputText) => {
    setEnteredName(inputText);
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const notifData = await Notifications.getExpoPushTokenAsync();
        const tokenOrg = notifData;
        //const tokenTrimmed = tokenOrg.slice(18, -1);
        setPushToken(tokenOrg);
        console.log("token", tokenOrg);
      } catch (err) {
        const errString= JSON.stringify(err)
        setPushToken(errString);
      }
    };
    getToken();
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
        <Text style={styles.titleText}>B R R O S</Text>
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
        <Text>{pushToken}</Text>
        {/* <Text>VER 2.1</Text> */}
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
