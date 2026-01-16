import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./total.css";

const Reports = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csvLoading, setCsvLoading] = useState(false);
  const [individualCsvLoading, setIndividualCsvLoading] = useState({});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.frenzone.live/user/getAllReports?page=${page}&limit=${limit}`
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

  // ==================== FULL CSV EXPORT WITH UNICODE SUPPORT ====================
  const downloadCSV = async () => {
    setCsvLoading(true);
    try {
      let allReports = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `https://api.frenzone.live/user/getAllReports?page=${currentPage}&limit=100`
        );
        if (!res.ok) throw new Error("Failed to fetch all reports");
        const data = await res.json();
        if (!data.success || data.reports.length === 0) {
          hasMore = false;
        } else {
          allReports = [...allReports, ...data.reports];
          if (data.reports.length < 100) hasMore = false;
          currentPage++;
        }
      }

      const enrichedReports = await Promise.all(
        allReports.map(async (report) => {
          let reporterFull = {};
          let reportedFull = {};

          try {
            const reporterRes = await fetch(
              `https://api.frenzone.live/user/getUserById/${report.userid._id}`
            );
            if (reporterRes.ok) {
              const repData = await reporterRes.json();
              reporterFull = repData.user || {};
            }
          } catch (e) {}

          try {
            const reportedRes = await fetch(
              `https://api.frenzone.live/user/getUserById/${report.reported._id}`
            );
            if (reportedRes.ok) {
              const repData = await reportedRes.json();
              reportedFull = repData.user || {};
            }
          } catch (e) {}

          return { ...report, reporterFull, reportedFull };
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
        "Report Date",
        "Report Reason",
        "Report Type",
        "Post Description",
        "Post Created At",
        "Post Type",
        "Post Content URL",
        "Reporter Username",
        "Reporter Full Name",
        "Reporter Email",
        "Reporter Phone",
        "Reporter Address",
        "Reporter IP",
        "Reporter DOB",
        "Reporter Bio",
        "Reported Username",
        "Reported Full Name",
        "Reported Email",
        "Reported Phone",
        "Reported Address",
        "Reported IP",
        "Reported DOB",
        "Reported Bio",
      ];

      const csvRows = [headers.map(escapeCSV).join(",")];

      enrichedReports.forEach((r) => {
        const post = r.postid || {};
        const contentUrl =
          post.contentArray?.[0]?.objectUrl || post.contents?.[0] || "";

        const reporter = r.userid || {};
        const reporterFull = r.reporterFull || {};

        const reported = r.reported || {};
        const reportedFull = r.reportedFull || {};

        const row = [
          new Date(r.createdAt).toLocaleString(),
          r.message || "",
          r.type || "",
          post.description || "",
          post.createdAt ? new Date(post.createdAt).toLocaleString() : "",
          post.postType || "",
          contentUrl,
          reporter.username || "",
          `${reporter.firstname || ""} ${reporter.lastname || ""}`.trim(),
          reporter.email || "",
          reporterFull.phone || "",
          reporterFull.address || reporter.address || "",
          reporter.ipAddress || reporterFull.ipAddress || "",
          reporterFull.dob || "",
          reporterFull.bio || "",
          reported.username || "",
          `${reported.firstname || ""} ${reported.lastname || ""}`.trim(),
          reported.email || "",
          reportedFull.phone || "",
          reportedFull.address || reported.address || "",
          reportedFull.ipAddress || "",
          reportedFull.dob || "",
          reportedFull.bio || "",
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
        `reported_posts_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "CSV downloaded successfully!",
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

  // ==================== INDIVIDUAL REPORT CSV DOWNLOAD ====================
  const downloadIndividualReportCSV = async (reportId, reporterUsername, reportedUsername) => {
    if (individualCsvLoading[reportId]) return;
    
    setIndividualCsvLoading((prev) => ({ ...prev, [reportId]: true }));

    try {
      // Find the specific report from current data
      const report = reportsData.reports.find(r => r._id === reportId);
      
      if (!report) {
        throw new Error("Report data not found");
      }

      let reporterFull = {};
      let reportedFull = {};

      // Fetch reporter details
      try {
        const reporterRes = await fetch(
          `https://api.frenzone.live/user/getUserById/${report.userid._id}`
        );
        if (reporterRes.ok) {
          const repData = await reporterRes.json();
          reporterFull = repData.user || {};
        }
      } catch (e) {}

      // Fetch reported user details
      try {
        const reportedRes = await fetch(
          `https://api.frenzone.live/user/getUserById/${report.reported._id}`
        );
        if (reportedRes.ok) {
          const repData = await reportedRes.json();
          reportedFull = repData.user || {};
        }
      } catch (e) {}

      const post = report.postid || {};
      const contentUrl =
        post.contentArray?.[0]?.objectUrl || post.contents?.[0] || "";

      const reporter = report.userid || {};
      const reported = report.reported || {};

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
        "Report ID",
        "Report Date",
        "Report Reason",
        "Report Type",
        "Post Description",
        "Post Created At",
        "Post Type",
        "Post Content URL",
        "Reporter Username",
        "Reporter Full Name",
        "Reporter Email",
        "Reporter Phone",
        "Reporter Address",
        "Reporter IP",
        "Reporter DOB",
        "Reporter Bio",
        "Reported Username",
        "Reported Full Name",
        "Reported Email",
        "Reported Phone",
        "Reported Address",
        "Reported IP",
        "Reported DOB",
        "Reported Bio",
      ];

      const row = [
        report._id || "",
        new Date(report.createdAt).toLocaleString(),
        report.message || "",
        report.type || "",
        post.description || "",
        post.createdAt ? new Date(post.createdAt).toLocaleString() : "",
        post.postType || "",
        contentUrl,
        reporter.username || "",
        `${reporter.firstname || ""} ${reporter.lastname || ""}`.trim(),
        reporter.email || "",
        reporterFull.phone || "",
        reporterFull.address || reporter.address || "",
        reporter.ipAddress || reporterFull.ipAddress || "",
        reporterFull.dob || "",
        reporterFull.bio || "",
        reported.username || "",
        `${reported.firstname || ""} ${reported.lastname || ""}`.trim(),
        reported.email || "",
        reportedFull.phone || "",
        reportedFull.address || reported.address || "",
        reportedFull.ipAddress || "",
        reportedFull.dob || "",
        reportedFull.bio || "",
      ];

      const csvContent = BOM + [headers.map(escapeCSV).join(","), row.map(escapeCSV).join(",")].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `report_${reporterUsername || "reporter"}_${reportedUsername || "reported"}_${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `CSV for report downloaded!`,
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
      setIndividualCsvLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  return (
    <div className="reports-container">
      {loading && <Loader />}
      {csvLoading && <Loader />}

      <div className="reports-container-inner">
        <div className="reports-heading">
          <h2>Reported Posts</h2>
          <button
            className="btn-download-csv"
            onClick={downloadCSV}
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

        {error && <div className="reports-error">{error}</div>}

        {reportsData && reportsData.reports?.length > 0 ? (
          <>
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Post Description</th>
                    <th>Reported User</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Actions</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsData.reports.map((report) => {
                    const user = report.userid;
                    const reportedUser = report.reported;
                    const post = report.postid;
                    const isCsvLoading = individualCsvLoading[report._id];

                    return (
                      <tr
                        key={report._id}
                        className="reports-row reports-animate"
                      >
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
                        <td className="post-description">
                          {post?.description || "Post no longer available"}
                        </td>
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
                        <td className="reason">{report.message || "-"}</td>
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
                        <td className="actions">
                          <button
                            className="btn-details"
                            onClick={() => handleViewDetails(report._id)}
                          >
                            Details
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-download-individual-csv"
                            onClick={() => downloadIndividualReportCSV(
                              report._id, 
                              user?.username, 
                              reportedUser?.username
                            )}
                            disabled={isCsvLoading}
                            style={{
                              padding: "6px 12px",
                              background: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              minWidth: "80px"
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