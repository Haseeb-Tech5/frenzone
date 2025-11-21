import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./Withdrawals.css";

const GetallUserWidthraws = () => {
  const [allWithdrawals, setAllWithdrawals] = useState([]); // Full list from API
  const [displayList, setDisplayList] = useState([]); // After filter + sort
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all"); // "all" | "pending"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const publicip = "https://api.frenzone.live";

  // Load ALL withdrawals once
  useEffect(() => {
    fetchAllWithdrawals();
  }, []);

  // Apply filter + sort + pagination whenever data or filter changes
  useEffect(() => {
    if (!allWithdrawals.length) return;

    let filtered = [...allWithdrawals];

    // Apply filter
    if (filter === "pending") {
      filtered = filtered.filter((w) => w.status.toLowerCase() === "pending");
    }

    // Sort: NEWEST ON TOP (by createdAt)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setDisplayList(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      if (data.success && Array.isArray(data.withdraws)) {
        const sorted = data.withdraws.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllWithdrawals(sorted);
      } else {
        throw new Error("Invalid data");
      }
    } catch (err) {
      setError("Failed to load withdrawals");
      Swal.fire("Error", "Could not load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const text = action === "accept" ? "Accept" : "Cancel";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${text.toLowerCase()} this withdrawal?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff9800",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${text} it!`,
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
          `Withdrawal ${action === "accept" ? "approved" : "cancelled"}`,
          "success"
        );
        fetchAllWithdrawals(); // Refresh full list
      } else {
        throw new Error(data.message || "Failed");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Action failed", "error");
    }
  };

  const getProfilePic = (url) =>
    !url || url.trim() === "" ? "/default-avatar.png" : url;

  const getStatusInfo = (status) => {
    const s = status.toLowerCase();
    if (s === "pending") return { text: "Pending", class: "pending" };
    if (s === "processed" || s === "completed")
      return { text: "Processed", class: "processed" };
    if (s === "cancelled") return { text: "Cancelled", class: "cancelled" };
    return { text: status, class: "unknown" };
  };

  // Pagination logic
  const totalItems = displayList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayList.slice(startIndex, endIndex);

  const pendingCount = allWithdrawals.filter(
    (w) => w.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="withdrawals-container">
      {loading && <Loader />}

      <div className="withdrawals-container-inner">
        <div className="withdrawals-heading">
          <h2>Withdrawal Requests</h2>
        </div>

        {/* Filter Buttons */}
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
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((wd) => {
                    const user = wd.userId;
                    const statusInfo = getStatusInfo(wd.status);
                    const isPending = wd.status.toLowerCase() === "pending";

                    return (
                      <tr
                        key={wd._id}
                        className="withdrawals-row withdrawals-animate"
                      >
                        <td className="withdrawals-user">
                          <img
                            src={getProfilePic(user.profilePicture)}
                            alt={user.username}
                            className="withdrawals-profile-pic"
                            // onError={(e) =>
                            //   (e.target.src = "/default-avatar.png")
                            // }
                          />
                          <div>
                            <div className="username">{user.username}</div>
                            <small>
                              {user.firstname} {user.lastname}
                            </small>
                          </div>
                        </td>
                        <td className="amount">${wd.amount.toFixed(2)}</td>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Frontend Pagination */}
            <div className="withdrawals-meta">
              <p>
                Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} request(s)
                {filter === "pending" && " — Pending Only"}
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

              <div className="limit-controls">
                <label>Per page: </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    /* You can make this dynamic later */
                  }}
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
