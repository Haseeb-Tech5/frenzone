import React, { useState } from "react";
import Swal from "sweetalert2";
import "../employee/broadcast.css";

const ReportsEmployee = () => {
  const [isSending, setIsSending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSendClick = () => {
    setIsSending(true);
  };

  const handleClose = () => {
    setIsSending(false);
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
        Swal.fire({
          title: "Success!",
          text: "Notification sent successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        handleClose();
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to send notification",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      });
  };

  return (
    <div className="broad-container">
      <div className="broad-container-full">
        <div className="broad-heading">
          <h2>BroadCast</h2>
        </div>
        <div className="send-heading">
          <div className="btn-head-set">
            <button onClick={handleSendClick}>Send Notifications</button>
          </div>
        </div>
        <div className="send-container">
          <textarea
            placeholder="Write your message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          ></textarea>
          <div className="button-container">
            <button onClick={handleClose}>Cancel</button>
            {/* <button onClick={handleSend}>Send</button> */}
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsEmployee;
