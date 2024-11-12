"use client";

import { Message } from "@prisma/client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { sendMessageToDB } from "@/utils/db";
import { continueConversation } from "@/utils/open-ai";

const Chat = ({
  initMessages,
  conversationId,
}: {
  initMessages: Message[];
  conversationId: string;
}) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isProcessing) return;
    setIsProcessing(true);
    const currentMessages = message.trim();
    setMessage("");

    try {
      const userMessage: Message = {
        content: currentMessages,
        role: "user",
        id: `temp-${Date.now()}`,
        conversationId,
        createdAt: new Date(),
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          ...userMessage,
          id: "typing",
          content: "I'm typing...",
          role: "assistant",
        },
      ]);

      const [newMessage] = await Promise.all([
        sendMessageToDB(currentMessages, conversationId, "user"),
      ]);

      if (!newMessage) throw new Error("Failed to send message");

      setMessages((prev) =>
        prev.filter((m) => m.id !== "typing").concat(newMessage)
      );

      const aiResponse = await continueConversation(
        [...messages, newMessage],
        currentMessages
      );
      if (!aiResponse) throw new Error("Failed to get response");

      const newAiMessage = await sendMessageToDB(
        aiResponse.content,
        conversationId,
        "assistant"
      );
      if (!newAiMessage) throw new Error("Failed to save AI message");

      setMessages((prev) => prev.concat(newAiMessage));
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== "typing"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Badge, Title, Description */}
      </motion.div>
      <Card className="mb-4">
        <CardContent className="p-6">
          <motion.div
            className="space-y-4 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            aria-live="polite"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  layout
                  key={msg.id}
                  layoutId={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "flex items-center gap-3",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        msg.role === "assistant"
                          ? "/ai-avatar.png"
                          : "/user-avatar.png"
                      }
                    />
                    <AvatarFallback>
                      {msg.role === "assistant" ? "AI" : "ME"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      msg.role === "assistant"
                        ? "bg-accent/10 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <Separator className="my-4" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <div className="flex-1 flex gap-3">
              <Input
                placeholder={
                  isProcessing ? "Waiting for response" : "Type your message..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                className="shrink-0"
                onClick={sendMessage}
                disabled={!message.trim() || isProcessing}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, loop: Infinity, ease: "linear" }}
                    className="h-5 w-5"
                  >
                    loading...
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
