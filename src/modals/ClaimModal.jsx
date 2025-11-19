import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { toast } from "react-toastify";
import { claimPrize } from "../services/EventService";

const ClaimModal = ({ open, handleClose, ticketData }) => {
  const [name, setName] = useState("");
  const [eventId, setEventId] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const [nameError, setNameError] = useState("");
  const [ticketError, setTicketError] = useState("");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (ticketData) {
      setName(ticketData.name || "");
      setEventId(ticketData.event_id || "");
      setTicketNumber(ticketData.ticket_number || "");

      setNameError("");
      setTicketError("");
      setServerError("");
    }
  }, [ticketData, open]);

  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!ticketNumber.trim()) {
      setTicketError("Ticket number is required");
      isValid = false;
    } else {
      setTicketError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const payload = {
        name,
        event_id: eventId,
        ticket_number: ticketNumber,
      };

      const res = await claimPrize(payload);
      if(res.status === false){
        toast.error(res.message)
        return;
      }
      toast.success("Claim submitted successfully!");
      handleClose();
    } catch (err) {
      console.error("Server Error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to submit claim. Please try again.";
      toast.error(message);
      setServerError(message);
    } finally {
      setLoading(false);
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
            border: `1px solid #f9037a33`,
          }}
        >
          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 14, right: 14 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          {/* Crown Image */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src="./images/prize.png"
              alt="Winner Crown"
              width="80"
              style={{ animation: "bounce 1.5s infinite ease-in-out" }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            sx={{ color: "#f9037a" }}
          >
            Claim Your Prize
          </Typography>

          {/* Server Error */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: "#f9037a33" }}>
              {serverError}
            </Alert>
          )}

          {/* Name Field */}
          <TextField
            fullWidth
            label="Full Name"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            sx={{ mb: 3 }}
          />

          {/* Ticket Number */}
          <TextField
            fullWidth
            label="Ticket Number"
            variant="standard"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            error={!!ticketError}
            helperText={ticketError}
            sx={{ mb: 4 }}
          />

          {/* Submit Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<EmojiEventsIcon />}
            sx={{
              bgcolor: "#f9037a",
              borderRadius: "30px",
              py: 1.4,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                bgcolor: "#f9037a",
                boxShadow: `0 0 10px #f9037a33`,
              },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Claim Now"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClaimModal;
