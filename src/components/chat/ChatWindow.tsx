import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import type { Message, Chat } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../../services/chatService";

type Props = {
  chatId: string | null;
  setCurrentChatId: (id: string) => void;

  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;

  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
};

const ChatWindow: React.FC<Props> = ({
  chatId,
  setCurrentChatId,
  messages,
  setMessages,
  setChats,
}) => {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ✅ ONLY show messages for the active chat */

  const visibleMessages = chatId
    ? messages.filter((m) => m.chatId === chatId)
    : messages;


  /* ✅ Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, loading]);

  /* ✅ Reset typing state when chat resets */
  useEffect(() => {
    if (!chatId) {
      setLoading(false);
    }
  }, [chatId]);

  const handleSend = async (msg: string) => {
    if (!msg.trim() || loading) return;
    setLoading(true);

    try {
      const userMsg: Message = {
        id: uuidv4(),
        chatId: chatId ?? "temp",
        sender: "user",
        text: msg,
      };

      setMessages((prev) => [...prev, userMsg]);

      const res = await sendMessage(chatId, msg);
      // res = { reply, chatId, chatTitle }

      if (!chatId && res.chatId) {
        setCurrentChatId(res.chatId);
        setChats((prev) => [
          {
            id: res.chatId,
            title: res.chatTitle || "New Chat",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      if (res.chatTitle && chatId) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, title: res.chatTitle } : c
          )
        );
      }

      const aiMsg: Message = {
        id: uuidv4(),
        chatId: res.chatId ?? chatId!,
        sender: "ai",
        text: res.reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* MESSAGE LIST */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 3 }}>
        {visibleMessages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m.text}
            sender={m.sender}
          />
        ))}

        {loading && (
          <ChatMessage
            message="Typing…"
            sender="ai"
            thinking
          />
        )}

        <div ref={bottomRef} />
      </Box>

      {/* INPUT */}
      <Box sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
        <ChatInput onSend={handleSend} disabled={loading} />
      </Box>
    </Box>
  );
};

export default ChatWindow;
