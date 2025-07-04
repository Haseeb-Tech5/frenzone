import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Employee from "./layout/Employee";
import LoginEmployee from "./pages/employee/LoginEmployee";
import DashboardEmployee from "./pages/employee/DashboardEmployee";
import ReportsEmployee from "./pages/employee/ReportsEmployee";
import ManageOrdersEmployee from "./pages/employee/ManageOrdersEmployee";
import AppointmentCalendarEmployee from "./pages/employee/AppointmentCalendarEmployee";
import ProfileEmployee from "./pages/employee/ProfileEmployee";
import ManageProfile from "./pages/employee/ManageProfile";
import DetailedPage from "./DetailedPage/DetailedPage";
import VersionControl from "./pages/employee/VersionControl";
import store from "./Redux/store.js";
import { Provider } from "react-redux";
import Drwal from "./components/withdrawals/Drwal.jsx";
import AdultContent from "./components/AdultContent/AdultContent.jsx";
import CompanyProfit from "./components/CompanyProfit/CompanyProfit.jsx";
import AdultReels from "./components/AdultContent/Adultrell/AdultReels.jsx";
import ReviewContentPage from "./components/ReviewContent/ReviewContentPage.jsx";
import DashboardOverview from "./components/DashboardOverview/DashboardOverview.jsx";
import Loader from "./components/Loader/Loader.jsx";

const App = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const delay = 3000;
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Provider store={store}>
            <Routes>
              <Route path="/" element={<LoginEmployee />} />
              <Route
                path="/employee/dashboard"
                element={
                  <Employee>
                    <DashboardOverview />
                  </Employee>
                }
              />
              <Route
                path="/employee/user-management"
                element={
                  <Employee>
                    <DashboardEmployee />
                  </Employee>
                }
              />
              <Route
                path="/employee/reports"
                element={
                  <Employee>
                    <ReportsEmployee />
                  </Employee>
                }
              />
              <Route
                path="/employee/manage-orders"
                element={
                  <Employee>
                    <ManageOrdersEmployee />
                  </Employee>
                }
              />
              <Route
                path="/employee/appointment-calendar"
                element={
                  <Employee>
                    <AppointmentCalendarEmployee />
                  </Employee>
                }
              />
              <Route
                path="/employee/profile"
                element={
                  <Employee>
                    <ProfileEmployee />
                  </Employee>
                }
              />
              <Route
                path="/employee/manage-profile"
                element={
                  <Employee>
                    <ManageProfile />
                  </Employee>
                }
              />
              <Route
                path="/detailed"
                element={
                  <Employee>
                    <DetailedPage />
                  </Employee>
                }
              />
              <Route
                path="/employee/version"
                element={
                  <Employee>
                    <VersionControl />
                  </Employee>
                }
              />{" "}
              <Route
                path="/employee/review"
                element={
                  <Employee>
                    <ReviewContentPage />
                  </Employee>
                }
              />{" "}
              <Route
                path="/employee/withdrawals"
                element={
                  <Employee>
                    <Drwal />
                  </Employee>
                }
              />{" "}
              <Route
                path="/employee/adultcontent"
                element={
                  <Employee>
                    <AdultContent />
                  </Employee>
                }
              />{" "}
              <Route
                path="/employee/companyprofit"
                element={
                  <Employee>
                    <CompanyProfit />
                  </Employee>
                }
              />{" "}
              <Route
                path="/sensitivereels"
                element={
                  <Employee>
                    <AdultReels />
                  </Employee>
                }
              />
            </Routes>
          </Provider>
        </div>
      )}
    </>
  );
};

export default App;
