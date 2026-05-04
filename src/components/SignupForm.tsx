import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import FormInput from "./FormInput";
import { sanitize } from "../utils/sanitize";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3)
    .required("Full Name is required"),

  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .required()
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
      "Weak password"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
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

        // ⛑️ SANITIZE INPUTS
        const safeData = {
          fullName: sanitize(values.fullName),
          email: sanitize(values.email),
          password: values.password,
        };

        const result = await registerUser(
          safeData.fullName,
          safeData.email,
          safeData.password
        );

        alert(result.message || "Account created");
        navigate("/login");

        // ⛔ prevent spam submit
        setTimeout(() => setCooldown(false), 5000);
      } catch (err: any) {
        alert(err.response?.data || "Registration failed");
        setCooldown(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" sx={{ textAlign:"center", mb:2 }}>
        Create Account
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <FormInput label="Full Name" name="fullName" formik={formik} />
          <FormInput label="Email" name="email" type="email" formik={formik} />
          <FormInput label="Password" name="password" type="password" formik={formik} />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            formik={formik}
          />

          <Divider>OR</Divider>

          <Button variant="outlined" fullWidth>
            Continue with Google
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting || cooldown}
            fullWidth
          >
            {cooldown ? "Wait..." : "Create Account"}
          </Button>
        </Stack>
      </form>

      <Typography sx={{ textAlign:"center", mt: 2}}>
        Already have an account?{" "}
        <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignupForm;