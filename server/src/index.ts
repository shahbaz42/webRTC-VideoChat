import express from "express";
import peerExpress from "express";
import ServerConfig from "./config/serverConfig";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import roomHandler from "./handlers/roomHandler";
import { ExpressPeerServer } from "peer";

const app = express();

app.use(cors());
app.enable("trust proxy");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user has connected");

  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("error", (error) => {
    console.log("An error occurred: ", error);
  });
});

// Express server
server.listen(ServerConfig.PORT, () => {
  console.log(`Server is running on port ${ServerConfig.PORT}`);
});

// Peer server
const peerApp = peerExpress();
const peerHttpServer = http.createServer(peerApp);
const peerServer = ExpressPeerServer(peerHttpServer, {
    path: "/",
});

peerApp.use("/peerjs", peerServer);
peerHttpServer.listen(ServerConfig.PEER_PORT, () => {
    console.log(`Peer server is running on port ${ServerConfig.PEER_PORT}`);
});



