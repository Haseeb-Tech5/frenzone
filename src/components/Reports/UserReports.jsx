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
  const [csvLoading, setCsvLoading] = useState(false);
  const [individualCsvLoading, setIndividualCsvLoading] = useState({});
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
        const sortedReports = {
          ...data,
          reports: [...data.reports].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          ),
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

  // ==================== FULL CSV WITH UNICODE SUPPORT ====================
  const downloadUserReportsCSV = async () => {
    setCsvLoading(true);
    try {
      let allReports = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `${API_BASE}/user/getAllUsersReports?page=${page}&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();

        if (!data.success || data.reports.length === 0) {
          hasMore = false;
        } else {
          allReports = [...allReports, ...data.reports];
          if (data.reports.length < 100) hasMore = false;
          page++;
        }
      }

      const enrichedReports = await Promise.all(
        allReports.map(async (entry) => {
          let reportedUserFull = {};
          try {
            const res = await fetch(
              `${API_BASE}/user/getUserById/${entry.userid._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (res.ok) {
              const data = await res.json();
              reportedUserFull = data.user || {};
            }
          } catch (e) {}

          const enrichedIndividualReports = await Promise.all(
            entry.reports.map(async (indReport) => {
              let reporterFull = {};
              if (indReport.reportedBy?._id) {
                try {
                  const res = await fetch(
                    `${API_BASE}/user/getUserById/${indReport.reportedBy._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (res.ok) {
                    const data = await res.json();
                    reporterFull = data.user || {};
                  }
                } catch (e) {}
              }
              return { ...indReport, reporterFull };
            })
          );

          return {
            ...entry,
            reportedUserFull,
            reports: enrichedIndividualReports,
          };
        })
      );

      const escapeCSV = (text) => {
        if (!text) return "N/A";
        const str = String(text).trim();
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      const BOM = "\uFEFF";
      const headers = [
        "Reported Username",
        "Reported Full Name",
        "Reported Email",
        "Reported Phone",
        "Reported Address",
        "Reported IP Address",
        "Reported DOB",
        "Reported Bio",
        "Reported Profile Picture URL",
        "Reported Is Verified",
        "Reported Signup Type",
        "Total Reports on User",
        "Report Reason",
        "Reported On",
        "Reporter Username",
        "Reporter Full Name",
        "Reporter Email",
        "Reporter Phone",
        "Reporter Address",
        "Reporter IP Address",
      ];

      const csvRows = [headers.map(escapeCSV).join(",")];

      enrichedReports.forEach((entry) => {
        const reportedUser = entry.userid;
        const reportedUserFull = entry.reportedUserFull;

        entry.reports.forEach((indReport) => {
          const reportedBy = indReport.reportedBy || {};
          const reporterFull = indReport.reporterFull || {};

          const row = [
            reportedUser.username || "",
            `${reportedUser.firstname || ""} ${
              reportedUser.lastname || ""
            }`.trim(),
            reportedUser.email || "",
            reportedUserFull.phone || "",
            reportedUserFull.address || reportedUser.address || "",
            reportedUserFull.ipAddress || reportedUser.ipAddress || "",
            reportedUserFull.dob || "",
            reportedUserFull.bio || "",
            reportedUserFull.profilePictureUrl ||
              reportedUser.profilePicUrl ||
              "",
            reportedUserFull.isVerified ? "Yes" : "No",
            reportedUserFull.signupType || "",
            entry.totalReports,
            indReport.reason || "",
            new Date(indReport.reportedOn).toLocaleString(),
            reportedBy.username || "",
            `${reportedBy.firstname || ""} ${reportedBy.lastname || ""}`.trim(),
            reportedBy.email || "",
            reporterFull.phone || "",
            reporterFull.address || reportedBy.address || "",
            reporterFull.ipAddress || reportedBy.ipAddress || "",
          ];

          csvRows.push(row.map(escapeCSV).join(","));
        });
      });

      const csvContent = BOM + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reported_users_full_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Full detailed CSV downloaded!",
        timer: 2000,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate CSV.",
      });
    } finally {
      setCsvLoading(false);
    }
  };

  // ==================== INDIVIDUAL USER CSV DOWNLOAD ====================
  const downloadIndividualUserCSV = async (userId, username, userData) => {
    if (individualCsvLoading[userId]) return;

    setIndividualCsvLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      // Use the existing data from the table instead of making new API calls
      const userEntry = reportsData.reports.find(
        (report) => report.userid._id === userId
      );

      if (!userEntry) {
        throw new Error("User data not found");
      }

      const u = userEntry.userid;

      // Fetch full user details from existing API
      let reportedUserFull = {};
      try {
        const userRes = await fetch(`${API_BASE}/user/getUserById/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          reportedUserFull = userData.user || {};
        }
      } catch (e) {}

      // Fetch reporter details for each report
      const enrichedReports = await Promise.all(
        userEntry.reports.map(async (report) => {
          let reporterFull = {};
          if (report.reportedBy?._id) {
            try {
              const reporterRes = await fetch(
                `${API_BASE}/user/getUserById/${report.reportedBy._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (reporterRes.ok) {
                const reporterData = await reporterRes.json();
                reporterFull = reporterData.user || {};
              }
            } catch (e) {}
          }
          return { ...report, reporterFull };
        })
      );

      const escapeCSV = (text) => {
        if (!text) return "N/A";
        const str = String(text).trim();
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      const BOM = "\uFEFF";
      const headers = [
        "Reported Username",
        "Reported Full Name",
        "Reported Email",
        "Reported Phone",
        "Reported Address",
        "Reported IP Address",
        "Reported DOB",
        "Reported Bio",
        "Reported Profile Picture URL",
        "Reported Is Verified",
        "Reported Signup Type",
        "Total Reports on User",
        "Report Reason",
        "Reported On",
        "Reporter Username",
        "Reporter Full Name",
        "Reporter Email",
        "Reporter Phone",
        "Reporter Address",
        "Reporter IP Address",
      ];

      const csvRows = [headers.map(escapeCSV).join(",")];

      enrichedReports.forEach((report) => {
        const reportedBy = report.reportedBy || {};
        const reporterFull = report.reporterFull || {};

        const row = [
          u.username || "",
          `${u.firstname || ""} ${u.lastname || ""}`.trim(),
          u.email || "",
          reportedUserFull.phone || "",
          reportedUserFull.address || u.address || "",
          reportedUserFull.ipAddress || u.ipAddress || "",
          reportedUserFull.dob || "",
          reportedUserFull.bio || "",
          reportedUserFull.profilePictureUrl || u.profilePicUrl || "",
          reportedUserFull.isVerified ? "Yes" : "No",
          reportedUserFull.signupType || "",
          userEntry.totalReports,
          report.reason || "",
          new Date(report.reportedOn).toLocaleString(),
          reportedBy.username || "",
          `${reportedBy.firstname || ""} ${reportedBy.lastname || ""}`.trim(),
          reportedBy.email || "",
          reporterFull.phone || "",
          reporterFull.address || reportedBy.address || "",
          reporterFull.ipAddress || reportedBy.ipAddress || "",
        ];

        csvRows.push(row.map(escapeCSV).join(","));
      });

      const csvContent = BOM + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `user_reports_${username || userId}_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `CSV for ${username} downloaded!`,
        timer: 1500,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to generate individual CSV.",
      });
    } finally {
      setIndividualCsvLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="userreports-container">
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
          <button
            className="btn-download-csv"
            onClick={downloadUserReportsCSV}
            disabled={csvLoading}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {csvLoading ? "Generating..." : "Download All CSV"}
          </button>
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
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.reports.map((report) => {
                  const u = report.userid;
                  const isBlocked = u.systemBlocked;
                  const isUnderStrike = u.underStrike;
                  const isLoading = actionLoading[u._id];
                  const isCsvLoading = individualCsvLoading[u._id];

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
                      <td>
                        <button
                          className="btn-download-individual-csv"
                          onClick={() =>
                            downloadIndividualUserCSV(u._id, u.username, u)
                          }
                          disabled={isCsvLoading}
                          style={{
                            padding: "6px 12px",
                            background: "#17a2b8",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            minWidth: "80px",
                          }}
                        >
                          {isCsvLoading ? "Generating..." : "Download CSV"}
                        </button>
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
