import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsapp() {
  const [isVisible, setIsVisible] = useState(true);
  const phoneNumber = "9589847113";
  const message = "Hello, I would like to know more about your events!";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  // Optional: Hide on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
// In your current FloatingWhatsapp component, update to:
<a
  href={whatsappURL}
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-24 right-6 z-[100000] bg-green-500 text-black p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110"
  style={{
    bottom: '100px',
    right: '25px',
    zIndex: 100000, // Higher than Book Now button
  }}
>
  <FaWhatsapp size={30} />
</a>
  );
}