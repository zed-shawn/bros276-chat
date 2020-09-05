global.socket = io("http://42d5c698eefa.ngrok.io/", {
    transports: ["websocket"],
    reconnection: false,
  });