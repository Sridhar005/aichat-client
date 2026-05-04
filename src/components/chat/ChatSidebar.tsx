import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import type { Chat } from "../../types/chat";

const ChatSidebar = ({ chats, selectedChatId, onSelect, onNewChat }: any) => {
  return (
    <Box sx={{ width: 260, borderRight: "1px solid #ddd" }}>
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="contained" onClick={onNewChat}>
          + New Chat
        </Button>
      </Box>

      <Typography sx={{ px: 2 }}>Recent Chats</Typography>

      <List>
        {chats.map((chat: Chat) => (
          <ListItemButton
            key={chat.id}
            selected={chat.id === selectedChatId}
            onClick={() => onSelect(chat.id)}
          >
            <ListItemText primary={chat.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ChatSidebar;