import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import socket from "../components/socketInit";

import { getAuth, getHashAndName } from "../helpers/db";

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const authRowRaw = await getAuth();
    const authRow = authRowRaw.rows._array[0]["COUNT (hashID)"];
    let isAuth = false;
    if (authRow === 1) {
      isAuth = true;
      const dbResult = await getHashAndName();
      let array = dbResult.rows._array;
      hash = array[0].hashID.toString();
      name = array[0].name.toString();
      //console.log("from auth screen", name);
      //socket.emit("user", hash);
      props.navigation.navigate({
        routeName: "Chat",
        key: "Chat",
        params: {
          username: name,
        },
      });
    } else if (authRow !== 1) {
      props.navigation.navigate("Auth");
    }
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
