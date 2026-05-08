import React, { useEffect, useState } from "react";
import {
  Box,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LogoutIcon from "@mui/icons-material/Logout";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

import type { Chat, Message } from "../types/chat";
import { upgradeToPro } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/axios";
import { deleteChat } from "../services/chatService";

const ChatPage: React.FC = () => {
  const { user, refreshUser, authReady, logout } = useAuth();

  const username =
    user?.fullName?.trim() ||
    user?.email ||
    "User";

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const plan = user?.plan;
  const isPro = plan === "pro";
  const isBasic = plan === "basic";

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
          } else {
            setMessages([]);
            setCurrentChatId(null);
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

  const handleUpgrade = async () => {
    try {
      await upgradeToPro();
      await refreshUser();

      setMessages([]);
      setChats([]);
      setCurrentChatId(null);

      const res = await api.post("/chat/new");
      const newChat = res.data;

      setChats([newChat]);
      setCurrentChatId(newChat.id);
      setMessages([]);
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
      setChats((prev) => prev.filter((c) => c.id !== chatId));

      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Delete chat failed:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f7f7f8" }}>
      {isPro && (
        <ChatSidebar
          chats={chats}
          selectedChatId={currentChatId}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDelete={handleDeleteChat}
          onLogout={logout}
        />
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <Box
          sx={{
            height: 64,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "white",
          }}
        >
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#2563eb",
              }}
            />
            <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
              AstraChat
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Basic-only Upgrade */}
            {isBasic && (
              <Tooltip title="Upgrade to Pro">
                <IconButton
                  onClick={handleUpgrade}
                  sx={{
                    color: "#0f172a",
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                    },
                  }}
                >
                  <AutoAwesomeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Basic-only Logout */}
            {isBasic && (
              <Tooltip title="Logout">
                <IconButton
                  onClick={logout}
                  sx={{
                    color: "#0f172a",
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                    },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Avatar */}
            <Tooltip title={username}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#2563eb",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* CHAT WINDOW */}
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