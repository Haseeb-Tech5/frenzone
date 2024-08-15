import React, { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setAdminId } from "../../Redux/userSlice";
import "./employee.css";
import emailIcon from "../../Assets-admin/message.svg";
import mort from "../../Assets-admin/mort-crop.png";
import logo from "../../Assets-admin/logo-fren.svg";
import Icon7 from "../../Icon/Icon7";

const LoginEmployee = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized Access",
        text: errors.email || errors.password,
      });
      return;
    }
    const requestData = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch(
        "https://api.frenzone.live/auth/loginAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        dispatch(setAdminId(data.adminId));
        localStorage.setItem("adminId", data.adminId);
        sessionStorage.setItem("adminId", data.adminId);
        console.log(data.adminId, "data.adminId");
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
    <div className="employee-container">
      <div className="employee-left">
        <div className="form-heading-flux-content">
          <div className="form-heading">
            <h2>
              Get in{" "}
              <span
                style={{
                  color: "#FF9700",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  fontFamily: "inherit",
                }}
              >
                Touch
              </span>
            </h2>
          </div>
          <div className="para-touch">
            <p>Enter your Email and Password to Log In!</p>
          </div>
          <div className="input-imgage-flux">
            <div className="input-controller">
              <label htmlFor="message">Email Id</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-img-controller">
              <img src={emailIcon} alt="" />
            </div>
          </div>
          <div className="input-imgage-flux">
            <div className="input-controller">
              <label htmlFor="message">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-img-controller">
              <Icon7 />
            </div>
          </div>
          <div className="button-contained">
            <button onClick={handleLogin}>Log in</button>
          </div>
        </div>
      </div>
      <div className="employee-right">
        <div className="employee-right-full">
          <div className="fenzone-log">
            <img src={logo} alt="" />
          </div>
          <div className="img-mokup-contained">
            <img src={mort} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEmployee;
