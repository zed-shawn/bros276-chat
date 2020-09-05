import React from "react";
import { View, StyleSheet, Text } from "react-native";

var hours = new Date().getHours(); //To get the Current Hours
var min = new Date().getMinutes(); //To get the Current Minutes

export default function ChatBubbleReceive(props) {
  const color = props.color;
  //console.log(color);
  return (
    <View style={styles.rootest}>
      <View style={styles.root}>
        <View style={styles.sender}>
          <Text style={{ color: color, fontWeight: "bold" }}>
            {props.sender}
          </Text>
        </View>
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
  rootest: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex:1
    
  },
  root: {
    backgroundColor: "#fffdf0",
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    maxWidth: "80%",
    marginVertical: 5,
    //maxWidth:"80%"

    //marginRight: "60%",
  },
  time: {
    alignItems: "flex-end",
  },
  timeText: {
    color: "grey",
  },
  senderText: {},
  sender: {
    alignItems: "flex-start",
    marginBottom: 3,
  },
});
