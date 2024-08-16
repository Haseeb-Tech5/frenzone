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
  Button,
} from "@mui/material";
import "./draw.css";
import StatusOverview from "./SttausOveriew/StatusOverview";

const DrwalTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

        // Fetch withdrawal data for each user
        const usersWithWithdrawals = usersArray.map((user) =>
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
                return user;
              }
              return null;
            })
            .catch((error) => {
              console.error("Error fetching withdrawal data:", error);
              return null;
            })
        );

        Promise.all(usersWithWithdrawals).then((users) => {
          const filteredUsers = users.filter((user) => user !== null);
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
                <TableCell className="table-cell" style={{ minWidth: "150px" }}>
                  Name
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "150px" }}>
                  Amount
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "150px" }}>
                  Withdrawal Date
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "150px" }}>
                  Withdrawal Time
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "292px" }}>
                  lemverifyID
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "150px" }}>
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
                  const verifyID = "hSXjBUI4JZd91UbD6gHIs"; // Assuming this is a constant

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
                          onClick={() => copyToClipboard(verifyID)}
                        >
                          {verifyID}
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
    </div>
  );
};

export default DrwalTable;
