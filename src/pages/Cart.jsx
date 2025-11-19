import { useState } from "react";
import "../assets/css/cart.css";

export default function Cart() {
  const [quantity, setQuantity] = useState(5);
  const ticketPrice = 2; // per ticket
  const eventTitle = "The Breeze Zodiac IX";
  const eventImage = "./images/event.jpg"; // replace with API image

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const totalPrice = ticketPrice * quantity;

  return (
    <div className="cart-page">
      {/* Page Banner */}
      <section className="page-header banner-top-add text-center">
        <div className="container">
          <h1>Cart</h1>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">Cart</li>
          </ul>
        </div>
      </section>

      <div className="container my-5">
        <div className="row g-4">
          {/* Left Section */}
          <div className="col-lg-8">
            <div className="card p-4 shadow-sm cart-box">
              <h5 className="cart-title mb-4">Your Tickets:</h5>
              <div className="d-flex align-items-center justify-content-between flex-wrap cart-item">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={eventImage}
                    alt={eventTitle}
                    className="cart-img rounded"
                  />
                  <span className="fw-bold">{eventTitle}</span>
                </div>

                <div className="cart-price">${ticketPrice.toFixed(2)}</div>

                <div className="cart-qty d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleDecrease}
                  >
                    –
                  </button>
                  <span className="mx-3 qty-value">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleIncrease}
                  >
                    +
                  </button>
                </div>

                <div className="cart-actions d-flex align-items-center gap-2">
                  <button className="btn btn-light btn-sm">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger btn-sm">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-4">
            <div className="card p-4 shadow-sm cart-summary">
              <h5 className="cart-title mb-3">Your tickets:</h5>
              <p className="mb-2">
                <strong>Ticket Price:</strong> ${totalPrice.toFixed(2)}
              </p>
              <small className="text-muted d-block mb-3">
                ({quantity} tickets × ${ticketPrice.toFixed(2)})
              </small>
              <hr />
              <h5 className="mb-3">Total: ${totalPrice.toFixed(2)}</h5>
              <button className="btn btn-buy w-100">
                BUY TICKETS <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
