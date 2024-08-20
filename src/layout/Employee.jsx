import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { SiGoogleanalytics } from "react-icons/si";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineEditCalendar } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import Icon1 from "../Icon/Icon1";
import Icon2 from "../Icon/Icon2";
import "../pages/employee/employee.css";
import { useDispatch } from "react-redux";
import { clearAdminId } from "../Redux/userSlice";
import { BiMoneyWithdraw } from "react-icons/bi";
import { ImBlocked } from "react-icons/im";
import { FaHandHoldingDollar } from "react-icons/fa6";
const Employee = ({ children }) => {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname.split("/").pop();
    if (pathname === "detailed") {
      setActiveItem("dashboard");
    } else {
      setActiveItem(pathname);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    sessionStorage.removeItem("adminId");
    dispatch(clearAdminId());
    window.location.href = "/";
  };
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
                <IoMdPerson
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
                  Manage Profile
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
            <Link to="/employee/version" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "version" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("version")}
              >
                <MdOutlineEditCalendar
                  className={`text-[24px] ${
                    activeItem == "version" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "version"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Version Control
                </span>
              </div>
            </Link>{" "}
            <Link to="/employee/withdrawals" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "withdrawals"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("withdrawals")}
              >
                <BiMoneyWithdraw
                  className={`text-[24px] ${
                    activeItem == "withdrawals"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "withdrawals"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Withdrawals
                </span>
              </div>
            </Link>{" "}
            <Link
              to="/employee/adultcontent"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "adultcontent"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("adultcontent")}
              >
                <ImBlocked
                  className={`text-[24px] ${
                    activeItem == "adultcontent"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "adultcontent"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Adult content
                </span>
              </div>
            </Link>{" "}
            <Link
              to="/employee/companyprofit"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "companyprofit"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("companyprofit")}
              >
                <FaHandHoldingDollar
                  className={`text-[24px] ${
                    activeItem == "companyprofit"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "companyprofit"
                      ? "text-[white] font-[700]"
                      : "text-[#A3AED0] font-[500]"
                  }`}
                >
                  Company Profit
                </span>
              </div>
            </Link>
          </div>
          <div className="text-center mt-6 flex justify-center">
            <button className="Btn" onClick={handleLogout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div class="text">Log out</div>
            </button>
          </div>
        </Grid>
      </aside>
      <header className="flex z-[99999] md:hidden fixed bg-white shadow-md flex items-center w-[100vw] py-3 px-4 justify-between">
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
                <IoMdPerson
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
                  Manage Profile
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
                  BroadCast
                </span>
              </div>
            </Link>
            <Link to="/employee/version" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "version" ? "border-r-2 border-r-[#ff9700]" : ""
                }`}
                onClick={() => setActiveItem("version")}
              >
                <MdOutlineEditCalendar
                  className={`text-[24px] ${
                    activeItem == "version" ? "text-[#ff9700]" : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "version"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Version Control
                </span>
              </div>
            </Link>{" "}
            <Link to="/employee/withdrawals" style={{ textDecoration: "none" }}>
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "withdrawals"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("withdrawals")}
              >
                <BiMoneyWithdraw
                  className={`text-[24px] ${
                    activeItem == "withdrawals"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "withdrawals"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Withdrawals
                </span>
              </div>
            </Link>{" "}
            <Link
              to="/employee/adultcontent"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "adultcontent"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("adultcontent")}
              >
                <ImBlocked
                  className={`text-[24px] ${
                    activeItem == "adultcontent"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "adultcontent"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Adult content
                </span>
              </div>
            </Link>{" "}
            <Link
              to="/employee/companyprofit"
              style={{ textDecoration: "none" }}
            >
              <div
                className={`flex items-center w-[100%] my-8 ${
                  activeItem == "companyprofit"
                    ? "border-r-2 border-r-[#ff9700]"
                    : ""
                }`}
                onClick={() => setActiveItem("companyprofit")}
              >
                <FaHandHoldingDollar
                  className={`text-[24px] ${
                    activeItem == "companyprofit"
                      ? "text-[#ff9700]"
                      : "text-[white]"
                  }`}
                />
                <span
                  className={`text-[16px] ml-3 ${
                    activeItem == "companyprofit"
                      ? "text-[white] font-[700] text-[17px]"
                      : "text-[#5b5c5ff8] font-[600]"
                  }`}
                >
                  Company Profit
                </span>
              </div>
            </Link>
          </div>
          <div className="text-center mt-6 flex justify-center">
            <button className="Btn" onClick={handleLogout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <div class="text">Log out</div>
            </button>
          </div>
        </Grid>
      </nav>
      <div className="w-[100%] mt-8 md:mt-0 ">{children}</div>
    </div>
  );
};

export default Employee;
