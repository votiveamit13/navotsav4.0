import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  const phoneNumber = "9589847113"; // <--- replace with your WhatsApp number
  const message = "Hello, I would like to know more about your events!";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
<a
  href={whatsappURL}
  target="_blank"
  rel="noopener noreferrer"
  className="fixed top-6 right-6 z-[999999] bg-green-500 text-black p-4 rounded-full shadow-lg hover:bg-green-600 transition-all"
>
  <FaWhatsapp size={30} />
</a>


  );
}
