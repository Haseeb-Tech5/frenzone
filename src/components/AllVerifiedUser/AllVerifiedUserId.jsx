import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./VerifiedUsers.css";

const AllVerifiedUserId = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const publicip = "https://api.frenzone.live";

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch(`${publicip}/user/getUserById/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.user) {
        setUserData(data.user);
        setError(null);
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch user details");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to fetch user details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const safeImage = (url, fallback = "/default-avatar.png") => {
    if (!url) return fallback;
    return url.startsWith("http") ? url : fallback;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="verified-users-detail-container">
        <div className="verified-users-detail-inner">
          <h2 style={{ color: "var(--orange)" }}>Error Loading User</h2>
          <button
            className="verified-users-back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="verified-users-detail-container">
        <div className="verified-users-detail-inner">
          <h2 style={{ color: "var(--orange)" }}>User Not Found</h2>
          <button
            className="verified-users-back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const u = userData;

  return (
    <div className="verified-users-detail-container">
      <div className="verified-users-detail-inner">
        <button
          className="verified-users-back-btn"
          onClick={() => navigate(-1)}
        >
          Back to Verified Users
        </button>

        <div className="verified-users-header">
          <img
            src={safeImage(u.profilePictureUrl || u.profilePictureUrl)}
            alt={u.username}
            className="verified-users-big-avatar"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <div className="verified-users-main-info">
            <h2>{u.username}</h2>
            <p className="verified-users-fullname">
              {u.firstname} {u.lastname}
            </p>
            <p className="verified-users-bio-text">"{u.bio || "No bio set"}"</p>

            <div className="verified-users-tags">
              {u.isVerified && (
                <span className="verified-users-tag verified-users-verified">
                  Verified
                </span>
              )}
              {u.identityVerified && (
                <span className="verified-users-tag verified-users-id">
                  ID Verified
                </span>
              )}
              {u.underStrike && (
                <span className="verified-users-tag verified-users-strike">
                  Under Strike
                </span>
              )}
              {u.systemBlocked && (
                <span className="verified-users-tag verified-users-blocked">
                  System Blocked
                </span>
              )}
              {u.banned && (
                <span className="verified-users-tag verified-users-banned">
                  BANNED
                </span>
              )}
              {u.isLive && (
                <span className="verified-users-tag verified-users-live">
                  LIVE NOW
                </span>
              )}
              {u.isOnCall && (
                <span className="verified-users-tag verified-users-call">
                  On Call
                </span>
              )}
            </div>

            <div className="verified-users-stats-big">
              <div>
                <strong>{u.followers?.length || 0}</strong> Followers
              </div>
              <div>
                <strong>{u.following?.length || 0}</strong> Following
              </div>
              <div>
                <strong>{u.posts?.length || 0}</strong> Posts
              </div>
              <div>
                <strong>{u.stories?.length || 0}</strong> Stories
              </div>
              <div>
                <strong>{u.reels?.length || 0}</strong> Reels
              </div>
              <div>
                <strong>{u.clubsJoined?.length || 0}</strong> Clubs
              </div>
            </div>
          </div>

          <div className="verified-users-total-stats">
            Account Status
            <strong>{u.isVerified ? "VERIFIED" : "UNVERIFIED"}</strong>
          </div>
        </div>

        <hr className="verified-users-divider" />

        <h3 className="verified-users-section-title">Personal Information</h3>
        <div className="verified-users-info-grid">
          <div>
            <strong>Email:</strong> {u.email}
          </div>
          <div>
            <strong>Phone:</strong> {u.phone || "Not provided"}
          </div>
          <div>
            <strong>DOB:</strong> {u.dob || "Not set"}
          </div>
          <div>
            <strong>Tag:</strong> @{u.tag || "None"}
          </div>
          {/* <div>
            <strong>Login Via:</strong> {u.loginFrom || "Unknown"}
          </div> */}
          <div>
            <strong>Joined:</strong>{" "}
            {new Date(u.createdAt || Date.now()).toLocaleDateString()}
          </div>
          <div>
            <strong>IP Address:</strong> {u.ipAddress || "N/A"}
          </div>
          <div>
            <strong>Location:</strong> {u.address || "Not set"}
          </div>
        </div>

        <hr className="verified-users-divider" />

        <h3 className="verified-users-section-title">Account Status</h3>
        <div className="verified-users-status-grid">
          <div>
            <strong>Online Now:</strong>{" "}
            <span
              className={
                u.is_online === "1"
                  ? "verified-users-online"
                  : "verified-users-offline"
              }
            >
              {u.is_online === "1" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div>
            <strong>Live Access:</strong> {u.liveAccess ? "Yes" : "No"}
          </div>
          <div>
            <strong>Admin Blocked:</strong> {u.isAdminBlocked ? "Yes" : "No"}
          </div>
          {/* <div>
            <strong>Identity Status:</strong>{" "}
            {u.identifyApprovalStatus?.toUpperCase() || "NONE"}
          </div> */}
          {/* <div>
            <strong>Payment Verified:</strong>{" "}
            {u.paymentVerified ? "Yes" : "No"}
          </div> */}
          {/* <div>
            <strong>LEM Verified:</strong> {u.lemVerified ? "Yes" : "No"}
          </div> */}
        </div>

        <hr className="verified-users-divider" />

        {u.twitterUrl || u.instagramUrl || u.facebookUrl ? (
          <>
            <h3 className="verified-users-section-title">Social Links</h3>
            <div className="verified-users-social-grid">
              {u.twitterUrl && (
                <div>
                  Twitter/X:{" "}
                  <a
                    href={u.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.twitterUrl}
                  </a>
                </div>
              )}
              {u.instagramUrl && (
                <div>
                  Instagram:{" "}
                  <a
                    href={u.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.instagramUrl}
                  </a>
                </div>
              )}
              {u.facebookUrl && (
                <div>
                  Facebook:{" "}
                  <a
                    href={u.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.facebookUrl}
                  </a>
                </div>
              )}
              {u.linkedinUrl && (
                <div>
                  LinkedIn:{" "}
                  <a
                    href={u.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.linkedinUrl}
                  </a>
                </div>
              )}
              {u.WebsiteUrl && (
                <div>
                  Website:{" "}
                  <a
                    href={u.WebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {u.WebsiteUrl}
                  </a>
                </div>
              )}
            </div>
          </>
        ) : null}

        <hr className="verified-users-divider" />

        {u.strikeHistory?.length > 0 && (
          <>
            <h3 className="verified-users-section-title">
              Strike History ({u.strikeHistory.length})
            </h3>
            <div className="verified-users-strike-list">
              {u.strikeHistory.map((s, index) => (
                <div
                  key={s._id || index}
                  className="verified-users-strike-card"
                >
                  <div className="verified-users-strike-reason">
                    <strong>{s.reason}</strong>
                    <span className={`verified-users-status-badge ${s.status}`}>
                      {s.status?.toUpperCase() || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="verified-users-strike-dates">
                    {new Date(s.startDate).toLocaleString()} →{" "}
                    {s.endDate
                      ? new Date(s.endDate).toLocaleString()
                      : "Active"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* <hr className="verified-users-divider" />

        <h3 className="verified-users-section-title">Additional Information</h3>
        <div className="verified-users-additional-grid">
          <div>
            <strong>Bank Account:</strong>{" "}
            {u.bankAccount ? "Linked" : "Not Linked"}
          </div>
          <div>
            <strong>PayPal Account:</strong>{" "}
            {u.paypalAccount ? "Linked" : "Not Linked"}
          </div>
          <div>
            <strong>Subscribed Products:</strong>{" "}
            {u.subscribedProducts?.length || 0}
          </div>
          <div>
            <strong>FCM Tokens:</strong> {u.fcmtoken?.length || 0}
          </div>
          <div>
            <strong>Blocked Users:</strong> {u.blocked?.length || 0}
          </div>
          <div>
            <strong>Blocked By:</strong> {u.blockedBy?.length || 0}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AllVerifiedUserId;
