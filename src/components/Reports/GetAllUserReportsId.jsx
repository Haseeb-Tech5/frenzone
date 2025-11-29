import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./GetAllUserReportsId.css";

const GetAllUserReportsId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reportData, setReportData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://api.frenzone.live";

  const safeImage = (url, fallback = "/default-avatar.png") => {
    if (!url) return fallback;
    return url.startsWith("http") ? url : fallback;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [repRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/user/getUserReports/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/user/getUserById/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const repJson = await repRes.json();
        const userJson = await userRes.json();

        if (repJson.success && userJson.user) {
          setReportData(repJson.report);
          setUserInfo(userJson.user);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load user data", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchData();
  }, [id, token]);

  if (loading) return <Loader />;
  if (!userInfo || !reportData) {
    return (
      <div className="userreports-detail-container">
        <div className="userreports-detail-inner">
          <h2 style={{ color: "var(--orange)" }}>User Not Found</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const u = userInfo;

  return (
    <div className="userreports-detail-container">
      <div className="userreports-detail-inner">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Reported Users
        </button>

        <div className="reported-user-header">
          <img
            src={safeImage(u.profilePictureUrl)}
            alt={u.username}
            className="user-big-avatar"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <div className="user-main-info">
            <h2>{u.username}</h2>
            <p className="fullname">
              {u.firstname} {u.lastname}
            </p>
            <p className="bio-text">"{u.bio || "No bio set"}"</p>

            <div className="user-tags">
              {u.isVerified && <span className="tag verified">Verified</span>}
              {u.identityVerified && (
                <span className="tag id">ID Verified</span>
              )}
              {u.underStrike && (
                <span className="tag strike">Under Strike</span>
              )}
              {u.systemBlocked && (
                <span className="tag blocked">System Blocked</span>
              )}
              {u.banned && <span className="tag banned">BANNED</span>}
              {u.isLive && <span className="tag live">LIVE NOW</span>}
              {u.isOnCall && <span className="tag call">On Call</span>}
            </div>

            <div className="user-stats-big">
              <div>
                <strong>{reportData.totalReports || 0}</strong> Reports
              </div>
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
            </div>
          </div>

          <div className="total-reports-big">
            Total Reports
            <strong>{reportData.totalReports || 0}</strong>
          </div>
        </div>

        <hr className="userreports-divider" />

        <h3 className="section-title">Personal Information</h3>
        <div className="info-grid">
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

        <hr className="userreports-divider" />

        <h3 className="section-title">Account Status</h3>
        <div className="status-grid">
          <div>
            <strong>Online Now:</strong>{" "}
            <span className={u.is_online === "1" ? "online" : "offline"}>
              {u.is_online === "1" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div>
            <strong>Live Access:</strong> {u.liveAccess ? "Yes" : "No"}
          </div>
          <div>
            <strong>Admin Blocked:</strong> {u.isAdminBlocked ? "Yes" : "No"}
          </div>
          <div>
            <strong>Identity Status:</strong>{" "}
            {u.identifyApprovalStatus?.toUpperCase()}
          </div>
        </div>

        <hr className="userreports-divider" />

        {u.twitterUrl || u.instagramUrl || u.facebookUrl ? (
          <>
            <h3 className="section-title">Social Links</h3>
            <div className="social-grid">
              {u.twitterUrl && (
                <div>
                  Twitter/X:{" "}
                  <a href={u.twitterUrl} target="_blank">
                    {u.twitterUrl}
                  </a>
                </div>
              )}
              {u.instagramUrl && (
                <div>
                  Instagram:{" "}
                  <a href={u.instagramUrl} target="_blank">
                    {u.instagramUrl}
                  </a>
                </div>
              )}
              {u.facebookUrl && (
                <div>
                  Facebook:{" "}
                  <a href={u.facebookUrl} target="_blank">
                    {u.facebookUrl}
                  </a>
                </div>
              )}
              {u.linkedinUrl && (
                <div>
                  LinkedIn:{" "}
                  <a href={u.linkedinUrl} target="_blank">
                    {u.linkedinUrl}
                  </a>
                </div>
              )}
              {u.WebsiteUrl && (
                <div>
                  Website:{" "}
                  <a href={u.WebsiteUrl} target="_blank">
                    {u.WebsiteUrl}
                  </a>
                </div>
              )}
            </div>
          </>
        ) : null}

        <hr className="userreports-divider" />

        {u.strikeHistory?.length > 0 && (
          <>
            <h3 className="section-title">
              Strike History ({u.strikeHistory.length})
            </h3>
            <div className="strike-list">
              {u.strikeHistory.map((s) => (
                <div key={s._id} className="strike-card">
                  <div className="strike-reason">
                    <strong>{s.reason}</strong>
                    <span className={`status-badge ${s.status}`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="strike-dates">
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

        <hr className="userreports-divider" />

        <h3 className="reports-title">
          All Reports ({reportData.reports?.length || 0})
        </h3>
        <div className="reports-list">
          {reportData.reports?.map((rep, idx) => (
            <div key={rep._id} className="single-report-card">
              <div className="report-header">
                <span className="report-number">Report #{idx + 1}</span>
                <span className="report-date">
                  {new Date(rep.reportedOn).toLocaleString()}
                </span>
              </div>
              <div className="report-reason">
                <strong>Reason:</strong> {rep.reason || "No reason given"}
              </div>
              <div className="reporter-section">
                <strong>Reported By:</strong>
                <div className="reporter-info">
                  <img
                    src={safeImage(
                      rep.reportedBy?.profilePictureUrl ||
                        rep.reportedBy?.profilePicture
                    )}
                    alt={rep.reportedBy?.username}
                    className="reporter-pic"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                  <div>
                    <div className="reporter-username">
                      {rep.reportedBy?.username || "Unknown"}
                    </div>
                    <small>
                      {rep.reportedBy?.firstname} {rep.reportedBy?.lastname}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetAllUserReportsId;
