import React, { useState } from "react";
import Swal from "sweetalert2";
import "./version.css";

const VersionControl = () => {
  const [version, setVersion] = useState("");
  const [os, setOs] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const fetchVersion = (osType) => {
    fetch(`https://api.frenzone.live/version/${osType}`)
      .then((response) => response.json())
      .then((data) => {
        setVersion(data.version);
      })
      .catch((error) => console.error("Error fetching version:", error));
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
    <div className="versoon-control-container-mmm">
      <div className="versoon-control-container">
        <div className="version-display-container">
          <div className="version-display">
            <div className="verson-container-heading">
              <h2>Version Control</h2>
            </div>

            {!os ? (
              <div className="os-selection">
                <button
                  className="os-button"
                  onClick={() => handleOsChange("android")}
                >
                  Android
                </button>
                <button
                  className="os-button"
                  onClick={() => handleOsChange("apple")}
                >
                  Apple
                </button>
              </div>
            ) : (
              <>
                <div className="additional-buttons">
                  <button
                    className="os-button"
                    onClick={() =>
                      handleOsChange(os === "android" ? "apple" : "android")
                    }
                  >
                    Go to {os === "android" ? "Apple" : "Android"} version
                  </button>
                  <button className="os-button" onClick={handleBackClick}>
                    Go back
                  </button>
                </div>
                <div className="version-control-noneditable-ok">
                  <div className="current-version">
                    <h2>
                      Current Version{" "}
                      <span className="current-current">
                        {" "}
                        ({os.charAt(0).toUpperCase() + os.slice(1)})
                      </span>
                    </h2>
                  </div>
                  <div className="version-control-noneditable">
                    {isEditable ? (
                      <input
                        type="text"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                      />
                    ) : (
                      <span className="center-version">
                        <span className="version-lime">Version:</span>
                        {version}
                      </span>
                    )}
                  </div>
                </div>
                <div className="update-version-button">
                  {isEditable ? (
                    <button onClick={handleSaveClick}>Save Version</button>
                  ) : (
                    <button onClick={handleUpdateClick}>Update Version</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
