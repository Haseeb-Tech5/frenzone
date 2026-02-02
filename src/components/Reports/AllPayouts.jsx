import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./Withdrawals.css";

const AllPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [individualDownloading, setIndividualDownloading] = useState({});

  const token = localStorage.getItem("token");
  const publicip = "https://api.frenzone.live";

  useEffect(() => {
    fetchPayouts(currentPage);
  }, [currentPage]);

  const fetchPayouts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${publicip}/payout/getAllPayouts?page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch payouts");

      const data = await res.json();

      if (data.success && Array.isArray(data.payouts)) {
        setPayouts(data.payouts);
        setTotalCount(data.count ?? data.payouts.length);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to load payouts");
      Swal.fire("Error", err.message || "Could not load data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Download ALL payouts CSV
  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const csvData = convertToCSV(payouts);
      downloadCSV(
        csvData,
        `all_payouts_${new Date().toISOString().slice(0, 10)}.csv`
      );
      Swal.fire("Success!", "All payouts CSV downloaded", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to generate CSV", "error");
    } finally {
      setDownloading(false);
    }
  };

  // Download INDIVIDUAL payout CSV
  const downloadIndividualPayoutCSV = async (payoutId, username) => {
    if (individualDownloading[payoutId]) return;

    setIndividualDownloading((prev) => ({ ...prev, [payoutId]: true }));

    try {
      const payout = payouts.find((p) => p._id === payoutId);
      if (!payout) throw new Error("Payout not found");

      const user = payout.userId || {};
      const escapeCSV = (val) => {
        if (val === null || val === undefined) return "N/A";
        const str = String(val).trim();
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      const BOM = "\uFEFF";
      const headers = [
        "Username",
        "First Name",
        "Last Name",
        "Payout Method",
        "Amount",
        "Net Amount",
        "Fee",
        "Currency",
        "Status",
        "Created Date",
      ];

      const row = [
        escapeCSV(user.username || "N/A"),
        escapeCSV(user.firstname || "N/A"),
        escapeCSV(user.lastname || "N/A"),
        escapeCSV(payout.payoutMethod || "N/A"),
        payout.amount?.toFixed(2) || "0.00",
        (payout.netAmount?.toFixed(2) ?? payout.amount?.toFixed(2)) || "0.00",
        payout.fee?.toFixed(2) ?? "0.00",
        escapeCSV(payout.currency || "N/A"),
        escapeCSV(payout.status || "N/A"),
        new Date(payout.createdAt).toLocaleString(),
      ];

      const csvContent = BOM + [headers.join(","), row.join(",")].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payout_${username || "user"}_${payoutId.slice(0, 8)}_${new Date().toISOString().slice(0, 10)}.csv`;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire(
        "Success",
        `CSV downloaded for ${username || "user"}`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to generate CSV", "error");
    } finally {
      setIndividualDownloading((prev) => ({ ...prev, [payoutId]: false }));
    }
  };

  const convertToCSV = (payoutsList) => {
    const BOM = "\uFEFF";
    const headers = [
      "Username",
      "First Name",
      "Last Name",
      "Payout Method",
      "Amount",
      "Net Amount",
      "Fee",
      "Currency",
      "Status",
      "Created Date",
    ];

    const rows = payoutsList.map((p) => {
      const user = p.userId || {};
      const escape = (val) => {
        if (val === null || val === undefined) return "N/A";
        const str = String(val).trim();
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      return [
        escape(user.username || "N/A"),
        escape(user.firstname || "N/A"),
        escape(user.lastname || "N/A"),
        escape(p.payoutMethod || "N/A"),
        p.amount?.toFixed(2) || "0.00",
        (p.netAmount?.toFixed(2) ?? p.amount?.toFixed(2)) || "0.00",
        p.fee?.toFixed(2) ?? "0.00",
        escape(p.currency || "N/A"),
        escape(p.status || "N/A"),
        new Date(p.createdAt).toLocaleString(),
      ].join(",");
    });

    return BOM + [headers.join(","), ...rows].join("\n");
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getProfilePic = (url) =>
    !url || url.trim() === "" ? "/default-avatar.png" : url;

  const getStatusInfo = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return { text: "Pending", class: "pending" };
    if (s === "processed" || s === "completed")
      return { text: "Completed", class: "processed" };
    if (s === "cancelled") return { text: "Cancelled", class: "cancelled" };
    return { text: status || "Unknown", class: "unknown" };
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const showingEnd = Math.min(startIndex + payouts.length, totalCount);

  return (
    <div className="withdrawals-container">
      {loading && <Loader />}

      <div className="withdrawals-container-inner">
        <div className="withdrawals-heading">
          <h2>Payouts</h2>
        </div>

        <div className="withdrawals-header-actions">
          <div className="withdrawals-filters">
            <span className="filter-info" style={{ color: "var(--white)", fontSize: "1.4rem" }}>
              Total: {totalCount} payout(s)
            </span>
          </div>

          <button
            className="download-csv-btn"
            onClick={handleDownloadCSV}
            disabled={downloading || payouts.length === 0}
          >
            {downloading ? "Downloading..." : "Download All CSV"}
          </button>
        </div>

        {error && <div className="withdrawals-error">{error}</div>}

        {payouts.length > 0 ? (
          <>
            <div className="withdrawals-table-wrapper">
              <table className="withdrawals-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Payout Method</th>
                    <th>Amount</th>
                    <th>Net Amount</th>
                    <th>Fee</th>
                    <th>Currency</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => {
                    const user = p.userId || {};
                    const statusInfo = getStatusInfo(p.status);
                    const isLoading = individualDownloading[p._id];

                    return (
                      <tr
                        key={p._id}
                        className="withdrawals-row withdrawals-animate"
                      >
                        <td className="withdrawals-user">
                          <img
                            src={getProfilePic(user.profilePicture)}
                            alt={user.username || "User"}
                            className="withdrawals-profile-pic"
                          />
                          <div>
                            <div className="username">
                              {user.username || "Unknown"}
                            </div>
                            <small>
                              {user.firstname} {user.lastname}
                            </small>
                          </div>
                        </td>
                        <td>{p.payoutMethod || "—"}</td>
                        <td className="amount">
                          ${p.amount?.toFixed(2) || "0.00"}
                        </td>
                        <td>${p.netAmount?.toFixed(2) ?? p.amount?.toFixed(2) ?? "0.00"}</td>
                        <td>${p.fee?.toFixed(2) ?? "0.00"}</td>
                        <td>{p.currency || "—"}</td>
                        <td>
                          <span className={`status-badge ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          <button
                            className="btn-download-individual-csv"
                            onClick={() =>
                              downloadIndividualPayoutCSV(p._id, user.username)
                            }
                            disabled={isLoading}
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
                            {isLoading ? "Generating..." : "Download CSV"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="withdrawals-meta">
              <p>
                Showing {startIndex + 1}–{showingEnd} of {totalCount} payout(s)
              </p>

              <div className="pagination-controls">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="withdrawals-no-data">
              No payouts found
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllPayouts;
