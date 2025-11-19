import { useState } from "react";
import "../assets/css/contact.css";
import { contactLead } from "../services/WebService";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number.";

    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    let payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      body: formData.message,
    };

    try {
      const res = await contactLead(payload);
      toast.success("Thankyou for contacting us..");
      console.log("Form submitted successfully", formData);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.errors[0]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-header banner-top-add">
        <div className="container">
          <h1>Contact</h1>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <p className="get-started-text mb-1">
            <i className="bi bi-trophy"></i> Get Started
          </p>
          <h2 className="mb-4">
            Get In Touch With Us.
            <br />
            We’re Here To Assist You.
          </h2>

          <form className="contact-us-form" onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                name="message"
                className={`form-control ${errors.message ? "is-invalid" : ""}`}
                rows="3"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {errors.message && (
                <div className="invalid-feedback">{errors.message}</div>
              )}
            </div>

            <div className="leave-us-message pt-2">
              <button type="submit" className="btn btn-pink">
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Sending...
                  </>
                ) : (
                  <>
                    LEAVE US A MESSAGE <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
