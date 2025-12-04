import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { eventDetail } from "../services/EventService";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderButton from "../components/Loader";

export default function EventDetail() {
  const [loading, setLoading] = useState(false);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [searchMobile, setSearchMobile] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");



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
    // 5: "Dummy",
  };

  const JNV_LIST = {
    "Madhya Pradesh": [
      "Agar Malwa",
      "Alirajpur",
      "Anuppur",
      "Ashoknagar",
      "Balaghat",
      "Barwani",
      "Betul",
      "Bhind",
      "Bhopal",
      "Burhanpur",
      "Chhatarpur",
      "Chhindwara",
      "Damoh",
      "Datia",
      "Dewas",
      "Dhar",
      "Dindori",
      "Guna",
      "Gwalior",
      "Harda",
      "Hoshangabad",
      "Indore",
      "Jabalpur",
      "Jhabua",
      "Katni",
      "Khandwa",
      "Khargone",
      "Mandla",
      "Mandsaur",
      "Morena",
      "Narsinghpur",
      "Neemuch",
      "Panna",
      "Raisen",
      "Rajgarh",
      "Ratlam",
      "Rewa",
      "Sagar",
      "Satna",
      "Sehore",
      "Seoni",
      "Shahdol",
      "Shajapur",
      "Sheopur",
      "Shivpuri",
      "Sidhi",
      "Singrauli",
      "Tikamgarh",
      "Ujjain I",
      "Ujjain II",
      "Umaria",
      "Vidisha",
    ]
  };

  const years = Array.from({ length: 2025 - 1993 + 1 }, (_, i) => 1993 + i);

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

        let minLimit = p.id === 3 ? 1 : 1; // all pass min = 1
        let qty = p.qty || minLimit;

        return { ...p, qty };
      })
    );
  };



  const increment = (id) => {
    if (id !== selectedPassId) return;

    setPasses(prev =>
      prev.map(p => {
        if (p.id !== id) return p;

        const maxLimit =
          p.id === 1 ? 2 :
            p.id === 2 ? 2 :
              p.id === 3 ? 4 :
                p.id === 4 ? 2 : 1;

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

        const minLimit = 1; // All passes min = 1

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

  // const handleSubmitOffline = async () => {
  //   if (!validate()) return;
  //   setLoading(true);

  //   const payload = {
  //     event_id: eventId,
  //     pass_id: selectedPass?.id,
  //     pass_name: selectedPass?.name,
  //     qty: selectedPass?.qty,
  //     amount: totalAmount,
  //     name: form.name,
  //     email: form.email,
  //     mobile: form.mobile,
  //     jnv_state: form.jnv_state,
  //     jnv: form.jnv,
  //     year: form.year,
  //   };

  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_BASE_URL}/offline-booking`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();

  //     setLoading(false);

  //     if (response.ok && data.success) {
  //       console.log("data:", data)
  //       setSuccessPopup(true);

  //         const message =
  //           `*Your Ticket Details*

  // *Order ID:* ${data.orderId}

  // *Name:* ${form.name}
  // *Pass:* ${selectedPass?.name}
  // *Quantity:* ${selectedPass?.qty}
  // *Amount:* ₹${totalAmount}
  // *Event:* ${event.title}

  // Please pay cash at the ticket counter.
  // Thank you!`;


  //         const whatsappNumber = "91" + form.mobile;

  //         const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  //         window.location.href = whatsappURL;
  //       return;
  //     }

  //     if (response.status === 422) {
  //       let message = "";

  //       if (data.errors?.email) {
  //         message = data.errors.email[0];
  //       } else if (data.errors?.mobile) {
  //         message = data.errors.mobile[0];
  //       } else {
  //         message = "Please check your input.";
  //       }

  //       setErrorPopup({ show: true, message });
  //       return;
  //     }

  //     setErrorPopup({
  //       show: true,
  //       message: data.message || "Something went wrong!"
  //     });

  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Offline Booking Error:", error);
  //     setErrorPopup({ show: true, message: "Failed to connect to server" });
  //   }
  // };

  const handleRazorpayPayment = async () => {
    if (!validate()) return;

    const payload = {
      mode: "new",
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

    // Step 1: Create Order on Laravel
    const orderRes = await fetch(`${import.meta.env.VITE_BASE_URL}/razorpay/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });


    const orderData = await orderRes.json();

    if (orderRes.status === 422) {
      let msg = "";

      if (orderData.errors.email) {
        msg = orderData.errors.email[0];
      } else if (orderData.errors.mobile) {
        msg = orderData.errors.mobile[0];
      } else {
        msg = "Validation failed";
      }

      setErrorPopup({ show: true, message: msg });
      setLoading(false);
      return;
    }


    if (!orderData.success) {
      alert("Order creation failed!");
      return;
    }

    // Step 2: Open Razorpay popup
    const options = {
      key: orderData.key,
      amount: totalAmount * 100,
      currency: "INR",
      name: "NAVLAY 1.0",
      description: selectedPass.name,
      order_id: orderData.order_id,

      handler: async function (response) {
        // Step 3: Verify payment
        const verifyRes = await fetch(`${import.meta.env.VITE_BASE_URL}/razorpay/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,   // razorpay_order_id, razorpay_payment_id, razorpay_signature

            // also send booking data to Laravel
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
          }),

        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          // alert("Payment successful!");

          // Redirect or show success
          setSuccessPopup(true);
          const message = `
            *Your Ticket Details*

            *Order ID:* ${verifyData.orderId}

            *Name:* ${form.name}
            *Pass:* ${selectedPass?.name}
            *Quantity:* ${selectedPass?.qty}
            *Amount:* ₹${totalAmount}
            *Event:* ${event.title}
              Thank you for your booking!
            `;

          const whatsappNumber = "91" + form.mobile;
          const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

          const link = document.createElement("a");
          link.href = whatsappURL;
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert("Payment failed!");
        }
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.mobile,
      },
      theme: { color: "#FFC107" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  // const handleSearchPass = async () => {
  //   setErrorMessage("");
  //   setBookingData(null);

  //   if (!searchMobile) {
  //     setErrorMessage("Please enter mobile number");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("https://maan-backend.votivereact.in/api/get-pass", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         mobile: searchMobile,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!data.success || !data.booking) {
  //       setErrorMessage("No pass found for this mobile number");
  //       return;
  //     }

  //     // Data received → update UI
  //     setBookingData(data.booking);

  //   } catch (err) {
  //     setErrorMessage("Something went wrong. Try again.");
  //   }
  // };


  // const handleRazorpayPaymentExistingBooking = async () => {
  //   if (!bookingData) return;

  //   // Payload from existing booking
  //   const payload = {
  //     mode: "existing",
  //     booking_id: bookingData.id,
  //     event_id: bookingData.event_id,
  //     pass_id: bookingData.pass_id,
  //     pass_name: bookingData.pass_name,
  //     qty: bookingData.qty,
  //     amount: bookingData.amount,
  //     name: bookingData.user_name,
  //     email: bookingData.email,
  //     mobile: bookingData.mobile,
  //     jnv_state: bookingData.jnv_state,
  //     jnv: bookingData.jnv,
  //     year: bookingData.year,
  //   };

  //   // Step 1: Create Razorpay Order from server
  //   const orderRes = await fetch(`${import.meta.env.VITE_BASE_URL}/razorpay/order`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const orderData = await orderRes.json();

  //   if (!orderData.success) {
  //     alert("Order creation failed!");
  //     return;
  //   }

  //   // Step 2: Razorpay Popup
  //   const options = {
  //     key: orderData.key,
  //     amount: bookingData.amount * 100,
  //     currency: "INR",
  //     name: "NAVLAY 1.0",
  //     description: bookingData.pass_name,
  //     order_id: orderData.order_id,

  //     handler: async function (response) {
  //       // Step 3: Verify payment
  //       const verifyRes = await fetch(`${import.meta.env.VITE_BASE_URL}/razorpay/verify`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           ...response,
  //           booking_id: bookingData.id,
  //           event_id: bookingData.event_id,
  //           pass_id: bookingData.pass_id,
  //           pass_name: bookingData.pass_name,
  //           qty: bookingData.qty,
  //           amount: bookingData.amount,
  //           name: bookingData.user_name,
  //           email: bookingData.email,
  //           mobile: bookingData.mobile,
  //           jnv_state: bookingData.jnv_state,
  //           jnv: bookingData.jnv,
  //           year: bookingData.year,
  //         }),
  //       });

  //       const verifyData = await verifyRes.json();

  //       if (verifyData.success) {
  //         setSuccessPopup(true);

  //         const message = `
  //           *Your Ticket Details*

  //           *Order ID:* ${verifyData.orderId}

  //           *Name:* ${bookingData.user_name}
  //           *Pass:* ${bookingData.pass_name}
  //           *Quantity:* ${bookingData.qty}
  //           *Amount:* ₹${bookingData.amount}
  //           *Event:* NAVLAY 1.0  
  //            Thank you for your booking! `;

  //         const whatsappNumber = "91" + bookingData.mobile;
  //         const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  //         const link = document.createElement("a");
  //         link.href = whatsappURL;
  //         link.target = "_blank";
  //         link.rel = "noopener noreferrer";

  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       } else {
  //         alert("Payment failed!");
  //       }
  //     },

  //     prefill: {
  //       name: bookingData.user_name,
  //       email: bookingData.email,
  //       contact: bookingData.mobile,
  //     },
  //     theme: { color: "#FFC107" },
  //   };

  //   const rzp1 = new window.Razorpay(options);
  //   rzp1.open();
  // };




  return (
    <div className="py-5 text-light bg-black navlay-top-view-add" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="container mx-auto row g-4 p-0">
        <div className="row g-4 mt-0 p-0">
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
                    {/* <div className="d-flex justify-content-start">
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
                    </div> */}

                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="d-flex align-items-start">
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

                     {(p.id == 1 || p.id == 3) && <motion.span
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="px-3 py-1"
                        style={{
                          background: "#ff3b30",
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🔥 Filling Fast
                      </motion.span>}
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
                            (p.id === 1 && p.qty >= 2) ||    // Student pass max 2
                            (p.id === 2 && p.qty >= 2) ||    // Adult pass max 2
                            (p.id === 3 && p.qty >= 4) ||    // Family pass max 4
                            (p.id === 4 && p.qty >= 2)       // Host pass max 2
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
                  {/* <p className="text-warning fw-semibold mt-3 mb-1" style={{ fontSize: "14px" }}>
                  <span className="text-danger">*</span> Pay Cash on Ticket collection
                </p> */}

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

                  {/* <div className="mb-3">
                  <label className="text-light">JNV Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.jnv ? "is-invalid" : ""}`}
                    name="jnv"
                    value={form.jnv}
                    onChange={handleChange}
                  />
                  {errors.jnv && <div className="text-danger">{errors.jnv}</div>}
                </div> */}

                  <div className="mb-3">
                    <label className="text-light">JNV Name *</label>

                    {/* Disable until state selected */}
                    {form.jnv_state === "" ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select state first"
                        disabled
                      />
                    ) : form.jnv_state === "Madhya Pradesh" ? (
                      /* Show dropdown for MP */
                      <select
                        name="jnv"
                        className={`form-control ${errors.jnv ? "is-invalid" : ""}`}
                        value={form.jnv}
                        onChange={handleChange}
                      >
                        <option value="">Select JNV (District)</option>
                        {JNV_LIST["Madhya Pradesh"].map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    ) : (
                      /* Show text input for ANY other state */
                      <input
                        type="text"
                        className={`form-control ${errors.jnv ? "is-invalid" : ""}`}
                        name="jnv"
                        value={form.jnv}
                        onChange={handleChange}
                        placeholder="Enter JNV Name"
                      />
                    )}

                    {errors.jnv && <div className="text-danger">{errors.jnv}</div>}
                  </div>


                  {/* <div className="mb-3">
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
                </div> */}

                  <div className="mb-3">
                    <label className="text-light">Passout Year *</label>

                    <select
                      name="year"
                      className={`form-control ${errors.year ? "is-invalid" : ""}`}
                      value={form.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      {years.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>

                    {errors.year && <div className="text-danger">{errors.year}</div>}
                  </div>


                  {/* <LoaderButton
                  loading={loading}
                  className="btn btn-warning w-100 fw-bold py-2 mt-2"
                  onClick={handleSubmitOffline}
                >
                  Submit Details
                </LoaderButton> */}
                  <LoaderButton
                    loading={loading}
                    className="btn btn-warning w-100 fw-bold py-2 mt-2"
                    onClick={handleRazorpayPayment}
                  >
                    Pay Now
                  </LoaderButton>


                </div>
              )}



            </motion.div>
            {/* TERMS & CONDITIONS */}



          </div>
        </div>
      </div>
      <div
        className="container mx-auto mb-8 row mt-4 p-3 rounded-4 text-white term-condition-add"
        style={{
          background: "rgba(255, 255, 255, 0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h5 className="fw-bold mb-2">Terms & Conditions</h5>

        <ul className="ps-3 mb-0" style={{ lineHeight: "1.6" }}>
          <li>Entry requires a valid ticket/pass and acceptance of these terms and ticket agent policies.</li>
          <li>Security checks may be conducted, and admission may be refused at the Organiser’s discretion.</li>
          <li>Please check tickets at the time of purchase — mistakes and lost tickets cannot be corrected or replaced.</li>
          <li>Tickets are non-refundable and non-exchangeable. If government rules prevent attendance, tickets may be moved to a future event.</li>
          <li>If you cannot attend due to unforeseen circumstances, a transfer may be considered at the Organiser’s discretion (no refunds).</li>
          <li>Booking or transaction fees are strictly non-refundable.</li>
          <li>If the Event is rescheduled or cancelled, tickets may be transferred or refunded (fees excluded).</li>
          <li>The Organiser is not responsible for additional costs (travel, accommodation, etc.) arising from changes or cancellations.</li>
          <li>Damaged, duplicated, or resold tickets are invalid. Ticket quantity limits may apply.</li>
          <li>Event content, schedule, or lineup may change without eligibility for a refund.</li>
          <li>Attendees must follow the Code of Conduct. Admission may be refused or individuals removed for safety concerns or inappropriate behaviour (including signs of infection).</li>
          <li>The Organiser/venue is not liable for loss, injury, or damage unless legally proven negligent.</li>
          <li>Outdoor events proceed in all weather conditions unless declared unsafe — no refunds for weather issues.</li>
          <li>The Organiser is not responsible for loss or damage to personal belongings.</li>
          <li>Visitors may be filmed or photographed for media, promotional, or security purposes.</li>
          <li>Any content or items obtained at the Event must not be used for commercial purposes.</li>
          <li>No animals allowed inside the venue, including pets.</li>
          <li>Please check event timings, travel routes, and parking instructions — delays are not the Organiser’s responsibility.</li>
          <li>Late entry into sessions is not guaranteed.</li>
          <li>Recording inside performance areas is prohibited without written permission.</li>
          <li>Alcohol is strictly prohibited inside the venue.</li>
        </ul>
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
              {/* <strong>Pay Cash on Ticket collection</strong> */}
            </p>

            {/* SHARE MESSAGE */}
            <div className="mt-3">
              <p className="text-warning fw-bold mb-2">Share with your friends,<br />that you're going to attend NAVLAY 1.0</p>

              <div className="d-flex flex-column gap-2">

                {/* WHATSAPP SHARE */}
                <button
                  className="btn btn-success w-100 fw-bold"
                  onClick={() => {
                    const msg = `
I just booked my pass for *${event.title}*!   

You can also book your pass here:  
 ${window.location.origin}
          `;

                    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                  }}
                >
                  Share on WhatsApp
                </button>
              </div>
            </div>

            <LoaderButton
              loading={loading}
              className="btn btn-warning w-75 fw-bold mt-4"
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


      {/* {showPaymentPopup && (
        <div className="popup-overlay">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="popup-container"
          >
            <h3 className="text-center text-black mb-3">Search Your Pass</h3>
       
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Mobile Number"
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
            />

            <button
              className="btn btn-warning w-100 fw-bold"
              onClick={handleSearchPass}
            >
              Search
            </button>

            {errorMessage && (
              <p className="text-danger text-center mt-2">{errorMessage}</p>
            )}



            {bookingData && (
              <div className="pass-details mt-3">
                <h5 className="text-black">Pass Details</h5>

                <input className="form-control mb-2" value={bookingData.id} disabled />
                <input className="form-control mb-2" value={bookingData.user_name} disabled />
                <input className="form-control mb-2" value={bookingData.email} disabled />
                <input className="form-control mb-2" value={bookingData.mobile} disabled />
                <input className="form-control mb-2" value={bookingData.pass_name} disabled />
                <input className="form-control mb-2" value={bookingData.qty} disabled />
                <input className="form-control mb-2" value={bookingData.amount} disabled />


                {bookingData.payment_status === "pending" ? (
                  <button
                    className="btn btn-success w-100 mt-3 fw-bold"
                    onClick={handleRazorpayPaymentExistingBooking}
                  >
                    Pay Now
                  </button>
                ) : (
                  <p className="text-success fw-bold mt-2">Payment Already Completed</p>
                )}
              </div>
            )}

            <button
              className="btn btn-danger w-100 mt-4"
              onClick={() => setShowPaymentPopup(false)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}



      <div
        className="position-fixed"
        style={{
          bottom: "25px",
          right: "25px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
       
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="fw-bold"
          style={{
            color: "#ffcc00",
            fontSize: "18px",
            textShadow: "0 0 10px #ffcc00",
          }}
        >
          Already booked the pass?
        </motion.span>

   
        <motion.button
          onClick={() => setShowPaymentPopup(true)}
          whileHover={{ scale: 1.15, rotateZ: -5 }}
          whileTap={{ scale: 0.95 }}
          className="fw-bold"
          style={{
            padding: "15px 30px",
            borderRadius: "50px",
            background: "linear-gradient(135deg, #ffcc00 0%, #ff8800 100%)",
            boxShadow: "0 10px 30px rgba(255, 200, 0, 0.4)",
            color: "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Pay Now Online
        </motion.button>
      </div> */}


    </div>
  );
}