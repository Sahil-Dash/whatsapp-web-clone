import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="flex items-center justify-center py-5">
        <span className="text-slate-400">All Messages</span>
      </div>
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="flex w-full">
        <div className="flex flex-col justify-end w-full ga-1 overflow-auto">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-center gap-2 text-sm ${
                message.senderId && message.senderId === currentChatUser.id
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              {message.type === "text" && (
                <div
                  className={`text-white px-4 mx-10 py-[5px] text-sm rounded-md flex gap-2 iteme max-w-[45%] ${
                    message.senderId && message.senderId === currentChatUser.id
                      ? "bg-incoming-background"
                      : "bg-outgoing-background"
                  }`}
                >
                  <span className="break-all ">{message.message}</span>
                  <div className="flex gap-2 items-end">
                    <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                      {calculateTime(message.createdAt)}
                    </span>
                    <span>
                      {message.senderId === userInfo.id && (
                        <MessageStatus status={message.messageStatus} />
                      )}
                    </span>
                  </div>
                </div>
              )}
              {message.type === "image" && <ImageMessage message={message} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
