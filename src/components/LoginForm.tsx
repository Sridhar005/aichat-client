import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const FormInput = ({ label, name, type = "text", formik }: any) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={type}
    value={formik.values[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={formik.touched[name] && formik.errors[name]}
  />
);

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Minimum 6 characters required")
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  // 🔥 ONLY THIS (NO setIsAuthenticated)
  const { refreshUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        // 1. Login API call
        await loginUser(values.email, values.password);

        // 2. IMPORTANT: fetch user (basic/pro comes from backend)
        await refreshUser();

        // 3. Redirect AFTER auth is updated
        navigate("/chat");
      } catch (error: any) {
        alert(error.response?.data || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 400,
        width: "100%",
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Login
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            formik={formik}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            formik={formik}
          />

          <label style={{ fontSize: "14px" }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
            />
            {" "}Remember Me
          </label>

          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer" }}
          >
            Forgot Password?
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <Divider>OR</Divider>

          <Button variant="outlined" fullWidth>
            Continue with Google
          </Button>
        </Stack>
      </form>

      <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ textDecoration: "none", color: "blue" }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;