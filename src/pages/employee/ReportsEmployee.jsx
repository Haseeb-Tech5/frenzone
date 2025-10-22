import React, { useState } from "react";
import "./broadcast.css";

const ReportsEmployee = () => {
  const [isSending, setIsSending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    isSuccess: true,
  });

  const handleSendClick = () => {
    setIsSending(true);
  };

  const handleClose = () => {
    setIsSending(false);
    setNotificationMessage("");
  };

  const handleSend = () => {
    if (!notificationMessage.trim()) {
      setModal({
        isOpen: true,
        message: "Cannot send an empty broadcast message.",
        isSuccess: false,
      });
      return;
    }

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
        setModal({
          isOpen: true,
          message: "Notification sent successfully!",
          isSuccess: true,
        });
        handleClose();
      })
      .catch((error) => {
        setModal({
          isOpen: true,
          message: "Failed to send notification: " + error.message,
          isSuccess: false,
        });
        console.error("Error sending notification:", error);
      });
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "", isSuccess: true });
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

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modal.isSuccess ? "Success" : "Error"}</h3>
            <p>{modal.message}</p>
            <button className="modal-btn-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsEmployee;
