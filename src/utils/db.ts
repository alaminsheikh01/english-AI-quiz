"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import db from "../../db";
import { Message } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Define allowed roles for type safety
type Role = "user" | "assistant";

export async function sendMessageToDB(
  message: string,
  conversationId: string,
  role: Role
): Promise<Message | undefined> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found for user ${user.id}.`);
    }

    const newMessage = await db.message.create({
      data: {
        content: message,
        conversationId: conversationId,
        role: role,
      },
    });

    // Revalidate cache if necessary
    revalidatePath(`/conversation/${conversationId}`);

    return newMessage;
  } catch (error) {
    console.error("Error in sendMessageToDB:", error);
    throw new Error("Failed to send message to database.");
  }
}
