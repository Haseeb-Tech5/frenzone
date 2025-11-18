import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./reports.css";
import Loader from "../Loader/Loader";

const Reports = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/user/getAllReports?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch reports");

        const data = await response.json();

        if (data.success) {
          const sortedReports = {
            ...data,
            reports: [...data.reports].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
          };
          setReportsData(sortedReports);
          setError(null);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError("Failed to fetch report data");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch report data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [page, limit]);

  const handleViewDetails = (reportId) => {
    navigate(`/frenzone/report/${reportId}`);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage > 0 &&
      reportsData &&
      newPage <= Math.ceil(reportsData.count / limit)
    ) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="reports-container">
      {loading && <Loader />}

      <div className="reports-container-inner">
        <div className="reports-heading">
          <h2>Reported Users</h2>
        </div>

        {error && <div className="reports-error">{error}</div>}

        {reportsData && reportsData.reports?.length > 0 ? (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>type</th>
                  <th>Post Description</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsData.reports.map((report) => {
                  const user = report.userid; // may be null (deleted user)
                  const reportedUser = report.reported; // for harmful type reports
                  const post = report.postid; // may be null

                  return (
                    <tr
                      key={report._id}
                      className="reports-row reports-animate"
                    >
                      {/* ---------- User column (with fallbacks) ---------- */}
                      <td className="reports-user">
                        {user ? (
                          <>
                            <img
                              src={
                                user.profilePicUrl || "/default-avatar.png" // you can add a default image
                              }
                              alt={user.username || "User"}
                              className="reports-profile-pic"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png"; // fallback if image 404
                              }}
                            />
                            <span>{user.username || "Unknown User"}</span>
                          </>
                        ) : (
                          <>
                            <div className="reports-profile-pic-placeholder">
                              ?
                            </div>
                            {/* <span className="deleted-user">Deleted User</span> */}
                          </>
                        )}
                      </td>
                      {/* ---------- Post description ---------- */}
                      <td>
                        <span
                          className={`report-type-badge ${
                            report.type || "post"
                          }`}
                        >
                          {report.type === "harmful"
                            ? "Harmful User"
                            : "Post Report"}
                        </span>
                      </td>{" "}
                      <td>{post?.description || "Post no longer available"}</td>
                      {/* ---------- Reason ---------- */}
                      <td>{report.message || "-"}</td>
                      {/* ---------- Date ---------- */}
                      <td>
                        {new Date(report.createdAt).toLocaleDateString(
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
                      {/* ---------- Actions ---------- */}
                      <td>
                        <button
                          className="reports-detail-button"
                          onClick={() => handleViewDetails(report._id)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ---------- Pagination & limit controls ---------- */}
            <div className="reports-meta">
              <p>
                Showing page {reportsData.page} of{" "}
                {Math.ceil(reportsData.count / limit)} ({reportsData.count}{" "}
                reports)
              </p>

              <div className="pagination-controls1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= Math.ceil(reportsData.count / limit)}
                >
                  Next
                </button>
              </div>

              <div className="limit-controls">
                <label>Reports per page: </label>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="reports-no-data">No reports available</div>
          )
        )}
      </div>
    </div>
  );
};

export default Reports;
