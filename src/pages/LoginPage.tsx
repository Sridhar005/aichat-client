import React from "react";
import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f6f8fb",
        overflow: "hidden",
        px: 2,
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;