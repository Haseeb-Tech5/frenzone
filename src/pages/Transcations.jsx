import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  FaDownload,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaFileDownload,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./gbl.css";
import Loader from "../components/Loader/Loader";

// Default avatar as base64 SVG - prevents network requests and loops
const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIxOCIgZmlsbD0iIzY2NiIvPjxwYXRoIGQ9Ik0yMCA4NWMwLTIwIDEzLTMwIDMwLTMwczMwIDEwIDMwIDMwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+";

// Improved Avatar component - renders only ONE element at a time
const UserAvatar = memo(({ src, username }) => {
  const [status, setStatus] = useState("loading"); // 'loading' | 'loaded' | 'error'
  const [loadedSrc, setLoadedSrc] = useState(null);

  // Memoize full URL calculation
  const fullSrc = useMemo(() => {
    if (!src || src === "null" || src === "undefined" || src === "") {
      return null;
    }
    return src.startsWith("http")
      ? src
      : `https://frenzone.live/uploads/${src}`;
  }, [src]);

  useEffect(() => {
    let isMounted = true;

    // If no valid source, show default immediately
    if (!fullSrc) {
      setStatus("error");
      setLoadedSrc(null);
      return;
    }

    // Reset to loading state
    setStatus("loading");
    setLoadedSrc(null);

    const img = new Image();

    img.onload = () => {
      if (isMounted) {
        setLoadedSrc(fullSrc);
        setStatus("loaded");
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setStatus("error");
        setLoadedSrc(null);
      }
    };

    img.src = fullSrc;

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [fullSrc]);

  // Render ONLY ONE element based on status - prevents double rendering
  if (status === "loading") {
    return (
      <div className="gbl_avatar_wrapper">
        <div className="gbl_avatar_placeholder">
          <FaUser />
        </div>
      </div>
    );
  }

  if (status === "loaded" && loadedSrc) {
    return (
      <div className="gbl_avatar_wrapper">
        <img
          src={loadedSrc}
          alt={username || "User"}
          className="gbl_user_avatar"
          onError={() => setStatus("error")}
        />
      </div>
    );
  }

  // Error state - show default avatar
  return (
    <div className="gbl_avatar_wrapper">
      <img
        src={DEFAULT_AVATAR}
        alt={username || "User"}
        className="gbl_user_avatar"
      />
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";

const Transactions = () => {
  const token = localStorage.getItem("token");

  const [transactionsData, setTransactionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filter options
  const statusOptions = ["pending", "completed", "failed", "refunded"];
  const typeOptions = [
    "tip",
    "club_subscription",
    "paywall",
    "coin_purchase",
    "withdrawal",
  ];

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", limit);
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);

      const response = await fetch(
        `https://api.frenzone.live/global-transactions/getTransactions?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      if (data.success) {
        setTransactionsData(data);
        setError(null);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      setError("Failed to fetch transaction data");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch transaction data.",
      });
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, limit, statusFilter, typeFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "type") {
      setTypeFilter(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil((transactionsData?.count || 0) / limit)
    ) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setTypeFilter("");
    setCurrentPage(1);
  };

  // CSV Headers
  const csvHeaders = [
    "Transaction ID",
    "Username",
    "Email",
    "Type",
    "Amount",
    "Platform Fee",
    "Net Creator Amount",
    "Status",
    "Store",
    "Environment",
    "Is Renewal",
    "Is Family Share",
    "Subscription Period",
    "Entitlement ID",
    "Content ID",
    "Content Model",
    "Club ID",
    "Post ID",
    "Original Transaction ID",
    "App User ID",
    "Original App User ID",
    "Offer Code",
    "Cancel Reason",
    "Expiration Reason",
    "Purchased At",
    "Expiration At",
    "Grace Period Expiration",
    "Created At",
    "Updated At",
  ];

  // Generate CSV row for a single transaction
  const generateTransactionRow = (transaction) => {
    return [
      transaction._id || "N/A",
      transaction.user_id?.username || "N/A",
      transaction.user_id?.email || "N/A",
      transaction.type || "N/A",
      transaction.amount || 0,
      transaction.platform_fee || 0,
      transaction.net_creator_amount || 0,
      transaction.status || "N/A",
      transaction.store || "N/A",
      transaction.environment || "N/A",
      transaction.is_renewal ? "Yes" : "No",
      transaction.is_family_share ? "Yes" : "No",
      transaction.subscription_period || "N/A",
      transaction.entitlement_id || "N/A",
      transaction.content_id || "N/A",
      transaction.content_model || "N/A",
      transaction.club_id || "N/A",
      transaction.post_id || "N/A",
      transaction.original_transaction_id || "N/A",
      transaction.app_user_id || "N/A",
      transaction.original_app_user_id || "N/A",
      transaction.offer_code || "N/A",
      transaction.cancel_reason || "N/A",
      transaction.expiration_reason || "N/A",
      transaction.purchased_at
        ? new Date(transaction.purchased_at).toLocaleString()
        : "N/A",
      transaction.expiration_at
        ? new Date(transaction.expiration_at).toLocaleString()
        : "N/A",
      transaction.grace_period_expiration_at
        ? new Date(transaction.grace_period_expiration_at).toLocaleString()
        : "N/A",
      transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleString()
        : "N/A",
      transaction.updatedAt
        ? new Date(transaction.updatedAt).toLocaleString()
        : "N/A",
    ];
  };

  // Download individual transaction CSV
  const downloadSingleCSV = (transaction) => {
    const row = generateTransactionRow(transaction);
    const csvRows = [
      csvHeaders.join(","),
      row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const username = transaction.user_id?.username || "unknown";
    const transactionId = transaction._id?.slice(-6) || "tx";
    const fileName = `transaction_${username}_${transactionId}_${new Date().toISOString().split("T")[0]}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all transactions CSV
  const downloadAllCSV = () => {
    if (!transactionsData?.transactions?.length) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No transactions available to download.",
      });
      return;
    }

    const csvRows = [csvHeaders.join(",")];

    transactionsData.transactions.forEach((transaction) => {
      const row = generateTransactionRow(transaction);
      csvRows.push(
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      );
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `all_transactions_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatAmount = (amount) => {
    const absAmount = Math.abs(amount || 0);
    const prefix = amount < 0 ? "-" : "";
    return `${prefix}$${absAmount.toFixed(2)}`;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "gbl_status_completed";
      case "pending":
        return "gbl_status_pending";
      case "failed":
        return "gbl_status_failed";
      case "refunded":
        return "gbl_status_refunded";
      default:
        return "";
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      tip: "Tip",
      club_subscription: "Club Subscription",
      paywall: "Paywall",
      coin_purchase: "Coin Purchase",
      withdrawal: "Withdrawal",
    };
    return labels[type] || type || "N/A";
  };

  const totalPages = Math.ceil((transactionsData?.count || 0) / limit);

  return (
    <div className="gbl_transactions_container">
      {loading && <Loader />}
      <div className="gbl_transactions_inner">
        <div className="gbl_transactions_header">
          <h2 className="gbl_transactions_title">Global Transactions</h2>
          <button className="gbl_download_btn" onClick={downloadAllCSV}>
            <FaDownload /> Download All CSV
          </button>
        </div>

        {/* Filters Section */}
        <div className="gbl_filters_section">
          <div className="gbl_filters_row">
            <div className="gbl_filter_group">
              <label className="gbl_filter_label">
                <FaFilter /> Status
              </label>
              <select
                className="gbl_filter_select"
                value={statusFilter}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="gbl_filter_group">
              <label className="gbl_filter_label">
                <FaFilter /> Type
              </label>
              <select
                className="gbl_filter_select"
                value={typeFilter}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className="gbl_filter_group">
              <label className="gbl_filter_label">Per Page</label>
              <select
                className="gbl_filter_select"
                value={limit}
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <button className="gbl_clear_filters_btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {error && <div className="gbl_error_message">{error}</div>}

        {transactionsData && transactionsData.transactions?.length > 0 ? (
          <>
            <div className="gbl_table_wrapper">
              <table className="gbl_transactions_table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Platform Fee</th>
                    <th>Net Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.transactions.map((transaction) => (
                    <tr key={transaction._id} className="gbl_table_row">
                      <td className="gbl_user_cell">
                        <UserAvatar
                          key={`avatar-${transaction._id}`}
                          src={transaction.user_id?.profilePicture}
                          username={transaction.user_id?.username}
                        />
                        <div className="gbl_user_info">
                          <span className="gbl_username">
                            {transaction.user_id?.username || "Unknown User"}
                          </span>
                          <span className="gbl_user_email">
                            {transaction.user_id?.email || ""}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="gbl_type_badge">
                          {getTypeLabel(transaction.type)}
                        </span>
                      </td>
                      <td
                        className={
                          transaction.amount < 0
                            ? "gbl_amount_negative"
                            : "gbl_amount_positive"
                        }
                      >
                        {formatAmount(transaction.amount)}
                      </td>
                      <td>${(transaction.platform_fee || 0).toFixed(2)}</td>
                      <td>
                        ${(transaction.net_creator_amount || 0).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`gbl_status_badge ${getStatusClass(transaction.status)}`}
                        >
                          {transaction.status || "N/A"}
                        </span>
                      </td>
                      <td>
                        {new Date(transaction.createdAt).toLocaleDateString(
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
                      <td className="gbl_actions_cell">
                        <div className="gbl_actions_wrapper">
                          <button
                            className="gbl_detail_btn"
                            onClick={() => openModal(transaction)}
                            title="View Details"
                          >
                            Details
                          </button>
                          <button
                            className="gbl_row_download_btn"
                            onClick={() => downloadSingleCSV(transaction)}
                            title="Download CSV"
                          >
                            <FaFileDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="gbl_pagination_section">
              <div className="gbl_pagination_info">
                Showing page {currentPage} of {totalPages} (
                {transactionsData.count} total transactions)
              </div>
              <div className="gbl_pagination_controls">
                <button
                  className="gbl_pagination_btn"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="gbl_pagination_btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft /> Prev
                </button>
                <span className="gbl_page_indicator">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="gbl_pagination_btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <FaChevronRight />
                </button>
                <button
                  className="gbl_pagination_btn"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="gbl_no_data_message">No transactions available</div>
          )
        )}
      </div>

      {/* Transaction Details Modal */}
      {isModalOpen && selectedTransaction && (
        <div className="gbl_modal_overlay" onClick={closeModal}>
          <div
            className="gbl_modal_container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gbl_modal_header">
              <h3>Transaction Details</h3>
              <div className="gbl_modal_header_actions">
                <button
                  className="gbl_modal_download_btn"
                  onClick={() => downloadSingleCSV(selectedTransaction)}
                  title="Download CSV"
                >
                  <FaDownload /> CSV
                </button>
                <button className="gbl_modal_close_btn" onClick={closeModal}>
                  ×
                </button>
              </div>
            </div>
            <div className="gbl_modal_body">
              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Basic Information</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Transaction ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction._id}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">User:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.user_id?.username || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Email:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.user_id?.email || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Type:</span>
                    <span className="gbl_field_value gbl_type_badge">
                      {getTypeLabel(selectedTransaction.type)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Status:</span>
                    <span
                      className={`gbl_field_value gbl_status_badge ${getStatusClass(selectedTransaction.status)}`}
                    >
                      {selectedTransaction.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Financial Details</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Amount:</span>
                    <span
                      className={`gbl_field_value ${selectedTransaction.amount < 0 ? "gbl_amount_negative" : "gbl_amount_positive"}`}
                    >
                      {formatAmount(selectedTransaction.amount)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Platform Fee:</span>
                    <span className="gbl_field_value">
                      ${(selectedTransaction.platform_fee || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Net Creator Amount:</span>
                    <span className="gbl_field_value">
                      $
                      {(selectedTransaction.net_creator_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Store & Environment</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Store:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.store || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Environment:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.environment || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">App User ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.app_user_id || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">
                      Original App User ID:
                    </span>
                    <span className="gbl_field_value">
                      {selectedTransaction.original_app_user_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">
                  Subscription Details
                </h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">
                      Subscription Period:
                    </span>
                    <span className="gbl_field_value">
                      {selectedTransaction.subscription_period || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Entitlement ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.entitlement_id || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Is Renewal:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.is_renewal ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Is Family Share:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.is_family_share ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Offer Code:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.offer_code || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Related IDs</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Content ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.content_id || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Content Model:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.content_model || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Club ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.club_id || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Post ID:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.post_id || "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">
                      Original Transaction ID:
                    </span>
                    <span className="gbl_field_value">
                      {selectedTransaction.original_transaction_id || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Dates & Expiration</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Purchased At:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.purchased_at
                        ? new Date(
                            selectedTransaction.purchased_at
                          ).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Expiration At:</span>
                    <span className="gbl_field_value">
                      {selectedTransaction.expiration_at
                        ? new Date(
                            selectedTransaction.expiration_at
                          ).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">
                      Grace Period Expiration:
                    </span>
                    <span className="gbl_field_value">
                      {selectedTransaction.grace_period_expiration_at
                        ? new Date(
                            selectedTransaction.grace_period_expiration_at
                          ).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Created At:</span>
                    <span className="gbl_field_value">
                      {new Date(selectedTransaction.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Updated At:</span>
                    <span className="gbl_field_value">
                      {new Date(selectedTransaction.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {(selectedTransaction.cancel_reason ||
                selectedTransaction.expiration_reason) && (
                <div className="gbl_modal_section">
                  <h4 className="gbl_modal_section_title">Cancellation Info</h4>
                  <div className="gbl_modal_grid">
                    <div className="gbl_modal_field">
                      <span className="gbl_field_label">Cancel Reason:</span>
                      <span className="gbl_field_value">
                        {selectedTransaction.cancel_reason || "N/A"}
                      </span>
                    </div>
                    <div className="gbl_modal_field">
                      <span className="gbl_field_label">
                        Expiration Reason:
                      </span>
                      <span className="gbl_field_value">
                        {selectedTransaction.expiration_reason || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="gbl_modal_footer">
              <button
                className="gbl_modal_close_action_btn"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;