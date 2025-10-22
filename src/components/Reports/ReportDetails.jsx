import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./reports.css";
import Loader from "../Loader/Loader";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/user/getReportById/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }
        const data = await response.json();
        if (data.report) {
          setReportData(data.report);
          setError(null);
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

    fetchReportDetails();
  }, [id]);

  const handleBack = () => {
    navigate("/frenzone/totalreports");
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
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
        );
      } else if (content.contentType === "video/mp4") {
        return (
          <div key={index} className="video-container">
            <video
              src={content.objectUrl}
              controls
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            >
              Your browser does not support the video tag.
            </video>
            {/* {content.thumbnail && (
              <img
                src={content.thumbnail}
                alt="Video thumbnail"
                className="video-thumbnail"
              />
            )} */}
          </div>
        );
      }
      return null;
    });
  };

  const renderComments = (comments) => {
    if (!comments || !comments.length) {
      return <p>No comments available</p>;
    }

    return (
      <div className="comments-section">
        {comments.map((commentId, index) => (
          <p key={index} className="comment-item">
            <strong>Comment {index + 1} ID:</strong> {commentId}
          </p>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="reports-error">{error}</div>;
  }

  if (!reportData || !reportData.postid || !reportData.userid) {
    return <div className="reports-error">Invalid report data</div>;
  }

  return (
    <div className="reports-container">
      <div className="reports-container-inner">
        <div className="reports-heading">
          <h2>Report Details</h2>
        </div>
        <div className="reports-modal-content">
          <div className="report-message">
            <p>
              Post by{" "}
              <strong>
                {reportData.postid.user?.username || "Unknown User"}
              </strong>{" "}
              has been reported by{" "}
              <strong>
                {reportData.userid.username || "Unknown Reporter"}
              </strong>
              .
            </p>
          </div>
          {/* Reporter Section */}
          <div className="reporter-section">
            <h3>Reported By</h3>
            <div className="user-info">
              {reportData.userid.profilePictureUrl && (
                <img
                  src={reportData.userid.profilePictureUrl}
                  alt="Reporter Profile"
                  className="reports-profile-pic"
                />
              )}
              <div>
                <p>
                  <strong>Username:</strong>{" "}
                  {reportData.userid.username || "N/A"}
                </p>
                <p>
                  <strong>First Name:</strong>{" "}
                  {reportData.userid.firstname || "N/A"}
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  {reportData.userid.lastname || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {reportData.userid.email || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {reportData.userid.address || "N/A"}
                </p>
                <p>
                  <strong>IP Address:</strong>{" "}
                  {reportData.userid.ipAddress || "N/A"}
                </p>
              </div>
            </div>
            <p>
              <strong>Reason for Report:</strong> {reportData.message || "N/A"}
            </p>
            <p>
              <strong>Reported At:</strong>{" "}
              {reportData.createdAt
                ? new Date(reportData.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Post Owner Section */}
          <div className="post-owner-section">
            <h3>Post Owner</h3>
            <div className="user-info">
              {reportData.postid.user?.profilePicture && (
                <img
                  src={reportData.postid.user.profilePicture}
                  alt="Post Owner Profile"
                  className="reports-profile-pic"
                />
              )}
              <div>
                <p>
                  <strong>Username:</strong>{" "}
                  {reportData.postid.user?.username || "N/A"}
                </p>
                <p>
                  <strong>First Name:</strong>{" "}
                  {reportData.postid.user?.firstname || "N/A"}
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  {reportData.postid.user?.lastname || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Reported Post Section */}
          <div className="post-section">
            <h3>Reported Post</h3>
            <p>
              <strong>Description:</strong>{" "}
              {reportData.postid.description || "N/A"}
            </p>
            <div>
              <strong>Content:</strong>
              {renderPostContent(reportData.postid.contentArray)}
            </div>
            <p>
              <strong>Created At:</strong>{" "}
              {reportData.postid.createdAt
                ? new Date(reportData.postid.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="reports-modal-footer">
            <button className="reports-modal-button" onClick={handleBack}>
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
