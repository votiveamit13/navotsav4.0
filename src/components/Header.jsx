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
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand fw-bold" to="/">
            <img src="/images/maan-logo.png" alt="Logo" width="80" />
          </NavLink>
{/* <div className="marquee-container position-relative text-center">
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
</div> */}



          {/* Mobile Toggler */}
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}

          {/* Menu */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav mb-2 mb-lg-0 gap-lg-3">
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  {t("home")}
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/fundraising-products">
                  {t("fundraisingProducts")}
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/past-events">
                  Past Events
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/our-team">
                  {t("ourTeam")}
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  {t("contact")}
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/news">
                  {t("news")}
                </NavLink>
              </li> */}
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/blog">
                  {t("blog")}
                </NavLink>
              </li> */}
            </ul>

            {/* Right Side */}
            {/* <div className="d-flex mt-3 mt-lg-0 right-side-login">
              {!user ? (
                <>
                  <button className="btn bg-warning d-flex align-items-center gap-2 px-3 login-btn-add">
                    <i
                      className="bi bi-person-plus"
                      onClick={() => setOpenSignup(true)}
                    ></i>
                    <span onClick={() => setOpenLogin(true)}> | Login</span>
                  </button>
                </>
              ) : (
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <div className="dropdown">
                    {/* <a
                      className="text-dark position-relative"
                      href="#"
                      role="button"
                      id="notificationDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-bell fs-5"></i>

                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {notifications.length}
                      </span>
                    </a> */}

                    {/* <ul
                      className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3"
                      aria-labelledby="notificationDropdown"
                      style={{ width: "320px" }}
                    >
                      <li className="dropdown-header notification-text d-flex justify-content-between align-items-center">
                        Notifications
                        <span className="badge bg-danger rounded-pill">
                          {notifications.length}
                        </span>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      {notifications &&
                        notifications.map((notification, index) => (
                          <li key={notification.id}>
                            <a
                              onClick={handleRedirect}
                              className="dropdown-item d-flex align-items-center gap-2 py-2"
                              href="#"
                            > */}
                              {/* <img src={notification.icon} /> */}
                              {/* <span>{notification.title}</span>
                            </a>
                          </li>
                        ))} */}

                      {/* <li>
                        <NavLink
                          to="/notifications"
                          className="dropdown-item text-center fw-semibold text-primary"
                        >
                          View all
                        </NavLink>
                      </li>
                    </ul>
                  </div>

                  <div className="dropdown">
                    <a
                      className="d-flex align-items-center text-decoration-none dropdown-toggle"
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={user?.avatar_url}
                        alt="Profile"
                        className="profile-img me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                      <span>{user?.name}</span>
                    </a>

                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <NavLink className="dropdown-item" to="/profile">
                          My Passes
                        </NavLink>
                      </li> */}
                      {/* <li>
                        <a className="dropdown-item" href="#">
                          Settings
                        </a>
                      </li> */}
                      {/* <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="#" onClick={logout}>
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )} */}
           {/* </div> */}
          </div>
        </div>
      </nav>
      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        handleClose={() => setOpenLogin(false)}
        handleSignupClick={() => {
          setOpenLogin(false);
          setOpenSignup(true);
        }}
        onLoginSuccess={handleLoginSuccess}
        handleForgotClick={() => {
          setOpenLogin(false); // close login
          setOpenForgot(true); // open forgot password
        }}
      />

      {/* Forgot Password Modal */}
      {/* <ForgotPasswordModal
        open={openForgot}
        handleClose={() => setOpenForgot(false)}
        handleBackToLogin={() => {
          setOpenForgot(false);
          setOpenLogin(true);
        }}
      /> */}

      <SignupModal
        open={openSignup}
        handleClose={() => setOpenSignup(false)}
        handleLoginClick={() => {
          setOpenSignup(false);
          setOpenLogin(true); // close login
          // open signup
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
