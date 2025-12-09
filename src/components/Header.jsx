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
import { motion } from "framer-motion";
import DonationModal from "./DonationModal";
const Header = () => {
  const [openDonation, setOpenDonation] = useState(false);

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
                 4.0 - A grand fusion of comedy, storytelling, music & electrifying DJ night. For any query contact at: +91 9589847113
                </span>
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.15, rotateZ: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenDonation(true)}  // OPEN MODAL
            className="position-fixed"
            style={{
              top: "75px",
              right: "25px",
              zIndex: 9999,
              padding: "10px 20px",
              borderRadius: "50px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #ffcc00 0%, #ff8800 100%)",
              boxShadow: "0 10px 30px rgba(255, 200, 0, 0.4)",
              color: "#000",
              transform: `translateZ(50px)`,
            }}
          >
            Donate Now!
          </motion.button>

          <DonationModal open={openDonation} setOpen={setOpenDonation} />

        </div>
      </nav>
    </>
  );
};

export default Header;
