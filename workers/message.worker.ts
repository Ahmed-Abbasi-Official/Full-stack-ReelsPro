// workers/message.worker.ts
import Redis from 'ioredis';
import mongoose from 'mongoose';
import { Message } from '../models/Message.models'; // Adjust path
import { DBConnect } from '../lib/db'; // Adjust path

const redis = new Redis({
  host: "redis-13764.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 6379,
});

const startWorker = async () => {
  await DBConnect();

  console.log("Message worker started, waiting for messages...");

  while (true) {
    try {
      const data = await redis.blpop("message-queue", 0); // 0 = wait indefinitely

      if (data) {
        const [, raw] = data;
        const message = JSON.parse(raw);

        console.log("Processing message:", message);

        await Message.create({
          sender: message.sender,
          receiver: message.receiver,
          message: message.message,
        });
      }
    } catch (error) {
      console.error("Worker error:", error);
    }
  }
};

startWorker();
