import React from "react";
import { View, ActivityIndicator } from "react-native";
import socket from "../components/socketInit";

import { getAuth, getHash } from "../helpers/db";

export default function AuthLoadingScreen(props) {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const authRowRaw = await getAuth();
    const authRow = rowNumRaw.rows._array[0]["COUNT (hashID)"];
    let isAuth = false;
    if (authRow === 1) {
      isAuth = true;
      const dbResult = await getHash();
      let array = dbResult.rows._array;
      hash = array[0].hashID.toString();
      socket.emit("user", hash);
    }
    props.navigation.navigate(isAuth ? "Chat" : "Auth");
  }

  return (
    <View>
      <ActivityIndicator size="large" />
    </View>
  );
}
