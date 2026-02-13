import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import "./gbl.css";

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIxOCIgZmlsbD0iIzY2NiIvPjxwYXRoIGQ9Ik0yMCA4NWMwLTIwIDEzLTMwIDMwLTMwczMwIDEwIDMwIDMwIiBmaWxsPSIjNjY2Ii8+PC9zdmc+";

const safeRenderValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") {
    if (value._id) return String(value._id);
    if (value.username) return String(value.username);
    return "[Object]";
  }
  return String(value);
};

const getIdFromField = (field) => {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object" && field._id) return field._id;
  return null;
};

const UserAvatar = ({ src, username }) => {
  const fullSrc =
    src && src !== "null" && src !== ""
      ? src.startsWith("http")
        ? src
        : `https://frenzone.live/uploads/${src}`
      : null;

  return (
    <div className="gbl_avatar_wrapper">
      <img
        src={fullSrc || DEFAULT_AVATAR}
        alt={username || "User"}
        className="gbl_user_avatar"
        onError={(e) => {
          e.target.src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
};

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const transaction = state?.transaction;

  if (!transaction) {
    return (
      <div className="gbl_transactions_container">
        <div className="gbl_transactions_inner">
          <div className="gbl_detail_back_section">
            <button
              className="gbl_detail_back_btn"
              onClick={() => navigate("/frenzone/transactions")}
            >
              <FaArrowLeft /> Back to Transactions
            </button>
          </div>
          <div className="gbl_no_data_message">
            No transaction data found. Please go back and select a transaction
            from the list.
          </div>
        </div>
      </div>
    );
  }

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

  const formatAmount = (amount) => {
    const absAmount = Math.abs(amount || 0);
    const prefix = amount < 0 ? "-" : "";
    return `${prefix}$${absAmount.toFixed(2)}`;
  };

  const csvHeaders = [
    "Transaction ID",
    "User",
    "User Email",
    "Creator",
    "Creator Email",
    "Type",
    "Amount",
    "Platform Fee",
    "Net Creator Amount",
    "Status",
    "Purchased At",
    "Created At",
  ];

  const downloadCSV = () => {
    const creator = transaction.creator_id;
    const creatorName =
      typeof creator === "object" ? creator?.username : creator;
    const creatorEmail = typeof creator === "object" ? creator?.email : "";

    const row = [
      safeRenderValue(transaction._id),
      safeRenderValue(transaction.user_id?.username),
      safeRenderValue(transaction.user_id?.email),
      safeRenderValue(creatorName),
      safeRenderValue(creatorEmail),
      safeRenderValue(transaction.type),
      transaction.amount || 0,
      transaction.platform_fee || 0,
      transaction.net_creator_amount || 0,
      safeRenderValue(transaction.status),
      transaction.purchased_at
        ? new Date(transaction.purchased_at).toLocaleString()
        : "N/A",
      transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleString()
        : "N/A",
    ];

    const csvContent = [
      csvHeaders.join(","),
      row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(","),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transaction_${transaction._id?.slice(-8) || "detail"}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const creator = transaction.creator_id;
  const creatorObj =
    typeof creator === "object" && creator !== null ? creator : null;

  return (
    <div className="gbl_transactions_container">
      <div className="gbl_transactions_inner">
        <div className="gbl_detail_header">
          <button
            className="gbl_detail_back_btn"
            onClick={() => navigate("/frenzone/transactions")}
          >
            <FaArrowLeft /> Back to Transactions
          </button>
          <h2 className="gbl_transactions_title">Transaction Details</h2>
          <button className="gbl_download_btn" onClick={downloadCSV}>
            <FaDownload /> Download CSV
          </button>
        </div>

        <div className="gbl_detail_content">
          {/* Transaction Overview */}
          <div className="gbl_modal_section">
            <h4 className="gbl_modal_section_title">Transaction</h4>
            <div className="gbl_modal_grid">
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Transaction ID</span>
                <span className="gbl_field_value gbl_field_mono">
                  {safeRenderValue(transaction._id)}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Type</span>
                <span className="gbl_field_value gbl_type_badge">
                  {getTypeLabel(transaction.type)}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Status</span>
                <span
                  className={`gbl_field_value gbl_status_badge ${getStatusClass(transaction.status)}`}
                >
                  {safeRenderValue(transaction.status)}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Amount</span>
                <span
                  className={`gbl_field_value ${transaction.amount < 0 ? "gbl_amount_negative" : "gbl_amount_positive"}`}
                >
                  {formatAmount(transaction.amount)}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Platform Fee</span>
                <span className="gbl_field_value">
                  ${(transaction.platform_fee || 0).toFixed(2)}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Net Creator Amount</span>
                <span className="gbl_field_value">
                  ${(transaction.net_creator_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="gbl_modal_section">
            <h4 className="gbl_modal_section_title">User (Payer)</h4>
            <div className="gbl_detail_user_card">
              <UserAvatar
                src={transaction.user_id?.profilePicture}
                username={transaction.user_id?.username}
              />
              <div className="gbl_detail_user_info">
                <div className="gbl_modal_field">
                  <span className="gbl_field_label">Username</span>
                  <span className="gbl_field_value">
                    {safeRenderValue(transaction.user_id?.username)}
                  </span>
                </div>
                <div className="gbl_modal_field">
                  <span className="gbl_field_label">Email</span>
                  <span className="gbl_field_value">
                    {safeRenderValue(transaction.user_id?.email)}
                  </span>
                </div>
                {transaction.user_id?._id && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">User ID</span>
                    <span className="gbl_field_value gbl_field_mono">
                      {transaction.user_id._id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Creator Details */}
          <div className="gbl_modal_section">
            <h4 className="gbl_modal_section_title">Creator (Receiver)</h4>
            {creatorObj ? (
              <div className="gbl_detail_user_card">
                <UserAvatar
                  src={creatorObj?.profilePicture}
                  username={creatorObj?.username}
                />
                <div className="gbl_detail_user_info">
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Username</span>
                    <span className="gbl_field_value">
                      {safeRenderValue(creatorObj?.username)}
                    </span>
                  </div>
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Email</span>
                    <span className="gbl_field_value">
                      {safeRenderValue(creatorObj?.email)}
                    </span>
                  </div>
                  {creatorObj?._id && (
                    <div className="gbl_modal_field">
                      <span className="gbl_field_label">Creator ID</span>
                      <span className="gbl_field_value gbl_field_mono">
                        {creatorObj._id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span className="gbl_field_value gbl_user_email">N/A</span>
            )}
          </div>

          {/* Dates */}
          <div className="gbl_modal_section">
            <h4 className="gbl_modal_section_title">Dates</h4>
            <div className="gbl_modal_grid">
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Purchased At</span>
                <span className="gbl_field_value">
                  {transaction.purchased_at
                    ? new Date(transaction.purchased_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="gbl_modal_field">
                <span className="gbl_field_label">Created At</span>
                <span className="gbl_field_value">
                  {transaction.createdAt
                    ? new Date(transaction.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              {transaction.expiration_at && (
                <div className="gbl_modal_field">
                  <span className="gbl_field_label">Expiration At</span>
                  <span className="gbl_field_value">
                    {new Date(transaction.expiration_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Related IDs (only when present) */}
          {(transaction.club_id ||
            transaction.post_id ||
            transaction.content_id) && (
            <div className="gbl_modal_section">
              <h4 className="gbl_modal_section_title">Related</h4>
              <div className="gbl_modal_grid">
                {transaction.club_id && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Club ID</span>
                    <span className="gbl_field_value gbl_field_mono">
                      {safeRenderValue(getIdFromField(transaction.club_id))}
                    </span>
                  </div>
                )}
                {transaction.post_id && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Post ID</span>
                    <span className="gbl_field_value gbl_field_mono">
                      {safeRenderValue(getIdFromField(transaction.post_id))}
                    </span>
                  </div>
                )}
                {transaction.content_id && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Content ID</span>
                    <span className="gbl_field_value gbl_field_mono">
                      {safeRenderValue(getIdFromField(transaction.content_id))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancellation (only when present) */}
          {(transaction.cancel_reason || transaction.expiration_reason) && (
            <div className="gbl_modal_section">
              <h4 className="gbl_modal_section_title">Cancellation Info</h4>
              <div className="gbl_modal_grid">
                {transaction.cancel_reason && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Cancel Reason</span>
                    <span className="gbl_field_value">
                      {safeRenderValue(transaction.cancel_reason)}
                    </span>
                  </div>
                )}
                {transaction.expiration_reason && (
                  <div className="gbl_modal_field">
                    <span className="gbl_field_label">Expiration Reason</span>
                    <span className="gbl_field_value">
                      {safeRenderValue(transaction.expiration_reason)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
