'use client';
import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/slices/userSlice"; // ✅ Redux
import { signIn, resetPassword } from "../auth/authFunctions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/login.css";
import { useSelector } from 'react-redux';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = getAuth();

  // Get the user and token from Redux state
  const user = useSelector((state) => state.user.currentUser);
  const token = useSelector((state) => state.user.token);

  // If user is logged in and token exists, redirect to dashboard
  useEffect(() => {
    if (user && token) {
      router.push("/dashboard");
    }
  }, [user, token]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn(email, password); // This is already the user with token
  
      if (!response || !response.email) {
        alert("Login failed: User not found.");
        return;
      }
  
      dispatch(loginUser({
        user: {
          email: response.email,
          uid: response.uid,
        },
        token: response.token,
      }));
  
      router.push("/dashboard");
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  };
  

  // Handle password reset
  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await resetPassword(email);
      alert("Password reset email sent. Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="left-panel">
        <h1 className="title">AgriTech Login</h1>
        <p className="motivation-text">
          Empowering Farmers with Smart Agriculture Tools to boost productivity and efficiency.
        </p>
        <img src="/hero_4.jpg" alt="Farming Illustration" className="image" />
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="login-form">
          <h2 className="form-title">Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">Login</button>

            <div className="forgot-password-wrapper">
              <button
                type="button"
                className="forgot-password-button"
                onClick={handleResetPassword}
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <p className="signup-link">
            Don’t have an account?{" "}
            <Link href="/signup" className="signup-text">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
