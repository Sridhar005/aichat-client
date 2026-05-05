import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import type { Message } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../../services/chatService";

type Props = {
  chatId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const ChatWindow: React.FC<Props> = ({
  chatId,
  messages,
  setMessages,
}) => {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isBasic = chatId === null;   // ✅ single source of truth
  const isPro = chatId !== null;

  /* ✅ Auto-scroll on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (msg: string) => {
    if (!msg.trim() || loading) return;

    // ❗ Pro users must have chatId
    if (isPro && !chatId) return;

    setLoading(true);

    try {
      /* ✅ USER MESSAGE */
      const userMsg: Message = {
        id: uuidv4(),
        chatId: isBasic ? "basic" : chatId,
        sender: "user",
        text: msg,
      };

      setMessages(prev => [...prev, userMsg]);

      /* ✅ SEND TO API */
      const res = await sendMessage(
        isBasic ? null : chatId,
        msg
      );

      /* ✅ AI MESSAGE */
      const aiMsg: Message = {
        id: uuidv4(),
        chatId: isBasic ? "basic" : chatId,
        sender: "ai",
        text: res.reply,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("SEND ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* MESSAGES */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 3 }}>
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m.text}
            sender={m.sender}
          />
        ))}
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