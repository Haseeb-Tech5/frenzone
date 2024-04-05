import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function Paginated() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const fetchData = () => {
    let url = "https://api.frenzone.live/admin/getAllUsers";

    // If there's a search term, use the search API endpoint
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
        setFilteredData(usersArray);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
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

  const handleBanSwitchChange = (id, newValue) => {
    updateProperty(id, "ban", newValue);
  };

  const handleLiveAccessSwitchChange = (id, newValue) => {
    updateProperty(id, "liveAccess", newValue);
  };

  const handleVerifiedSwitchChange = (id, newValue) => {
    updateProperty(id, "setVerified", newValue);
  };

  const updateProperty = (id, property, newValue) => {
    const updatedData = filteredData.map((user) => {
      if (user._id === id) {
        return {
          ...user,
          [property]: newValue,
        };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/${property}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid: id,
        [property]: newValue,
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
        console.error("Error updating user:", error);
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
      <TableContainer component={Paper} className="scroll-table">
        <Table>
          <TableHead className="table-heading-set">
            <TableRow className="table-cell">
              <TableCell className="table-cell">Name</TableCell>
              <TableCell className="table-cell">Ban</TableCell>
              <TableCell className="table-cell">Live Access</TableCell>
              <TableCell className="table-cell">Verified</TableCell>
              <TableCell className="table-cell1">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-cell-set">
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id} className="table-cell-set">
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
                          handleVerifiedSwitchChange(user._id, e.target.checked)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </TableCell>
                  <TableCell>
                    <Link to="/detailed" style={{ textDecoration: "none" }}>
                      <div className="btn-controller">
                        <button>Details</button>
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default Paginated;
