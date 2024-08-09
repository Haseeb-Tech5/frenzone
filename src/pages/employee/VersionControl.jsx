import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./version.css";

const VersionControl = () => {
  const [version, setVersion] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    fetch("https://api.frenzone.live/version")
      .then((response) => response.json())
      .then((data) => {
        setVersion(data.version);
      })
      .catch((error) => console.error("Error fetching version:", error));
  }, []);
  const handleUpdateClick = () => {
    setIsEditable(true);
  };
  const handleSaveClick = () => {
    fetch("https://api.frenzone.live/version", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version }),
    })
      .then((response) => response.json())
      .then((data) => {
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
            <div className="version-control-noneditable-ok">
              <div className="current-version">
                <h2>Current Version</h2>
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
                    <span className="version-lime">version:</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
