import { NavLink, useNavigate } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import { useEffect, useState } from "react";
import SignupModal from "../modals/SignupModal";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "../modals/ForgotPasswordModal";
import { fetchNotifications } from "../services/WebService";
import { useTranslation } from "react-i18next"; // import hook
import i18n from "../i18n";
import FundraisingProducts from "../pages/FundraisingProducts";

const Header = () => {
  const {
    user,
    handleLoginSuccess,
    openLogin,
    openSignup,
    setOpenLogin,
    setOpenSignup,
    openForgot,
    setOpenForgot,
    logout,
  } = useAuth();

  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNoti = async () => {
    const res = await fetchNotifications({ limit: 5 });
    console.log("nofi", res);
    setNotifications(res.data);
  };
  useEffect(() => {
    fetchNoti();
  }, [user]);

  const handleRedirect = () => {
    navigate("/notifications");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top about_mob">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo */}
          <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src="/images/maan-logo.png" alt="Logo" width="80" />
          </NavLink>

          {/* Marquee */}
          <div className="marquee-container flex-grow-1">
            <div className="marquee-track">
              <span className="marquee-text">
                <span className="red">NA</span>
                <span className="green">VO</span>
                <span className="yellow">TS</span>
                <span className="blue">AV</span>
                &nbsp;
                <span className="gradient-text">
                  4.0 - A grand fusion of comedy, storytelling, music & electrifying DJ night
                </span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
