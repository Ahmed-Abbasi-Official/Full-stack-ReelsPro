// services/socket.ts
import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { Message } from "../Message.models.ts";
import { DBConnect } from '../db.ts';
import dotenv from 'dotenv';
dotenv.config(); // Add this before any other imports
// const serverName = process.env.SERVER_ID! 


const pub = new Redis({
  host: process.env.REDIS_HOST || "redis-13764.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: Number(process.env.PORT) || 13764,
  password: process.env.PASSWORD,
});
const sub = pub.duplicate();

pub.on("error", (err: any) => {
  console.error("Redis pub error:", err);
});
sub.on("error", (err: any) => {
  console.error("Redis sub error:", err);
});

const serverName = process.env.SERVER_ID || "unknown-server";


interface RegisterEvent {
  userId: string;
}

interface MessageEvent {
  sender: string;
  reciver: string;
  message: string;
}

class SocketService {
  private _io: Server;
  private onlineUsers = new Set<string>(); // Track all logged-in users

  constructor() {
    // console.log(serverName)
    console.log("Initializing socket service");
    DBConnect().catch(err => console.error("DB connection error:", err));

    this._io = new Server({
      adapter: createAdapter(pub, sub),
      cors: {
        origin: "*",
      },
    });
  }

  public initListener() {
    const io = this._io;

    console.log("Socket listener running");

    io.on("connection", (socket: Socket) => {
      const userId = socket.handshake?.query?.userId as string;
      console.log(`Socket connected: ${socket.id} for user ${userId}`);
      console.log("Total clients:", io.engine.clientsCount);

      if (userId && userId !== undefined) {
        this.onlineUsers.add(userId)
      }

      console.log("Online users:", Array.from(this.onlineUsers));

      //* TRIGGER WHEN USER IN COME ON YOUR WEB :

      this._io.emit("getOnlineUser", Array.from(this.onlineUsers)); // Broadcast to all

      socket.on("joinRoom", (chatId) => {
        if (!socket.rooms.has(chatId)) {
          socket.join(chatId);
        }
        console.log(`Socket ${socket.id} joined room ${chatId}`);
      });

      //* SEND MESSAGE :

      socket.on("event:message", async (data) => {
        // console.log(data)
        const { sender, receiver, message } = data;
        // console.log(data)
        const payload = {
          sender:sender,
          receiver: receiver,
          message,
        };

        io.to(receiver).emit("get:messages", data);
        // console.log({ ...payload, serverName })

        try {
          await DBConnect();
          await Message.create(payload)
        } catch (error: any) {
          console.error("Message DB save failed:", error.message);
        }
      });

      //* DELETE MESSAGE :

      socket.on("event:delete", async ({sender,messageId,reciever} : any) => {
        // console.log(messageId)
        socket.to(reciever).emit("event:deleted", { messageId });
        try {
          await DBConnect();
          await Message.findOneAndDelete({ sender: sender });
          console.log(`Message with ID ${messageId} deleted.`);
        } catch (error: any) {
          console.error("Message delete failed:", error.message);
        }
      });



      // socket.on("event:logout", ({ userId }) => {
      //   onlineUsers.delete(userId);
      //   io.emit("user-offline", userId);
      // });


      

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        const userId = socket.data.userId;
        if (userId && this.onlineUsers.has(userId)) {
          this.onlineUsers.delete(userId);
          this._io.emit("user-offline", userId);
        }
      });
    });
  }

  public get io(): Server {
    return this._io;
  }
}

export default SocketService;
