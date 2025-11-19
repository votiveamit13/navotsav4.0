import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fifty-play-footer about_mob">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <img src="./images/logo-footer.png" />
            <p className="simply-text-add">
              Create your account in just a few minutes. Simply register
            </p>
            <div className="social-icons">
              <a href="#">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <NavLink to="/">
              <i className="bi bi-chevron-right"></i> Home
            </NavLink>
            <NavLink to="/about">
              <i className="bi bi-chevron-right"></i> About Us
            </NavLink>
            <NavLink to="/fundraising-products">
              <i className="bi bi-chevron-right"></i> Products
            </NavLink>
            <NavLink to="/our-team">
              <i className="bi bi-chevron-right"></i> Our Team
            </NavLink>
            <NavLink href="#">
              <i className="bi bi-chevron-right"></i> Lottery
            </NavLink>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Categories</h5>
            <a href="#">
              <i className="bi bi-chevron-right"></i> Gaming
            </a>
            <a href="#">
              <i className="bi bi-chevron-right"></i> Sports
            </a>
            <a href="#">
              <i className="bi bi-chevron-right"></i> Lottery
            </a>
            <a href="#">
              <i className="bi bi-chevron-right"></i> Betting
            </a>
            <a href="#">
              <i className="bi bi-chevron-right"></i> Business
            </a>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Help & Support</h5>
            <NavLink href="#">
              <i className="bi bi-chevron-right"></i> FAQ
            </NavLink>
            <NavLink to="/contact">
              <i className="bi bi-chevron-right"></i> Contact Us
            </NavLink>
            <NavLink to="/blog">
              <i className="bi bi-chevron-right"></i> Blog
            </NavLink>
            <NavLink to="/news">
              <i className="bi bi-chevron-right"></i> News
            </NavLink>
            <NavLink href="#">
              <i className="bi bi-chevron-right"></i> Login
            </NavLink>
          </div>

          <div className="col-lg-3 get-in-touch">
            <h5>Get In Touch</h5>
            <div className="inner-get-in">
              <i class="bi bi-telephone-inbound"></i>
              <p>
                Hotline: <span>+1 7878085000</span>
              </p>
            </div>
            <div className="inner-get-in">
              <i class="bi bi-envelope-arrow-down"></i>
              <p>
                Email: <span>thefiftyplay@gmail.com</span>
              </p>
            </div>
            <div className="inner-get-in">
              <i class="bi bi-geo-alt"></i>
              <p>
                Address: <span>52 Mendez Vigo W Mayaguez PR 00680</span>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Fifty Play - Raffle
          </p>
          <div className="inner-text-add">
            <a href="#">Help & Support</a> | <a href="#">Terms & Conditions</a>{" "}
            |<a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
