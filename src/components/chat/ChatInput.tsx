import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

const ChatInput = ({ onSend, disabled }: any) => {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg.trim()) return;
    onSend(msg);
    setMsg("");
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        placeholder="Type your message..."
        value={msg}
        disabled={disabled}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={disabled}
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          "&:hover": { bgcolor: "#1565c0" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;