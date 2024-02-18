import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// @mui
import Grid from "@mui/material/Grid";
// react icons
import { MdHome } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { IoMdPerson } from "react-icons/io";
import { FaFileInvoice } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { BsPersonBadgeFill } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import WebChatModal from "../components/WebChatModal";
import Icon1 from "../Icon/Icon1";
import Icon2 from "../Icon/Icon2";
import "../pages/employee/employee.css";

const Employee = ({ children }) => {
  const [activeItem, setActiveItem] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let activePage = window.location.href.split("/")[4];
    if (activePage.includes("-")) {
      activePage = activePage.replace(/-/g, " ");
    }
    console.log("active Page", activePage);
    setActiveItem(activePage);
    console.log("activeItem", activeItem);
  }, [activeItem]);
  return (
    <div className="flex ">
      <aside className="hidden md:block min-w-[280px] w-[280px] py-8 h-[100vh] bg-[black] ">
        <Grid
          item
          xs={12}
          align="center"
          className="fixed  w-[280px] bg-[black] h-[100vh]"
        >
          <div className="w-[100%]  border-b-[2px] border-[#ff9700] h-[150px] flex items-center justify-center -mt-[20px]">
            <Icon1 />
          </div>
          <div className="mt-10 pl-8">
            <Link to="/employee/dashboard" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "dashboard"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("dashboard")}
              >
                <MdHome
                  className={`text-[24px] ${
                    activeItem == "dashboard"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "dashboard"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Dashboard
                </span>
              </div>
            </Link>
            <Link to="/employee/reports" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "reports" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("reports")}
              >
                <SiGoogleanalytics
                  className={`text-[24px] ${
                    activeItem == "reports" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "reports"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  BroadCast
                </span>
              </div>
            </Link>
            <Link
              to="/employee/manage-profile"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "manage profile"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("manage profile")}
              >
                <IoMdPerson
                  className={`text-[24px] ${
                    activeItem == "manage profile"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "manage profile"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Manage Profile
                </span>
              </div>
            </Link>

            <Link
              to="/employee/manage-orders"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "manage orders"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("manage orders")}
              >
                <FaFileInvoice
                  className={`text-[24px] ${
                    activeItem == "manage orders"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "manage orders"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Manage Orders
                </span>
              </div>
            </Link>
            <Link
              to="/employee/appointment-calendar"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "appointment calendar"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("appointment calendar")}
              >
                <MdOutlineCalendarMonth
                  className={`text-[24px] ${
                    activeItem == "appointment calendar"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "appointment calendar"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Appointment Calendar
                </span>
              </div>
            </Link>
            <Link to="/employee/profile" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "profile" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("profile")}
              >
                <BsPersonBadgeFill
                  className={`text-[24px] ${
                    activeItem == "profile" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "profile"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Profile
                </span>
              </div>
            </Link>
          </div>
          {/* <div className="text-center mt-16 flex justify-center -ml-8">
            <div
              className="rounded-full bg-[#ff9700] p-4 w-16 h-16 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <BiMessageDetail className="text-[32px]" />
            </div>
            <WebChatModal setOpenModal={setOpen} modalOpen={open} />
          </div> */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="text-center mt-6 flex justify-center">
              <button className="Btn">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div class="text">Log out</div>
              </button>
            </div>
          </Link>
        </Grid>
      </aside>
      <header className="flex z-[99999] md:hidden fixed bg-white shadow-md flex items-center w-[100vw] py-3 px-4 justify-between">
        {/* <img
          src={require("../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png")}
          width="120px"
          alt="logo"
        /> */}
        <Icon2 />
        <GiHamburgerMenu
          className="text-[25px]"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        />
      </header>
      <nav
        className={`sidebar  ${isSidebarOpen ? "open" : ""}`}
        style={{ backgroundColor: "black" }}
      >
        <Grid
          item
          xs={12}
          align="center"
          className="fixed w-[280px] bg-[black]"
        >
          <div className="w-[100%]  border-b-[2px] border-[#ff9700] h-[150px] flex items-center justify-center">
            <Icon1 />
          </div>
          <div className="mt-10 pl-8">
            <Link to="/employee/dashboard" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "dashboard"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("dashboard")}
              >
                <MdHome
                  className={`text-[24px] ${
                    activeItem == "dashboard"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "dashboard"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Dashboard
                </span>
              </div>
            </Link>
            <Link to="/employee/reports" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "reports" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("reports")}
              >
                <SiGoogleanalytics
                  className={`text-[24px] ${
                    activeItem == "reports" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "reports"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Reports
                </span>
              </div>
            </Link>
            <Link
              to="/employee/manage-profile"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "manage profile"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("manage profile")}
              >
                <IoMdPerson
                  className={`text-[24px] ${
                    activeItem == "manage profile"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "manage profile"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Manage Profile
                </span>
              </div>
            </Link>

            <Link
              to="/employee/manage-orders"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "manage orders"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("manage orders")}
              >
                <FaFileInvoice
                  className={`text-[24px] ${
                    activeItem == "manage orders"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "manage orders"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Manage Orders
                </span>
              </div>
            </Link>
            <Link
              to="/employee/appointment-calendar"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "appointment calendar"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("appointment calendar")}
              >
                <MdOutlineCalendarMonth
                  className={`text-[24px] ${
                    activeItem == "appointment calendar"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "appointment calendar"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Appointment Calendar
                </span>
              </div>
            </Link>
            <Link to="/employee/profile" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "profile" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("profile")}
              >
                <BsPersonBadgeFill
                  className={`text-[24px] ${
                    activeItem == "profile" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "profile"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Profile
                </span>
              </div>
            </Link>
          </div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="text-center mt-6 flex justify-center">
              <button className="Btn">
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                  </svg>
                </div>
                <div class="text">Log out</div>
              </button>
            </div>
          </Link>
        </Grid>
      </nav>
      <div className="w-[100%] mt-8 md:mt-0 ">{children}</div>
    </div>
  );
};

export default Employee;
