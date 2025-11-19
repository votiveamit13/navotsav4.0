import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingTickets, reserveTicket } from "../services/EventService";
import { toast } from "react-toastify";

import "../assets/css/checkout.css";
import "../assets/css/cart.css";

export default function CheckoutNew() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get event + selected price option from EventDetail
  const event = location.state?.event;
  const selectedPackage = location.state?.selectedPrice;
  const isPackage = event?.multiple_price ? true : false;

  const [quantity, setQuantity] = useState(1);
  const [packageId, setPackageId] = useState(null);
  const [packagePrice, setPackagePrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event) {
      // If no event data, redirect back to product list
      navigate("/fundraising-products");
    }

    if (selectedPackage) {
      setPackageId(selectedPackage.id);
      setPackagePrice(selectedPackage.price);
    }
  }, [event, navigate]);

  if (!event) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      let payload = {
        event_id: event.id,
        package_id: packageId,
        payment_method: "card",
      };
      const res = await bookingTickets(payload);
      console.log("Booked response", res);

      if (res.status) {
        window.location.href = res.payment_url;
      }
    } catch (err) {
      console.log("error", err);
      if (err.response?.status === 422) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong. Try again.");
      }
      setLoading(false);
    }
  };

  const handlePackage = (package_id) => {
    const selected = event.prices.find((price) => price.id == package_id);
    setPackageId(package_id);
    setPackagePrice(selected.price);
  };

  const increseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <section className="page-header banner-top-add">
        <div className="container">
          <h1>Checkout</h1>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                CHECKOUT
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="cart-tickets-add checkout-summary-form">
        <div className="container py-5">
          <div className="row g-4 cart-add-tickets-inner">
            <div className="col-lg-8 cart-tickets-left">
              <div className="card shadow-sm">
                <div className="card-header">
                  <h4>{event.title}</h4>
                </div>
                <div className="card-body">
                  <img src={event?.banners[0]} alt="{event.title}" />

                  <div className="contest-text-add">
                    <p>
                      Contest No.{" "}
                      <span className="contest-no"> {event?.contest_no} </span>{" "}
                      | Drawn:{" "}
                      <span className="contest-date">{event.draw_time}</span>{" "}
                    </p>
                  </div>

                  <div className="description">
                    <h3>Description</h3>
                    <p>{event.description}</p>
                  </div>

                  <div className="fundraiser-details">
                    <h3>Fundraiser Details</h3>
                    <p>{event?.cause}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 cart-tickets-right checkout-ticket-price">
              <div className="card shadow-sm">
                <div className="card-header">Tickets Summary</div>
                <div className="card-body">
                  {!selectedPackage && (
                    <>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="price">Ticket Price</span>
                        <span className="price">${event.ticket_price}</span>
                      </div>
                      <hr />
                    </>
                  )}

                  {selectedPackage ? (
                    <>
                      <select
                        className="form-select"
                        value={packageId}
                        onChange={(e) => handlePackage(e.target.value)}
                      >
                        {event.prices.map((price) => (
                          <option key={price.id} value={price.id}>
                            {price.quantity} Ticket
                            {price.quantity > 1 ? "s" : ""} - ${price.price}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between mb-3">
                      <span className="tic-price">Quantity</span>
                      <span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={decreaseQty}
                        >
                          -
                        </button>
                        <span className="mx-3">{quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={increseQty}
                        >
                          +
                        </button>
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="price">Total</span>
                    <span className="price">
                      $
                      {selectedPackage
                        ? packagePrice
                        : (event.ticket_price || 0) * quantity}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn w-100 buy-btn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment{" "}
                    <i className="bi bi-arrow-right ms-1"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
