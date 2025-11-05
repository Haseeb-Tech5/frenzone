import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SiGoogleanalytics } from "react-icons/si";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineEditCalendar, MdOutlineReportProblem } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { ImBlocked } from "react-icons/im";
import { FaHandHoldingDollar, FaMoneyBillTransfer } from "react-icons/fa6";
import Icon1 from "../Icon/Icon1";
import { clearAdminId } from "../Redux/userSlice";
import "./employee.css";
import { MdOutlineReviews } from "react-icons/md";
import { MdAssessment } from "react-icons/md";

const Employee = ({ children }) => {
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Menu items array for dynamic rendering
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashbaord",
      route: "/frenzone/dashboard",
      icon: <MdAssessment className="emp-nav-icon" />,
    },
    {
      id: "user-management",
      label: "User Management",
      route: "/frenzone/user-management",
      icon: <IoMdPerson className="emp-nav-icon" />,
    },
    {
      id: "reports",
      label: "BroadCast",
      route: "/frenzone/reports",
      icon: <SiGoogleanalytics className="emp-nav-icon" />,
    },
    {
      id: "version",
      label: "Version Control",
      route: "/frenzone/version",
      icon: <MdOutlineEditCalendar className="emp-nav-icon" />,
    },
    {
      id: "review",
      label: "Reviews",
      route: "/frenzone/review",
      icon: <MdOutlineReviews className="emp-nav-icon" />,
    },
    // {
    //   id: "withdrawals",
    //   label: "Withdrawals",
    //   route: "/frenzone/withdrawals",
    //   icon: <BiMoneyWithdraw className="emp-nav-icon" />,
    // },
    {
      id: "adultcontent",
      label: "Suspicious Posts",
      route: "/frenzone/adultcontent",
      icon: <ImBlocked className="emp-nav-icon" />,
    },
    {
      id: "companyprofit",
      label: "Company Profit",
      route: "/frenzone/companyprofit",
      icon: <FaHandHoldingDollar className="emp-nav-icon" />,
    },
    {
      id: "transactions",
      label: "Transactions",
      route: "/frenzone/transactions",
      icon: <FaMoneyBillTransfer className="emp-nav-icon" />,
    },
    {
      id: "totalreports",
      label: "Reported Posts",
      route: "/frenzone/totalreports",
      icon: <MdOutlineReportProblem className="emp-nav-icon" />,
    },
  ];

  useEffect(() => {
    const pathname = location.pathname.split("/").pop();
    if (pathname === "detailed") {
      setActiveItem("dashboard");
    } else if (pathname === "sensitivereels") {
      setActiveItem("adultcontent");
    } else {
      setActiveItem(pathname);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("token");
    sessionStorage.removeItem("adminId");
    dispatch(clearAdminId());
    window.location.href = "/";
  };

  return (
    <div className="emp-container">
      <aside
        className={`emp-sidebar ${isSidebarOpen ? "emp-sidebar-open" : ""}`}
      >
        <div className="emp-sidebar-inner">
          <div className="emp-logo-container">
            <Icon1 />
          </div>
          <div className="emp-nav-list">
            {menuItems.map((item) => (
              <Link key={item.id} to={item.route} className="emp-nav-link">
                <div
                  className={`emp-nav-item ${
                    activeItem === item.id ? "emp-nav-item-active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after click
                  }}
                >
                  {item.icon}
                  <span className="emp-nav-text">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="emp-logout-container">
            <button className="emp-logout-btn" onClick={handleLogout}>
              <div className="emp-logout-icon">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>
              <span className="emp-logout-text">Log out</span>
            </button>
          </div>
        </div>
      </aside>
      <header className="emp-header">
        <GiHamburgerMenu
          className="emp-hamburger-icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        />
      </header>
      <div className="emp-content">{children}</div>
    </div>
  );
};

export default Employee;
