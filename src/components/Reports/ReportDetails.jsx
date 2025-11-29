import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./reports.css";
import Loader from "../Loader/Loader";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [postOwnerData, setPostOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postOwnerLoading, setPostOwnerLoading] = useState(false);
  const [error, setError] = useState(null);

  const publicip = "https://api.frenzone.live";

  useEffect(() => {
    const fetchReportDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${publicip}/user/getReportById/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }
        const data = await response.json();
        if (data.report) {
          setReportData(data.report);
          setError(null);

          // Fetch post owner details if post owner ID exists
          if (data.report.postid?.user?._id) {
            fetchPostOwnerDetails(data.report.postid.user._id);
          }
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (error) {
        setError("Failed to fetch report details");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch report details.",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchPostOwnerDetails = async (userId) => {
      setPostOwnerLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${publicip}/user/getUserById/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post owner details");
        }

        const data = await response.json();
        if (data.user) {
          setPostOwnerData(data.user);
        } else {
          throw new Error("Post owner not found");
        }
      } catch (error) {
        console.error("Error fetching post owner details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch post owner details.",
        });
      } finally {
        setPostOwnerLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const handleBack = () => {
    navigate("/frenzone/totalreports");
  };

  const safeImage = (url, fallback = "/default-avatar.png") => {
    if (!url) return fallback;
    return url.startsWith("http") ? url : fallback;
  };

  const getAvatarFallback = (username, firstName, lastName) => {
    const firstChar = (
      username?.[0] ||
      firstName?.[0] ||
      lastName?.[0] ||
      "U"
    ).toUpperCase();
    return firstChar;
  };

  const handleImageError = (e, username, firstName, lastName) => {
    const fallbackChar = getAvatarFallback(username, firstName, lastName);
    e.target.style.display = "none";

    const fallbackDiv = document.createElement("div");
    fallbackDiv.className = "reportdetails-avatar-fallback";
    fallbackDiv.textContent = fallbackChar;

    e.target.parentNode.appendChild(fallbackDiv);
  };

  const renderPostContent = (contentArray) => {
    if (!contentArray || !contentArray.length) {
      return <p>No content available</p>;
    }

    return contentArray.map((content, index) => {
      if (
        content.contentType === "image/png" ||
        content.contentType === "image/jpeg"
      ) {
        return (
          <img
            key={index}
            src={content.objectUrl}
            alt="Reported post"
            className="reportdetails-content-image"
          />
        );
      } else if (content.contentType === "video/mp4") {
        return (
          <div key={index} className="reportdetails-video-container">
            <video
              src={content.objectUrl}
              controls
              className="reportdetails-content-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
      return null;
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="reportdetails-error">{error}</div>;
  }

  if (!reportData || !reportData.postid || !reportData.userid) {
    return <div className="reportdetails-error">Invalid report data</div>;
  }

  const reporter = reportData.userid;
  const postOwner = reportData.postid.user;

  return (
    <div className="reportdetails-container">
      <div className="reportdetails-inner">
        <button className="reportdetails-back-btn" onClick={handleBack}>
          Back to Reports
        </button>

        <div className="reportdetails-header">
          <h2>Report Details</h2>
          <div className="reportdetails-overview">
            {/* <div className="reportdetails-badge">
              Report ID: <strong>{id}</strong>
            </div> */}
            <div className="reportdetails-date-badge">
              {reportData.createdAt
                ? new Date(reportData.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
            <div className={`reportdetails-type-badge ${reportData.type}`}>
              {reportData.type?.toUpperCase() || "POST"}
            </div>
          </div>
        </div>

        <div className="reportdetails-message-card">
          <div className="reportdetails-message-icon">⚠️</div>
          <div className="reportdetails-message-content">
            <p>
              Post by <strong>{postOwner?.username || "Unknown User"}</strong>{" "}
              has been reported by{" "}
              <strong>{reporter.username || "Unknown Reporter"}</strong>
            </p>
            <div className="reportdetails-reason-box">
              <strong>Reason:</strong>{" "}
              {reportData.message || "No reason provided"}
            </div>
          </div>
        </div>

        <hr className="reportdetails-divider" />

        {/* Reporter Section - Full User Profile */}
        <h3 className="reportdetails-section-title">Reporter Information</h3>
        <div className="reportdetails-user-card reportdetails-reporter-card">
          <div className="reportdetails-user-header">
            <div className="reportdetails-avatar-container">
              <img
                src={safeImage(reporter.profilePictureUrl)}
                alt="Reporter Profile"
                className="reportdetails-user-avatar"
                onError={(e) =>
                  handleImageError(
                    e,
                    reporter.username,
                    reporter.firstname,
                    reporter.lastname
                  )
                }
              />
            </div>
            <div className="reportdetails-user-info">
              <h4>{reporter.username || "N/A"}</h4>
              <p className="reportdetails-user-fullname">
                {reporter.firstname || ""} {reporter.lastname || ""}
              </p>
              <p className="reportdetails-bio-text">
                "{reporter.bio || "No bio set"}"
              </p>

              <div className="reportdetails-user-tags">
                {reporter.isVerified && (
                  <span className="reportdetails-tag reportdetails-verified">
                    Verified
                  </span>
                )}
                {reporter.identityVerified && (
                  <span className="reportdetails-tag reportdetails-id">
                    ID Verified
                  </span>
                )}
                {reporter.underStrike && (
                  <span className="reportdetails-tag reportdetails-strike">
                    Under Strike
                  </span>
                )}
                {reporter.systemBlocked && (
                  <span className="reportdetails-tag reportdetails-blocked">
                    System Blocked
                  </span>
                )}
                {reporter.banned && (
                  <span className="reportdetails-tag reportdetails-banned">
                    BANNED
                  </span>
                )}
                {reporter.isLive && (
                  <span className="reportdetails-tag reportdetails-live">
                    LIVE NOW
                  </span>
                )}
                {reporter.isOnCall && (
                  <span className="reportdetails-tag reportdetails-call">
                    On Call
                  </span>
                )}
              </div>

              <div className="reportdetails-user-stats">
                <div>
                  <strong>{reporter.followers?.length || 0}</strong> Followers
                </div>
                <div>
                  <strong>{reporter.following?.length || 0}</strong> Following
                </div>
                <div>
                  <strong>{reporter.posts?.length || 0}</strong> Posts
                </div>
                <div>
                  <strong>{reporter.stories?.length || 0}</strong> Stories
                </div>
                <div>
                  <strong>{reporter.reels?.length || 0}</strong> Reels
                </div>
              </div>
            </div>
          </div>

          <hr className="reportdetails-divider" />

          <h3 className="reportdetails-section-title">Personal Information</h3>
          <div className="reportdetails-info-grid">
            <div>
              <strong>Email:</strong> {reporter.email}
            </div>
            <div>
              <strong>Phone:</strong> {reporter.phone || "Not provided"}
            </div>
            <div>
              <strong>DOB:</strong> {reporter.dob || "Not set"}
            </div>
            <div>
              <strong>Tag:</strong> @{reporter.tag || "None"}
            </div>
            {/* <div>
              <strong>Login Via:</strong> {reporter.loginFrom || "Unknown"}
            </div> */}
            <div>
              <strong>Joined:</strong>{" "}
              {new Date(reporter.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <div>
              <strong>IP Address:</strong> {reporter.ipAddress || "N/A"}
            </div>
            <div>
              <strong>Location:</strong> {reporter.address || "Not set"}
            </div>
          </div>

          <hr className="reportdetails-divider" />

          <h3 className="reportdetails-section-title">Account Status</h3>
          <div className="reportdetails-status-grid">
            <div>
              <strong>Online Now:</strong>{" "}
              <span
                className={
                  reporter.is_online === "1"
                    ? "reportdetails-online"
                    : "reportdetails-offline"
                }
              >
                {reporter.is_online === "1" ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div>
              <strong>Live Access:</strong> {reporter.liveAccess ? "Yes" : "No"}
            </div>
            <div>
              <strong>Admin Blocked:</strong>{" "}
              {reporter.isAdminBlocked ? "Yes" : "No"}
            </div>
            <div>
              <strong>Identity Status:</strong>{" "}
              {reporter.identifyApprovalStatus?.toUpperCase() || "N/A"}
            </div>
            {/* <div>
              <strong>Payment Verified:</strong>{" "}
              {reporter.paymentVerified ? "Yes" : "No"}
            </div>
            <div>
              <strong>LEM Verified:</strong>{" "}
              {reporter.lemVerified ? "Yes" : "No"}
            </div> */}
          </div>

          {reporter.twitterUrl ||
          reporter.instagramUrl ||
          reporter.facebookUrl ? (
            <>
              <hr className="reportdetails-divider" />
              <h3 className="reportdetails-section-title">Social Links</h3>
              <div className="reportdetails-social-grid">
                {reporter.twitterUrl && (
                  <div>
                    Twitter/X:{" "}
                    <a
                      href={reporter.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reporter.twitterUrl}
                    </a>
                  </div>
                )}
                {reporter.instagramUrl && (
                  <div>
                    Instagram:{" "}
                    <a
                      href={reporter.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reporter.instagramUrl}
                    </a>
                  </div>
                )}
                {reporter.facebookUrl && (
                  <div>
                    Facebook:{" "}
                    <a
                      href={reporter.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reporter.facebookUrl}
                    </a>
                  </div>
                )}
                {reporter.linkedinUrl && (
                  <div>
                    LinkedIn:{" "}
                    <a
                      href={reporter.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reporter.linkedinUrl}
                    </a>
                  </div>
                )}
                {reporter.WebsiteUrl && (
                  <div>
                    Website:{" "}
                    <a
                      href={reporter.WebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reporter.WebsiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {reporter.strikeHistory?.length > 0 && (
            <>
              <hr className="reportdetails-divider" />
              <h3 className="reportdetails-section-title">
                Strike History ({reporter.strikeHistory.length})
              </h3>
              <div className="reportdetails-strike-list">
                {reporter.strikeHistory.map((s) => (
                  <div key={s._id} className="reportdetails-strike-card">
                    <div className="reportdetails-strike-reason">
                      <strong>{s.reason}</strong>
                      <span
                        className={`reportdetails-status-badge ${s.status}`}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="reportdetails-strike-dates">
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
        </div>

        <hr className="reportdetails-divider" />

        {/* Post Owner Section - Full User Profile */}
        <h3 className="reportdetails-section-title">Post Owner Information</h3>
        {postOwnerLoading ? (
          <div className="reportdetails-loading">
            Loading post owner details...
          </div>
        ) : postOwnerData ? (
          <div className="reportdetails-user-card reportdetails-postowner-card">
            <div className="reportdetails-user-header">
              <div className="reportdetails-avatar-container">
                <img
                  src={safeImage(
                    postOwnerData.profilePicUrl || postOwnerData.profilePicture
                  )}
                  alt="Post Owner Profile"
                  className="reportdetails-user-avatar"
                  onError={(e) =>
                    handleImageError(
                      e,
                      postOwnerData.username,
                      postOwnerData.firstname,
                      postOwnerData.lastname
                    )
                  }
                />
              </div>
              <div className="reportdetails-user-info">
                <h4>{postOwnerData.username || "N/A"}</h4>
                <p className="reportdetails-user-fullname">
                  {postOwnerData.firstname || ""} {postOwnerData.lastname || ""}
                </p>
                <p className="reportdetails-bio-text">
                  "{postOwnerData.bio || "No bio set"}"
                </p>

                <div className="reportdetails-user-tags">
                  {postOwnerData.isVerified && (
                    <span className="reportdetails-tag reportdetails-verified">
                      Verified
                    </span>
                  )}
                  {postOwnerData.identityVerified && (
                    <span className="reportdetails-tag reportdetails-id">
                      ID Verified
                    </span>
                  )}
                  {postOwnerData.underStrike && (
                    <span className="reportdetails-tag reportdetails-strike">
                      Under Strike
                    </span>
                  )}
                  {postOwnerData.systemBlocked && (
                    <span className="reportdetails-tag reportdetails-blocked">
                      System Blocked
                    </span>
                  )}
                  {postOwnerData.banned && (
                    <span className="reportdetails-tag reportdetails-banned">
                      BANNED
                    </span>
                  )}
                  {postOwnerData.isLive && (
                    <span className="reportdetails-tag reportdetails-live">
                      LIVE NOW
                    </span>
                  )}
                  {postOwnerData.isOnCall && (
                    <span className="reportdetails-tag reportdetails-call">
                      On Call
                    </span>
                  )}
                </div>

                <div className="reportdetails-user-stats">
                  <div>
                    <strong>{postOwnerData.followers?.length || 0}</strong>{" "}
                    Followers
                  </div>
                  <div>
                    <strong>{postOwnerData.following?.length || 0}</strong>{" "}
                    Following
                  </div>
                  <div>
                    <strong>{postOwnerData.posts?.length || 0}</strong> Posts
                  </div>
                  <div>
                    <strong>{postOwnerData.stories?.length || 0}</strong>{" "}
                    Stories
                  </div>
                  <div>
                    <strong>{postOwnerData.reels?.length || 0}</strong> Reels
                  </div>
                </div>
              </div>
            </div>

            <hr className="reportdetails-divider" />

            <h3 className="reportdetails-section-title">
              Personal Information
            </h3>
            <div className="reportdetails-info-grid">
              <div>
                <strong>Email:</strong> {postOwnerData.email}
              </div>
              <div>
                <strong>Phone:</strong> {postOwnerData.phone || "Not provided"}
              </div>
              <div>
                <strong>DOB:</strong> {postOwnerData.dob || "Not set"}
              </div>
              <div>
                <strong>Tag:</strong> @{postOwnerData.tag || "None"}
              </div>
              {/* <div>
                <strong>Login Via:</strong>{" "}
                {postOwnerData.loginFrom || "Unknown"}
              </div> */}
              <div>
                <strong>Joined:</strong>{" "}
                {new Date(
                  postOwnerData.createdAt || Date.now()
                ).toLocaleDateString()}
              </div>
              <div>
                <strong>IP Address:</strong> {postOwnerData.ipAddress || "N/A"}
              </div>
              <div>
                <strong>Location:</strong> {postOwnerData.address || "Not set"}
              </div>
            </div>

            <hr className="reportdetails-divider" />

            <h3 className="reportdetails-section-title">Account Status</h3>
            <div className="reportdetails-status-grid">
              <div>
                <strong>Online Now:</strong>{" "}
                <span
                  className={
                    postOwnerData.is_online === "1"
                      ? "reportdetails-online"
                      : "reportdetails-offline"
                  }
                >
                  {postOwnerData.is_online === "1" ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <div>
                <strong>Live Access:</strong>{" "}
                {postOwnerData.liveAccess ? "Yes" : "No"}
              </div>
              <div>
                <strong>Admin Blocked:</strong>{" "}
                {postOwnerData.isAdminBlocked ? "Yes" : "No"}
              </div>
              <div>
                <strong>Identity Status:</strong>{" "}
                {postOwnerData.identifyApprovalStatus?.toUpperCase() || "N/A"}
              </div>
              {/* <div>
                <strong>Payment Verified:</strong>{" "}
                {postOwnerData.paymentVerified ? "Yes" : "No"}
              </div>
              <div>
                <strong>LEM Verified:</strong>{" "}
                {postOwnerData.lemVerified ? "Yes" : "No"}
              </div> */}
            </div>

            {postOwnerData.twitterUrl ||
            postOwnerData.instagramUrl ||
            postOwnerData.facebookUrl ? (
              <>
                <hr className="reportdetails-divider" />
                <h3 className="reportdetails-section-title">Social Links</h3>
                <div className="reportdetails-social-grid">
                  {postOwnerData.twitterUrl && (
                    <div>
                      Twitter/X:{" "}
                      <a
                        href={postOwnerData.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postOwnerData.twitterUrl}
                      </a>
                    </div>
                  )}
                  {postOwnerData.instagramUrl && (
                    <div>
                      Instagram:{" "}
                      <a
                        href={postOwnerData.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postOwnerData.instagramUrl}
                      </a>
                    </div>
                  )}
                  {postOwnerData.facebookUrl && (
                    <div>
                      Facebook:{" "}
                      <a
                        href={postOwnerData.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postOwnerData.facebookUrl}
                      </a>
                    </div>
                  )}
                  {postOwnerData.linkedinUrl && (
                    <div>
                      LinkedIn:{" "}
                      <a
                        href={postOwnerData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postOwnerData.linkedinUrl}
                      </a>
                    </div>
                  )}
                  {postOwnerData.WebsiteUrl && (
                    <div>
                      Website:{" "}
                      <a
                        href={postOwnerData.WebsiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {postOwnerData.WebsiteUrl}
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : null}

            {postOwnerData.strikeHistory?.length > 0 && (
              <>
                <hr className="reportdetails-divider" />
                <h3 className="reportdetails-section-title">
                  Strike History ({postOwnerData.strikeHistory.length})
                </h3>
                <div className="reportdetails-strike-list">
                  {postOwnerData.strikeHistory.map((s) => (
                    <div key={s._id} className="reportdetails-strike-card">
                      <div className="reportdetails-strike-reason">
                        <strong>{s.reason}</strong>
                        <span
                          className={`reportdetails-status-badge ${s.status}`}
                        >
                          {s.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="reportdetails-strike-dates">
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
          </div>
        ) : (
          <div className="reportdetails-error">
            Unable to load post owner details
          </div>
        )}

        <hr className="reportdetails-divider" />

        {/* Reported Post Section */}
        <h3 className="reportdetails-section-title">Reported Post</h3>
        <div className="reportdetails-post-card">
          <div className="reportdetails-post-header">
            <div className="reportdetails-post-meta">
              <strong>Created:</strong>{" "}
              {reportData.postid.createdAt
                ? new Date(reportData.postid.createdAt).toLocaleString()
                : "N/A"}
            </div>
            <div className="reportdetails-post-stats">
              <span>
                <strong>{reportData.postid.likes?.length || 0}</strong> Likes
              </span>
              <span>
                <strong>{reportData.postid.comments?.length || 0}</strong>{" "}
                Comments
              </span>
              <span>
                <strong>{reportData.postid.shares || 0}</strong> Shares
              </span>
            </div>
          </div>

          <div className="reportdetails-post-description">
            <strong>Description:</strong>
            <p>{reportData.postid.description || "No description"}</p>
          </div>

          <div className="reportdetails-post-content-section">
            <strong>Content:</strong>
            <div className="reportdetails-post-content-grid">
              {renderPostContent(reportData.postid.contentArray)}
            </div>
          </div>
{/* 
          <div className="reportdetails-post-details">
            <div>
              <strong>Post Type:</strong> {reportData.postid.postType || "N/A"}
            </div>
            <div>
              <strong>Comments Allowed:</strong>{" "}
              {reportData.postid.commentsAllowed ? "Yes" : "No"}
            </div>
            <div>
              <strong>Pinned:</strong> {reportData.postid.pinned ? "Yes" : "No"}
            </div>
            <div>
              <strong>Location:</strong>{" "}
              {reportData.postid.location || "Not specified"}
            </div>
          </div> */}
        </div>

        <div className="reportdetails-footer">
          <button className="reportdetails-back-btn" onClick={handleBack}>
            Back to Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
