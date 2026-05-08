import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import LogoutButton from "../components/LogoutButton";

import type { Chat, Message } from "../types/chat";
import { upgradeToPro } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/axios";
import { deleteChat } from "../services/chatService";

const ChatPage: React.FC = () => {
  const { user, refreshUser, authReady } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const plan = user?.plan;
  const isPro = plan === "pro";
  const isBasic = plan === "basic";

  /* ================= LOADING ================= */

  if (!authReady) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading user...</Typography>
      </Box>
    );
  }

  /* ================= INIT ================= */

  useEffect(() => {
    const init = async () => {
      if (!plan) return;

      try {
        if (isPro) {
          const res = await api.get("/chat/list");
          setChats(res.data);

          if (res.data.length > 0) {
            const firstChatId = res.data[0].id;
            setCurrentChatId(firstChatId);

            const history = await api.get(
              `/chat/${firstChatId}/history`
            );
            setMessages(history.data);
          }
        } else {
          setChats([]);
          setMessages([]);
          setCurrentChatId(null);
        }
      } catch (err) {
        console.error("INIT ERROR:", err);
      }
    };

    init();
  }, [plan, isPro]);

  /* ================= HANDLERS ================= */

  const handleUpgrade = async () => {
    try {
      await upgradeToPro();
      await refreshUser(); // 🔥 reload user + re-init chats
    } catch (err) {
      console.error("Upgrade failed:", err);
    }
  };

  const handleNewChat = async () => {
    const res = await api.post("/chat/new");
    const newChat = res.data;

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = async (id: string) => {
    setCurrentChatId(id);

    const res = await api.get(`/chat/${id}/history`);
    setMessages(res.data);
  };

  const handleDeleteChat = async (chatId: string) => {
  try {
    await deleteChat(chatId);

    setChats(prev => prev.filter(c => c.id !== chatId));

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  } catch (err) {
    console.error("Delete chat failed:", err);
  }
};
  /* ================= RENDER ================= */

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f7f7f8" }}>
      {/* ===== SIDEBAR (PRO ONLY) ===== */}
      {isPro && (
        <ChatSidebar
          chats={chats}
          selectedChatId={currentChatId}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDelete={handleDeleteChat}
        />
      )}

      {/* ===== MAIN AREA ===== */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ===== HEADER (PUT LOGOUT HERE) ===== */}
        <Box
          sx={{
            height: 60,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            bgcolor: "white",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            {/* AI Chat ({plan}) */}
            AI Chat
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {isBasic && (
              <Button variant="contained" onClick={handleUpgrade}>
                Upgrade
              </Button>
            )}
            <LogoutButton />
          </Box>
        </Box>

        {/* ===== CHAT WINDOW ===== */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 900 }}>

            <ChatWindow
              chatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
              messages={messages}
              setMessages={setMessages}
              setChats={setChats}
            />

          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default ChatPage;