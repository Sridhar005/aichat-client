import { Box, Paper } from "@mui/material";

type Props = {
  message: string;
  sender: "user" | "ai";
  thinking?: boolean;
};

const ChatMessage: React.FC<Props> = ({ message, sender, thinking }) => {
  const isUser = sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 3,
          bgcolor: isUser ? "#1976d2" : "#f1f1f1",
          color: isUser ? "white" : "black",
          maxWidth: "75%",
          fontSize: 14,
          fontStyle: thinking ? "italic" : "normal",
          opacity: thinking ? 0.7 : 1,
        }}
      >
        {thinking ? "Typing…" : message}
      </Paper>
    </Box>
  );
};

export default ChatMessage;
