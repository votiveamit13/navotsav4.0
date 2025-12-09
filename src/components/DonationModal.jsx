import { useState } from "react";

const DonationModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    emailid: "",
    phone: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    if (!form.name || !form.emailid || !form.phone || !form.amount) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    // Step 1: Create Order
    const createOrder = await fetch(
      `${import.meta.env.VITE_BASE_URL}/donation/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: 1,
          name: form.name,
          emailid: form.emailid,
          phone: form.phone,
          amount: Number(form.amount),
        }),
      }
    );

    const orderData = await createOrder.json();

    if (!orderData.success) {
      setLoading(false);
      alert("Failed to create order!");
      return;
    }

    const options = {
      key: orderData.key,
      amount: form.amount * 100,
      currency: "INR",
      name: "Event Donation",
      description: "Donation Payment",
      order_id: orderData.orderId,
handler: async function (response) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/donation/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...response,
      event_id: 1,
      name: form.name,
      emailid: form.emailid,
      phone: form.phone,
      amount: form.amount,
    }),
  });

  alert("Thank you! Your donation was successful.");

        setOpen(false);
        setLoading(false);
      },
      prefill: {
        name: form.name,
        email: form.emailid,
        contact: form.phone,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div 
      className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}
    >
      <div className="bg-white rounded modal-dialog custom-modal-width">


        <div className="modal-content p-3 rounded shadow-lg">
          <h4 className="mb-3 text-center">Donate Now</h4>

          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            onChange={handleChange}
          />

          <input
            name="emailid"
            type="email"
            className="form-control mb-2"
            placeholder="Email ID"
            onChange={handleChange}
          />

          <input
            name="phone"
            className="form-control mb-2"
            placeholder="Mobile Number"
            onChange={handleChange}
          />

          <input
            name="amount"
            type="number"
            min="1"
            className="form-control mb-2"
            placeholder="Amount to Donate"
            onChange={handleChange}
          />

          <button 
            className="btn btn-success w-100 mt-2 d-flex justify-content-center align-items-center"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? (
              <div 
                className="spinner-border spinner-border-sm text-light"
                role="status"
              ></div>
            ) : (
              "Pay Now"
            )}
          </button>

          <button 
            className="btn btn-danger w-100 mt-2" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
