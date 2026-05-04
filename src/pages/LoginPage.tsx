import React from "react";
import { Box, Container } from "@mui/material";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;