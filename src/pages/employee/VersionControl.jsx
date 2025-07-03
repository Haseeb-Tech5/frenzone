import React, { useState } from "react";
import Swal from "sweetalert2";

import "./version.css";
import Loader from "../../components/Loader/Loader";

const VersionControl = () => {
  const [version, setVersion] = useState("");
  const [os, setOs] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchVersion = (osType) => {
    setLoading(true); // Show loader
    fetch(`https://api.frenzone.live/version/${osType}`)
      .then((response) => response.json())
      .then((data) => {
        setVersion(data.version);
        setLoading(false); // Hide loader
      })
      .catch((error) => {
        console.error("Error fetching version:", error);
        setLoading(false); // Hide loader on error
      });
  };

  const handleOsChange = (newOs) => {
    setOs(newOs);
    fetchVersion(newOs);
  };

  const handleBackClick = () => {
    setOs(null);
    setVersion("");
    setIsEditable(false);
  };

  const handleUpdateClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    fetch("https://api.frenzone.live/version", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version, os }),
    })
      .then((response) => response.json())
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Version updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditable(false);
      })
      .catch((error) => console.error("Error updating version:", error));
  };

  return (
    <div className="vers-container">
      {loading && <Loader />} {/* Show loader when loading */}
      <div className="vers-container-full">
        <div className="vers-heading">
          <h2>Version Control</h2>
        </div>
        <div className="vers-display-container">
          {!os ? (
            <div className="vers-os-selection">
              <button
                className="vers-btn-os"
                onClick={() => handleOsChange("android")}
              >
                Android
              </button>
              <button
                className="vers-btn-os"
                onClick={() => handleOsChange("apple")}
              >
                Apple
              </button>
            </div>
          ) : (
            <>
              <div className="vers-additional-buttons">
                <button
                  className="vers-btn-os"
                  onClick={() =>
                    handleOsChange(os === "android" ? "apple" : "android")
                  }
                >
                  Switch to {os === "android" ? "Apple" : "Android"} Version
                </button>
                <button className="vers-btn-back" onClick={handleBackClick}>
                  Go Back
                </button>
              </div>
              <div className="vers-version-control">
                <div className="vers-current-version">
                  <h2>
                    Current Version{" "}
                    <span className="vers-current-os">
                      ({os.charAt(0).toUpperCase() + os.slice(1)})
                    </span>
                  </h2>
                </div>
                <div className="vers-version-display">
                  {isEditable ? (
                    <input
                      className="vers-input-version"
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                    />
                  ) : (
                    <span className="vers-version-text">
                      <span className="vers-version-label">Version:</span>{" "}
                      {version}
                    </span>
                  )}
                </div>
              </div>
              <div className="vers-update-button">
                <button
                  className="vers-btn-update"
                  onClick={isEditable ? handleSaveClick : handleUpdateClick}
                >
                  {isEditable ? "Save Version" : "Update Version"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
