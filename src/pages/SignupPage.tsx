import React from "react";
import { Box, Container } from "@mui/material";
import SignupForm from "../components/SignupForm";

const SignupPage: React.FC = () => {
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
        <SignupForm />
      </Box>
    </Container>
  );
};

export default SignupPage;