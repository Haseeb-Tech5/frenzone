import React, { useState } from "react";
import "./broadcast.css";

const ReportsEmployee = () => {
  const [isSending, setIsSending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSendClick = () => {
    setIsSending(true);
  };

  const handleClose = () => {
    setIsSending(false);
    setNotificationMessage("");
  };

  const handleSend = () => {
    fetch("https://api.frenzone.live/admin/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: notificationMessage }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send notification");
        }
        handleClose();
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  return (
    <div className="broad-container">
      <div className="broad-container-full">
        <div className="broad-heading">
          <h2>BroadCast</h2>
        </div>

        <div className="broad-send-container">
          <textarea
            className="broad-textarea"
            placeholder="Write your message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          ></textarea>
          <div className="broad-button-container">
            <button className="broad-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button className="broad-btn-send" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsEmployee;
