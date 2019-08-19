const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const mongoose = require("mongoose");

const httpserver = express();
const server = require("http").Server(httpserver);

const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});
mongoose.connect(
  "mongodb+srv://richard:bim@cluster0-uob3u.mongodb.net/omnistack8?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

httpserver.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

httpserver.use(express.json());
httpserver.use(cors());
httpserver.use(routes);
httpserver.use(express);
server.listen(3333);
