import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./total.css";

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

  const getProfilePic = (url) =>
    !url || url.trim() === "" ? "/default-avatar.png" : url;

  return (
    <div className="reports-container">
      {loading && <Loader />}

      <div className="reports-container-inner">
        <div className="reports-heading">
          <h2>Reported Users</h2>
        </div>

        {error && <div className="reports-error">{error}</div>}

        {reportsData && reportsData.reports?.length > 0 ? (
          <>
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Post Description</th>
                    <th>Reported User</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.reports.map((report) => {
                    const user = report.userid; // who made the report
                    const reportedUser = report.reported; // who is being reported (harmful reports)
                    const post = report.postid;

                    return (
                      <tr
                        key={report._id}
                        className="reports-row reports-animate"
                      >
                        {/* Reporter */}
                        <td className="reports-user">
                          <div className="reports-user-info">
                            <img
                              src={getProfilePic(user?.profilePicUrl)}
                              alt={user?.username || "User"}
                              className="reports-profile-pic"
                            />
                            <div>
                              <div className="username">
                                {user?.username || "Unknown User"}
                              </div>
                              <small>
                                {user?.firstname || ""} {user?.lastname || ""}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td>
                          <span
                            className={`status-badge ${report.type || "post"}`}
                          >
                            {report.type === "harmful"
                              ? "Harmful User"
                              : "Post Report"}
                          </span>
                        </td>

                        {/* Post Description */}
                        <td className="post-description">
                          {post?.description || "Post no longer available"}
                        </td>

                        {/* Reported User */}
                        <td>
                          {reportedUser ? (
                            <div className="reported-user-info">
                              <span className="reported-username">
                                {reportedUser.username || "Unknown"}
                              </span>
                            </div>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>

                        {/* Reason */}
                        <td className="reason">{report.message || "-"}</td>

                        {/* Date */}
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

                        {/* Actions */}
                        <td className="actions">
                          <button
                            className="btn-details"
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
            </div>

            {/* Pagination & Meta Information */}
            <div className="reports-meta">
              <p>
                Showing page {reportsData.page} of{" "}
                {Math.ceil(reportsData.count / limit)} ({reportsData.count}{" "}
                reports)
              </p>

              <div className="pagination-controls">
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
                <label>Per page: </label>
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
          </>
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
