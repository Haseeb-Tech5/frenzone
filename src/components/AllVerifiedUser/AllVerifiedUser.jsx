import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./VerifiedUsers.css";

const AllVerifiedUser = () => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const publicip = "https://api.frenzone.live";

  useEffect(() => {
    fetchVerifiedUsers();
  }, [page, limit]);

  const fetchVerifiedUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(
        `${publicip}/user/getAllVerifiedUsers?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsersData(data);
        setError(null);
      } else {
        throw new Error(data.message || "API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch verified users data");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to fetch verified users data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/frenzone/verifieduser/${userId}`);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage > 0 &&
      usersData &&
      newPage <= Math.ceil(usersData.count / limit)
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

  const getVerificationStatus = (user) => {
    if (user.identityVerified)
      return { text: "Identity Verified", class: "verified-user-status" };
    if (user.lemVerified)
      return { text: "LEM Verified", class: "lem-verified-user-status" };
    return { text: "Verified", class: "basic-verified-user-status" };
  };

  return (
    <div className="verified-users-main-container">
      {loading && <Loader />}

      <div className="verified-users-content-wrapper">
        <div className="verified-users-header-section">
          <h2>Verified Users</h2>
        </div>

        {error && <div className="verified-users-error-message">{error}</div>}

        {usersData && usersData.users?.length > 0 ? (
          <>
            <div className="verified-users-table-container">
              <table className="verified-users-data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    {/* <th>Followers</th>
                    <th>Following</th> */}
                    <th>Posts</th>
                    <th>Verification Status</th>
                    {/* <th>Join Date</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.users.map((user) => {
                    const verificationInfo = getVerificationStatus(user);

                    return (
                      <tr
                        key={user._id}
                        className="verified-users-table-row verified-users-fade-in"
                      >
                        <td className="verified-users-user-cell">
                          <img
                            src={getProfilePic(
                              user.profilePicUrl || user.profilePicture
                            )}
                            alt={user.username}
                            className="verified-users-avatar"
                          />
                          <div className="verified-users-user-info">
                            <div className="verified-users-username">
                              {user.username}
                            </div>
                            <small className="verified-users-fullname">
                              {user.firstname} {user.lastname}
                            </small>
                          </div>
                        </td>
                        <td className="verified-users-email">{user.email}</td>
                        {/* <td className="verified-users-count">
                          {user.followers?.length || 0}
                        </td>
                        <td className="verified-users-count">
                          {user.following?.length || 0}
                        </td> */}
                        <td className="verified-users-count">
                          {user.posts?.length || 0}
                        </td>
                        <td>
                          <span
                            className={`verified-users-status-badge ${verificationInfo.class}`}
                          >
                            {verificationInfo.text}
                          </span>
                        </td>
                        {/* <td className="verified-users-join-date">
                          {new Date(
                            user.createdAt ||
                              user._id.toString().substring(0, 8) * 1000
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td> */}
                        <td className="verified-users-actions">
                          <button
                            className="verified-users-details-btn"
                            onClick={() => handleViewDetails(user._id)}
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
            <div className="verified-users-pagination-section">
              <p className="verified-users-pagination-info">
                Showing page {usersData.page} of{" "}
                {Math.ceil(usersData.count / limit)} ({usersData.count} users)
              </p>

              <div className="verified-users-pagination-controls">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="verified-users-pagination-btn"
                >
                  Previous
                </button>
                <span className="verified-users-page-indicator">
                  Page {page}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= Math.ceil(usersData.count / limit)}
                  className="verified-users-pagination-btn"
                >
                  Next
                </button>
              </div>

              <div className="verified-users-limit-controls">
                <label className="verified-users-limit-label">Per page: </label>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="verified-users-limit-select"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="verified-users-empty-state">
              No verified users found
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllVerifiedUser;
