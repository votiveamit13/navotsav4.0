import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signup, socialLogin } from "../services/AuthService";
import {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
  requestForToken,
} from "../firebase";
import { signInWithPopup } from "firebase/auth";

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "At least 6 characters")
    .required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const SignupModal = ({
  open,
  handleClose,
  handleLoginClick,
  onLoginSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    let payload = { ...data, user_type: 5 };

    try {
      const res = await signup(payload);
      onLoginSuccess(res);
      toast.success("Signup successful!");
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        Object.keys(validationErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: validationErrors[field][0],
          });
        });
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const socialLoginHandler = async (provider, type) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      let deviceToken = null;
      try {
        deviceToken = await requestForToken();
        console.log("device token", deviceToken);
      } catch (err) {
        console.warn("⚠️ Could not get device token:", err.message);
      }

      const res = await socialLogin({
        device_token: deviceToken,
        token: idToken,
        provider: type,
      });

      onLoginSuccess(res);
      toast.success(res.message || `${type} login successful!`);
      handleClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          fontFamily: '"Jost", sans-serif',
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "90%", md: "480px" },
            bgcolor: "white",
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            position: "relative",
            boxShadow: 24,
          }}
        >
          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 14, right: 14 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img src="/images/maan-logo.png" alt="logo" width="100" />
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            sx={{ fontFamily: '"Jost", sans-serif' }}
          >
            Sign up
          </Typography>

          {/* Server Error */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PersonIcon sx={{ mr: 1.5, color: "gray" }} />
              <TextField
                variant="standard"
                placeholder="Enter your full name"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  style: { fontFamily: '"Jost", sans-serif' },
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <EmailIcon sx={{ mr: 1.5, color: "gray" }} />
              <TextField
                variant="standard"
                placeholder="Enter your email address"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  style: { fontFamily: '"Jost", sans-serif' },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LockIcon sx={{ mr: 1.5, color: "gray" }} />
              <TextField
                type={showPassword ? "text" : "password"}
                variant="standard"
                placeholder="Enter your password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { fontFamily: '"Jost", sans-serif' },
                }}
              />
            </Box>

            {/* Confirm Password */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LockIcon sx={{ mr: 1.5, color: "gray" }} />
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                variant="standard"
                placeholder="Confirm your password"
                fullWidth
                {...register("password_confirmation")}
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { fontFamily: '"Jost", sans-serif' },
                }}
              />
            </Box>

            {/* Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#ffc107",
                borderRadius: "30px",
                py: 1.4,
                textTransform: "none",
                fontWeight: "bold",
                color: "black",
                fontSize: "16px",
                mb: 3,
                "&:hover": { bgcolor: "#ffc107" },
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          {/* Divider */}
          {/* <Typography
            align="center"
            color="text.secondary"
            sx={{ mb: 1, fontFamily: '"Jost", sans-serif' }}
          >
            or continue with
          </Typography> */}

          {/* Social Buttons */}
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <IconButton
              sx={{ color: "#1877F2" }}
              onClick={() => socialLoginHandler(facebookProvider, "facebook")}
            >
              <FacebookIcon fontSize="medium" />
            </IconButton>
            <IconButton
              sx={{ color: "black" }}
              onClick={() => socialLoginHandler(appleProvider, "apple")}
            >
              <AppleIcon fontSize="medium" />
            </IconButton>
            <IconButton
              sx={{ color: "#DB4437" }}
              onClick={() => socialLoginHandler(googleProvider, "google")}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Box> */}

          {/* Login Link */}
          <Typography
            align="center"
            variant="body2"
            sx={{ fontFamily: '"Jost", sans-serif' }}
          >
            Already have an account?{" "}
            <span
              onClick={handleLoginClick}
              style={{
                color: "#7b1fa2",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignupModal;
