import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { api } from "../utils/axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f6f8fb",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight:700, mb:1 }} >
          Forgot Password
        </Typography>

        <Typography sx={{ color:"text.secondary", mb:3 }} >
          Enter your registered email address
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          Send reset link
        </Button>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;