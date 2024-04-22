import express from "express";
import ServerConfig from "./config/serverConfig";
import http from "http";

const app = express();

const server = http.createServer(app);

server.listen(ServerConfig.PORT, () => {
    console.log(`Server is running on port ${ServerConfig.PORT}`);
});