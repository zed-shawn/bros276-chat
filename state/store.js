import { createStore, combineReducers } from "redux";
import chatReducer from "./chatEngine";

const rootReducer = combineReducers({
  chat: chatReducer,
});

const store = createStore(rootReducer);
export default store;
