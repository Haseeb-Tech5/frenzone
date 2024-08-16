import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./status.css";
const StatusOverview = ({ status, withdrawalId, user }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [showModal, setShowModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [withdrawalData, setWithdrawalData] = useState(null);
  useEffect(() => {
    const fetchWithdrawalData = async () => {
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getWithdrawByWithdrawId/${withdrawalId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch withdrawal data");
        }
        const data = await response.json();
        console.log("Withdrawal Data:", data);
        setWithdrawalData(data);
        const newStatus =
          data.status === "Pending"
            ? user.isVerified
              ? "Verified"
              : "Unverified"
            : data.status;
        const requestBody = {
          withdrawId: withdrawalId,
          status: newStatus,
        };
        const updateStatus = async () => {
          try {
            const updateResponse = await fetch(
              "https://api.frenzone.live/wallet/setWithdrawStatus",
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              }
            );
            if (!updateResponse.ok) {
              throw new Error("Failed to update status");
            }
            setCurrentStatus(newStatus);
          } catch (error) {
            console.error("Error updating status:", error);
          }
        };
        updateStatus();
      } catch (error) {
        console.error("Error fetching withdrawal data:", error);
      }
    };

    fetchWithdrawalData();
  }, [withdrawalId, user.isVerified]);

  const handleStatusClick = () => {
    if (currentStatus === "Verified") {
      setModalOptions(["Processing"]);
    } else if (currentStatus === "Unverified") {
      setModalOptions(["Rejected", "Processing"]);
    } else {
      setModalOptions([]);
    }
    setShowModal(true);
  };

  const handleOptionClick = async (option) => {
    if (option === "Processing") {
      setShowCompletedModal(true);
      return;
    }

    const requestBody = {
      withdrawId: withdrawalId,
      status: option,
    };
    try {
      const response = await fetch(
        "https://api.frenzone.live/wallet/setWithdrawStatus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setCurrentStatus(option);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCompletedClick = async () => {
    const requestBody = {
      withdrawId: withdrawalId,
      status: "Completed",
    };
    try {
      const response = await fetch(
        "https://api.frenzone.live/wallet/setWithdrawStatus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setCurrentStatus("Completed");
      setShowCompletedModal(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <div className="clip-conut red-red-set" onClick={handleStatusClick}>
        {currentStatus}
      </div>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="slecet-staus-oracle"> Select Status</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="check-status-button">
            {modalOptions.map((option) => (
              <Button key={option} onClick={() => handleOptionClick(option)}>
                {option}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={showCompletedModal}
        onHide={() => setShowCompletedModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="slecet-staus-oracle">Mark as Completed</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="check-status-button">
            <Button onClick={handleCompletedClick}>Completed</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StatusOverview;
