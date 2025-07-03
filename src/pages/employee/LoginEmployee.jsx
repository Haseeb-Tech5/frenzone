import React, { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setAdminId } from "../../Redux/userSlice";
import "./login.css";
import emailIcon from "../../Assets-admin/message.svg";
import logo from "../../Assets-admin/logo-fren.svg";

const LoginEmployee = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized Access",
        text: errors.email || errors.password,
      });
      return;
    }
    const requestData = { email, password };
    try {
      const response = await fetch(
        "https://api.frenzone.live/auth/loginAdmin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        dispatch(setAdminId(data.adminId));
        localStorage.setItem("adminId", data.adminId);
        sessionStorage.setItem("adminId", data.adminId);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to your dashboard...",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/employee/dashboard";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unauthorized Access",
          text: data.error || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Frenzone Logo" />
        </div>
        <h2 className="login-heading">
          Welcome <span>Back</span>
        </h2>
        <p className="login-subheading">Log in to your account</p>
        <div className="login-input-group">
          <label htmlFor="email">Email</label>
          <div className="login-input-wrapper">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
            {/* <img
              src={emailIcon}
              alt="Email Icon"
              className="login-input-icon"
            /> */}
          </div>
        </div>
        <div className="login-input-group">
          <label htmlFor="password">Password</label>
          <div className="login-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="login-toggle-password"
            >
              {showPassword ? (
                <svg
                  className="login-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="login-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button onClick={handleLogin} className="login-button">
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginEmployee;
