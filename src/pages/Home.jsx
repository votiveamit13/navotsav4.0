import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const targetDate = new Date("2025-12-20T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div
      className="bg-dark text-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="position-fixed d-flex align-items-center"
        style={{
          bottom: "95px",
          right: "45px",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >

        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="fw-bold"
          style={{ color: "#ffcc00", fontSize: "18px", textShadow: "0 0 10px #ffcc00" }}
        >
          Limited Seats!
        </motion.span>
      </motion.div>

      <motion.a
        href="/event-detail"
        whileHover={{ scale: 1.15, rotateZ: -5 }}
        whileTap={{ scale: 0.95 }}
        className="position-fixed"
        style={{
          bottom: "25px",
          right: "25px",
          zIndex: 9999,
          padding: "15px 30px",
          borderRadius: "50px",
          fontWeight: "bold",
          background:
            "linear-gradient(135deg, #ffcc00 0%, #ff8800 100%)",
          boxShadow: "0 10px 30px rgba(255, 200, 0, 0.4)",
          color: "#000",
          transform: `translateZ(50px)`,
        }}
      >
        Book Now
      </motion.a>

      <section
        id="hero"
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "90vh",
          background: "linear-gradient(130deg, #0a0a0a, #111, #050505)",
          position: "relative",
          overflow: "hidden",
          perspective: "1000px",
          marginTop: "-150px",
        }}
      >
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="particle"
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth - 200,
              y: Math.random() * window.innerHeight - 200,
              scale: Math.random() * 0.6 + 0.3,
            }}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              y: "-=100",
              x: "+=50",
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 6 + 4,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              background:
                ["#ffcc00", "#ff8800", "#ff0000"].sort(() => 0.5 - Math.random())[0],
              borderRadius: "50%",
              filter: "blur(1px)",
            }}
          />
        ))}

        <motion.div
          style={{
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            position: "absolute",
            top: "-10%",
            left: "-5%",
            opacity: 0.09,
            background:
              "radial-gradient(circle, #ff0000ff 0%, transparent 70%)",
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />

        <motion.div
          style={{
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            opacity: 0.07,
            background:
              "radial-gradient(circle, #ff0000ff 0%, transparent 70%)",
            transform: `translateY(${scrollY * -0.2}px)`,
          }}
        />
        <motion.div
          className="position-absolute d-flex align-items-center justify-content-center w-100"
          style={{ top: "25%", zIndex: 5 }}
        >
          <motion.img
            src="/images/maan.png"
            style={{
              width: "160px",
              height: "160px",
              objectFit: "contain",
            }}
            initial={{ x: -350, opacity: 0 }}
            animate={{
              x: [-350, 0, 500],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.2,
              times: [0, 0.5, 1],
              ease: ["easeOut", "linear", "easeIn"],
            }}
          />

          <motion.img
            src="/images/phoenix.png"
            style={{
              width: "160px",
              height: "160px",
              objectFit: "contain",
            }}
            initial={{ x: 350, opacity: 0 }}
            animate={{
              x: [350, 0, -500],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.2,
              times: [0, 0.5, 1],
              ease: ["easeOut", "linear", "easeIn"],
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.2 }}
          style={{ transform: `translateZ(80px)` }}
        >
          <motion.h1
            className="display-1 fw-bold mb-3"
            style={{
              background:
                "linear-gradient(90deg, #ffcc00, #ff0000ff, #ffcc00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
              animation: "gradientMove 4s linear infinite",
              textShadow: "0 0 40px rgba(255, 200, 0, 0.3)",
            }}
          >
            NAVOTSAV 4.0
          </motion.h1>

          <p className="fs-4 text-secondary">
            A grand fusion of comedy, storytelling, music & electrifying DJ night
          </p>
        </motion.div>

<div
  className="w-100 position-absolute"
  style={{ bottom: "10%", paddingBottom: "20px" }}
>
  {/* DESKTOP VIEW */}
  <div className="d-none d-md-flex justify-content-center gap-5">
    {[
      "/images/apporv.webp",
      "/images/ranmaljain.jpg",
      "/images/kabirstudio.jpg",
      "/images/djbunny.avif",
    ].map((img, i) => (
      <motion.img
        key={i}
        src={img}
        className="rounded shadow"
        style={{
          width: "130px",
          height: "130px",
          objectFit: "cover",
          border: "3px solid #ffcc00",
          borderRadius: "15px",
          transform: `translateY(${scrollY * 0.1}px) translateZ(50px)`,
        }}
        whileHover={{ scale: 1.2, rotateY: 15, rotateX: 5 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2, duration: 0.8 }}
      />
    ))}
  </div>

  {/* MOBILE VIEW */}
{/* MOBILE AUTO-SCROLL VERSION */}
<div className="d-block d-md-none position-absolute w-100" style={{ bottom: "50%" }}>
  <div className="scroll-container">
    <div className="scroll-track">
      {[ 
        "/images/apporv.webp",
        "/images/ranmaljain.jpg",
        "/images/kabirstudio.jpg",
        "/images/djbunny.avif",
      ]
        // duplicate array to create infinite loop
        .concat([
          "/images/apporv.webp",
          "/images/ranmaljain.jpg",
          "/images/kabirstudio.jpg",
          "/images/djbunny.avif",
        ])
        .map((img, i) => (
          <img
            key={i}
            src={img}
            className="scroll-img"
          />
        ))}
    </div>
  </div>
</div>


  {/* AUTO SCROLL KEYFRAMES */}
  <style>
    {`
.scroll-container {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.scroll-track {
  display: flex;
  gap: 20px;
  animation: scroll 5s linear infinite;
}

.scroll-img {
  width: 100%;
  max-width: 100%;
  height: 150px;
  object-fit: cover;
  border: 3px solid #ffcc00;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transform: perspective(300px) rotateY(-8deg);
}

/* Infinite scroll keyframes */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

    `}
  </style>
</div>

      </section>

      <section id="artists" className="container py-5 text-center">
        <h2 className="display-5 fw-bold text-warning mb-4">
          Featured Artists
        </h2>

        <div className="row g-4 justify-content-center">
          {[
            { name: "Appurva Gupta – Standup Comedian", img: "/images/apporv.webp" },
            { name: "Ranmal Jain – Storyteller", img: "/images/ranmaljain.jpg" },
            { name: "Kabir Studio – Soulful Sufi Band", img: "/images/kabirstudio.jpg" },
            { name: "DJ Bunny & Team", img: "/images/djbunny.avif" },
          ].map((item, i) => (
            <div key={i} className="col-10 col-md-5 col-lg-3">
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotateY: 15,
                  rotateX: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
                className="p-3 rounded-4 shadow-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  transformStyle: "preserve-3d",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <img
                  src={item.img}
                  className="img-fluid rounded mb-3"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                />
                <h5 className="fw-bold text-warning">{item.name}</h5>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="event"
        className="text-center py-5"
        style={{
          background: "linear-gradient(180deg, #000 20%, #111 80%)",
          perspective: "800px",
        }}
      >
        <motion.h2
          className="display-5 fw-bold text-warning mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Event Date
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, rotateX: -90 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 1 }}
          className="display-2 fw-bold"
          style={{ transformOrigin: "top center" }}
        >
          20 December 2025
        </motion.h1>

        <p className="fs-4 mt-3 text-secondary">
          Venue: <span className="text-warning">Phoenix Citadel, Indore</span>
        </p>
        <p>Come & Enjoy • Commercial Apply</p>
      </section>

      <section className="container text-center py-5">
        <h2 className="fw-bold text-warning mb-4 display-5">
          Why Attend NAVOTSAV 4.0?
        </h2>

        <p className="text-secondary mb-5 fs-5">
          An unforgettable evening of entertainment, energy and celebration.
        </p>

        <div className="row g-4 justify-content-center">
          {[
            { icon: "bi bi-star-fill", title: "Star Performers", desc: "Top comedians, storytellers & musicians." },
            { icon: "bi bi-music-note-beamed", title: "3+ Hours Non-stop Fun", desc: "Comedy, storytelling, music & DJ night." },
            { icon: "bi bi-people-fill", title: "Massive Audience", desc: "Join thousands of excited attendees." },
            { icon: "bi bi-lightning-charge-fill", title: "Electrifying Energy", desc: "Sound, lights & vibes like never before." },
          ].map((item, i) => (
            <div className="col-10 col-md-6 col-lg-3" key={i}>
              <motion.div
                whileHover={{
                  scale: 1.07,
                  rotateY: 10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-3 rounded-4 shadow-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <i className={`${item.icon} display-4 text-warning`}></i>
                <h5 className="mt-3 fw-bold text-warning">{item.title}</h5>
                <p className="text-secondary small">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5 text-center" style={{ background: "#080808" }}>
        <h2 className="text-warning fw-bold mb-4 display-6">
          Countdown to NAVOTSAV 4.0
        </h2>

        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="p-3 rounded-4 shadow text-center"
              style={{
                width: "120px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
              }}
            >
              <h1 className="text-warning fw-bold">{item.value}</h1>
              <small className="text-secondary">{item.label}</small>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="artists" className="container py-5 text-center">
        <h2 className="display-5 fw-bold text-warning mb-4">
          Our Sponsors
        </h2>

        <div className="row g-4 justify-content-center">
          {[
            { name: "Sponsor Name", img: "/images/unnamed.webp" },
            { name: "Sponsor Name", img: "/images/unnamed.webp" },
            { name: "Sponsor Name", img: "/images/unnamed.webp" },
            { name: "Sponsor Name", img: "/images/unnamed.webp" },
          ].map((item, i) => (
            <div key={i} className="col-10 col-md-5 col-lg-3">
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotateY: 15,
                  rotateX: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
                className="p-3 rounded-4 shadow-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(12px)",
                  transformStyle: "preserve-3d",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <img
                  src={item.img}
                  className="img-fluid rounded mb-3"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                />
                <h5 className="fw-bold text-warning">{item.name}</h5>
              </motion.div>
            </div>
          ))}
        </div>
      </section>




      {/* KEYFRAMES */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
              .particle {
      pointer-events: none;
    }
      `}</style>
    </div>
  );
}
