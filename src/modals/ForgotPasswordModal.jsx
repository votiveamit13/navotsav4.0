import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
//import { sendPasswordReset } from "../services/AuthService"; // create this API call
import { toast } from "react-toastify";
import { forgotPassword } from "../services/ForgotService";
import OtpVerification from "./OtpVerification";
import "../assets/css/event-products.css";  

const ForgotPasswordModal = ({ open, handleClose, handleBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openVerify, setOpenVerify] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword({ email });
      toast.success("OTP has been sent!");
      handleClose();
      setOpenVerify(true);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <img src="/images/logo.png" alt="logo" width="100" />
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              Forgot Password
            </Typography>

            {/* Email */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <EmailIcon sx={{ mr: 1.5, color: "gray" }} />
              <TextField
                variant="standard"
                placeholder="Enter your email address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  style: { fontFamily: '"Jost", sans-serif' },
                }}
              />
            </Box>

            {/* Submit Button */}
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
                mb: 3,
                "&:hover": { bgcolor: "#e60073" },
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>

            {/* Back to login */}
            <Typography
              align="center"
              variant="body2"
              sx={{ fontFamily: '"Jost", sans-serif' }}
            >
              Remember your password?{" "}
              <span
                onClick={handleBackToLogin}
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
      <OtpVerification
        open={openVerify}
        forgotEmail={email}
        handleClose={() => setOpenVerify(false)}
      />
    </>
  );
};

export default ForgotPasswordModal;
