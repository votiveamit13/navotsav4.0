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

        // Name validation
        if (!form.name.trim()) newErrors.name = "Name is required";

        // Email validation
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                newErrors.email = "Invalid email address";
            }
        }

        // Mobile validation
        if (!form.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else {
            const mobileRegex = /^[0-9]{10}$/; // adjust if country code needed
            if (!mobileRegex.test(form.mobile)) {
                newErrors.mobile = "Invalid mobile number";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handlePay = () => {
        if (!validate()) return;

        console.log("Proceeding to backend:", form);
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
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                        setForm({ ...form, mobile: onlyNums });
                                        setErrors({ ...errors, mobile: "" });
                                    }}
                                    maxLength={10}
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
