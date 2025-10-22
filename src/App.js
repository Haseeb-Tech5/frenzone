import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import Loader from "./components/Loader/Loader.jsx";
import LoginEmployee from "./pages/employee/LoginEmployee";
import DashboardEmployee from "./pages/employee/DashboardEmployee";
import ReportsEmployee from "./pages/employee/ReportsEmployee";
import ManageOrdersEmployee from "./pages/employee/ManageOrdersEmployee";
import AppointmentCalendarEmployee from "./pages/employee/AppointmentCalendarEmployee";
import ProfileEmployee from "./pages/employee/ProfileEmployee";
import ManageProfile from "./pages/employee/ManageProfile";
import DetailedPage from "./DetailedPage/DetailedPage";
import VersionControl from "./pages/employee/VersionControl";
import Drwal from "./components/withdrawals/Drwal.jsx";
import AdultContent from "./components/AdultContent/AdultContent.jsx";
import CompanyProfit from "./components/CompanyProfit/CompanyProfit.jsx";
import AdultReels from "./components/AdultContent/Adultrell/AdultReels.jsx";
import ReviewContentPage from "./components/ReviewContent/ReviewContentPage.jsx";
import DashboardOverview from "./components/DashboardOverview/DashboardOverview.jsx";
import "./App.css";
import Employee from "./layout/Employee.jsx";
import Transcations from "./pages/Transcations.jsx";
import Reports from "./components/Reports/Reports.jsx";
import ReportDetails from "./components/Reports/ReportDetails.jsx";

const App = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const employeeRoutes = [
    { path: "/frenzone/dashboard", component: DashboardOverview },
    { path: "/frenzone/user-management", component: DashboardEmployee },
    { path: "/frenzone/reports", component: ReportsEmployee },
    { path: "/frenzone/manage-orders", component: ManageOrdersEmployee },
    {
      path: "/frenzone/appointment-calendar",
      component: AppointmentCalendarEmployee,
    },
    { path: "/frenzone/profile", component: ProfileEmployee },
    { path: "/frenzone/manage-profile", component: ManageProfile },
    { path: "/detailed", component: DetailedPage },
    { path: "/frenzone/version", component: VersionControl },
    { path: "/frenzone/review", component: ReviewContentPage },
    { path: "/frenzone/withdrawals", component: Drwal },
    { path: "/frenzone/adultcontent", component: AdultContent },
    { path: "/frenzone/companyprofit", component: CompanyProfit },
    { path: "/sensitivereels", component: AdultReels },
    { path: "/frenzone/transactions", component: Transcations },
    { path: "/frenzone/totalreports", component: Reports },
    { path: "/frenzone/report/:id", component: ReportDetails },
  ];

  return (
    <div className={`app-container ${isLoading ? "" : "fade-in"}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<LoginEmployee />} />
            {employeeRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Employee>
                    <Component />
                  </Employee>
                }
              />
            ))}
          </Routes>
        </Provider>
      )}
    </div>
  );
};

export default App;
