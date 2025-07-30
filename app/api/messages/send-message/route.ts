// /app/api/messages/send-message/route.ts

import { DBConnect } from "@/lib/db";
import { Message } from "@/models/Message.models";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await DBConnect();

    const payload = await req.json();

    const newMessage = await Message.create(payload);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Message DB save failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
