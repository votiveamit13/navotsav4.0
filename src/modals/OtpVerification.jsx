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
import { otpVerification, resendOpt } from "../services/ForgotService";
import { toast } from "react-toastify";
import ResetPasswordModal from "./ResetPasswordModal";

const OtpVerification = ({ open, forgotEmail, handleClose }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [openReset, setOpenReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (otp.join("").length < 4) {
      newErrors.otp = "Enter the 4-digit OTP.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const code = otp.join("");
      const res = await otpVerification({ otp: code, email: forgotEmail });
      if (res.status) {
        handleClose();
        setOpenReset(true);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        Object.keys(validationErrors).forEach((field) => {
          setErrors(field, {
            type: "server",
            message: validationErrors[field][0],
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const res = await resendOpt({
      purpose: "Forgot password",
      email: forgotEmail,
    });

    if (res.status) {
      toast.success(res.message);
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
              position: "relative",
              width: { xs: "100%", sm: "90%", md: "420px" },
              bgcolor: "white",
              borderRadius: "20px",
              p: { xs: 3, sm: 4 },
              boxShadow: 24,
              textAlign: "center",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Close Icon */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                color: "grey.600",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Logo */}
            <img src="/images/logo.png" alt="logo" width={100} />

            {/* Title */}
            <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
              Check your email
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              We sent an OTP to <b>{forgotEmail}</b>, enter the 4-digit code
              that mantioned in the email
            </Typography>

            {/* OTP Inputs */}
            <Box display="flex" justifyContent="center" gap={1.5} mb={1}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  error={!!errors.otp}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "20px",
                      width: "50px",
                    },
                  }}
                />
              ))}
            </Box>
            {errors.otp && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mb: 2 }}
              >
                {errors.otp}
              </Typography>
            )}

            {/* Resend */}
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", mb: 3 }}
              onClick={handleResend}
            >
              Resend
            </Typography>

            {/* Verify Button */}
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
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <ResetPasswordModal
        open={openReset}
        forgotEmail={forgotEmail}
        handleClose={() => setOpenReset(false)}
      />
    </>
  );
};

export default OtpVerification;
