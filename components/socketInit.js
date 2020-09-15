import io from "socket.io-client";

const socket = io("http://3a4dec411a8b.ngrok.io/", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket

// heroku: wss://cryptic-tor-50532.herokuapp.com
