import React, { useState } from "react";
import { Button, Divider, Typography, Stack,Paper,Box} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import FormInput from "./FormInput";
import { sanitize } from "../utils/sanitize";
import toast from "react-hot-toast";

const validationSchema = Yup.object({
  fullName: Yup.string().trim().min(3).required("Enter your full name"),
  email: Yup.string().trim().email("Invalid email").required("Enter your email"),
  password: Yup.string()
    .required("Create a password")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
      "Use 8–16 chars with upper, lower, number & Special"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (cooldown) return;

      try {
        setCooldown(true);

        const safeData = {
          fullName: sanitize(values.fullName),
          email: sanitize(values.email),
          password: values.password,
        };

        await registerUser(
          safeData.fullName,
          safeData.email,
          safeData.password
        );
        toast.success("Account created successfully");
        navigate("/login");
        setTimeout(() => setCooldown(false), 4000);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
          "Registration failed. Please try again."
        );
        setCooldown(false);
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
        overflowY: "auto",

        p: 4,
        borderRadius: 3,
        bgcolor: "#ffffff",
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 4, textAlign: "center" }} >
        <Typography sx={{ fontSize: "32px", variant: "h5", fontWeight: 700, mb: 0.5 }}>
          Create account
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>

          {/* IDENTITY SECTION */}
          <Stack spacing={2}>
            <FormInput
              label="Full name"
              name="fullName"
              formik={formik}
            />
            <FormInput
              label="Email address"
              name="email"
              type="email"
              formik={formik}
            />
          </Stack>

          {/* SECURITY SECTION */}
          <Stack spacing={2}>
            <FormInput
              label="Password"
              name="password"
              type="password"
              formik={formik}
            />
            <FormInput
              label="Confirm password"
              name="confirmPassword"
              type="password"
              formik={formik}
            />
          </Stack>

          {/* CTA */}
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || cooldown}
            fullWidth
            sx={{
              mt: 1,
              py: 1.4,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 15,
              textTransform: "none",
            }}
          >
            {cooldown ? "Please wait…" : "Create account"}
          </Button>

          {/* SECONDARY ACTION */}
          <Divider />
        </Stack>
      </form>

      {/* FOOTER */}
      <Typography sx={{ variant: "body2", mt: 4, color: "text.secondary" }}

      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
      </Typography>
    </Paper>
  );
};

export default SignupForm;