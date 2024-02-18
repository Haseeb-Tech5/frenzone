// import React from "react";
// import { Link } from "react-router-dom";
// import Grid from "@mui/material/Grid";
// import { FaEye } from "react-icons/fa";

// const LoginEmployee = () => {
//   return (
//     <Grid container xs={12}>
//       <Grid
//         item
//         lg={7}
//         md={6}
//         xs={12}
//         align="center"
//         className="min-h-[100vh] items-center w-full justify-center px-16 sm:px-32 py-20"
//       >
//         <div className="self-center">
//           <img
//             src={require("../../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png")}
//             width="250px"
//             alt="logo"
//           />
//           <Grid item xs={12} align="left" className="pt-12">
//             <h2 className="mt-8 text-[36px] font-[700] -tracking-[0.72px] leading-[56px]">
//               Login as Employee
//             </h2>
//             <p className="text-[#A3AED0] text-[16px] font-[400] mt-4">
//               Enter your email and password to log in!
//             </p>
//             <div className="mt-12">
//               <p className="text-[14px] font-[500] -tracking-[0.28px]">
//                 Email*
//               </p>
//               <input
//                 className="rounded-md px-4 py-4 w-[100%] border border-[#E0E2E7] mt-4"
//                 type="email"
//                 placeholder="mail@example.com"
//               />
//             </div>
//             <div className="mt-8">
//               <p className="text-[14px] font-[500] -tracking-[0.28px]">
//                 Password*
//               </p>
//               <div className="flex items-center">
//                 <input
//                   className="rounded-md px-4 py-4 w-[100%] border border-[#E0E2E7] mt-4"
//                   type="password"
//                   placeholder="Min 8 charachters"
//                 />
//                 <div className="w-0 h-0">
//                   <FaEye className="text-[#E0E2E7] relative -left-[45px] -top-[5px] text-[25px]" />
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center w-[100%] justify-between mt-4">
//               <div className="self-center">
//                 <input
//                   type="checkbox"
//                   class="accent-[#FFE11B] w-5 h-5 rounded-lg relative top-1"
//                   checked
//                 />
//                 <span className="text-[#A3AED0] ml-2 text-[15px] font-[400] leading-[20px]">
//                   Keep me logged in
//                 </span>
//               </div>
//               <div className="self-center">
//                 <p className="text-[#FFE11B] text-[14px]">Forgot password?</p>
//               </div>
//             </div>
//             <div className="text-center mt-20">
//               <Link to="/employee/dashboard">
//                 <button className="rounded-md border-[#FFE11B] bg-[#FFE11B] text-[#292828] w-[100%] py-6 font-[600]">
//                   Log in
//                 </button>
//               </Link>
//             </div>
//           </Grid>
//         </div>
//       </Grid>
//       <Grid item lg={5} md={6} xs={0} className="hidden md:flex">
//         <img
//           src={require("../../assets/Image.png")}
//           alt=""
//           className="h-[100vh] w-full"
//         />
//       </Grid>
//     </Grid>
//   );
// };

// export default LoginEmployee;
import React, { useState } from "react";
import "./employee.css";
import { Modal, Button, Form } from "react-bootstrap";
import name from "../../Assets-admin/Name.svg";
import phone from "../../Assets-admin/phone.svg";
import admin from "../../Assets-admin/admin.svg";
import message from "../../Assets-admin/message.svg";
import { Link } from "react-router-dom";
import mort from "../../Assets-admin/mort-crop.png";
import logo from "../../Assets-admin/logo-fren.svg";
import Icon7 from "../../Icon/Icon7";
import Icon5 from "../../Icon/Icon5";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginEmployee = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
  });

  const correctUsername = "admin";
  const correctEmail = "admin@gmail.com";
  const correctPassword = "admin123";

  const handleLogin = () => {
    const errors = {};

    if (username !== correctUsername) {
      errors.username = "Username is incorrect";
    }

    if (email !== correctEmail) {
      errors.email = "Email is incorrect";
    }

    if (password !== correctPassword) {
      errors.password = "Password is incorrect";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      setShowModal(true);
    } else {
      window.location.href = "/employee/dashboard";
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
            <p>Enter your Username, Email, and Password to Log In!</p>
          </div>
          <div className="input-imgage-flux">
            <div className="input-controller ">
              <label htmlFor="message">User Name</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-img-controller">
              <Icon5 />
            </div>
          </div>
          <div className="input-imgage-flux">
            <div className="input-controller ">
              <label htmlFor="message">Email Id</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-img-controller">
              <img src={message} alt="" />
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

      {/* Modal for Unauthorized Access */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unauthorized Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.values(errorMessages).map((errorMessage, index) => (
            <p key={index}>{errorMessage}</p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginEmployee;
