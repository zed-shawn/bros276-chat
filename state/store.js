import { createStore, combineReducers } from "redux";
import chatReducer from "./chatEngine";
import userReducer from "./userDetail";

export const initialState = {
  user: [],
  chatList: [],
};

const rootReducer = combineReducers({
  chat: chatReducer,
  user: userReducer,
});

const store = createStore(rootReducer);
export default store;
