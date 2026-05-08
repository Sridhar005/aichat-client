import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        backgroundColor: "#fafafa",
      },
    }}
  />
);

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
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
        await loginUser(values.email, values.password);
        await refreshUser();
        navigate("/chat");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          "Login failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 420,
        maxHeight: "90vh",
        p: 4,
        borderRadius: 3,
        bgcolor: "#ffffff",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb:3, textAlign: "center"}}>
        <Typography sx={{fontSize: "32px",variant:"h2", fontWeight:700, mb: 0.5 }} >
          Sign in
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2.5}>
          <FormInput
            label="Email address"
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              Remember me
            </label>

            <Typography
              variant="body2"
              sx={{ cursor: "pointer" }}
              color="primary"
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formik.isSubmitting}
            sx={{
              mt: 0.5,
              py: 1.3,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            {formik.isSubmitting ? "Signing in…" : "Sign in"}
          </Button>

          <Divider />

          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 1.1,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Continue with Google
          </Button>
        </Stack>
      </form>

      <Typography sx={{  variant:"body2",mt:3,color:"text.secondary" }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ fontWeight: 600, textDecoration: "none" }}>
          Create one
        </Link>
      </Typography>
    </Paper>
  );
};

export default LoginForm;