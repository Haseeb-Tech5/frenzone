import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// CSS
import "./App.css";
// Layouts
import SuperAdmin from "./layout/SuperAdmin";
import StoreAdmin from "./layout/StoreAdmin";
import Employee from "./layout/Employee";
// Pages
import Login from "./pages/Login";
import WebChat from "./pages/WebChat";
// -> Super Admin
import Dashboard from "./pages/superadmin/Dashboard";
import Reports from "./pages/superadmin/Reports";
import ManageEmployees from "./pages/superadmin/ManageEmployees";
import ManageOrders from "./pages/superadmin/ManageOrders";
import ManageStore from "./pages/superadmin/ManageStore";
import ManageShop from "./pages/superadmin/ManageShop";
import AppointmentCalendar from "./pages/superadmin/AppointmentCalendar";
import Profile from "./pages/superadmin/Profile";
import LoginSuper from "./pages/superadmin/LoginSuper";
// -> Store Admin
import LoginStore from "./pages/storeadmin/LoginStore";
import DashboardStore from "./pages/storeadmin/DashboardStore";
import ReportsStore from "./pages/storeadmin/ReportsStore";
import ManageEmployeesStore from "./pages/storeadmin/ManageEmployeesStore";
import ManageOrdersStore from "./pages/storeadmin/ManageOrdersStore";
import AppointmentCalendarStore from "./pages/storeadmin/AppointmentCalendarStore";
import ProfileStore from "./pages/storeadmin/ProfileStore";
// -> Employee
import LoginEmployee from "./pages/employee/LoginEmployee";
import DashboardEmployee from "./pages/employee/DashboardEmployee";
import ReportsEmployee from "./pages/employee/ReportsEmployee";
import ManageOrdersEmployee from "./pages/employee/ManageOrdersEmployee";
import AppointmentCalendarEmployee from "./pages/employee/AppointmentCalendarEmployee";
import ProfileEmployee from "./pages/employee/ProfileEmployee";
import ManageProfile from "./pages/employee/ManageProfile";
import Detailed from "./pages/Detailed";

const App = () => {
  return (
    <>
      <div className="app">
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/webchat" element={<WebChat />} /> */}

          {/* Super Admin */}
          {/* <Route
            path="/super-admin/dashboard"
            element={
              <SuperAdmin>
                <Dashboard />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/reports"
            element={
              <SuperAdmin>
                <Reports />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/manage-employees"
            element={
              <SuperAdmin>
                <ManageEmployees />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/manage-orders"
            element={
              <SuperAdmin>
                <ManageOrders />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/manage-store"
            element={
              <SuperAdmin>
                <ManageStore />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/manage-shop"
            element={
              <SuperAdmin>
                <ManageShop />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/appointment-calendar"
            element={
              <SuperAdmin>
                <AppointmentCalendar />
              </SuperAdmin>
            }
          />
          <Route
            path="/super-admin/profile"
            element={
              <SuperAdmin>
                <Profile />
              </SuperAdmin>
            }
          />
          <Route path="/super-admin/login" element={<LoginSuper />} /> */}
          {/* Store Admin */}
          {/* <Route path="/store-admin/login" element={<LoginStore />} />
          <Route
            path="/store-admin/dashboard"
            element={
              <StoreAdmin>
                <DashboardStore />
              </StoreAdmin>
            }
          />
          <Route
            path="/store-admin/reports"
            element={
              <StoreAdmin>
                <ReportsStore />
              </StoreAdmin>
            }
          />
          <Route
            path="/store-admin/manage-employees"
            element={
              <StoreAdmin>
                <ManageEmployeesStore />
              </StoreAdmin>
            }
          />
          <Route
            path="/store-admin/manage-orders"
            element={
              <StoreAdmin>
                <ManageOrdersStore />
              </StoreAdmin>
            }
          />
          <Route
            path="/store-admin/appointment-calendar"
            element={
              <StoreAdmin>
                <AppointmentCalendarStore />
              </StoreAdmin>
            }
          />
          <Route
            path="/store-admin/profile"
            element={
              <StoreAdmin>
                <ProfileStore />
              </StoreAdmin>
            }
          /> */}
          {/* Employee */}
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
          <Route path="/detailed" element={<Detailed />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
