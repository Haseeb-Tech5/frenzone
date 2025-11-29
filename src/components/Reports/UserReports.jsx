import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./UserReports.css";

const UserReports = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [strikeModalOpen, setStrikeModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [strikeReason, setStrikeReason] = useState("");

  const API_BASE = "https://api.frenzone.live";

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/getAllUsersReports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // Sort reports: Newest activity (updatedAt) first
        const sortedReports = {
          ...data,
          reports: [...data.reports].sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB - dateA; // Descending: newest on top
          }),
        };
        setReportsData(sortedReports);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/frenzone/user/reports/${userId}`);
  };

  // BLOCK / UNBLOCK
  const toggleBlock = async (userId, currentStatus) => {
    if (actionLoading[userId]) return;
    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    const action = currentStatus ? "Unblock" : "Block";
    const result = await Swal.fire({
      title: `${action} User?`,
      text: currentStatus ? "User will be unblocked." : "User will be blocked.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: currentStatus ? "#3085d6" : "#d33",
      confirmButtonText: `Yes, ${action}!`,
    });

    if (!result.isConfirmed) {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/user/blockUserInSystem/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const isSuccess =
        data.success ||
        data.message?.includes("block") ||
        data.message?.includes("unblock");

      if (isSuccess) {
        Swal.fire(
          "Success!",
          data.message || `User ${action.toLowerCase()}ed!`,
          "success"
        );
        fetchReports();
      } else {
        Swal.fire("Failed", data.message || "Action failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // LIFT STRIKE
  const liftStrike = async (userId) => {
    if (actionLoading[userId]) return;
    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    const result = await Swal.fire({
      title: "Lift Strike?",
      text: "This will remove the strike from the user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Lift Strike",
    });

    if (!result.isConfirmed) {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/user/liftStrike`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: userId }),
      });
      const data = await res.json();

      if (data.success || data.message?.includes("lift")) {
        Swal.fire("Success!", data.message || "Strike lifted!", "success");
        fetchReports();
      } else {
        Swal.fire("Failed", data.message || "Could not lift strike", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // STRIKE USER – MODAL
  const openStrikeModal = (userId) => {
    if (actionLoading[userId]) return;
    setSelectedUserId(userId);
    setStrikeReason("");
    setStrikeModalOpen(true);
  };

  const submitStrike = async () => {
    if (!strikeReason.trim()) {
      Swal.fire("Warning", "Please enter a reason", "warning");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [selectedUserId]: true }));

    try {
      const res = await fetch(`${API_BASE}/user/strikeUser`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: selectedUserId,
          reason: strikeReason.trim(),
        }),
      });
      const data = await res.json();

      if (data.success || data.message?.includes("strike")) {
        Swal.fire("Success!", data.message || "Strike issued!", "success");
        setStrikeModalOpen(false);
        fetchReports();
      } else {
        Swal.fire("Failed", data.message || "Could not issue strike", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedUserId]: false }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="userreports-container">
      {/* Strike Modal */}
      {strikeModalOpen && (
        <div
          className="strike-modal-overlay"
          onClick={() => setStrikeModalOpen(false)}
        >
          <div className="strike-modal" onClick={(e) => e.stopPropagation()}>
            <div className="strike-modal-header">
              <h3>Issue Strike</h3>
              <button
                className="strike-modal-close"
                onClick={() => setStrikeModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="strike-modal-body">
              <p>Enter reason for giving strike:</p>
              <textarea
                value={strikeReason}
                onChange={(e) => setStrikeReason(e.target.value)}
                placeholder="e.g. Repeated harassment, spam, inappropriate content..."
                className="strike-textarea"
                rows="6"
              />
            </div>
            <div className="strike-modal-footer">
              <button
                className="strike-btn-cancel"
                onClick={() => setStrikeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="strike-btn-submit"
                onClick={submitStrike}
                disabled={actionLoading[selectedUserId]}
              >
                {actionLoading[selectedUserId] ? "Issuing..." : "Issue Strike"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="userreports-container-inner">
        <div className="userreports-heading">
          <h2>Reported Users</h2>
        </div>

        {reportsData?.reports?.length > 0 ? (
          <div className="userreports-table-wrapper">
            <table className="userreports-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reports</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.reports.map((report) => {
                  const u = report.userid;
                  const isBlocked = u.systemBlocked;
                  const isUnderStrike = u.underStrike;
                  const isLoading = actionLoading[u._id];

                  return (
                    <tr key={report._id} className="userreports-row">
                      <td className="userreports-user">
                        <img
                          src={u.profilePicUrl || "/default-avatar.png"}
                          alt={u.username}
                          className="userreports-profile-pic"
                          onError={(e) =>
                            (e.target.src = "/default-avatar.png")
                          }
                        />
                        <div>
                          <span className="userreports-username">
                            {u.username}
                          </span>
                          <small className="userreports-name">
                            {u.firstname} {u.lastname}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="userreports-report-count">
                          {report.totalReports}
                        </span>
                      </td>
                      <td>
                        <div className="status-badges">
                          {isUnderStrike && (
                            <span className="badge strike">Under Strike</span>
                          )}
                          {isBlocked && (
                            <span className="badge blocked">Blocked</span>
                          )}
                          {!isUnderStrike && !isBlocked && (
                            <span className="badge normal">Normal</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-view"
                            onClick={() => handleViewDetails(u._id)}
                          >
                            View
                          </button>

                          {!isUnderStrike && (
                            <button
                              className="btn-strike"
                              onClick={() => openStrikeModal(u._id)}
                              disabled={isLoading}
                            >
                              Strike
                            </button>
                          )}

                          {isUnderStrike && (
                            <button
                              className="btn-lift"
                              onClick={() => liftStrike(u._id)}
                              disabled={isLoading}
                            >
                              Lift Strike
                            </button>
                          )}

                          <button
                            className={isBlocked ? "btn-unblock" : "btn-block"}
                            onClick={() => toggleBlock(u._id, isBlocked)}
                            disabled={isLoading}
                          >
                            {isLoading
                              ? "..."
                              : isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="userreports-no-data">No reported users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserReports;
