
import { createStackNavigator } from "react-navigation-stack";

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import userDetailsScreen from "../screens/userDetailsScreen";
import chatScreen from "../screens/chatScreen";
import AuthLoadingScreen  from "../screens/authLoadingScreen";

const defaultStackNav = {
  headerStyle: {
    backgroundColor: "#ff863b",
  },
  headerLeft: () => null,
  headerTintColor: "white",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const ChatNavigator = createStackNavigator(
  {
    Chat: chatScreen,
  },
  {
    initialRouteName: "Chat",
    defaultNavigationOptions: defaultStackNav,
  }
);

const AuthNavigator = createStackNavigator(
  {
    UserDetail: userDetailsScreen,
  },
  {
    defaultNavigationOptions: defaultStackNav,
  }
);

const AppNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Chat: ChatNavigator,
  Auth: AuthNavigator,
},{
  initialRouteName:'AuthLoading'
});

export default createAppContainer(AppNavigator);
