import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../assets/css/payment.css";
import "../assets/css/cart.css";
import { reservedTickets, bookingTickets } from "../services/EventService";
import { Box, CircularProgress } from "@mui/material";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const event = location.state?.event;
  const quantity = location.state?.quantity || 1;
  const packageId = location.state?.packageId;

  const [reserved, setReserved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  let ticketPrice = null;
  let packagePrice = null;

  if (packageId) {
    const selected = event?.prices.find((price) => price.id == packageId);
    packagePrice = selected.price;
  } else {
    ticketPrice = event?.ticket_price || 0;
  }

  const totalAmount = packageId ? packagePrice : ticketPrice * quantity;

  useEffect(() => {
    if (!event) {
      navigate("/checkout");
      return;
    }

    const fetchReserved = async () => {
      try {
        const res = await reservedTickets(event.id);
        if (res.status) {
          setReserved(res.reserve_tickets);
        } else {
          toast.error(res.error || "Reservation expired");
          navigate("/checkout");
        }
      } catch (err) {
        toast.error("Failed to load reserved tickets");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchReserved();
  }, [event, navigate]);

  const handlePayment = async () => {
    if (!reserved.length) {
      toast.error("No tickets reserved for payment");
      return;
    }

    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call booking API
      const res = await bookingTickets({
        event_id: event.id,
        ticket_numbers: reserved.map((t) => t.ticket_number),
      });

      if (res.status) {
        toast.success("Payment successful! Tickets booked.");
        navigate("/fundraising-products"); // redirect
      } else {
        toast.error(res.error || "Booking failed after payment");
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#ee127b" }} />
      </Box>
    );

  return (
    <>
      <section className="page-header banner-top-add">
        <div className="container">
          <h1>Payment</h1>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                PAYMENT
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="cart-tickets-add checkout-add-page">
        <div className="container py-5">
          <div className="row g-4 cart-add-tickets-inner">
            {/* LEFT: Payment Options */}
            <div className="col-lg-8 cart-tickets-left">
              <div className="card card-custom payment-options-add">
                <div className="card-header">Payment Options</div>
                <div className="card-body">
                  <ul
                    className="nav nav-pills mb-3"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <img src="/images/credit-card.png" alt="card" />
                      <button
                        className="nav-link active"
                        id="credit-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#credit"
                        type="button"
                      >
                        Credit Card
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <img
                        src="/images/apple-pay.png"
                        className="apple-pay-img"
                        alt="applepay"
                      />
                      <button
                        className="nav-link"
                        id="apple-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#apple"
                        type="button"
                      >
                        Apple Pay
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <img src="/images/paypal.png" alt="paypal" />
                      <button
                        className="nav-link"
                        id="paypal-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#paypal"
                        type="button"
                      >
                        PayPal
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <img src="/images/stripe.png" alt="stripe" />
                      <button
                        className="nav-link"
                        id="stripe-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#stripe"
                        type="button"
                      >
                        Stripe
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    {/* Card Payment */}
                    <div
                      className="tab-pane fade show active"
                      id="credit"
                      role="tabpanel"
                    >
                      <form className="enter-your-details-card">
                        <h4>Enter Your Card Details</h4>
                        <div className="mb-3">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Name on Card</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Expiration</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">CVV</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-purple px-4"
                          disabled={processing}
                          onClick={handlePayment}
                        >
                          {processing ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Processing...
                            </>
                          ) : (
                            `PAY $${totalAmount}`
                          )}
                          <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </form>
                      <p className="mt-2 small">
                        By clicking "Pay" you agree to the{" "}
                        <a href="#">terms and conditions</a>
                      </p>
                    </div>

                    {/* Other Payment Tabs */}
                    <div className="tab-pane fade" id="apple" role="tabpanel">
                      <p>Apple Pay option selected.</p>
                    </div>
                    <div className="tab-pane fade" id="paypal" role="tabpanel">
                      <p>Pay with PayPal option selected.</p>
                    </div>
                    <div className="tab-pane fade" id="stripe" role="tabpanel">
                      <p>Stripe option selected.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Checkout Summary */}
            <div className="col-lg-4 cart-tickets-right checkout-ticket-price">
              <div className="card card-custom shadow-sm">
                <div className="card-header">Checkout</div>
                <div className="card-body">
                  {/* Event name */}
                  <h5 className="fw-bold mb-3">{event?.title}</h5>

                  {/* If package selected */}
                  {packageId ? (
                    <>
                      <div className="d-flex justify-content-between">
                        <span className="tic-price">Price Package</span>
                        <span className="tic-price">
                          ${reserved.length} Tickets - {totalAmount}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between">
                        <span className="tic-price">Ticket Price</span>
                        <span className="tic-price">${ticketPrice}</span>
                      </div>
                      <small className="price-tickets">
                        ({reserved.length} Ticket{quantity > 1 ? "s" : ""} × $
                        {event.ticket_price})
                      </small>
                    </>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="price">Total</span>
                    <span className="price">${totalAmount}</span>
                  </div>

                  {/* Show reserved tickets */}
                  {reserved.length > 0 && (
                    <div className="mt-3">
                      <h6 className="fw-bold">Reserved Tickets</h6>
                      <ul className="list-unstyled">
                        {reserved.map((t) => (
                          <li key={t.id}>Ticket #{t.ticket_number}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
