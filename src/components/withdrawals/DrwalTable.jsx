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
import { Modal, Button } from "react-bootstrap";
import "./draw.css";
import StatusOverview from "./SttausOveriew/StatusOverview";

const DrwalTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const fetchData = () => {
    setLoading(true);
    let url = "https://api.frenzone.live/admin/getAllUsers";

    if (searchTerm) {
      url = `https://api.frenzone.live/admin/searchUsers/${rowsPerPage}/${
        page + 1
      }/${searchTerm}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        const usersArray = data.users || [];
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
        setError(error);
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

  const isLastRowOfPage = (index) => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage - 1;
    return index === endIndex || index === filteredData.length - 1;
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

  return (
    <div>
      <div className="input-set-contained">
        <input
          placeholder="Search"
          type="text"
          className="input"
          required=""
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {loading ? (
        <div className="spinner-set">
          <div className="spinner"></div>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="scroll-table scroll-continue-para oper-cer"
        >
          <Table className="table-set">
            <TableHead>
              <TableRow className="table-cell">
                <TableCell className="table-cell" style={{ minWidth: "175px" }}>
                  Name
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "175px" }}>
                  Amount
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "175px" }}>
                  Withdrawal Date
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "175px" }}>
                  Withdrawal Time
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "175px" }}>
                  Verification
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "155px" }}>
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
                          : "1px solid #b8d0d0",
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
                          style={{ textDecoration: "none", cursor: "pointer" }}
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
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100, 150, 200, 250]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Verification */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="slecet-staus-oracle">Verification</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="lemid-container-lemid-main">
            <div className="lemid-container-lemid">
              <div className="lemid-text-set">lemid:</div>{" "}
              <div
                className="lemid-text-sett"
                onClick={() => copyToClipboard(modalData.lemid)}
              >
                {" "}
                {modalData.lemid}
              </div>
            </div>
            <div className="lemid-container-lemid">
              <div className="lemid-text-set">URL:</div>{" "}
              <div className="lemid-text-sett">
                {" "}
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
              </div>
            </div>
          </div>
          <div className="check-status-button crip-lemid">
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DrwalTable;
