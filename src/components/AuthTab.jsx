import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AuthTab = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="profile-info">
        <img src={user?.avatar_url} alt="User" />
        <h6>{user?.name}</h6>
        <span className="text-success">
          <i className="bi bi-check-lg"></i>
        </span>
      </div>
      <nav className="nav flex-column">
        <NavLink className="nav-link" to="/profile">
          <i className="bi bi-person"></i> Profile
        </NavLink>
        <NavLink className="nav-link" to="/notifications">
          <i className="bi bi-bell fs-5"></i> Notifications
        </NavLink>
        <NavLink className="nav-link" to="/tickets-history">
          <i className="bi bi-ticket-perforated"></i> Donate History
        </NavLink>
        {/* <NavLink className="nav-link" to="/">
          <i className="bi bi-gift"></i> Claim
        </NavLink> */}
        <NavLink className="nav-link" to="/favourite-events">
          <i className="bi bi-heart"></i> Favourite Events
        </NavLink>
        <a
          className="nav-link"
          href="javascript:void(0)"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i> Sign Out
        </a>
      </nav>
    </>
  );
};
