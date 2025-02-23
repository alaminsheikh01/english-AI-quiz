import React from "react";
import db from "../../../../db";
import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Chat from "@/components/Chat";
import GrammerImprovement from "@/components/GrammerImprovement";

const page = async ({ params }: { params: { chatId: string } }) => {
  const { chatId } = await params;

  const chat = await db.conversation.findUnique({
    where: {
      id: chatId,
    },
    select: {
      message: {
        include: {
          improvements: true,
        },
      },
    },
  });

  if (!chat) {
    return notFound();
  }
  return (
    <MaxWidthWrapper className="bg-background">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="grid col-span-1 md:col-span-8">
          <Chat initMessages={chat?.message || []} conversationId={chatId} />
        </div>
        <div className="grid col-span-1 md:col-span-4">
            <GrammerImprovement/>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
