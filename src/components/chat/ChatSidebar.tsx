import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import type { Chat } from "../../types/chat";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

type Props = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void; // ✅ ONLY logout here
};

const ChatSidebar: React.FC<Props> = ({
  chats,
  selectedChatId,
  onSelect,
  onNewChat,
  onDelete,
  onLogout,
}) => {
  return (
    <Box
      sx={{
        width: 260,
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
      }}
    >


      <Box
        onClick={onNewChat}
        sx={{
          mx: 1,
          my: 1,
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          borderRadius: 1,
          cursor: "pointer",
          color: "#1976d2",

          "&:hover": {
            bgcolor: "#b5c7d9",
          },
        }}
      >
        <ChatOutlinedIcon fontSize="small" sx={{ color: "#64748b" }} />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          New Chat
        </Typography>
      </Box>


      <Typography sx={{ px: 2, pb: 1, fontWeight: 600 }}>
        Recent Chats
      </Typography>

      {/* CHAT LIST */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {chats.length === 0 ? (
          <ListItem>
            <Typography sx={{ color: "gray" }}>
              No chats yet
            </Typography>
          </ListItem>
        ) : (
          chats.map((chat) => (
            <ListItemButton
              key={chat.id}
              selected={chat.id === selectedChatId}
              onClick={() => onSelect(chat.id)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover .delete-btn": {
                  opacity: 1,
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    noWrap
                    title={chat.title}
                    sx={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat.title}
                  </Typography>
                }
              />

              <IconButton
                size="small"
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                sx={{
                  opacity: 0,
                  color: "error.main",
                }}
              >
                🗑
              </IconButton>
            </ListItemButton>
          ))
        )}
      </List>

      {/* ✅ FOOTER: LOGOUT ICON */}
      <Divider />
      <Box
        sx={{
          py: 1.5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={onLogout}
          title="Logout"
          color="default"
        >
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatSidebar;