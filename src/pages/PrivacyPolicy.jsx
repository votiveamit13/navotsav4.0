import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <>
    <div className="container min-vh-100 bg-white text-black px-3 px-md-5 py-5">

      {/* Page Header */}
      <h1 className="text-warning fw-bold mt-4 mb-4" style={{ fontSize: "28px" }}>
        Privacy Policy – NAVLAY 1.0
      </h1>
      {/* <p className="text-muted mb-4">Last Updated: 15 January 2025</p> */}

      {/* Card Wrapper */}
      <div className="bg-white border rounded-4 shadow-sm p-4 p-md-5">

        {/* 1. Introduction */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">1. Introduction</h2>
          <p className="text-secondary">
            Welcome to NAVLAY 1.0, organized by MAAN Organization.  
            This Privacy Policy explains how we collect, use, and protect your information  
            when registering, booking passes, or interacting with our website.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">2. Information We Collect</h2>

          <h6 className="text-warning fw-semibold mt-3 mb-2">A. Information You Provide</h6>
          <ul className="text-secondary">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Mobile Number</li>
            <li>JNV State & School Name</li>
            <li>Passout Year</li>
            <li>Number and type of passes booked</li>
          </ul>

          {/* <h6 className="text-warning fw-semibold mt-3 mb-2">B. Automatically Collected Data</h6>
          <ul className="text-secondary">
            <li>Device information</li>
            <li>Browser type & version</li>
            <li>IP Address</li>
            <li>Pages visited</li>
            <li>Time spent on website</li>
          </ul> */}
        </section>

        {/* 3. How We Use Your Information */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="text-secondary">
            <li>Process pass bookings</li>
            <li>Send confirmation messages</li>
            <li>Verify identity at event entry</li>
            <li>Provide customer support</li>
            <li>Share event updates & reminders</li>
            <li>Improve the event experience</li>
          </ul>
        </section>

        {/* 4. Sharing */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">4. Sharing of Information</h2>
          <ul className="text-secondary">
            <li>Event management team (for verification)</li>
            <li>Payment partners (if applicable)</li>
            <li>Security agencies (only when required by law)</li>
          </ul>
        </section>

        {/* 5. WhatsApp/SMS */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">5. WhatsApp & SMS Communication</h2>
          <p className="text-secondary">
            By booking a pass, you agree to receive WhatsApp messages, SMS confirmations,  
            event reminders, and emergency updates.
          </p>
        </section>

        {/* 6. Security */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">6. Data Storage & Security</h2>
          <p className="text-secondary">
            We use secure servers, encrypted databases, and restricted access to protect your data.  
            Although safety measures are in place, no system is 100% secure.
          </p>
        </section>

        {/* 7. Photos */}
        {/* <section className="mb-4">
          <h2 className="text-warning fw-semibold mb-2">7. Photography & Media Usage</h2>
          <p className="text-secondary">
            By attending NAVLAY 1.0, you consent to being photographed or recorded.  
            These media may be used for promotion or marketing without compensation.
          </p>
        </section> */}

        {/* 8. Cookies */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">7. Cookies & Tracking</h2>
          <p className="text-secondary">
            We use cookies and analytics tools to improve performance and user experience on our site.
          </p>
        </section>

        {/* 9. Children */}
        {/* <section className="mb-4">
          <h2 className="text-warning fw-semibold mb-2">8. Children’s Privacy</h2>
          <p className="text-secondary">
            NAVLAY 1.0 is not intended for children under 13 unless accompanied by a guardian.
          </p>
        </section> */}

        {/* 10. Rights */}
        {/* <section className="mb-4">
          <h2 className="text-warning fw-semibold mb-2">8. Your Rights</h2>
          <p className="text-secondary">
            You may request correction, deletion, or access to the data we store about you.
          </p>
        </section> */}

        {/* 11. Updates */}
        <section className="mb-4">
          <h2 className="text-warning fs-3 fw-semibold mb-2">8. Changes to This Policy</h2>
          <p className="text-secondary">
            This Privacy Policy may be updated without prior notice.  
          </p>
        </section>

        {/* 12. Contact */}
        <section>
          <h2 className="text-warning fs-3 fw-semibold mb-2">9. Contact Us</h2>
          <p className="text-secondary">
            For any questions, please contact us:  
            <br />
            <strong className="text-warning">maanalumniassociation@gmail.com</strong>
          </p>
        </section>
      </div>
    </div>
          <section className="bg-black mb-8">
        <div className="container py-2 text-center">
          <div className="shimmer-border p-1 rounded-4">
            <div className="inner-box rounded-4 p-5">
              <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 mb-3">
                <div className="small text-white">
                  MAAN - Madhya Pradesh Alumni Association of Navodaya
                </div>
                {/* <div
              className="rounded-circle bg-warning"
              style={{ width: "8px", height: "8px" }}
            ></div>

            <div className="small">Phoenix Citadel</div> */}
              </div>
                <div className="d-flex align-items-center text-white justify-content-center flex-wrap gap-3 mb-3">
                  <Link to="/" className="text-white text-decoration-none">Home</Link>
                                    {/* <Link href="">NAVLAY 1.0</Link> */}
                                    <Link to="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link>

                </div>
              <p className="text-secondary small mb-0">
                © 2025 NAVLAY 1.0. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
