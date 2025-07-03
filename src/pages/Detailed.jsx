import React, { useState } from "react";
import "./detailed.css";
import Img from "../../src/Assets-admin/pic.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AbusiveReport from "./AbusiveReport/AbusiveReport";
import BalanceOverview from "./BalanceOverview/BalanceOverview";
import EndStream from "./EndStream/EndStream";

const Detailed = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [selectedOption, setSelectedOption] = useState("Identity");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className="dtl-container">
        <div className="dtl-flex-wrapper">
          <div className="dtl-header">
            <Link to="/employee/dashboard">
              <div className="dtl-back-btn-container">
                <button className="dtl-back-btn">Go Back</button>
              </div>
            </Link>
            <div className="dtl-profile-img">
              <img
                src={selectedUser?.profilePicUrl || Img}
                alt="User Profile"
                className="dtl-img"
              />
              {selectedUser?.is_online == "1" && (
                <div className="dtl-online-indicator"></div>
              )}
            </div>
            <div className="dtl-user-info">
              <div className="dtl-user-name">
                <h1>
                  {selectedUser?.firstname} {selectedUser?.lastname}
                </h1>
              </div>
            </div>
          </div>
          <div className="dtl-nav-tabs">
            <div className="dtl-tabs-container">
              <ul className="dtl-tabs-list">
                <li
                  className={`dtl-tab ${
                    selectedOption === "Identity" ? "dtl-tab-active" : ""
                  }`}
                  onClick={() => handleOptionClick("Identity")}
                >
                  Identity
                </li>
                <li
                  className={`dtl-tab ${
                    selectedOption === "BalanceOverview" ? "dtl-tab-active" : ""
                  }`}
                  onClick={() => handleOptionClick("BalanceOverview")}
                >
                  Balance Overview
                </li>
                <li
                  className={`dtl-tab ${
                    selectedOption === "Abusive Report" ? "dtl-tab-active" : ""
                  }`}
                  onClick={() => handleOptionClick("Abusive Report")}
                >
                  Abusive Report
                </li>
                <li
                  className={`dtl-tab ${
                    selectedOption === "End Live" ? "dtl-tab-active" : ""
                  }`}
                  onClick={() => handleOptionClick("End Live")}
                >
                  End Live
                </li>
              </ul>
            </div>
          </div>
          {selectedOption === "Identity" && (
            <div className="dtl-content-section">
              <div className="dtl-content-grid">
                <div className="dtl-cards-grid">
                  <div className="dtl-card dtl-card-blue">
                    <div className="dtl-card-content">
                      <h1>Username</h1>
                      <h1>{selectedUser?.username || "N/A"}</h1>
                    </div>
                  </div>

                  <div className="dtl-card dtl-card-blue">
                    <div className="dtl-card-content">
                      <h1>About</h1>
                      <h1>{selectedUser?.about || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-green">
                    <div className="dtl-card-content">
                      <h1>Banned</h1>
                      <h1>{selectedUser?.banned ? "true" : "false"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-green">
                    <div className="dtl-card-content">
                      <h1>Is Online</h1>
                      <h1>
                        {selectedUser?.is_online == "1" ? "true" : "false"}
                      </h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-green">
                    <div className="dtl-card-content">
                      <h1>isAdminBlocked</h1>
                      <h1>{selectedUser?.isAdminBlocked ? "true" : "false"}</h1>
                    </div>
                  </div>

                  <div className="dtl-card dtl-card-red">
                    <div className="dtl-card-content">
                      <h1>Bio</h1>
                      <h1>{selectedUser?.bio || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-blue">
                    <div className="dtl-card-content">
                      <h1>Email</h1>
                      <h1>{selectedUser?.email || "N/A"}</h1>
                    </div>
                  </div>

                  <div className="dtl-card dtl-card-green">
                    <div className="dtl-card-content">
                      <h1>Is Live</h1>
                      <h1>{selectedUser?.isLive ? "true" : "false"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-red">
                    <div className="dtl-card-content">
                      <h1>Is on Call</h1>
                      <h1>{selectedUser?.isOnCall ? "true" : "false"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-blue">
                    <div className="dtl-card-content">
                      <h1>Is Verified</h1>
                      <h1>{selectedUser?.isVerified ? "true" : "false"}</h1>
                    </div>
                  </div>

                  <div className="dtl-card dtl-card-blue">
                    <div className="dtl-card-content">
                      <h1>Live Access</h1>
                      <h1>{selectedUser?.liveAccess ? "true" : "false"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-green">
                    <div className="dtl-card-content">
                      <h1>Phone</h1>
                      <h1>{selectedUser?.phone || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="dtl-card dtl-card-red">
                    <div className="dtl-card-content">
                      <h1>Tags</h1>
                      <h1>
                        {selectedUser?.tags
                          ? selectedUser.tags.join(", ")
                          : "N/A"}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedOption === "BalanceOverview" && <BalanceOverview />}
          {selectedOption === "Abusive Report" && <AbusiveReport />}
          {selectedOption === "End Live" && <EndStream />}
        </div>
      </div>
    </>
  );
};

export default Detailed;
