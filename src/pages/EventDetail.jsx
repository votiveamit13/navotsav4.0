import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { eventDetail } from "../services/EventService";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderButton from "../components/Loader";

export default function EventDetail() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState({
    show: false,
    message: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    jnv_state: "",
    jnv: "",
    year: "",
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

  useEffect(() => {
    const loadEvent = async () => {
      try {
        let res = await eventDetail(eventId);
        setEvent(res.data);

        const updated = res.data.prices.map((item) => ({
          id: item.id,
          name: passNames[item.id],
          price: item.price,
          qty: 0,
        }));

        setPasses(updated);

      } catch (err) {
        console.error("❌ Failed to load event", err);
      }
    };

    if (eventId) loadEvent();
  }, [eventId]);

  const handleSelect = (id) => {
    setSelectedPassId(id);

    setPasses(prev =>
      prev.map(p => {
        if (p.id !== id) return { ...p, qty: 0 };

        let qty = p.qty;

        if (p.id === 1) qty = 1;
        else if (p.id === 3) qty = Math.max(2, p.qty || 2);
        else qty = Math.max(1, p.qty || 1);

        return { ...p, qty };
      })
    );
  };


  const increment = (id) => {
    if (id !== selectedPassId) return;

    setPasses(prev =>
      prev.map(p => {
        if (p.id !== id) return p;

        const maxLimit = p.id === 1 ? 1 : p.id === 3 ? 4 : 4;

        if (p.qty >= maxLimit) return p;

        return { ...p, qty: p.qty + 1 };
      })
    );
  };




  const decrement = (id) => {
    if (id !== selectedPassId) return;

    setPasses(prev =>
      prev.map(p => {
        if (p.id !== id) return p;

        const minLimit = p.id === 1 ? 1 : p.id === 3 ? 2 : 1;

        if (p.qty <= minLimit) return p;

        return { ...p, qty: p.qty - 1 };
      })
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

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(form.mobile)) {
        newErrors.mobile = "Invalid mobile number";
      }
    }

    if (!form.jnv_state || form.jnv_state.trim() === "") {
      newErrors.jnv_state = "JNV State is required";
    }


    if (!form.jnv.trim()) newErrors.jnv = "JNV Name is required";

    if (!form.year.trim()) {
      newErrors.year = "Passout Year is required";
    } else {
      const yearRegex = /^[0-9]{4}$/;
      if (!yearRegex.test(form.year)) {
        newErrors.year = "Enter valid year (e.g., 2015)";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // const handlePayNow = async () => {
  //   if (!validate()) return;

  //   // CALL BACKEND API
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/phonepe/initiate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user: form,
  //         selectedPass,
  //         totalAmount,
  //         eventId,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.success && data.redirect_url) {
  //       window.location.href = data.redirect_url; // 🔥 Open PhonePe gateway
  //     }
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //   }
  // };

  const handleSubmitOffline = async () => {
    if (!validate()) return;
     setLoading(true); 

    const payload = {
      event_id: eventId,
      pass_id: selectedPass?.id,
      pass_name: selectedPass?.name,
      qty: selectedPass?.qty,
      amount: totalAmount,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      jnv_state: form.jnv_state,
      jnv: form.jnv,
      year: form.year,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/offline-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      setLoading(false);

      if (response.ok && data.success) {
        setSuccessPopup(true);
        return;
      }

      if (response.status === 422) {
        let message = "";

        if (data.errors?.email) {
          message = data.errors.email[0];
        } else if (data.errors?.mobile) {
          message = data.errors.mobile[0];
        } else {
          message = "Please check your input.";
        }

        setErrorPopup({ show: true, message });
        return;
      }

      setErrorPopup({
        show: true,
        message: data.message || "Something went wrong!"
      });

    } catch (error) {
      setLoading(false);
      console.error("Offline Booking Error:", error);
      setErrorPopup({ show: true, message: "Failed to connect to server" });
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
                  <h5 className="mb-0 fs-6 fs-md-5">{p.name}</h5>

                      <small className="text-warning fw-bold">₹{p.price}</small>
                    </div>
                  </div>

                  {selectedPassId === p.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-qty px-3"
                        disabled={
                          (p.id === 1 && p.qty <= 1) ||
                          (p.id === 3 && p.qty <= 2) ||
                          (p.id !== 1 && p.id !== 3 && p.qty <= 1)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          decrement(p.id);
                        }}
                      >
                        -
                      </button>

                      <span className="fs-5">{p.qty}</span>

                      <button
                        className="btn btn-qty px-3"
                        disabled={
                          (p.id === 1 && p.qty >= 1) ||
                          (p.id === 3 && p.qty >= 4) ||
                          (p.id !== 1 && p.id !== 3 && p.qty >= 4)
                        }
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
            className={`p-4 rounded-4 shadow-lg ${showForm ? "" : "position-sticky"}`}
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
              <>
                <p className="text-warning fw-semibold mt-3 mb-1" style={{ fontSize: "14px" }}>
                  <span className="text-danger">*</span> Pay Cash on Ticket collection
                </p>

                <LoaderButton
  loading={loading}
                  onClick={() => setShowForm(true)}
                  className="btn btn-warning w-100 mt-4 fw-bold py-2"
                  disabled={totalAmount === 0}
                >
                  Proceed to Checkout
                </LoaderButton>
              </>
            )}

            {showForm && (
              <div>
                <h4 className="mt-3 text-warning fw-bold mb-3">Your Details</h4>
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

                <div className="mb-3">
                  <label className="text-light">Mobile *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                    name="mobile"
                    value={form.mobile}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, mobile: onlyNums });
                      setErrors({ ...errors, mobile: "" });
                    }}
                    maxLength={10}
                  />
                  {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                </div>

                <div className="mb-3">
                  <label className="text-light">JNV State *</label>
                  <select
                    name="jnv_state"
                    className={`form-control ${errors.jnv_state ? "is-invalid" : ""}`}
                    value={form.jnv_state || ""}
                    onChange={(e) => {
                      setForm({ ...form, jnv_state: e.target.value });
                      setErrors({ ...errors, jnv_state: "" });
                    }}
                  >
                    <option value="">Select State</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.jnv_state && (
                    <div className="text-danger">{errors.jnv_state}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="text-light">JNV Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.jnv ? "is-invalid" : ""}`}
                    name="jnv"
                    value={form.jnv}
                    onChange={handleChange}
                  />
                  {errors.jnv && <div className="text-danger">{errors.jnv}</div>}
                </div>

                <div className="mb-3">
                  <label className="text-light">Passout Year *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.year ? "is-invalid" : ""}`}
                    name="year"
                    maxLength={4}
                    value={form.year}
                    onChange={(e) => {
                      const onlyNum = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, year: onlyNum });
                      setErrors({ ...errors, year: "" });
                    }}
                  />
                  {errors.year && <div className="text-danger">{errors.year}</div>}
                </div>

                <LoaderButton
  loading={loading}
                  className="btn btn-warning w-100 fw-bold py-2 mt-2"
                  onClick={handleSubmitOffline}
                >
                  Submit Details
               </LoaderButton>


              </div>
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
      {successPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-4 text-center"
            style={{
              width: "90%",
              maxWidth: "400px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h3 className="text-success fw-bold mb-2">Success</h3>
            <p className="text-white fs-5">
              Your pass is booked. <br />
              <strong>Pay Cash on Ticket collection</strong>
            </p>

            <LoaderButton
  loading={loading}
              className="btn btn-warning w-75 fw-bold mt-3"
              onClick={() => { setSuccessPopup(false); navigate("/") }}
            >
              OK
            </LoaderButton>
          </motion.div>
        </div>
      )}
      {errorPopup.show && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Error</h5>
                  {/* <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setErrorPopup({ show: false, message: "" })}
            ></button> */}
                </div>
                <div className="modal-body">
                  <p>{errorPopup.message}</p>
                </div>
                <div className="modal-footer">
                  <LoaderButton
  loading={loading}
                    className="btn btn-danger"
                    onClick={() => setErrorPopup({ show: false, message: "" })}
                  >
                    Close
                 </LoaderButton>
                </div>
              </div>
            </div>
          </div>

          {/* BACKDROP */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </div>
  );
}