import React, { useState } from "react";
import "./detailed.css";
import Img from "../../src/Assets-admin/pic.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Detailed = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [selectedOption, setSelectedOption] = useState("Identity");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  if (!selectedUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="detailed-container">
        <div className="set-flex-contained">
          <div className="contained-flex-set">
            <Link to="/employee/dashboard">
              <div className="btn-container-settt">
                <button>Go Back</button>
              </div>
            </Link>
            <div className="detailed-img">
              <img
                src={selectedUser?.profilePicUrl || Img}
                alt="User Profile"
              />
            </div>
            <div className="user-name-set">
              <div className="user-bk-set">
                <h1>
                  {selectedUser?.firstname} {selectedUser?.lastname}
                </h1>
              </div>
            </div>
          </div>
          <div className="button-content-setup">
            <div className="btn-set-flex-gain">
              <ul>
                <li
                  className={
                    selectedOption === "Identity" ? "active-option" : ""
                  }
                  onClick={() => handleOptionClick("Identity")}
                >
                  Identity
                </li>
                <li
                  className={
                    selectedOption === "Withdrawal" ? "active-option" : ""
                  }
                  onClick={() => handleOptionClick("Withdrawal")}
                >
                  Withdrawal
                </li>
                <li
                  className={
                    selectedOption === "Abusive Report" ? "active-option" : ""
                  }
                  onClick={() => handleOptionClick("Abusive Report")}
                >
                  Abusive Report
                </li>
              </ul>
            </div>
          </div>
          {selectedOption === "Identity" && (
            <div className="container1-sett">
              <div className="container-set-max-flex">
                <div className="cards">
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Username</h1>
                      <h1>{selectedUser?.username || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>Website URL</h1>
                      <h1>{selectedUser?.websiteurl || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>About</h1>
                      <h1>{selectedUser?.about || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Banned</h1>
                      <h1>{selectedUser?.banned ? "Yes" : "No"}</h1>
                    </div>
                  </div>
                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>Bio</h1>
                      <h1>{selectedUser?.bio || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Email</h1>
                      <h1>{selectedUser?.email || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Facebook URL</h1>
                      <h1>{selectedUser?.facebookUrl || "N/A"}</h1>
                    </div>
                  </div>

                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Instagram URL</h1>
                      <h1>{selectedUser?.instagramurl || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Is Live</h1>
                      <h1>{selectedUser?.islive ? "Yes" : "No"}</h1>
                    </div>
                  </div>
                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>Is on Call</h1>
                      <h1>{selectedUser?.isonCall ? "Yes" : "No"}</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Is Verified</h1>
                      <h1>{selectedUser?.isVerified ? "Yes" : "No"}</h1>
                    </div>
                  </div>

                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>LinkedIn URL</h1>
                      <h1>{selectedUser?.linkdinUrl || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Live Access</h1>
                      <h1>{selectedUser?.liveaccess || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Phone</h1>
                      <h1>{selectedUser?.phone || "N/A"}</h1>
                    </div>
                  </div>
                  <div className="card red">
                    <div className="data-set-max-flex">
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

          {selectedOption === "Withdrawal" && (
            <div className="container2-sett">
              <div className="container-set-max-flex">
                <div className="cards">
                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>Total Coins</h1>
                      <h1 style={{ color: "lime" }}>100</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Withdraw</h1>
                      <h1 style={{ color: "red" }}>50</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedOption === "Abusive Report" && (
            <div className="container3-sett">
              <div className="container-set-max-flex">
                <div className="cards">
                  <div className="card red">
                    <div className="data-set-max-flex">
                      <h1>User</h1>
                      <h1>Haseeb</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Reported by</h1>
                      <h1>Administrator</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Joined</h1>
                      <h1>2 months ago</h1>
                    </div>
                  </div>
                  <div className="card blue">
                    <div className="data-set-max-flex">
                      <h1>Reported</h1>
                      <h1>2 months ago</h1>
                    </div>
                  </div>
                  <div className="card green">
                    <div className="data-set-max-flex">
                      <h1>Message</h1>
                      <h1>User sends spams</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Detailed;
