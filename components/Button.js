import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Button(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.buttonBox}>
        <Text style={styles.buttonText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    height: 50,
    //width: 100,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems:"center"
  },
  buttonText: {
    //fontFamily: "SenReg",
    color: "white",
    //textAlign: "center",
    fontSize: 10,
  },
});
