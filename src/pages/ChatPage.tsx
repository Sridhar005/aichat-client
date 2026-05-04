import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import type { Chat, Message } from "../types/chat";
import { upgradeToPro } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const ChatPage: React.FC = () => {
  const { user, loading } = useAuth();

  const [plan, setPlan] = useState<"basic" | "pro">("basic");
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ Initialize ONLY from AuthContext (NO getMe here)
  useEffect(() => {
    if (loading) return;

    if (!user) {
      // 🔥 Not logged in → redirect
      window.location.href = "/login";
      return;
    }

    const userPlan = user?.plan || "basic";
    setPlan(userPlan);

    const defaultChat: Chat = {
      id: crypto.randomUUID(),
      title: userPlan === "basic" ? "Basic Chat" : "New Chat",
    };

    setChats([defaultChat]);
    setCurrentChatId(defaultChat.id);
  }, [user, loading]);

  // ✅ Upgrade handler
  const handleUpgrade = async () => {
    try {
      await upgradeToPro();
      setPlan("pro");
    } catch (err) {
      console.error("UPGRADE ERROR:", err);
    }
  };

  // ✅ New chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  // ✅ Select chat
  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setMessages([]);
  };

  // ⏳ Optional loading UI
  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f7f7f8" }}>
      
      {/* Sidebar only for PRO */}
      {plan === "pro" && (
        <ChatSidebar
          chats={chats}
          selectedChatId={currentChatId}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
        />
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <Box
          sx={{
            height: 60,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
            bgcolor: "white",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            AI Chat
          </Typography>

          {plan === "basic" && (
            <Button variant="contained" onClick={handleUpgrade}>
              Upgrade
            </Button>
          )}
        </Box>

        {/* Chat Window */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 900 }}>
            <ChatWindow
              chatId={currentChatId}
              messages={messages}
              setMessages={setMessages}
            />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default ChatPage;