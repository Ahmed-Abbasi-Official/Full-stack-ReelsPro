// index.ts
import express from "express";
import { createServer } from "node:http";
import SocketService from "./services/socket.js"; // TS with "moduleResolution": "node16" or "bundler"
import dotenv from 'dotenv';
dotenv.config();
const init = () => {
    const app = express();
    const server = createServer(app);
    const socketService = new SocketService();
    socketService.io.attach(server);
    socketService.initListener();
    app.get("/", (_req, res) => {
        res.send("<h1>Hello world</h1>");
    });
    server.listen(8000, () => {
        console.log("Server running at http://localhost:8000");
    });
};
init();
//# sourceMappingURL=index.js.map