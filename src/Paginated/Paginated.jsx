import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUsers, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import { setSelectedUser } from "../Redux/userSlice";
import Loader from "../components/Loader/Loader";
import "./table.css";
import "../pages/employee/dashboard.css";
import "./varient.css";

function Paginated() {
  const token = localStorage.getItem("token");
  const publicIp = "https://api.frenzone.live";

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal States
  const [isStrikeModalOpen, setIsStrikeModalOpen] = useState(false);
  const [isLiftModalOpen, setIsLiftModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successType, setSuccessType] = useState(""); // 'strike' or 'lift'

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [strikeReason, setStrikeReason] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const url = `${publicIp}/user/getAllUsers?page=${
        page + 1
      }&limit=${rowsPerPage}${searchTerm ? `&keyword=${searchTerm}` : ""}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      if (data.success) {
        setFilteredData(data.users || []);
        setTotalUsers(data.count || 0);
      }
    } catch (error) {
      console.error("Error:", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    setPage(0);
    fetchData();
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDetailsClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/detailed");
  };

  // Toggle Switches
  const handleBanSwitchChange = async (id, newValue) => {
    const updated = filteredData.map((u) =>
      u._id === id ? { ...u, banned: newValue } : u
    );
    setFilteredData(updated);
    try {
      await fetch(`${publicIp}/admin/ban`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: id, ban: newValue }),
      });
    } catch (err) {
      setFilteredData((prev) =>
        prev.map((u) => (u._id === id ? { ...u, banned: !newValue } : u))
      );
    }
  };

  const handleLiveAccessSwitchChange = async (id, newValue) => {
    const updated = filteredData.map((u) =>
      u._id === id ? { ...u, liveAccess: newValue } : u
    );
    setFilteredData(updated);
    try {
      await fetch(`${publicIp}/admin/liveAccess`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: id, liveAccess: newValue }),
      });
    } catch (err) {
      setFilteredData((prev) =>
        prev.map((u) => (u._id === id ? { ...u, liveAccess: !newValue } : u))
      );
    }
  };

  const handleVerifiedSwitchChange = async (id, newValue) => {
    const updated = filteredData.map((u) =>
      u._id === id ? { ...u, isVerified: newValue } : u
    );
    setFilteredData(updated);
    try {
      await fetch(`${publicIp}/admin/setVerified`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: id, setVerified: newValue }),
      });
    } catch (err) {
      setFilteredData((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isVerified: !newValue } : u))
      );
    }
  };

  // Open Modals
  const openStrikeModal = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setStrikeReason("");
    setIsStrikeModalOpen(true);
  };

  const openLiftModal = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setIsLiftModalOpen(true);
  };

  // Confirm Strike
  const confirmStrike = async () => {
    if (!strikeReason.trim() || strikeReason.trim().length < 10) {
      setSuccessMessage("Reason must be at least 10 characters");
      setSuccessType("error");
      setIsSuccessModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${publicIp}/user/strikeUser`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userid: selectedUserId,
          reason: strikeReason.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFilteredData((prev) =>
          prev.map((u) =>
            u._id === selectedUserId ? { ...u, underStrike: true } : u
          )
        );
        setIsStrikeModalOpen(false);
        setSuccessMessage(`Strike issued to ${selectedUsername}`);
        setSuccessType("strike");
        setIsSuccessModalOpen(true);
      } else {
        setSuccessMessage(data.message || "Failed to issue strike");
        setSuccessType("error");
        setIsSuccessModalOpen(true);
      }
    } catch (err) {
      setSuccessMessage("Network error. Please try again.");
      setSuccessType("error");
      setIsSuccessModalOpen(true);
    }
  };

  // Confirm Lift Strike
  const confirmLiftStrike = async () => {
    try {
      const res = await fetch(`${publicIp}/user/liftStrike`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid: selectedUserId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setFilteredData((prev) =>
          prev.map((u) =>
            u._id === selectedUserId ? { ...u, underStrike: false } : u
          )
        );
        setIsLiftModalOpen(false);
        setSuccessMessage(`Strike lifted from ${selectedUsername}`);
        setSuccessType("lift");
        setIsSuccessModalOpen(true);
      } else {
        setSuccessMessage(data.message || "Failed to lift strike");
        setSuccessType("error");
        setIsSuccessModalOpen(true);
      }
    } catch (err) {
      setSuccessMessage("Network error. Please try again.");
      setSuccessType("error");
      setIsSuccessModalOpen(true);
    }
  };

  return (
    <div className="dashboard-container">
      {loading && <Loader />}
      {/* Your Original Layout - Untouched */}
      <div className="dashboard-container-contained">
        <div className="input-set-contained-miller">
          <div className="input-set-contained-deep">
            <div className="heading-contained">
              <h2>User Management</h2>
            </div>
            <div className="input-set-contained">
              <input
                placeholder="Search"
                type="text"
                className="input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="btn-search" onClick={handleSearchClick}>
                Search
              </button>
            </div>
          </div>
          <div className="user-card-section">
            <div className="user-card">
              <FaUsers className="user-card-icon" />
              <h3 className="user-card-title">Total Users</h3>
              <p className="user-card-count">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="complete-table-nice">
          <TableContainer
            component={Paper}
            className="scroll-table scroll-continue-para"
          >
            <Table className="table-set">
              <TableHead>
                <TableRow className="table-cell">
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "18rem" }}
                  >
                    Name
                  </TableCell>
                  <TableCell className="table-cell">Under Strike</TableCell>
                  <TableCell className="table-cell">Ban</TableCell>
                  <TableCell className="table-cell">Live Access</TableCell>
                  <TableCell className="table-cell">Verified</TableCell>
                  <TableCell className="table-cell">Strike Action</TableCell>
                  <TableCell className="table-cell">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-cell-set">
                {filteredData.map((user) => (
                  <TableRow key={user._id} className="table-cell-set">
                    <TableCell className="table-cell-set">
                      {user.firstname} {user.lastname}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`strike-status ${
                          user.underStrike ? "striked" : "not-striked"
                        }`}
                      >
                        {user.underStrike ? "Yes" : "No"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.banned || false}
                          onChange={(e) =>
                            handleBanSwitchChange(user._id, e.target.checked)
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </TableCell>

                    <TableCell>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.liveAccess || false}
                          onChange={(e) =>
                            handleLiveAccessSwitchChange(
                              user._id,
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </TableCell>

                    <TableCell>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.isVerified || false}
                          onChange={(e) =>
                            handleVerifiedSwitchChange(
                              user._id,
                              e.target.checked
                            )
                          }
                        />
                        <span className="slider"></span>
                      </label>
                    </TableCell>

                    <TableCell>
                      {user.underStrike ? (
                        <button
                          className="btn-lift-strike"
                          onClick={() =>
                            openLiftModal(
                              user._id,
                              user.username ||
                                `${user.firstname} ${user.lastname}`
                            )
                          }
                        >
                          Lift Strike
                        </button>
                      ) : (
                        <button
                          className="btn-strike-user"
                          onClick={() =>
                            openStrikeModal(
                              user._id,
                              user.username ||
                                `${user.firstname} ${user.lastname}`
                            )
                          }
                        >
                          Strike User
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="btn-controller">
                        <button onClick={() => handleDetailsClick(user)}>
                          Details
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            className="pagination-sett"
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
      {/* STRIKE MODAL */}
      {isStrikeModalOpen && (
        <div
          className="pro-modal-overlay"
          onClick={() => setIsStrikeModalOpen(false)}
        >
          <div className="pro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h2>Issue Strike</h2>
              <button
                className="pro-close-btn"
                onClick={() => setIsStrikeModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="pro-modal-body">
              <div className="pro-user-box strike">
                <span className="label">Target User</span>
                <h3>{selectedUsername}</h3>
              </div>
              <div className="pro-field">
                <label>
                  Reason for Strike <span className="required">*</span>
                </label>
                <textarea
                  value={strikeReason}
                  onChange={(e) => setStrikeReason(e.target.value)}
                  placeholder="Describe the violation in detail..."
                  rows="5"
                />
              </div>
            </div>
            <div className="pro-modal-footer">
              <button
                className="pro-btn pro-btn-danger"
                onClick={confirmStrike}
              >
                Issue Strike
              </button>
              <button
                className="pro-btn pro-btn-secondary"
                onClick={() => setIsStrikeModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIFT STRIKE MODAL */}
      {isLiftModalOpen && (
        <div
          className="pro-modal-overlay"
          onClick={() => setIsLiftModalOpen(false)}
        >
          <div className="pro-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header lift">
              <h2>Lift Strike</h2>
              <button
                className="pro-close-btn"
                onClick={() => setIsLiftModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="pro-modal-body">
              <div className="pro-user-box lift">
                <span className="label">User</span>
                <h3>{selectedUsername}</h3>
              </div>
              <p className="warning">This action cannot be undone.</p>
            </div>
            <div className="pro-modal-footer">
              <button
                className="pro-btn pro-btn-success"
                onClick={confirmLiftStrike}
              >
                Confirm Lift Strike
              </button>
              <button
                className="pro-btn pro-btn-secondary"
                onClick={() => setIsLiftModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR MODAL */}
      {isSuccessModalOpen && (
        <div
          className="pro-modal-overlay"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div className="pro-modal success" style={{ maxWidth: "480px" }}>
            <div className="success-check">✓</div>
            <h2>
              {successType === "strike" && "Strike Issued"}
              {successType === "lift" && "Strike Removed"}
              {successType === "error" && "Failed"}
            </h2>
            <p>{successMessage}</p>
            <button
              className="pro-btn pro-btn-primary"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Paginated;
