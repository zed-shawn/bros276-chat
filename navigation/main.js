import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import { createAppContainer } from "react-navigation";

import userDetailsScreen from "../screens/userDetailsScreen";
import chatScreen from "../screens/chatScreen";

const defaultStackNav = {
  headerStyle: {
    backgroundColor: "#ff863b",
  },
  headerLeft:()=>null,
  headerTintColor: "white",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const ChatNavigator = createStackNavigator(
  {
    UserDetail: userDetailsScreen,
    Chat: chatScreen,
  },
  {
    defaultNavigationOptions: defaultStackNav,
  }
);

export default createAppContainer(ChatNavigator);
