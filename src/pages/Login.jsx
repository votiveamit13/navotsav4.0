// src/pages/LoginPage.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider, appleProvider } from "../firebase";
import { requestDeviceToken } from "../utils/notifications.js";

const Login = () => {
  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      console.log("User:", user);
      console.log("ID Token:", idToken);

      // 🔹 Send ID Token to Laravel backend
      await fetch("http://localhost:8000/api/auth/social-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      // 🔹 Register device for push notifications
      requestDeviceToken(idToken);

    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <button 
          className="btn btn-outline-danger mb-2 w-100"
          onClick={() => handleLogin(googleProvider)}
        >
          <i className="bi bi-google me-2"></i> Sign in with Google
        </button>

        <button 
          className="btn btn-outline-primary mb-2 w-100"
          onClick={() => handleLogin(facebookProvider)}
        >
          <i className="bi bi-facebook me-2"></i> Sign in with Facebook
        </button>

        <button 
          className="btn btn-outline-dark w-100"
          onClick={() => handleLogin(appleProvider)}
        >
          <i className="bi bi-apple me-2"></i> Sign in with Apple
        </button>
      </div>
    </div>
  );
}

export default Login;
