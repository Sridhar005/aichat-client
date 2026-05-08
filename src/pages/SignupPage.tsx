import React from "react";
import { Box } from "@mui/material";
import SignupForm from "../components/SignupForm";

const SignupPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",              // ✅ FIXED height, not minHeight
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f6f8fb",
        overflow: "hidden",           // ✅ STOP page scrolling
        px: 2,
      }}
    >
      <SignupForm />
    </Box>
  );
};

export default SignupPage;
