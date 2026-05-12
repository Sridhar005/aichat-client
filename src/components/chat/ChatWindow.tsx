import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import type { Message, Chat } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../../services/chatService";

const TEMP_CHAT_ID = "temp";

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

  const visibleMessages = messages.filter(
    (m) => m.chatId === (chatId ?? TEMP_CHAT_ID)
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, loading]);

  const handleSend = async (msg: string) => {
    if (!msg.trim() || loading) return;
    setLoading(true);

    const activeChatId = chatId ?? TEMP_CHAT_ID;

    try {
      /* ✅ USER MESSAGE */
      const userMsg: Message = {
        id: uuidv4(),
        chatId: activeChatId,
        sender: "user",
        text: msg,
      };

      setMessages((prev) => [...prev, userMsg]);

      /* ✅ SEND TO BACKEND */
      const res = await sendMessage(
        activeChatId === TEMP_CHAT_ID ? null : activeChatId,
        msg
      );

      /* ✅ CHAT CREATED (first message only) */
      if (!chatId && res.chatId) {
        setCurrentChatId(res.chatId);

        // Update temp messages to real chatId
        setMessages((prev) =>
          prev.map((m) =>
            m.chatId === TEMP_CHAT_ID
              ? { ...m, chatId: res.chatId }
              : m
          )
        );

        // Add new chat to sidebar
        setChats((prev) => [
          {
            id: res.chatId,
            title: res.chatTitle || "New Chat",
          },
          ...prev,
        ]);
      }

      /* ✅ ✅ ✅ UPDATE CHAT TITLE (FIX) */
      if (res.chatId && res.chatTitle) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === res.chatId
              ? { ...chat, title: res.chatTitle }
              : chat
          )
        );
      }

      /* ✅ AI MESSAGE */
      const aiMsg: Message = {
        id: uuidv4(),
        chatId: res.chatId ?? activeChatId,
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
