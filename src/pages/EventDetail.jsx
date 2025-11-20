import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { eventDetail } from "../services/EventService";
import { useLocation, useNavigate } from "react-router-dom";

export default function EventDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({
  name: "",
  email: "",
  mobile: "",
});
const [errors, setErrors] = useState({});


  const eventId =
    location.state?.event ||
    location.state?.id ||
    location.state?.event_id ||
    null;

  const [event, setEvent] = useState({});
  const [passes, setPasses] = useState([]); // FIXED
  const [selectedPassId, setSelectedPassId] = useState(null);

  const passNames = {
    1: "Students pass (for 1)",
    2: "Professional pass for adult (for 1)",
    3: "Professional pass for family (family of 2)",
    4: "Host pass only for family (family of 4)",
  };

  // SINGLE API CALL ONLY
  useEffect(() => {
    const loadEvent = async () => {
      try {
        let res = await eventDetail(eventId);
        setEvent(res.data);

        const updated = res.data.prices.map((item) => ({
          id: item.id,
          name: passNames[item.id], // static name
          price: item.price, // from API
          qty: 0,
        }));

        setPasses(updated);

      } catch (err) {
        console.error("❌ Failed to load event", err);
      }
    };

    if (eventId) loadEvent();
  }, [eventId]);

  // Select Pass
  const handleSelect = (id) => {
    setSelectedPassId(id);
    setPasses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: 1 } : { ...p, qty: 0 }))
    );
  };

  const increment = (id) => {
    if (id !== selectedPassId) return;
    setPasses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  };

  const decrement = (id) => {
    if (id !== selectedPassId) return;
    setPasses((prev) =>
      prev.map((p) =>
        p.id === id && p.qty > 0 ? { ...p, qty: p.qty - 1 } : p
      )
    );
  };

  const selectedPass = passes.find((p) => p.id === selectedPassId);
  const totalAmount = selectedPass ? selectedPass.qty * selectedPass.price : 0;

  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
};

const validate = () => {
  let newErrors = {};

  if (!form.name.trim()) newErrors.name = "Name is required";
  if (!form.email.trim()) newErrors.email = "Email is required";
  if (!form.mobile.trim()) newErrors.mobile = "Mobile is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handlePayNow = async () => {
  if (!validate()) return;

  // CALL BACKEND API
  try {
    const response = await fetch("http://127.0.0.1:8000/api/phonepe/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: form,
        selectedPass,
        totalAmount,
        eventId,
      }),
    });

    const data = await response.json();

    if (data.success && data.redirect_url) {
      window.location.href = data.redirect_url; // 🔥 Open PhonePe gateway
    }
  } catch (err) {
    console.error("Payment error:", err);
  }
};




  return (
    <div className="py-5 text-light bg-black" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="container mx-auto row g-4">

        {/* LEFT SIDE */}
        <div className="col-12 col-lg-7">
          <h2 className="fw-bold text-warning">
            {event.title || "Loading Event..."}
          </h2>

          <p className="text-secondary">
            {event.description || "Event details will appear soon."}
          </p>

          <div className="mt-4">
            <h4 className="fw-bold">🎟 Select Your Pass</h4>

            <div className="mt-3 d-flex flex-column gap-3">
              {passes.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="d-flex justify-content-between align-items-center px-3 py-2 rounded-4 shadow-sm"
                  style={{
                    background:
                      selectedPassId === p.id
                        ? "rgba(255, 193, 7, 0.15)"
                        : "rgba(255, 255, 255, 0.05)",
                    border:
                      selectedPassId === p.id
                        ? "1px solid rgba(255,193,7,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                >
                  <div className="d-flex justify-content-start">
                    <input
                      type="radio"
                      checked={selectedPassId === p.id}
                      onChange={() => handleSelect(p.id)}
                      style={{ width: "20px", height: "20px" }}
                    />

                    <div className="ms-3">
                      <h5 className="mb-0">{p.name}</h5>
                      <small className="text-warning fw-bold">₹{p.price}</small>
                    </div>
                  </div>

                  {selectedPassId === p.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn text-white px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          decrement(p.id);
                        }}
                      >
                        -
                      </button>
                      <span className="fs-5">{p.qty}</span>
                      <button
                        className="btn text-white px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          increment(p.id);
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div style={{ width: "120px" }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CHECKOUT */}
        <div className="col-12 col-lg-5">
          <motion.div
            className="p-4 rounded-4 shadow-lg position-sticky"
            style={{
              top: "20px",
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h4 className="fw-bold text-warning mb-3">Order Summary</h4>

            {totalAmount === 0 ? (
              <p>No pass selected.</p>
            ) : (
              <div className="d-flex justify-content-between border-bottom py-2">
                <span>
                  {selectedPass.name} × {selectedPass.qty}
                </span>
                <span>₹{totalAmount}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mt-3 fs-4 fw-bold">
              <span>Total:</span>
              <span className="text-warning">₹{totalAmount}</span>
            </div>

{!showForm && (
  <button
    onClick={() => setShowForm(true)}
    className="btn btn-warning w-100 mt-4 fw-bold py-2"
    disabled={totalAmount === 0}
  >
    Proceed to Checkout
  </button>
)}

{showForm && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 p-4 rounded-4"
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}
  >
    <h4 className="text-warning fw-bold mb-3">Your Details</h4>

    {/* NAME */}
    <div className="mb-3">
      <label className="text-light">Name *</label>
      <input
        type="text"
        className={`form-control ${errors.name ? "is-invalid" : ""}`}
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      {errors.name && <div className="text-danger">{errors.name}</div>}
    </div>

    {/* EMAIL */}
    <div className="mb-3">
      <label className="text-light">Email *</label>
      <input
        type="email"
        className={`form-control ${errors.email ? "is-invalid" : ""}`}
        name="email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <div className="text-danger">{errors.email}</div>}
    </div>

    {/* MOBILE */}
    <div className="mb-3">
      <label className="text-light">Mobile *</label>
      <input
        type="tel"
        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
      />
      {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
    </div>

    <button
      className="btn btn-warning w-100 fw-bold py-2 mt-2"
      onClick={handlePayNow}
    >
      Proceed to Pay
    </button>
  </motion.div>
)}



          </motion.div>
          {/* TERMS & CONDITIONS */}
          <div
            className="mt-4 p-3 rounded-4 text-white"
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h5 className="fw-bold mb-2">Terms & Conditions</h5>

            <ul className="ps-3 mb-0" style={{ lineHeight: "1.6" }}>
              <li>All passes are <strong>non-refundable</strong>.</li>
              <li>No extra members allowed beyond the limit of the selected pass.</li>
              <li>
                MAAN reserves the right to <strong>cancel any pass without refund</strong>&nbsp;
                in case of rule violations or organizational requirements.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}