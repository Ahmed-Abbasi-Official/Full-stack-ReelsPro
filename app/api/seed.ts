import User from "@/models/User";
import { Message } from "@/models/Message.models";
import { DBConnect } from "@/lib/db";

async function seed() {
  try {
    await DBConnect()

    // Clear old data
    await User.deleteMany({});
    await Message.deleteMany({});

    // Create dummy users
    const users = await User.insertMany([
      {
        username: "ahmed",
        email: "ahmed@example.com",
        password: "password123",
        code: "123456",
        codeExpiry: new Date(Date.now() + 3600000),
        isVerified: true,
        followers: [],
        following: [],
      },
      {
        username: "ali",
        email: "ali@example.com",
        password: "password123",
        code: "654321",
        codeExpiry: new Date(Date.now() + 3600000),
        isVerified: true,
        followers: [],
        following: [],
      },
      {
        username: "zara",
        email: "zara@example.com",
        password: "password123",
        code: "000000",
        codeExpiry: new Date(Date.now() + 3600000),
        isVerified: true,
        followers: [],
        following: [],
      },
    ]);

    const [ahmed, ali, zara] = users;

    // Create dummy messages
    const messages = await Message.insertMany([
      {
        sender: ahmed._id,
        receiver: ali._id,
        message: "Hey Ali! Kya haal hai?",
        status: "read",
        isRead: true,
        deletedFor: [],
        reportedBy: [],
      },
      {
        sender: ali._id,
        receiver: ahmed._id,
        message: "Sab theek Ahmed. Tum sunao?",
        status: "delivered",
        isRead: false,
        deletedFor: [],
        reportedBy: [],
      },
      {
        sender: zara._id,
        receiver: ahmed._id,
        message: "Hello Ahmed! This is Zara.",
        status: "sent",
        isRead: false,
        deletedFor: [],
        reportedBy: [],
      },
      {
        sender: ahmed._id,
        receiver: zara._id,
        message: "Hi Zara, nice to hear from you!",
        status: "delivered",
        isRead: false,
        repliedTo: null, // Will update after this
        deletedFor: [],
        reportedBy: [],
      },
    ]);

    // Optional: Add a reply to the 3rd message
    const reply = await Message.create({
      sender: zara._id,
      receiver: ahmed._id,
      message: "Thanks! That means a lot.",
      status: "read",
      isRead: true,
      repliedTo: messages[2]._id,
      deletedFor: [],
      reportedBy: [ali._id], // Ali reported this
    });

    console.log("✅ Dummy users and messages seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

export default seed();
