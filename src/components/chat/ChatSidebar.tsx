import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import type { Chat } from "../../types/chat";

type Props = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
};

const ChatSidebar: React.FC<Props> = ({
  chats,
  selectedChatId,
  onSelect,
  onNewChat,
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
      {/* NEW CHAT */}
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="contained" onClick={onNewChat}>
          + New Chat
        </Button>
      </Box>

      {/* HEADER */}
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
              sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
            >
              <ListItemText
                primary={
                  <Typography noWrap>
                    {chat.title}
                  </Typography>
                }
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatSidebar;