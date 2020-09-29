import io from "socket.io-client";

const socket = io("wss://cryptic-tor-50532.herokuapp.com", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;

// heroku: wss://cryptic-tor-50532.herokuapp.com
