import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { api } from "../utils/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const handleReset = async () => {
    if (!password || !token) return;

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      toast.success("Password updated successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Invalid or expired token"
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
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight:700, mb:2 }}>
          Reset Password
        </Typography>

        <TextField
          fullWidth
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Password
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
