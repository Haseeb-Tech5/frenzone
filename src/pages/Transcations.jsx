import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  FaDownload,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaFileDownload,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./gbl.css";
import Loader from "../components/Loader/Loader";

// Default avatar as base64 SVG - prevents network requests and loops
const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIxOCIgZmlsbD0iIzY2NiIvPjxwYXRoIGQ9Ik0yMCA4NWMwLTIwIDEzLTMwIDMwLTMwczMwIDEwIDMwIDMwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+";

// Helper function to safely render values (handles objects, arrays, null, undefined)
const safeRenderValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "object") {
    // If it's an object with _id, return the _id
    if (value._id) {
      return String(value._id);
    }
    // If it's an array, return count or join
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : fallback;
    }
    // For other objects, try to get a meaningful string
    if (value.name) return String(value.name);
    if (value.title) return String(value.title);
    if (value.username) return String(value.username);
    // Last resort - return object indicator
    return "[Object]";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

// Helper to get ID from a field that might be string or object
const getIdFromField = (field) => {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object" && field._id) return field._id;
  return null;
};

// Improved Avatar component - renders only ONE element at a time
const UserAvatar = memo(({ src, username }) => {
  const [status, setStatus] = useState("loading");
  const [loadedSrc, setLoadedSrc] = useState(null);

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

    if (!fullSrc) {
      setStatus("error");
      setLoadedSrc(null);
      return;
    }

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
  const [detailTransaction, setDetailTransaction] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
        },
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

  const handleViewDetails = (transaction) => {
    setDetailTransaction(transaction);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setDetailTransaction(null);
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    try {
      return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const renderPersonForModal = (person, label) => {
    if (!person) return null;
    const isObj = typeof person === "object";
    const username = isObj ? person.username : person;
    const email = isObj ? person.email : "";
    const firstname = isObj ? person.firstname : "";
    const lastname = isObj ? person.lastname : "";
    const phone = isObj ? person.phone : "";
    const about = isObj ? person.about : "";
    const bio = isObj ? person.bio : "";
    const tag = isObj ? person.tag : "";
    const isVerified = isObj ? person.isVerified : "";
    const profilePicture = isObj ? person.profilePicture : null;
    const address = isObj ? person.address : "";
    const dob = isObj ? person.dob : "";
    const twitterUrl = isObj ? person.twitterUrl : "";
    const facebookUrl = isObj ? person.facebookUrl : "";
    const instagramUrl = isObj ? person.instagramUrl : "";
    const linkedinUrl = isObj ? person.linkedinUrl : "";
    const websiteUrl = isObj ? person.WebsiteUrl : "";
    return (
      <div className="gbl_modal_section" key={label}>
        <h4 className="gbl_modal_section_title">{label}</h4>
        <div className="gbl_detail_user_card">
          <UserAvatar src={profilePicture} username={username} />
          <div className="gbl_modal_grid" style={{ flex: 1 }}>
            {username != null && username !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Username</span>
                <span className="gbl_field_value">{String(username)}</span>
              </div>
            )}
            {(firstname || lastname) && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Name</span>
                <span className="gbl_field_value">
                  {`${(firstname || "").trim()} ${(lastname || "").trim()}`.trim() || "N/A"}
                </span>
              </div>
            )}
            {email != null && email !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Email</span>
                <span className="gbl_field_value">{String(email)}</span>
              </div>
            )}
            {phone != null && phone !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Phone</span>
                <span className="gbl_field_value">{String(phone)}</span>
              </div>
            )}
            {tag != null && tag !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Tag</span>
                <span className="gbl_field_value">{String(tag)}</span>
              </div>
            )}
            {address != null && address !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Address</span>
                <span className="gbl_field_value">{String(address)}</span>
              </div>
            )}
            {dob != null && dob !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Date of Birth</span>
                <span className="gbl_field_value">{String(dob)}</span>
              </div>
            )}
            {isVerified != null && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Verified</span>
                <span className="gbl_field_value">
                  {isVerified ? "Yes" : "No"}
                </span>
              </div>
            )}
            {about != null && about !== "" && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">About</span>
                <span className="gbl_field_value">{String(about)}</span>
              </div>
            )}
            {bio != null && bio !== "" && bio !== about && (
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Bio</span>
                <span className="gbl_field_value">{String(bio)}</span>
              </div>
            )}
            {(twitterUrl || facebookUrl || instagramUrl || linkedinUrl || websiteUrl) && (
              <div className="gbl_modal_field gbl_modal_field_full">
                <span className="gbl_field_label">Social &amp; Links</span>
                <span className="gbl_field_value gbl_field_links">
                  {twitterUrl ? (
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="gbl_link">Twitter</a>
                  ) : null}
                  {facebookUrl ? (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="gbl_link">Facebook</a>
                  ) : null}
                  {instagramUrl ? (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="gbl_link">Instagram</a>
                  ) : null}
                  {linkedinUrl ? (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="gbl_link">LinkedIn</a>
                  ) : null}
                  {websiteUrl ? (
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="gbl_link">Website</a>
                  ) : null}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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

  const csvHeaders = [
    "Transaction ID",
    "Username",
    "Email",
    "Creator Username",
    "Creator Email",
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

  const generateTransactionRow = (transaction) => {
    const creator = transaction.creator_id;
    const creatorUsername =
      typeof creator === "object" ? creator?.username : creator;
    const creatorEmail = typeof creator === "object" ? creator?.email : "";
    return [
      safeRenderValue(transaction._id),
      safeRenderValue(transaction.user_id?.username),
      safeRenderValue(transaction.user_id?.email),
      safeRenderValue(creatorUsername),
      safeRenderValue(creatorEmail),
      safeRenderValue(transaction.type),
      transaction.amount || 0,
      transaction.platform_fee || 0,
      transaction.net_creator_amount || 0,
      safeRenderValue(transaction.status),
      safeRenderValue(transaction.store),
      safeRenderValue(transaction.environment),
      transaction.is_renewal ? "Yes" : "No",
      transaction.is_family_share ? "Yes" : "No",
      safeRenderValue(transaction.subscription_period),
      safeRenderValue(transaction.entitlement_id),
      safeRenderValue(getIdFromField(transaction.content_id)),
      safeRenderValue(transaction.content_model),
      safeRenderValue(getIdFromField(transaction.club_id)),
      safeRenderValue(getIdFromField(transaction.post_id)),
      safeRenderValue(transaction.original_transaction_id),
      safeRenderValue(transaction.app_user_id),
      safeRenderValue(transaction.original_app_user_id),
      safeRenderValue(transaction.offer_code),
      safeRenderValue(transaction.cancel_reason),
      safeRenderValue(transaction.expiration_reason),
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
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
      );
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `all_transactions_${new Date().toISOString().split("T")[0]}.csv`,
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
                <colgroup>
                  <col className="gbl_col_user" />
                  <col className="gbl_col_creator" />
                  <col className="gbl_col_type" />
                  <col className="gbl_col_amount" />
                  <col className="gbl_col_fee" />
                  <col className="gbl_col_net" />
                  <col className="gbl_col_status" />
                  <col className="gbl_col_date" />
                  <col className="gbl_col_actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Type</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Platform Fee</th>
                    <th scope="col">Net Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.transactions.map((transaction) => {
                    const userId = getIdFromField(transaction.user_id);
                    const creatorId = getIdFromField(transaction.creator_id);
                    const hasCreator =
                      transaction.creator_id &&
                      creatorId !== userId &&
                      (typeof transaction.creator_id !== "object" ||
                        transaction.creator_id?.username != null);
                    return (
                    <tr key={transaction._id} className="gbl_table_row">
                      <td className="gbl_td gbl_td_user">
                        <div className="gbl_cell_content gbl_cell_user">
                          <UserAvatar
                            key={`avatar-${transaction._id}`}
                            src={transaction.user_id?.profilePicture}
                            username={transaction.user_id?.username}
                          />
                          <div className="gbl_user_info">
                            <span className="gbl_username">
                              {safeRenderValue(
                                transaction.user_id?.username,
                                "Unknown User",
                              )}
                            </span>
                            <span className="gbl_user_email">
                              {safeRenderValue(transaction.user_id?.email, "")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="gbl_td gbl_td_creator">
                        <div className="gbl_cell_content gbl_cell_creator">
                          {hasCreator ? (
                            <>
                              <UserAvatar
                                key={`creator-avatar-${transaction._id}`}
                                src={
                                  typeof transaction.creator_id === "object"
                                    ? transaction.creator_id?.profilePicture
                                    : null
                                }
                                username={
                                  typeof transaction.creator_id === "object"
                                    ? transaction.creator_id?.username
                                    : null
                                }
                              />
                              <div className="gbl_user_info">
                                <span className="gbl_username">
                                  {safeRenderValue(
                                    typeof transaction.creator_id === "object"
                                      ? transaction.creator_id?.username
                                      : transaction.creator_id,
                                    "Unknown Creator",
                                  )}
                                </span>
                                <span className="gbl_user_email">
                                  {typeof transaction.creator_id === "object"
                                    ? safeRenderValue(
                                        transaction.creator_id?.email,
                                        "",
                                      )
                                    : ""}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="gbl_na_text">N/A</span>
                          )}
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
                          {safeRenderValue(transaction.status)}
                        </span>
                      </td>
                      <td>
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="gbl_actions_cell">
                        <div className="gbl_actions_wrapper">
                          <button
                            className="gbl_detail_btn"
                            onClick={() => handleViewDetails(transaction)}
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
                  );
                  })}
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

      {/* Detail Modal - no route, no IDs in UI */}
      {detailModalOpen && detailTransaction && (
        <div
          className="gbl_modal_overlay"
          onClick={closeDetailModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gbl_detail_modal_title"
        >
          <div
            className="gbl_modal_container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gbl_modal_header">
              <h3 id="gbl_detail_modal_title">Transaction Details</h3>
              <div className="gbl_modal_header_actions">
                <button
                  type="button"
                  className="gbl_modal_download_btn"
                  onClick={() => downloadSingleCSV(detailTransaction)}
                >
                  <FaFileDownload /> Download CSV
                </button>
                <button
                  type="button"
                  className="gbl_modal_close_btn"
                  onClick={closeDetailModal}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="gbl_modal_body">
              {/* Transaction summary - no IDs */}
              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Summary</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Type</span>
                    <span className="gbl_field_value">
                      {getTypeLabel(detailTransaction.type)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Amount</span>
                    <span
                      className={`gbl_field_value ${
                        detailTransaction.amount < 0
                          ? "gbl_amount_negative"
                          : "gbl_amount_positive"
                      }`}
                    >
                      {formatAmount(detailTransaction.amount)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Platform Fee</span>
                    <span className="gbl_field_value">
                      ${(detailTransaction.platform_fee ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Net Creator Amount</span>
                    <span className="gbl_field_value">
                      ${(detailTransaction.net_creator_amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Status</span>
                    <span className="gbl_field_value">
                      <span
                        className={`gbl_status_badge ${getStatusClass(detailTransaction.status)}`}
                      >
                        {safeRenderValue(detailTransaction.status)}
                      </span>
                    </span>
                  </div>
                  {detailTransaction.content_model != null &&
                    detailTransaction.content_model !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Content Model</span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.content_model)}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {renderPersonForModal(detailTransaction.user_id, "User")}

              {detailTransaction.creator_id &&
                getIdFromField(detailTransaction.creator_id) !==
                  getIdFromField(detailTransaction.user_id) &&
                renderPersonForModal(detailTransaction.creator_id, "Creator")}

              {/* Post details - only when post_id is an object with post data */}
              {detailTransaction.post_id &&
                typeof detailTransaction.post_id === "object" && (
                  <div className="gbl_modal_section">
                    <h4 className="gbl_modal_section_title">Post</h4>
                    <div className="gbl_modal_grid">
                      {detailTransaction.post_id.description != null &&
                        detailTransaction.post_id.description !== "" && (
                          <div className="gbl_modal_field gbl_modal_field_full">
                            <span className="gbl_field_label">Description</span>
                            <span className="gbl_field_value">
                              {String(detailTransaction.post_id.description)}
                            </span>
                          </div>
                        )}
                      {detailTransaction.post_id.postType != null &&
                        detailTransaction.post_id.postType !== "" && (
                          <div className="gbl_modal_field">
                            <span className="gbl_field_label">Post Type</span>
                            <span className="gbl_field_value">
                              {String(detailTransaction.post_id.postType)}
                            </span>
                          </div>
                        )}
                      {detailTransaction.post_id.price != null && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Price</span>
                          <span className="gbl_field_value">
                            ${Number(detailTransaction.post_id.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {detailTransaction.post_id.location != null &&
                        detailTransaction.post_id.location !== "" && (
                          <div className="gbl_modal_field">
                            <span className="gbl_field_label">Location</span>
                            <span className="gbl_field_value">
                              {String(detailTransaction.post_id.location)}
                            </span>
                          </div>
                        )}
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Restricted Content</span>
                        <span className="gbl_field_value">
                          {detailTransaction.post_id.restrictedContent
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Abusive Text Flag</span>
                        <span className="gbl_field_value">
                          {detailTransaction.post_id.abusiveText ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Text Post</span>
                        <span className="gbl_field_value">
                          {detailTransaction.post_id.textPost ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Comments Allowed</span>
                        <span className="gbl_field_value">
                          {detailTransaction.post_id.commentsAllowed
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      {typeof detailTransaction.post_id.shares === "number" && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Shares</span>
                          <span className="gbl_field_value">
                            {detailTransaction.post_id.shares}
                          </span>
                        </div>
                      )}
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Pinned</span>
                        <span className="gbl_field_value">
                          {detailTransaction.post_id.pinned ? "Yes" : "No"}
                        </span>
                      </div>
                      {Array.isArray(detailTransaction.post_id.contents) && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Media (contents)</span>
                          <span className="gbl_field_value">
                            {detailTransaction.post_id.contents.length} item
                            {detailTransaction.post_id.contents.length !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      )}
                      {Array.isArray(detailTransaction.post_id.thumbnails) && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Thumbnails</span>
                          <span className="gbl_field_value">
                            {detailTransaction.post_id.thumbnails.length} item
                            {detailTransaction.post_id.thumbnails.length !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      )}
                      {detailTransaction.post_id.createdAt && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Post Created</span>
                          <span className="gbl_field_value">
                            {formatDate(detailTransaction.post_id.createdAt)}
                          </span>
                        </div>
                      )}
                      {detailTransaction.post_id.updatedAt && (
                        <div className="gbl_modal_field">
                          <span className="gbl_field_label">Post Updated</span>
                          <span className="gbl_field_value">
                            {formatDate(detailTransaction.post_id.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Payment & subscription - no IDs */}
              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">
                  Payment &amp; Subscription
                </h4>
                <div className="gbl_modal_grid">
                  {detailTransaction.store != null &&
                    detailTransaction.store !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Store</span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.store)}
                        </span>
                      </div>
                    )}
                  {detailTransaction.environment != null &&
                    detailTransaction.environment !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Environment</span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.environment)}
                        </span>
                      </div>
                    )}
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Is Renewal</span>
                    <span className="gbl_field_value">
                      {detailTransaction.is_renewal ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Family Share</span>
                    <span className="gbl_field_value">
                      {detailTransaction.is_family_share ? "Yes" : "No"}
                    </span>
                  </div>
                  {detailTransaction.subscription_period != null &&
                    detailTransaction.subscription_period !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">
                          Subscription Period
                        </span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.subscription_period)}
                        </span>
                      </div>
                    )}
                  {detailTransaction.offer_code != null &&
                    detailTransaction.offer_code !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Offer Code</span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.offer_code)}
                        </span>
                      </div>
                    )}
                  {detailTransaction.cancel_reason != null &&
                    detailTransaction.cancel_reason !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">Cancel Reason</span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.cancel_reason)}
                        </span>
                      </div>
                    )}
                  {detailTransaction.expiration_reason != null &&
                    detailTransaction.expiration_reason !== "" && (
                      <div className="gbl_modal_field">
                        <span className="gbl_field_label">
                          Expiration Reason
                        </span>
                        <span className="gbl_field_value">
                          {String(detailTransaction.expiration_reason)}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Dates */}
              <div className="gbl_modal_section">
                <h4 className="gbl_modal_section_title">Dates</h4>
                <div className="gbl_modal_grid">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Purchased At</span>
                    <span className="gbl_field_value">
                      {formatDate(detailTransaction.purchased_at)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Expiration At</span>
                    <span className="gbl_field_value">
                      {formatDate(detailTransaction.expiration_at)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Grace Period Ends</span>
                    <span className="gbl_field_value">
                      {formatDate(
                        detailTransaction.grace_period_expiration_at,
                      )}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Created</span>
                    <span className="gbl_field_value">
                      {formatDate(detailTransaction.createdAt)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Updated</span>
                    <span className="gbl_field_value">
                      {formatDate(detailTransaction.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="gbl_modal_footer">
              <button
                type="button"
                className="gbl_modal_close_action_btn"
                onClick={closeDetailModal}
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
