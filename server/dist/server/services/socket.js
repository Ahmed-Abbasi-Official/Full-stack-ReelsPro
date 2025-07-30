// services/socket.ts
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { Message } from '../../models/Message.models.js';
import { DBConnect } from '../../lib/db.js';
import dotenv from 'dotenv';
dotenv.config(); // Add this before any other imports
const pub = new Redis({
    host: "redis-13764.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 13764,
    password: "DuqkNLY9Jg4ZmWR9aLDZrKlpusoOn33u",
});
const sub = pub.duplicate();
pub.on("error", (err) => {
    console.error("Redis pub error:", err);
});
sub.on("error", (err) => {
    console.error("Redis sub error:", err);
});
const serverName = process.env.SERVER_ID || "unknown-server";
class SocketService {
    constructor() {
        this.onlineUsers = new Set(); // Track all logged-in users
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
    initListener() {
        const io = this._io;
        console.log("Socket listener running");
        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);
            console.log("Total clients:", io.engine.clientsCount);
            // Triggered when user logs in (not just chat page)
            socket.on("event:login", ({ userId }) => {
                this.onlineUsers.add(userId);
                this._io.emit("user-online", userId); // Broadcast to all
            });
            // socket.on("event:logout", ({ userId }) => {
            //   onlineUsers.delete(userId);
            //   io.emit("user-offline", userId);
            // });
            socket.on("event:register", ({ userId }) => {
                socket.join(userId);
                socket.data.userId = userId;
                console.log(`${userId} joined their room`);
            });
            socket.on("event:message", async ({ toUserId, message }) => {
                // console.log(toUserId)
                const payload = {
                    sender: socket.data.userId,
                    receiver: toUserId,
                    message,
                };
                io.to(toUserId).emit("message", payload);
                console.log(payload);
                try {
                    await DBConnect();
                    await Message.create(payload);
                }
                catch (error) {
                    console.error("Message DB save failed:", error.message);
                }
            });
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
    get io() {
        return this._io;
    }
}
export default SocketService;
//# sourceMappingURL=socket.js.map