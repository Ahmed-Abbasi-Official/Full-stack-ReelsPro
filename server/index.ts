// index.ts
import express from "express";
import { createServer } from "node:http";
import SocketService from "./services/socket.ts"; // TS with "moduleResolution": "node16" or "bundler"
import dotenv from 'dotenv';
dotenv.config();

const init = () => {
  console.log("first")
  const app = express();
  const server = createServer(app);

  const socketService = new SocketService();
  socketService.io.attach(server);
  socketService.initListener();

  app.get("/", (_req:any, res:any) => {
    res.send("<h1>Hello world</h1>");
  });

  server.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
  });
};

init();
