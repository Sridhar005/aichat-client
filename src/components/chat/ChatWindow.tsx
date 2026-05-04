import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import type { Message } from "../../types/chat";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../../services/chatService";

const ChatWindow = ({ chatId, messages, setMessages }: any) => {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (msg: string) => {
    if (!chatId || loading) return;

    const userMsg: Message = {
      id: uuidv4(),
      chatId,
      sender: "user",
      text: msg,
    };

    setMessages((prev: Message[]) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendMessage(chatId, msg);

      const aiMsg: Message = {
        id: uuidv4(),
        chatId,
        sender: "ai",
        text: res.reply,
      };

      setMessages((prev: Message[]) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 3 }}>
        {messages.map((m: Message) => (
          <ChatMessage key={m.id} message={m.text} sender={m.sender} />
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
        <ChatInput onSend={handleSend} disabled={loading} />
      </Box>
    </Box>
  );
};

export default ChatWindow;