// import { useState, useEffect } from "react";
// import { Carousel } from "react-bootstrap";

// import "../assets/css/event_details.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { collectedAmount, eventDetail } from "../services/EventService";
// import LoginModal from "../modals/LoginModal";
// import SignupModal from "../modals/SignupModal";
// import { toast } from "react-toastify";

// export default function EventDetail() {
//   const [event, setEvent] = useState({});
//   const [chosenPrice, setChosenPrice] = useState(null);
//   const [collectAmt, setCollectAmt] = useState(0);

//   const {
//     handleLoginSuccess,
//     openLogin,
//     openSignup,
//     setOpenLogin,
//     setOpenSignup,
//   } = useAuth();

//   const location = useLocation();
//   const navigate = useNavigate();
//   const eventId = location.state?.event;

//   const isAuthenticated = !!localStorage.getItem("authToken");

//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const loadEvent = async () => {
//       try {
//         let res = await eventDetail(eventId);
//         console.log("event info", res);
//         setEvent(res.data);

//         // default selected price
//         if (res.data.multiple_price && res.data.prices?.length) {
//           setChosenPrice(res.data.prices[0]);
//         }
//       } catch (err) {
//         console.error("Failed to load event", err);
//       }
//     };
//     if (eventId) loadEvent();
//   }, [eventId]);

//   useEffect(() => {
//     if (!eventId) return;

//     const fetchCollectedAmount = async () => {
//       try {
//         const res = await collectedAmount(eventId);
//         setCollectAmt(res.amount);
//       } catch (err) {
//         console.error("Failed to fetch collected amount:", err);
//       }
//     };

//     // initial fetch
//     fetchCollectedAmount();

//     // poll every 5 seconds
//     const interval = setInterval(fetchCollectedAmount, 7000);
//     return () => clearInterval(interval);
//   }, [eventId]);

//   // countdown timer
//   useEffect(() => {
//     if (!event?.draw_time) return;

//     const targetDate = new Date(event.draw_time).getTime();

//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance <= 0) {
//         clearInterval(timer);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor(
//         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       setTimeLeft({ days, hours, minutes, seconds });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [event?.draw_time]);

//   const checkout = () => {
//     isAuthenticated
//       ? navigate("/checkout", {
//           state: {
//             event,
//             selectedPrice: event.multiple_price ? chosenPrice : null,
//           },
//         })
//       : setOpenLogin(true);
//   };

//   return (
//     <>
//       {/* Banner */}
//       <section className="event-details-add">
//         <div className="container">
//           <h1 className="text-center">{event.title}</h1>
//           <ul className="event-list-add">
//             <li>
//               <a href="#">HOME</a>
//             </li>
//             <li>/</li>
//             <li>
//               <a href="#">CONTEST</a>
//             </li>
//             <li>/</li>
//             <li>
//               <a href="#">{event.title}</a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       {/* Carousel */}
//       <div className="event-testimonials">
//         <div className="container">
//           <Carousel>
//             {(event.banners || []).map((src, idx) => (
//               <Carousel.Item key={idx}>
//                 <img
//                   className="d-block w-100"
//                   src={src}
//                   alt={`Slide ${idx + 1}`}
//                 />
//               </Carousel.Item>
//             ))}
//           </Carousel>
//         </div>
//       </div>

//       {/* Details */}
//       <div className="chance-to-win">
//         <div className="container my-4">
//           <div className="row inner-content-add-win">
//             {/* Left content */}
//             <div className="col-lg-8 inner-content-win-right">
//               <div className="enter-now-chance">
//                 <h6>
//                   <i className="bi bi-trophy"></i> Enter now for a chance to
//                   donate and win
//                 </h6>
//                 {/* <p>
//                   <strong>${event.ticket_price}</strong> Per Ticket
//                 </p> */}
//               </div>
//               <h3 className="fw-bold">{event.title}</h3>
//               <p className="contest-number">
//                 Contest No. <b>{event.contest_no}</b>{" "}
//                 {event.draw_time && <>| Draw: {event.draw_time}</>}
//               </p>
//               {/* <h5 className="mt-4">Description</h5>
//               <p>{event.description}</p> */}
//               <h5 className="mt-4">Fundraiser Details</h5>
//               <p>{event.cause}</p>
//             </div>

//             {/* Right sidebar */}
//             <div className="col-lg-4 inner-content-win-left">
//               {event.end_date && event.draw_time && (
//                 <div className="countdown text-center mb-3">
//                   <p className="mb-1">This Raffle ends in:</p>
//                   <h3>
//                     <span className="number-text-add">
//                       {timeLeft.days}{" "}
//                       <small className="days-text-add">Days</small>
//                     </span>
//                     <span className="number-text-add">
//                       {timeLeft.hours}{" "}
//                       <small className="days-text-add">Hours</small>
//                     </span>
//                     <span className="number-text-add">
//                       {timeLeft.minutes}{" "}
//                       <small className="days-text-add">Minutes</small>
//                     </span>
//                     <span className="number-text-add">
//                       {timeLeft.seconds}{" "}
//                       <small className="days-text-add">Seconds</small>
//                     </span>
//                   </h3>
//                 </div>
//               )}

//               <div className="ticket-box text-center">
//                 <h5>Total Amount</h5>
//                 {/* // Total Sold Amount */}
//                 <p>${collectAmt}</p>

//                 {event.visiblity != "offline" &&
//                   event.multiple_price == true && (
//                     <select
//                       id="tickets"
//                       name="tickets"
//                       onChange={(e) => {
//                         const selected = event.prices.find(
//                           (price) => price.id === parseInt(e.target.value)
//                         );
//                         setChosenPrice(selected);
//                       }}
//                     >
//                       {event.prices.map((price) => (
//                         <option key={price.id} value={price.id}>
//                           {price.quantity} Ticket{price.quantity > 1 ? "s" : ""}{" "}
//                           - ${price.price}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 <button
//                   className="btn btn-buy"
//                   onClick={checkout}
//                   disabled={
//                     event.is_finalize || event.visiblity == "offline"
//                       ? true
//                       : false
//                   }
//                 >
//                   Donate Now <i className="bi bi-arrow-right ms-1"></i>
//                 </button>
//                 {event.visiblity == "offline" && (
//                   <>
//                     <br />
//                     <h6>Online donations are not available.</h6>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <SignupModal
//         open={openSignup}
//         handleClose={() => setOpenSignup(false)}
//         handleLoginClick={() => {
//           setOpenSignup(false); // close signup
//           setOpenLogin(true); // open login
//         }}
//         onLoginSuccess={handleLoginSuccess}
//       />

//       <LoginModal
//         open={openLogin}
//         handleClose={() => setOpenLogin(false)}
//         handleSignupClick={() => {
//           setOpenLogin(false); // close login
//           setOpenSignup(true); // open signup
//         }}
//         onLoginSuccess={handleLoginSuccess}
//       />
//     </>
//   );
// }
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

export default function EventDetail() {
  const passesData = [
    { id: 1, name: "Students pass", price: 100 },
    { id: 2, name: "Professional pass for adult", price: 200 },
    { id: 3, name: "Professional pass for family (specific family zone)", price: 250 },
    { id: 4, name: "Host pass only for family", price: 200 },
  ];

  const [passes, setPasses] = useState(
    passesData.map((p) => ({ ...p, qty: 0 }))
  );

  const [selectedPassId, setSelectedPassId] = useState(null);

 
  const handleSelect = (id) => {
    setSelectedPassId(id);
    setPasses((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty } : { ...p, qty: 0 }
      )
    );
  };

  const increment = (id) => {
    if (id !== selectedPassId) return;

    setPasses((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
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

  return (
    <div className="py-5 text-light bg-black" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="container mx-auto row g-4">
        <div className="col-12 col-lg-7">
          <h2 className="fw-bold text-warning">NAVOTSAV 4.0</h2>
          <p className="text-secondary">
            A grand fusion of comedy, storytelling, live band & DJ night.
          </p>

          <div className="mt-4">
            <h4 className="fw-bold">🎟 Select Your Pass</h4>

            {/* PASS LIST */}
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
                  {/* RADIO BUTTON */}
                  <input
                    type="radio"
                    checked={selectedPassId === p.id}
                    onChange={() => handleSelect(p.id)}
                    style={{ width: "20px", height: "20px" }}
                  />

                  {/* PASS NAME + PRICE */}
                  <div className="ms-3">
                    <h5 className="mb-0">{p.name}</h5>
                    <small className="text-warning fw-bold">₹{p.price}</small>
                  </div>
</div>
                  {/* QUANTITY */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn text-white px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        decrement(p.id);
                      }}
                      disabled={selectedPassId !== p.id}
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
                      disabled={selectedPassId !== p.id}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CHECKOUT */}
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

            {/* SUMMARY */}
            {!selectedPass || selectedPass.qty === 0 ? (
              <p>No pass selected.</p>
            ) : (
              <div className="d-flex justify-content-between border-bottom py-2">
                <span>{selectedPass.name} × {selectedPass.qty}</span>
                <span>₹{totalAmount}</span>
              </div>
            )}

            {/* TOTAL */}
            <div className="d-flex justify-content-between mt-3 fs-4 fw-bold">
              <span>Total:</span>
              <span className="text-warning">₹{totalAmount}</span>
            </div>

            {/* CHECKOUT */}
            <button
              className="btn btn-warning w-100 mt-4 fw-bold py-2"
              disabled={totalAmount === 0}
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
