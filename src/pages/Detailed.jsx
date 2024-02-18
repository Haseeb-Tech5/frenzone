import React, { useState } from "react";
import "./detailed.css";
import Img from "../../src/Assets-admin/pic.svg";
import { Link } from "react-router-dom";

const Detailed = () => {
  const [selectedOption, setSelectedOption] = useState("Identity");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <div className="detailed-container">
        <div className="contained-flex-set">
          <Link to="/employee/dashboard">
            <div className="btn-container-settt">
              <button>Go Back</button>
            </div>
          </Link>
          <div className="detailed-img">
            <img src={Img} alt="" />
          </div>
          <div className="user-name-set">
            <div className="user-bk-set">
              <h1>Haseeb</h1>
            </div>
          </div>
        </div>
        <div className="button-content-setup">
          <div className="btn-set-flex-gain">
            <ul>
              <li
                className={selectedOption === "Identity" ? "active-option" : ""}
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
              <div class="cards">
                <div class="card red">
                  <div className="data-set-max-flex">
                    <h1>Phone Type</h1>
                    <h1>Apple</h1>
                  </div>
                </div>
                <div class="card blue">
                  <div className="data-set-max-flex">
                    <h1>Country</h1>
                    <h1>Pakistan</h1>
                  </div>
                </div>
                <div class="card green">
                  <div className="data-set-max-flex">
                    <h1>Sign In</h1>
                    <h1>Google</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedOption === "Withdrawal" && (
          <div className="container2-sett">
            <div className="container-set-max-flex">
              <div class="cards">
                <div class="card red">
                  <div className="data-set-max-flex">
                    <h1>Total Coins</h1>
                    <h1 style={{ color: "lime" }}>100</h1>
                  </div>
                </div>
                <div class="card blue">
                  <div className="data-set-max-flex">
                    <h1>Withdraw</h1>
                    <h1 style={{ color: "red" }}>50</h1>
                  </div>
                </div>
                {/* <div class="card green">
                <div className="data-set-max-flex">
                  <h1>Sign In</h1>
                  <h1>Google</h1>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        )}
        {selectedOption === "Abusive Report" && (
          <div className="container3-sett">
            {" "}
            <div className="container-set-max-flex">
              <div class="cards">
                <div class="card red">
                  <div className="data-set-max-flex">
                    <h1>User</h1>
                    <h1>Haseeb</h1>
                  </div>
                </div>
                <div class="card blue">
                  <div className="data-set-max-flex">
                    <h1>Reported by</h1>
                    <h1>Adminstrator</h1>
                  </div>
                </div>
                <div class="card green">
                  <div className="data-set-max-flex">
                    <h1>Joined</h1>
                    <h1>2 months ago</h1>
                  </div>
                </div>
                <div class="card blue">
                  <div className="data-set-max-flex">
                    <h1>Reported</h1>
                    <h1>2 months ago</h1>
                  </div>
                </div>
                <div class="card green">
                  <div className="data-set-max-flex">
                    <h1>Message</h1>
                    <h1>User sends spams</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="block-set-contained">
              <button>Remove Report</button>
              {/* <button>Block User</button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Detailed;
