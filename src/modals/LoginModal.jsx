import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { login, socialLogin } from "../services/AuthService";

import {
  auth,
  googleProvider,
  facebookProvider,
  appleProvider,
  requestForToken,
} from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

const LoginModal = ({
  open,
  handleClose,
  handleSignupClick,
  onLoginSuccess,
  handleForgotClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    setServerError("");

    let reqBody = { email, password, user_type: 5 };
    let deviceToken = "";

    try {
      try {
        deviceToken = await requestForToken();
        reqBody = {
          ...reqBody,
          device_token: deviceToken,
          platform: "web",
        };
        console.log("device token", deviceToken);
      } catch (err) {
        console.warn("⚠️ Could not get device token:", err.message);
      }
      const res = await login(reqBody);
      console.log("Login Success:", res);
      onLoginSuccess(res);
      toast.success(res.message);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
      console.log("errr", err);
    } finally {
      setLoading(false);
    }
  };

  const socialLoginHandler = async (provider, type) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      let idToken = await user.getIdToken();

      // Get FCM Device Token (for push notifications)

      let deviceToken = null;
      try {
        deviceToken = await requestForToken();
        console.log("device token", deviceToken);
      } catch (err) {
        console.warn("⚠️ Could not get device token:", err.message);
      }

      let res = await socialLogin({
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
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Login
          </Typography>

          {/* Server error */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <EmailIcon sx={{ mr: 1.5, color: "gray" }} />
            <TextField
              variant="standard"
              placeholder="Enter your email address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email ? errors.email[0] : ""}
              InputProps={{
                style: { fontFamily: '"Jost", sans-serif' },
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LockIcon sx={{ mr: 1.5, color: "gray" }} />
            <TextField
              type={showPassword ? "text" : "password"}
              variant="standard"
              placeholder="Enter your password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password ? errors.password[0] : ""}
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

          {/* Remember + Forgot */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
              sx={{ fontFamily: '"Jost", sans-serif' }}
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={handleForgotClick}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#ffc107",
              borderRadius: "30px",
              py: 1.4,
              textTransform: "none",
              color: "black",
              fontWeight: "bold",
              fontSize: "16px",
              mb: 3,
              "&:hover": { bgcolor: "#ffc107" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Social Login */}
          {/* <Typography
            align="center"
            color="text.secondary"
            sx={{ mb: 1, fontFamily: '"Jost", sans-serif' }}
          >
            or continue with
          </Typography>
          <Box
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

          {/* Signup Link */}
          <Typography
            align="center"
            variant="body2"
            sx={{ fontFamily: '"Jost", sans-serif' }}
          >
            Don’t have an account?{" "}
            <span
              onClick={handleSignupClick}
              style={{
                color: "#7b1fa2",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Sign up
            </span>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
