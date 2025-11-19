import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addFavoriteEvent } from "../services/EventService";
import { useAuth } from "../context/AuthContext";
import ClaimModal from "../modals/ClaimModal";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(event.is_favourite || false);

  const [loadingFav, setLoadingFav] = useState(false);

  const [openClaimModal, setOpenClaimModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const {
    handleLoginSuccess,
    openLogin,
    openSignup,
    setOpenLogin,
    setOpenSignup,
    user,
  } = useAuth();

  const isAuthenticated = !!localStorage.getItem("authToken");

  console.log("isFavorite", isFavorite);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setOpenLogin(true);
      return false;
    }
    setLoadingFav(true);
    try {
      await addFavoriteEvent(event.id); // call API
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error adding favorite:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleOpenClaim = () => {
    if (isAuthenticated) {
      setSelectedTicket({
        name: "",
        event_id: event.id,
        ticket_number: event.won_ticket,
      });
      setOpenClaimModal(true);
    } else {
      setOpenLogin(true);
    }
  };

  const handleCloseClaim = () => {
    setOpenClaimModal(false);
    setSelectedTicket(null);
  };

  return (
    <div className="col-md-4 col-sm-6">
      <div className="card position-relative">
        <div className="exclusive-tab">
          <button>Exclusive</button>
          {!event.is_finalize && (
            <span
              onClick={() => !loadingFav && handleFavorite(event.id)}
              style={{
                cursor: loadingFav ? "not-allowed" : "pointer",
                opacity: loadingFav ? 0.5 : 1,
              }}
            >
              {isFavorite ? (
                <i className="bi bi-heart-fill"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
            </span>
          )}
        </div>

        <img
          src={event.banners?.[0] || "./images/latest-img.png"}
          className="card-img-top"
          alt={event.title}
        />

        <span className="card-price">
          <span className="contest-add">Contest</span>{" "}
          <small>{event.contest_no}</small>
        </span>

        <div className="card-body">
          <h5 className="card-title">{event.title}</h5>

          {/* <div className="ticket-price-tab">
            <p>Ticket Price:</p>
            <p className="inner-price-add">${event.ticket_price}</p>
          </div> */}

          <div className="remaining-tab">
            <p>Start date</p>
            <p className="inner-price-add">
              <i className="bi bi-stopwatch"></i> {event.start_date}
            </p>
          </div>

          {event.is_finalize && event.won_ticket && (
            <div className="winner-banner mt-3 p-3 rounded-4">
              <h6 className="text-primary fw-bold mb-1">🎉 Winner Announced</h6>
              <p className="mb-0">
                Won Donate:{" "}
                <strong className="text-default fs-7">
                  #{event.won_ticket}
                </strong>
              </p>
            </div>
          )}

          {event.is_finalize && event.won_ticket ? (
            <button
              className="btn btn-custom"
              onClick={handleOpenClaim}
              disabled={event.is_claimed ? true : false}
            >
              {event.is_claimed ? (
                "Claimed"
              ) : (
                <>
                  Claim Now <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          ) : (
            <button
              className="btn btn-custom"
              onClick={() =>
                navigate("/event-detail", { state: { event: event.id } })
              }
            >
              View Details <i className="bi bi-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
      {/* Claim Modal */}
      <ClaimModal
        open={openClaimModal}
        handleClose={handleCloseClaim}
        ticketData={selectedTicket}
      />
    </div>
  );
};

export default EventCard;
