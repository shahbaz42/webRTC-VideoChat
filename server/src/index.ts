import express from "express";
import ServerConfig from "./config/serverConfig";
import { Server } from "socket.io";
import http from "http";
import cors from 'cors';
import roomHandler from "./handlers/roomHandler";
import { PeerServer } from "peer";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    console.log("A new user has connected");

    roomHandler(socket);

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const peerServer = PeerServer({ port: 9000, path: "/myapp" });
console.log(`Peer Server is running on port 9000`);

server.listen(ServerConfig.PORT, () => {
    console.log(`Server is running on port ${ServerConfig.PORT}`);
});