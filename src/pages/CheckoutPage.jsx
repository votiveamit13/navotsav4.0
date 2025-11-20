// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import { PaymentService } from "../services/PaymentService";

// export default function CheckoutPage() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const passData = location.state?.selectedPass || null;
//     const totalAmount = location.state?.totalAmount || 0;
//     const event = location.state?.event || null;

//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         mobile: "",
//     });

//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState("upi");
//     const [qrCodeData, setQrCodeData] = useState(null);

//     const [cardDetails, setCardDetails] = useState({
//         cardNumber: "",
//         expiry: "",
//         cvv: "",
//         name: ""
//     });

//     // Generate UPI QR code when component mounts or amount changes
//     useEffect(() => {
//         if (totalAmount > 0) {
//             generateUpiQrCode();
//         }
//     }, [totalAmount]);

//     const generateUpiQrCode = async () => {
//         try {
//             // If you want server-side QR generation, use this:
//             // const response = await PaymentService.generateUpiQr(totalAmount, `ORDER_${Date.now()}`);
//             // setQrCodeData(response.data);
            
//             // Client-side QR generation (as before)
//             const upiId = "barodiya.devendra@ybl";
//             const amount = totalAmount;
//             const name = "Event Booking";
//             const note = `Payment for ${event?.title || 'Event'}`;
            
//             const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}`;
//             const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(upiUrl)}`;
            
//             setQrCodeData({
//                 upiUrl,
//                 qrCodeUrl,
//                 upiId
//             });
//         } catch (error) {
//             console.error("Failed to generate QR code:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     };

//     const handleCardInputChange = (field, value) => {
//         setCardDetails(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const validate = () => {
//         let newErrors = {};

//         // Name validation
//         if (!form.name.trim()) newErrors.name = "Name is required";

//         // Email validation
//         if (!form.email.trim()) {
//             newErrors.email = "Email is required";
//         } else {
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(form.email)) {
//                 newErrors.email = "Invalid email address";
//             }
//         }

//         // Mobile validation
//         if (!form.mobile.trim()) {
//             newErrors.mobile = "Mobile number is required";
//         } else {
//             const mobileRegex = /^[0-9]{10}$/;
//             if (!mobileRegex.test(form.mobile)) {
//                 newErrors.mobile = "Invalid mobile number";
//             }
//         }

//         // Card validation if card payment selected
//         if (paymentMethod === "card") {
//             if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
//                 newErrors.cardNumber = "Valid card number is required";
//             }
//             if (!cardDetails.expiry.trim() || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
//                 newErrors.expiry = "Valid expiry date (MM/YY) is required";
//             }
//             if (!cardDetails.cvv.trim() || cardDetails.cvv.length !== 3) {
//                 newErrors.cvv = "Valid CVV is required";
//             }
//             if (!cardDetails.name.trim()) {
//                 newErrors.cardName = "Cardholder name is required";
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const initiatePhonePePayment = async () => {
//         if (!validate()) return;

//         setLoading(true);
//         try {
//             const orderData = {
//                 eventId: event?.id,
//                 passId: passData?.id,
//                 quantity: passData?.qty || 1,
//                 amount: totalAmount,
//                 passName: passData?.name,
//                 customerInfo: {
//                     name: form.name,
//                     email: form.email,
//                     phone: form.mobile
//                 },
//                 paymentMethod: paymentMethod
//             };

//             const response = await PaymentService.createOrder(orderData);
            
//             if (response.data && response.data.paymentUrl) {
//                 // Redirect to PhonePe payment page
//                 window.location.href = response.data.paymentUrl;
//             } else {
//                 throw new Error("Invalid response from payment service");
//             }
//         } catch (error) {
//             console.error("Payment initiation failed:", error);
//             alert(error.response?.data?.message || "Payment initiation failed. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCardPayment = async () => {
//         if (!validate()) return;

//         setLoading(true);
//         try {
//             const paymentData = {
//                 eventId: event?.id,
//                 passId: passData?.id,
//                 quantity: passData?.qty || 1,
//                 amount: totalAmount,
//                 passName: passData?.name,
//                 cardDetails: cardDetails,
//                 customerInfo: {
//                     name: form.name,
//                     email: form.email,
//                     phone: form.mobile
//                 }
//             };

//             const response = await PaymentService.processCardPayment(paymentData);
            
//             if (response.data && response.data.success) {
//                 alert("Payment successful! Your tickets have been booked.");
//                 navigate("/payment-success", { 
//                     state: { 
//                         orderId: response.data.orderId,
//                         amount: totalAmount,
//                         event: event
//                     } 
//                 });
//             } else {
//                 throw new Error(response.data?.message || "Payment failed");
//             }
//         } catch (error) {
//             console.error("Card payment failed:", error);
//             alert(error.response?.data?.message || "Payment failed. Please check your card details and try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePay = () => {
//         if (paymentMethod === "upi") {
//             initiatePhonePePayment();
//         } else {
//             handleCardPayment();
//         }
//     };

//     const formatCardNumber = (value) => {
//         const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//         const matches = v.match(/\d{4,16}/g);
//         const match = matches && matches[0] || '';
//         const parts = [];
//         for (let i = 0, len = match.length; i < len; i += 4) {
//             parts.push(match.substring(i, i + 4));
//         }
//         if (parts.length) {
//             return parts.join(' ');
//         } else {
//             return value;
//         }
//     };

//     const formatExpiry = (value) => {
//         const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//         if (v.length >= 2) {
//             return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
//         }
//         return v;
//     };

//     return (
//         <div
//             className="py-5 text-light min-vh-100"
//             style={{
//                 background: "black",
//                 fontFamily: "Poppins, sans-serif",
//             }}
//         >
//             <div className="container">

//                 {/* BACK BUTTON */}
//                 <div className="d-flex justify-content-end mb-4">
//                     <button
//                         className="btn btn-outline-warning px-4"
//                         onClick={() => navigate(-1)}
//                     >
//                         ⬅ Back
//                     </button>
//                 </div>

//                 <div className="row g-4">

//                     {/* LEFT SIDE — USER DETAILS */}
//                     <div className="col-12 col-lg-6">
//                         <div
//                             className="p-4 rounded-4 shadow-lg"
//                             style={{
//                                 background: "rgba(255, 255, 255, 0.07)",
//                                 border: "1px solid rgba(255,255,255,0.15)",
//                                 backdropFilter: "blur(10px)",
//                             }}
//                         >
//                             <h4 className="fw-bold text-warning mb-3">Your Details</h4>

//                             {/* NAME */}
//                             <div className="mb-3">
//                                 <label className="form-label text-light">
//                                     Name <span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     className={`form-control bg-dark text-white border-secondary ${errors.name ? "is-invalid" : ""}`}
//                                     value={form.name}
//                                     onChange={handleChange}
//                                     placeholder="Enter your full name"
//                                 />
//                                 {errors.name && (
//                                     <div className="text-danger mt-1">{errors.name}</div>
//                                 )}
//                             </div>

//                             {/* EMAIL */}
//                             <div className="mb-3">
//                                 <label className="form-label text-light">
//                                     Email <span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     className={`form-control bg-dark text-white border-secondary ${errors.email ? "is-invalid" : ""}`}
//                                     value={form.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter your email"
//                                 />
//                                 {errors.email && (
//                                     <div className="text-danger mt-1">{errors.email}</div>
//                                 )}
//                             </div>

//                             {/* MOBILE */}
//                             <div className="mb-3">
//                                 <label className="form-label text-light">
//                                     Mobile Number <span className="text-danger">*</span>
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     name="mobile"
//                                     className={`form-control bg-dark text-white border-secondary ${errors.mobile ? "is-invalid" : ""}`}
//                                     value={form.mobile}
//                                     onChange={(e) => {
//                                         const onlyNums = e.target.value.replace(/\D/g, "");
//                                         setForm({ ...form, mobile: onlyNums });
//                                         setErrors({ ...errors, mobile: "" });
//                                     }}
//                                     maxLength={10}
//                                     placeholder="Enter 10-digit mobile number"
//                                 />
//                                 {errors.mobile && (
//                                     <div className="text-danger mt-1">{errors.mobile}</div>
//                                 )}
//                             </div>

//                             {/* Order Summary */}
//                             <div className="mt-4 p-3 rounded-3" style={{ background: "rgba(255,193,7,0.1)" }}>
//                                 <h6 className="fw-bold text-warning">Order Summary</h6>
//                                 {passData && (
//                                     <div className="d-flex justify-content-between">
//                                         <span>{passData.name} × {passData.qty}</span>
//                                         <span>₹{totalAmount}</span>
//                                     </div>
//                                 )}
//                                 <hr className="my-2" />
//                                 <div className="d-flex justify-content-between fw-bold">
//                                     <span>Total Amount:</span>
//                                     <span className="text-warning">₹{totalAmount}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT SIDE — PAYMENT SECTION */}
//                     <div className="col-12 col-lg-6">
//                         <div
//                             className="p-4 rounded-4 shadow-lg"
//                             style={{
//                                 background: "rgba(255, 255, 255, 0.07)",
//                                 border: "1px solid rgba(255,255,255,0.15)",
//                                 backdropFilter: "blur(10px)",
//                             }}
//                         >
//                             <h4 className="fw-bold text-warning mb-3">Payment Method</h4>

//                             {/* Payment Method Selection */}
//                             <div className="mb-4">
//                                 <div className="btn-group w-100" role="group">
//                                     <button
//                                         type="button"
//                                         className={`btn ${paymentMethod === 'upi' ? 'btn-warning' : 'btn-outline-warning'}`}
//                                         onClick={() => setPaymentMethod('upi')}
//                                     >
//                                         📱 UPI Payment
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className={`btn ${paymentMethod === 'card' ? 'btn-warning' : 'btn-outline-warning'}`}
//                                         onClick={() => setPaymentMethod('card')}
//                                     >
//                                         💳 Card Payment
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* UPI Payment Section */}
//                             {paymentMethod === "upi" && (
//                                 <div className="text-center">
//                                     <h6 className="fw-bold text-warning">Scan & Pay with UPI</h6>
//                                     <p className="text-secondary mb-3">Use any UPI app to scan the QR code</p>
                                    
//                                     {qrCodeData ? (
//                                         <div className="mb-3">
//                                             <img 
//                                                 src={qrCodeData.qrCodeUrl} 
//                                                 alt="UPI QR Code" 
//                                                 className="img-fluid rounded-3 border border-warning"
//                                                 style={{ maxWidth: "200px" }}
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div 
//                                             className="rounded-3 border border-warning d-flex align-items-center justify-content-center mx-auto mb-3"
//                                             style={{ 
//                                                 width: "200px", 
//                                                 height: "200px",
//                                                 background: "rgba(255,255,255,0.05)" 
//                                             }}
//                                         >
//                                             <div className="spinner-border text-warning" role="status">
//                                                 <span className="visually-hidden">Loading...</span>
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className="mb-3">
//                                         <small className="text-secondary">UPI ID: {qrCodeData?.upiId || "your-merchant@upi"}</small>
//                                     </div>

//                                     <div className="alert alert-info bg-dark border-info text-light">
//                                         <small>
//                                             💡 <strong>How to pay:</strong><br/>
//                                             1. Open your UPI app (PhonePe, GPay, Paytm, etc.)<br/>
//                                             2. Tap on 'Scan QR Code'<br/>
//                                             3. Scan the QR code above<br/>
//                                             4. Confirm payment
//                                         </small>
//                                     </div>

//                                     <button
//                                         className="btn btn-outline-warning w-100 mt-2"
//                                         onClick={() => {
//                                             if (qrCodeData?.upiUrl) {
//                                                 window.open(qrCodeData.upiUrl, '_blank');
//                                             }
//                                         }}
//                                     >
//                                         🌐 Open in UPI App
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Card Payment Section */}
//                             {paymentMethod === "card" && (
//                                 <div>
//                                     <h6 className="fw-bold text-warning mb-3">Card Details</h6>

//                                     {/* Card Number */}
//                                     <div className="mb-3">
//                                         <label className="form-label text-light">Card Number</label>
//                                         <input
//                                             type="text"
//                                             className={`form-control bg-dark text-white border-secondary ${errors.cardNumber ? "is-invalid" : ""}`}
//                                             placeholder="1234 5678 9012 3456"
//                                             value={cardDetails.cardNumber}
//                                             onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
//                                             maxLength={19}
//                                         />
//                                         {errors.cardNumber && (
//                                             <div className="text-danger mt-1">{errors.cardNumber}</div>
//                                         )}
//                                     </div>

//                                     {/* Expiry and CVV */}
//                                     <div className="row g-2 mb-3">
//                                         <div className="col-6">
//                                             <label className="form-label text-light">Expiry Date</label>
//                                             <input
//                                                 type="text"
//                                                 className={`form-control bg-dark text-white border-secondary ${errors.expiry ? "is-invalid" : ""}`}
//                                                 placeholder="MM/YY"
//                                                 value={cardDetails.expiry}
//                                                 onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
//                                                 maxLength={5}
//                                             />
//                                             {errors.expiry && (
//                                                 <div className="text-danger mt-1">{errors.expiry}</div>
//                                             )}
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="form-label text-light">CVV</label>
//                                             <input
//                                                 type="text"
//                                                 className={`form-control bg-dark text-white border-secondary ${errors.cvv ? "is-invalid" : ""}`}
//                                                 placeholder="123"
//                                                 value={cardDetails.cvv}
//                                                 onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
//                                                 maxLength={3}
//                                             />
//                                             {errors.cvv && (
//                                                 <div className="text-danger mt-1">{errors.cvv}</div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Cardholder Name */}
//                                     <div className="mb-3">
//                                         <label className="form-label text-light">Cardholder Name</label>
//                                         <input
//                                             type="text"
//                                             className={`form-control bg-dark text-white border-secondary ${errors.cardName ? "is-invalid" : ""}`}
//                                             placeholder="John Doe"
//                                             value={cardDetails.name}
//                                             onChange={(e) => handleCardInputChange('name', e.target.value)}
//                                         />
//                                         {errors.cardName && (
//                                             <div className="text-danger mt-1">{errors.cardName}</div>
//                                         )}
//                                     </div>

//                                     <div className="alert alert-info bg-dark border-info text-light">
//                                         <small>
//                                             🔒 Your card details are secure. We use PhonePe for secure payment processing.
//                                         </small>
//                                     </div>
//                                 </div>
//                             )}

//                             <hr className="border-secondary my-4" />

//                             {/* Pay Now Button */}
//                             <button
//                                 className="btn btn-warning w-100 fw-bold py-2"
//                                 onClick={handlePay}
//                                 disabled={loading || totalAmount === 0}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2" />
//                                         {paymentMethod === "upi" ? "Processing UPI Payment..." : "Processing Card Payment..."}
//                                     </>
//                                 ) : (
//                                     `Pay ₹${totalAmount}`
//                                 )}
//                             </button>

//                             <div className="text-center mt-3">
//                                 <small className="text-secondary">
//                                     🔐 Secure payment powered by PhonePe
//                                 </small>
//                             </div>
//                         </div>

//                         {/* Security Badges */}
//                         <div className="mt-3 text-center">
//                             <div className="d-flex justify-content-center gap-3">
//                                 <small className="text-success">🔒 SSL Secure</small>
//                                 <small className="text-info">🛡️ PCI DSS Compliant</small>
//                                 <small className="text-warning">📱 UPI & Card</small>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const passData = location.state?.selectedPass || null;
    const totalAmount = location.state?.totalAmount || 0;

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const [errors, setErrors] = useState({}); // ⬅ NEW

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        // Remove error when user types
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

const handlePay = async () => {
  if (!validate()) return;

  const payload = {
    name: form.name,
    email: form.email,
    mobile: form.mobile,
    event_id: location.state?.event?.id,
    pass_id: passData.id,
    pass_name: passData.name,
    qty: passData.qty,
    amount: totalAmount
  };

  const res = await fetch("http://127.0.0.1:8000/api/phonepe/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.paymentUrl) {
    window.location.href = data.paymentUrl; // opens PhonePe QR + Card page
  }
};


    return (
        <div
            className="py-5 text-light min-vh-100"
            style={{
                background: "black",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <div className="container">

                {/* BACK BUTTON */}
                <div className="d-flex justify-content-end mb-4">
                    <button
                        className="btn btn-outline-warning px-4"
                        onClick={() => navigate(-1)}
                    >
                        ⬅ Back
                    </button>
                </div>

                <div className="row g-4">

                    {/* LEFT SIDE — USER DETAILS */}
                    <div className="col-12 col-lg-6">
                        <div
                            className="p-4 rounded-4 shadow-lg"
                            style={{
                                background: "rgba(255, 255, 255, 0.07)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <h4 className="fw-bold text-warning mb-3">Your Details</h4>

                            {/* NAME */}
                            <div className="mb-3">
                                <label className="form-label text-light">
                                    Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                {errors.name && (
                                    <div className="text-danger mt-1">{errors.name}</div>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="mb-3">
                                <label className="form-label text-light">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <div className="text-danger mt-1">{errors.email}</div>
                                )}
                            </div>

                            {/* MOBILE */}
                            <div className="mb-3">
                                <label className="form-label text-light">
                                    Mobile Number <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                                    value={form.mobile}
                                    onChange={handleChange}
                                />
                                {errors.mobile && (
                                    <div className="text-danger mt-1">{errors.mobile}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE — PAYMENT SECTION */}
                    <div className="col-12 col-lg-6">
                        <div
                            className="p-4 rounded-4 shadow-lg"
                            style={{
                                background: "rgba(255, 255, 255, 0.07)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <h4 className="fw-bold text-warning mb-3">Payment</h4>

                            <div className="text-center mb-4">
                                <h6 className="fw-bold">Scan & Pay (UPI)</h6>
                                <p className="text-secondary">Use any UPI app to scan</p>
                                <div
                                    className="rounded"
                                    style={{
                                        width: "160px",
                                        height: "160px",
                                        background: "#fff",
                                        margin: "auto",
                                    }}
                                />
                            </div>

                            <hr className="border-secondary" />

                            <h6 className="text-secondary mb-2">Card Payment</h6>

                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Card Number"
                                disabled
                            />

                            <div className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="MM/YY"
                                    disabled
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="CVV"
                                    disabled
                                />
                            </div>

                            <small className="text-warning">
                                * Actual card form will appear from payment gateway
                            </small>

                            <hr className="border-secondary" />

                            <div className="d-flex justify-content-between mb-3 fs-5">
                                <span>Total Amount:</span>
                                <strong className="text-warning">₹{totalAmount}</strong>
                            </div>

                            <button
                                className="btn btn-warning w-100 fw-bold py-2"
                                onClick={handlePay}
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
