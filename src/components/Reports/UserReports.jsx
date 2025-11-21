import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./UserReports.css"; // We'll create this CSS below

const UserReports = () => {
  const token = localStorage.getItem("token");
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/user/getAllUsersReports`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user reports");
        }

        const data = await response.json();
        if (data.success) {
          setReportsData(data);
          setError(null);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError("Failed to load user reports");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not fetch reported users data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="userreports-container">
      {loading && <Loader />}
      <div className="userreports-container-inner">
        <div className="userreports-heading">
          <h2>Reported Users</h2>
        </div>

        {error && <div className="userreports-error">{error}</div>}

        {reportsData && reportsData.reports?.length > 0 ? (
          <div className="userreports-table-wrapper">
            <table className="userreports-table">
              <thead>
                <tr>
                  <th>Reported User</th>
                  <th>Total Reports</th>
                  <th>First Reported</th>
                  <th>Last Reported</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.reports.map((report) => (
                  <tr
                    key={report._id}
                    className="userreports-row userreports-animate"
                  >
                    <td className="userreports-user">
                      <img
                        src={
                          report.userid.profilePicUrl || "/default-avatar.png"
                        }
                        alt={report.userid.username}
                        className="userreports-profile-pic"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div>
                        <span className="userreports-username">
                          {report.userid.username}
                        </span>
                        <small className="userreports-name">
                          {report.userid.firstname} {report.userid.lastname}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="userreports-report-count">
                        {report.totalReports}
                      </span>
                    </td>
                    <td>
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      {new Date(report.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <button
                        className="userreports-detail-button"
                        onClick={() => openModal(report)}
                      >
                        View Reports
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="userreports-meta">
              <p>
                Showing page {reportsData.page} • Total {reportsData.count}{" "}
                reported user(s)
              </p>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="userreports-no-data">
              No users have been reported yet.
            </div>
          )
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <div className="userreports-modal-overlay" onClick={closeModal}>
          <div
            className="userreports-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="userreports-modal-header">
              <h3>User Report Details</h3>
              <button className="userreports-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="userreports-modal-content">
              <div className="userreports-reported-user">
                <img
                  src={
                    selectedReport.userid.profilePicUrl || "/default-avatar.png"
                  }
                  alt={selectedReport.userid.username}
                  className="userreports-modal-profile"
                />
                <div>
                  <strong>{selectedReport.userid.username}</strong>
                  <p>
                    {selectedReport.userid.firstname}{" "}
                    {selectedReport.userid.lastname}
                  </p>
                </div>
              </div>

              <p>
                <strong>Total Reports:</strong>{" "}
                <span className="highlight">{selectedReport.totalReports}</span>
              </p>

              <hr className="userreports-divider" />

              <h4>All Reports:</h4>
              {selectedReport.reports.map((rep, idx) => (
                <div key={rep._id} className="userreports-single-report">
                  <p className="report-number">Report #{idx + 1}</p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {rep.reason || "No reason provided"}
                  </p>
                  <p>
                    <strong>Reported By:</strong>
                  </p>
                  <div className="reporter-info">
                    <img
                      src={
                        rep.reportedBy.profilePicUrl || "/default-avatar.png"
                      }
                      alt={rep.reportedBy.username}
                      className="reporter-pic"
                    />
                    <div>
                      <span>{rep.reportedBy.username}</span>
                      <small>
                        {rep.reportedBy.firstname} {rep.reportedBy.lastname}
                      </small>
                    </div>
                  </div>
                  <p>
                    <strong>Reported On:</strong>{" "}
                    {new Date(rep.reportedOn).toLocaleString()}
                  </p>
                  {idx < selectedReport.reports.length - 1 && (
                    <hr className="report-separator" />
                  )}
                </div>
              ))}
            </div>

            <div className="userreports-modal-footer">
              <button className="userreports-modal-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReports;
