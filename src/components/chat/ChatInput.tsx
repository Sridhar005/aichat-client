import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

type Props = {
  onSend: (msg: string) => void;
  disabled?: boolean;
};

const ChatInput: React.FC<Props> = ({ onSend, disabled = false }) => {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (disabled || !msg.trim()) return;

    onSend(msg.trim());
    setMsg("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder={
          disabled ? "Chat disabled" : "Type your message..."
        }
        value={msg}
        disabled={disabled}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
          },
        }}
      />

      <IconButton
        onClick={handleSend}
        disabled={disabled || !msg.trim()}
        aria-label="Send message"
        sx={{
          bgcolor: disabled ? "grey.400" : "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: disabled ? "grey.400" : "primary.dark",
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;