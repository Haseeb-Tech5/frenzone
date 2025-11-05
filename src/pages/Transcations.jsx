import React, { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "./transactions.css";
import Loader from "../components/Loader/Loader";

const Transactions = () => {
  const token = localStorage.getItem("token");

  const [transactionsData, setTransactionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/wallet/getTransations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        if (data.success) {
          setTransactionsData(data);
          setError(null);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (error) {
        setError("Failed to fetch transaction data");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch transaction data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [adminId]);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="transactions-container">
      {loading && <Loader />}
      <div className="transactions-container-inner">
        <div className="transactions-heading">
          <h2>Transaction History</h2>
        </div>
        {error && <div className="transactions-error">{error}</div>}
        {transactionsData && transactionsData.transactions?.length > 0 ? (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  {/* <th>Type</th> */}
                  <th>Admin Share</th>
                  <th>User Got</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.transactions.map((transaction, index) => (
                  <tr
                    key={transaction._id}
                    className="transactions-row transactions-animate"
                  >
                    <td className="transactions-user">
                      <img
                        src={transaction.userid.profilePicture}
                        alt={transaction.userid.username}
                        className="transactions-profile-pic"
                      />
                      <span>{transaction.userid.username}</span>
                    </td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    {/* <td>{transaction.transactionType}</td> */}
                    <td>${transaction.adminShare.toFixed(2)}</td>
                    <td>${transaction.userGot.toFixed(2)}</td>
                    <td>
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td>
                      <button
                        className="transactions-detail-button"
                        onClick={() => openModal(transaction)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="transactions-meta">
              <p>
                Showing page {transactionsData.page} of{" "}
                {Math.ceil(transactionsData.count / 10)} (
                {transactionsData.count} transactions)
              </p>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="transactions-no-data">
              No transactions available
            </div>
          )
        )}
      </div>

      {isModalOpen && selectedTransaction && (
        <div className="transactions-modal-overlay">
          <div className="transactions-modal">
            <div className="transactions-modal-header">
              <h3>Transaction Details</h3>
              <button className="transactions-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="transactions-modal-content">
              {/* <p>
                <strong>Transaction ID:</strong> {selectedTransaction._id}
              </p> */}
              <p>
                <strong>User:</strong> {selectedTransaction.userid.username}
              </p>
              {/* <p>
                <strong>Email:</strong>{" "}
                {selectedTransaction.userid.email || "N/A"}
              </p> */}
              <p>
                <strong>Amount:</strong> $
                {selectedTransaction.amount.toFixed(2)}
              </p>
              {/* <p>
                <strong>Type:</strong> {selectedTransaction.transactionType}
              </p> */}
              <p>
                <strong>Admin Share:</strong> $
                {selectedTransaction.adminShare.toFixed(2)}
              </p>
              <p>
                <strong>User Got:</strong> $
                {selectedTransaction.userGot.toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedTransaction.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedTransaction.status || "Completed"}
              </p>
            </div>
            <div className="transactions-modal-footer">
              <button
                className="transactions-modal-button"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
