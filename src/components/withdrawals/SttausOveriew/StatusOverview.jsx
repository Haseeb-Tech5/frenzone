import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./status.css";

const StatusOverview = ({ status, withdrawalId, user }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [showModal, setShowModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
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
        console.log("user.paymentVerified", user.paymentVerified);
        const newStatus =
          data.status === "Pending"
            ? user.paymentVerified
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
  }, [withdrawalId, user.paymentVerified]);
  const togglePaymentVerified = async () => {
    try {
      const response = await fetch(
        `https://api.frenzone.live/auth/togglePaymentVerified/${user._id}`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle paymentVerified");
      }
      const data = await response.json();
      console.log("Payment Verified Toggle Response:", data);
      user.paymentVerified = !user.paymentVerified;
    } catch (error) {
      console.error("Error toggling paymentVerified:", error);
    }
  };

  const handleStatusClick = () => {
    if (currentStatus === "Verified") {
      setModalOptions(["Processing"]);
      setShowModal(true);
    } else if (currentStatus === "Unverified") {
      setModalOptions(["Rejected", "Processing"]);
      setShowModal(true);
    } else if (currentStatus === "Processing") {
      setShowCompletedModal(true);
    }
  };

  const handleOptionClick = async (option) => {
    if (option === "Processing") {
      await togglePaymentVerified();
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
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
        if (response.status === 502) {
          alert("Server error: Please try again later.");
        }
        throw new Error("Failed to update status");
      }

      setCurrentStatus(option);
      setShowModal(false);

      if (option === "Rejected") {
        setShowRejectedModal(true);
      } else if (option === "Completed") {
        setShowFinalModal(true);
      }
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
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
        if (response.status === 502) {
          alert("Server error: Please try again later.");
        }
        throw new Error("Failed to update status");
      }

      setCurrentStatus("Completed");
      setShowCompletedModal(false);
      setShowFinalModal(true);
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
            <div className="slecet-staus-oracle">Select Status</div>
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

      <Modal
        centered
        show={showRejectedModal}
        onHide={() => setShowRejectedModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="slecet-staus-oracle">Process Rejected</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="process-complete-y-as">
            Your process has been rejected.
          </div>
          <div className="check-status-button">
            <Button onClick={() => setShowRejectedModal(false)}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={showFinalModal}
        onHide={() => setShowFinalModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            <div className="slecet-staus-oracle">Process Completed</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="process-complete-y-as">
            Your process has been completed.
          </div>
          <div className="check-status-button">
            <Button onClick={() => setShowFinalModal(false)}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StatusOverview;
