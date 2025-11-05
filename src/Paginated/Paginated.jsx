import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUsers } from "react-icons/fa";
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

function Paginated() {
  const token = localStorage.getItem("token");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publicIp = "https://api.frenzone.live"; // Replace with actual public IP if different

  useEffect(() => {
    setLoading(true); // Show loader for pagination changes
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
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setFilteredData(data.users || []); // Set users array
        setTotalUsers(data.count || 0); // Set total count
        setError(null);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setFilteredData([]); // Clear filteredData on error
    } finally {
      setLoading(false); // Hide loader after fetch
    }
  };

  const handleSearchClick = () => {
    if (page !== 0) {
      setPage(0); // Reset to page 0, will trigger useEffect and loader
    } else {
      fetchData(); // Call fetchData without loader unless page changes
    }
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (!newSearchTerm && page !== 0) {
      setPage(0); // Reset to page 0, will trigger useEffect and loader
    } else if (!newSearchTerm) {
      fetchData(); // Fetch all users when input cleared, no loader unless page changes
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Triggers useEffect and loader
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Triggers useEffect and loader
  };

  const handleDetailsClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/detailed");
  };

  const handleBanSwitchChange = (id, newValue) => {
    const updatedData = filteredData.map((user) => {
      if (user._id === id) {
        return { ...user, banned: newValue };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userid: id,
        ban: newValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        console.log(
          `User with ID ${id} ${newValue ? "banned" : "unbanned"} successfully`
        );
      })
      .catch((error) => {
        setFilteredData(
          filteredData.map((user) => {
            if (user._id === id) {
              return { ...user, banned: !newValue };
            }
            return user;
          })
        );
        console.error("Error updating user:", error);
      });
  };

  const handleLiveAccessSwitchChange = (id, newValue) => {
    const updatedData = filteredData.map((user) => {
      if (user._id === id) {
        return { ...user, liveAccess: newValue };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/liveAccess`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userid: id,
        liveAccess: newValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        console.log(
          `User with ID ${id} ${
            newValue ? "granted live access" : "revoked live access"
          } successfully`
        );
      })
      .catch((error) => {
        setFilteredData(
          filteredData.map((user) => {
            if (user._id === id) {
              return { ...user, liveAccess: !newValue };
            }
            return user;
          })
        );
        console.error("Error updating user:", error);
      });
  };

  const handleVerifiedSwitchChange = (id, newValue) => {
    const updatedData = filteredData.map((user) => {
      if (user._id === id) {
        return { ...user, isVerified: newValue };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/setVerified`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userid: id,
        setVerified: newValue,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        console.log(
          `User with ID ${id} ${
            newValue ? "verified" : "unverified"
          } successfully`
        );
      })
      .catch((error) => {
        setFilteredData(
          filteredData.map((user) => {
            if (user._id === id) {
              return { ...user, isVerified: !newValue };
            }
            return user;
          })
        );
        console.error("Error updating user:", error);
      });
  };

  const isLastRowOfPage = (index) => {
    const totalRowsOnPage = Math.min(rowsPerPage, filteredData.length);
    return index === totalRowsOnPage - 1;
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
              <h2>User Management</h2>
            </div>
            <div className="input-set-contained">
              <input
                placeholder="Search"
                type="text"
                className="input"
                required=""
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
                    style={{ minWidth: "22rem" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Ban
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Live Access
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Verified
                  </TableCell>
                  <TableCell
                    className="table-cell"
                    style={{ minWidth: "22rem" }}
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="table-cell-set">
                {filteredData.map((user, index) => (
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
    </div>
  );
}

export default Paginated;
