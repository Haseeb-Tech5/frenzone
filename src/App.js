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
        <div className="loader">
          <span className="load" style={{ "--i": "1px" }}></span>
          <span className="load" style={{ "--i": "2px" }}></span>
          <span className="load" style={{ "--i": "3px" }}></span>
          <span className="load" style={{ "--i": "4px" }}></span>
          <span className="load" style={{ "--i": "5px" }}></span>
          <span className="load" style={{ "--i": "6px" }}></span>
          <span className="load" style={{ "--i": "7px" }}></span>
          <span className="load" style={{ "--i": "8px" }}></span>
          <span className="load" style={{ "--i": "9px" }}></span>
          <span className="load" style={{ "--i": "10px" }}></span>
        </div>
      ) : (
        <div>
          <Provider store={store}>
            <Routes>
              <Route path="/" element={<LoginEmployee />} />
              <Route
                path="/employee/dashboard"
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
                path="/employee/withdrawals"
                element={
                  <Employee>
                    <Drwal />
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
