import io from "socket.io-client";

const socket = io("http://5d2615b26987.ngrok.io/", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket
