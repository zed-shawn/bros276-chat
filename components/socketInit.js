import io from "socket.io-client";

const socket = io("http://a953e0936006.ngrok.io/", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket

// heroku: wss://cryptic-tor-50532.herokuapp.com
