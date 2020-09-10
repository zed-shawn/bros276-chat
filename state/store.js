import { createStore, combineReducers } from "redux";
import chatReducer from "./chatEngine";

export const initialState = {
  user: [],
  chatList: [],
};

const rootReducer = combineReducers({
  chat: chatReducer,
});

const store = createStore(rootReducer);
export default store;
