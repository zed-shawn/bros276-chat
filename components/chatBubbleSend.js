import React from "react";
import { View, StyleSheet, Text } from "react-native";

var hours = new Date().getHours(); //To get the Current Hours
var min = new Date().getMinutes(); //To get the Current Minutes

export default function ChatBubbleSend(props) {
  return (
    <View style={styles.rootest}>
      <View style={styles.root}>
        <View>
          <Text>{props.content}</Text>
        </View>
        <View style={styles.time}>
          <Text style={styles.timeText}>{props.timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootest:{
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  root: {
    backgroundColor: "#fffdf0",
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: "flex-end",
    maxWidth: "80%",
    //marginLeft: "60%",
    marginVertical: 5,
  },
  time: {
    alignItems: "flex-end",
  },
  timeText: {
    color: "grey",
  },
});
