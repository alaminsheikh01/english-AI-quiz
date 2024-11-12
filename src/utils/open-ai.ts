"use server"
import openai from "@/lib/openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Message } from "@prisma/client";

// Define schema for assistant and user messages
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

// Continue conversation function to process and respond to a conversation
export async function continueConversation(
  messages: Message[],
  message: string
) {
  try {
    const conversationMessages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that has conversations to help people learn their target language. Maintain a natural and engaging conversation style. Do not correct grammar mistakes.",
      },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // OpenAI API call to generate a conversational response
    const response = await openai.beta.chat.completions.parse({
      messages: conversationMessages as ChatCompletionMessageParam[],
      model: "gpt-4o-2024-08-06",
      temperature: 0.7,
      response_format: zodResponseFormat(messageSchema, "message"),
    });

    console.log("OpenAI API response:", response);

    const parsedMessage = response?.choices[0]?.message?.parsed;
    if (!parsedMessage) {
      throw new Error("OpenAI response parsing failed.");
    }

    return parsedMessage;
  } catch (error) {
    console.error("Error continuing conversation:", error);
    throw new Error("Failed to continue conversation");
  }
}