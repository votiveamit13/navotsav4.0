import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { resetPassword } from "../services/ForgotService";
import { toast } from "react-toastify";

const ResetPasswordModal = ({ open, forgotEmail, handleClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({}); // reset errors before calling server
    try {
      const res = await resetPassword({
        password,
        password_confirmation: confirmPassword,
        email: forgotEmail,
      });

      if (res.status) {
        toast.success(res.message);
        handleClose();
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        const serverErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          serverErrors[field] = validationErrors[field][0];
        });
        setErrors(serverErrors);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          px: 2,
          fontFamily: '"Jost", sans-serif',
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "90%", md: "420px" },
            bgcolor: "white",
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            boxShadow: 24,
            position: "relative",
            textAlign: "center",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 16, right: 16 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Logo */}
          <img src="/images/logo.png" alt="logo" width={100} />

          {/* New Password Section */}
          <Typography variant="h6" fontWeight="bold" textAlign="left" mb={2}>
            Set a new password
          </Typography>

          {/* Password */}
          <TextField
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            variant="standard"
            fullWidth
            sx={{ mb: 1 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
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
            }}
          />

          {/* Confirm Password */}
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            variant="standard"
            fullWidth
            sx={{ mb: 2 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Update Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#ff007f",
              borderRadius: "30px",
              py: 1.4,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": { bgcolor: "#e60073" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResetPasswordModal;
