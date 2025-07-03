import React, { useState, useEffect } from "react";
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
import Loader from "../Loader/Loader";
import StatusOverview from "./SttausOveriew/StatusOverview";
import "./modal.css";

const DrwalTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const fetchData = () => {
    let url = `https://api.frenzone.live/admin/getAllUsers?page=${
      page + 1
    }&limit=${rowsPerPage}${searchTerm ? `&keyword=${searchTerm}` : ""}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        const usersArray = data.users || [];
        setTotalUsers(data.count || 0);
        const usersWithWithdrawalsAndVerification = usersArray.map((user) =>
          fetch(`https://api.frenzone.live/wallet/getWithdrawById/${user._id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch withdrawal data");
              }
              return response.json();
            })
            .then((withdrawalData) => {
              if (withdrawalData.length > 0) {
                user.withdrawals = withdrawalData;
                return fetch(
                  `https://api.frenzone.live/auth/getLamVerifyDataById/${user._id}`
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Failed to fetch verification data");
                    }
                    return response.json();
                  })
                  .then((verificationData) => {
                    if (verificationData.verificationData.length > 0) {
                      user.lemid = verificationData.verificationData[0].lemid;
                      user.url = verificationData.verificationData[0].url;
                    } else {
                      user.lemid = "N/A";
                      user.url = "N/A";
                    }
                    return user;
                  });
              } else {
                user.lemid = "N/A";
                user.url = "N/A";
                return user;
              }
            })
            .catch((error) => {
              console.error(
                "Error fetching withdrawal or verification data:",
                error
              );
              user.lemid = "N/A";
              user.url = "N/A";
              return user;
            })
        );

        Promise.all(usersWithWithdrawalsAndVerification).then((users) => {
          const filteredUsers = users.filter((user) => user.withdrawals);
          setFilteredData(filteredUsers);
          setError(null);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleSearchClick = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      fetchData();
    }
  };

  const isLastRowOfPage = (index) => {
    const totalRowsOnPage = Math.min(rowsPerPage, filteredData.length);
    return index === totalRowsOnPage - 1;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };

  const handleModalOpen = (user) => {
    setModalData(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalData({});
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {loading && <Loader />}
      <div className="dashboard-container-contained">
        <div className="input-set-contained-miller">
          <div className="input-set-contained-deep">
            <div className="heading-contained">
              <h2>Withdrawal Management</h2>
            </div>
            <div className="input-set-contained">
              <input
                placeholder="Search"
                type="text"
                className="input"
                required=""
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="btn-search" onClick={handleSearchClick}>
                Search
              </button>
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
                    style={{ minWidth: "22rem" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Withdrawal Date
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Withdrawal Time
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Verification
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-cell-set">
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => {
                    const withdrawal = user.withdrawals[0];
                    const amount = withdrawal.amount;
                    const date = new Date(
                      withdrawal.createdAt
                    ).toLocaleDateString();
                    const time = new Date(
                      withdrawal.createdAt
                    ).toLocaleTimeString();
                    const status = withdrawal.status;

                    return (
                      <TableRow
                        key={user._id}
                        className="table-cell-set"
                        style={{
                          borderBottom: isLastRowOfPage(index)
                            ? "none"
                            : "0.1rem solid #b8d0d0",
                          width: "100%",
                        }}
                      >
                        <TableCell className="table-cell-set">
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell className="table-cell-set">
                          <div className="clip-conut">{amount}</div>
                        </TableCell>
                        <TableCell className="table-cell-set">
                          <div className="clip-conut">{date}</div>
                        </TableCell>
                        <TableCell className="table-cell-set">
                          <div className="clip-conut">{time}</div>
                        </TableCell>
                        <TableCell className="table-cell-set">
                          <div
                            className="clip-conut"
                            onClick={() => handleModalOpen(user)}
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </div>
                        </TableCell>
                        <TableCell className="table-cell-set">
                          <StatusOverview
                            status={status}
                            withdrawalId={withdrawal._id}
                            user={user}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {/* Custom Modal for Verification */}
      {showModal && (
        <div className="modal-verification">
          <div
            className="modal-verification-overlay"
            onClick={handleModalClose}
          ></div>
          <div className="modal-verification-content">
            <div className="modal-verification-header">
              <div className="modal-verification-title">Verification</div>
              <button
                className="modal-verification-close"
                onClick={handleModalClose}
              >
                ×
              </button>
            </div>
            <div className="modal-verification-body">
              <div className="modal-verification-field">
                <span className="modal-verification-label">LemID:</span>
                <span
                  className="modal-verification-value"
                  onClick={() => copyToClipboard(modalData.lemid)}
                >
                  {modalData.lemid}
                </span>
              </div>
              <div className="modal-verification-field">
                <span className="modal-verification-label">URL:</span>
                <span className="modal-verification-value">
                  {modalData.url === "N/A" ? (
                    "N/A"
                  ) : (
                    <a
                      href={modalData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {modalData.url}
                    </a>
                  )}
                </span>
              </div>
            </div>
            <div className="modal-verification-footer">
              <button
                className="modal-verification-button"
                onClick={handleModalClose}
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

export default DrwalTable;
