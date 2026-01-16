import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./Withdrawals.css";

const GetallUserWidthraws = () => {
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all"); // "all" | "pending"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [individualDownloading, setIndividualDownloading] = useState({});

  const token = localStorage.getItem("token");
  const publicip = "https://api.frenzone.live";

  useEffect(() => {
    fetchAllWithdrawals();
  }, []);

  useEffect(() => {
    if (!allWithdrawals.length) return;

    let filtered = [...allWithdrawals];

    if (filter === "pending") {
      filtered = filtered.filter((w) => w.status.toLowerCase() === "pending");
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setDisplayList(filtered);
    setCurrentPage(1);
  }, [allWithdrawals, filter]);

  const fetchAllWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${publicip}/wallet/getAllWithdrawals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch withdrawals");

      const data = await res.json();

      if (data.success && Array.isArray(data.withdraws)) {
        const sorted = data.withdraws.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllWithdrawals(sorted);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to load withdrawals");
      Swal.fire("Error", err.message || "Could not load data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Download ALL withdrawals CSV (only required fields)
  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const csvData = convertToCSV(allWithdrawals);
      downloadCSV(
        csvData,
        `all_withdrawals_${new Date().toISOString().slice(0, 10)}.csv`
      );
      Swal.fire("Success!", "All withdrawals CSV downloaded", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to generate CSV", "error");
    } finally {
      setDownloading(false);
    }
  };

  // Download INDIVIDUAL withdrawal CSV (only required fields)
  const downloadIndividualWithdrawalCSV = async (withdrawalId, username) => {
    if (individualDownloading[withdrawalId]) return;

    setIndividualDownloading((prev) => ({ ...prev, [withdrawalId]: true }));

    try {
      const withdrawal = allWithdrawals.find((w) => w._id === withdrawalId);
      if (!withdrawal) throw new Error("Withdrawal not found");

      const user = withdrawal.userId || {};

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
        "Amount ($)",
        "Status",
        "Created Date",
      ];

      const row = [
        escapeCSV(user.username || "N/A"),
        escapeCSV(user.firstname || "N/A"),
        escapeCSV(user.lastname || "N/A"),
        withdrawal.amount?.toFixed(2) || "0.00",
        escapeCSV(withdrawal.status || "N/A"),
        new Date(withdrawal.createdAt).toLocaleString(),
      ];

      const csvContent = BOM + [headers.join(","), row.join(",")].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `withdrawal_${username || "user"}_${withdrawalId.slice(
        0,
        8
      )}_${new Date().toISOString().slice(0, 10)}.csv`;
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
      setIndividualDownloading((prev) => ({ ...prev, [withdrawalId]: false }));
    }
  };

  const convertToCSV = (withdrawals) => {
    const BOM = "\uFEFF";
    const headers = [
      "Username",
      "First Name",
      "Last Name",
      "Amount ($)",
      "Status",
      "Created Date",
    ];

    const rows = withdrawals.map((wd) => {
      const user = wd.userId || {};

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
        wd.amount?.toFixed(2) || "0.00",
        escape(wd.status || "N/A"),
        new Date(wd.createdAt).toLocaleString(),
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

  const handleAction = async (id, action) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${
        action === "accept" ? "accept" : "cancel"
      } this withdrawal?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff9800",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action === "accept" ? "Accept" : "Cancel"}!`,
    });

    if (!result.isConfirmed) return;

    const endpoint =
      action === "accept"
        ? "/wallet/processedWithdrawRequest"
        : "/wallet/cancelWithdrawRequest";

    try {
      const res = await fetch(`${publicip}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ withdrawid: id }),
      });

      const data = await res.json();

      if (
        res.ok &&
        (data.success || data.message?.toLowerCase().includes("success"))
      ) {
        Swal.fire(
          "Success!",
          `Withdrawal ${action === "accept" ? "processed" : "cancelled"}`,
          "success"
        );
        fetchAllWithdrawals();
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Action failed", "error");
    }
  };

  const getProfilePic = (url) =>
    !url || url.trim() === "" ? "/default-avatar.png" : url;

  const getStatusInfo = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return { text: "Pending", class: "pending" };
    if (s === "processed" || s === "completed")
      return { text: "Processed", class: "processed" };
    if (s === "cancelled") return { text: "Cancelled", class: "cancelled" };
    return { text: status || "Unknown", class: "unknown" };
  };

  // Pagination
  const totalItems = displayList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = displayList.slice(startIndex, startIndex + itemsPerPage);

  const pendingCount = allWithdrawals.filter(
    (w) => w.status?.toLowerCase() === "pending"
  ).length;

  return (
    <div className="withdrawals-container">
      {loading && <Loader />}

      <div className="withdrawals-container-inner">
        <div className="withdrawals-heading">
          <h2>Withdrawal Requests</h2>
        </div>

        <div className="withdrawals-header-actions">
          <div className="withdrawals-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Requests ({allWithdrawals.length})
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending Only ({pendingCount})
            </button>
          </div>

          <button
            className="download-csv-btn"
            onClick={handleDownloadCSV}
            disabled={downloading || allWithdrawals.length === 0}
          >
            {downloading ? "Downloading..." : "Download All CSV"}
          </button>
        </div>

        {error && <div className="withdrawals-error">{error}</div>}

        {currentItems.length > 0 ? (
          <>
            <div className="withdrawals-table-wrapper">
              <table className="withdrawals-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                    <th>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((wd) => {
                    const user = wd.userId || {};
                    const statusInfo = getStatusInfo(wd.status);
                    const isPending = wd.status?.toLowerCase() === "pending";
                    const isLoading = individualDownloading[wd._id];

                    return (
                      <tr
                        key={wd._id}
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
                        <td className="amount">
                          ${wd.amount?.toFixed(2) || "0.00"}
                        </td>
                        <td>
                          <span className={`status-badge ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>
                          {new Date(wd.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="actions">
                          {isPending ? (
                            <>
                              <button
                                className="btn-accept"
                                onClick={() => handleAction(wd._id, "accept")}
                              >
                                Accept
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => handleAction(wd._id, "cancel")}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <span className="no-action">—</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-download-individual-csv"
                            onClick={() =>
                              downloadIndividualWithdrawalCSV(
                                wd._id,
                                user.username
                              )
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
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems} request(s)
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
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="withdrawals-no-data">
              {filter === "pending"
                ? "No pending requests"
                : "No withdrawal requests found"}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GetallUserWidthraws;
