import { Box, Paper } from "@mui/material";

const ChatMessage = ({ message, sender }: any) => {
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
        }}
      >
        {message}
      </Paper>
    </Box>
  );
};

export default ChatMessage;