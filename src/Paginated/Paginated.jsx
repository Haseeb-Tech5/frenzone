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
  TextField,
} from "@mui/material";

function Paginated() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [banSwitches, setBanSwitches] = useState({});
  const [liveAccessSwitches, setLiveAccessSwitches] = useState({});
  const [verifiedSwitches, setVerifiedSwitches] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [fullData, setFullData] = useState([]);

  const dummyData = [
    {
      id: 1,
      data: { firstName: "John", lastName: "Doe" },
    },
    {
      id: 2,
      data: { firstName: "Jane", lastName: "Smith" },
    },
    {
      id: 3,
      data: {
        firstName: "Alice",
        lastName: "Johnson",
      },
    },
    {
      id: 4,
      data: { firstName: "Bob", lastName: "Brown" },
    },
    {
      id: 5,
      data: {
        firstName: "Emily",
        lastName: "Davis",
      },
    },
    {
      id: 6,
      data: {
        firstName: "Michael",
        lastName: "Wilson",
      },
    },
    {
      id: 7,
      data: {
        firstName: "Emily",
        lastName: "Davis",
      },
    },
    {
      id: 8,
      data: {
        firstName: "Michael",
        lastName: "Wilson",
      },
    },
    {
      id: 9,
      data: {
        firstName: "Emily",
        lastName: "Davis",
      },
    },
    {
      id: 10,
      data: {
        firstName: "Michael",
        lastName: "Wilson",
      },
    },
    {
      id: 11,
      data: {
        firstName: "Emily",
        lastName: "Davis",
      },
    },
    {
      id: 12,
      data: {
        firstName: "Michael",
        lastName: "Wilson",
      },
    },
  ];

  useEffect(() => {
    setFullData(dummyData);
  }, []);

  useEffect(() => {
    let filtered = fullData;
    if (searchTerm) {
      filtered = fullData.filter((row) =>
        Object.values(row.data).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredData(filtered);
    setPage(0);
  }, [searchTerm, fullData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSwitchChange = (id, setter) => {
    setter((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
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
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
      </div>
      {/* <div className="scroll-table"> */}
      <TableContainer component={Paper} className="scroll-table">
        <Table>
          <TableHead className="table-heading-set">
            <TableRow className="table-cell">
              <TableCell className="table-cell">Name</TableCell>
              <TableCell className="table-cell">Ban</TableCell>
              <TableCell className="table-cell">Live Access</TableCell>
              <TableCell className="table-cell">Verified</TableCell>
              <TableCell className="table-cell1">Verified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-cell-set">
            {(rowsPerPage > 0
              ? filteredData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredData
            ).map((row) => (
              <TableRow key={row.id} className="table-cell-set">
                <TableCell className="table-cell-set">
                  {row.data.firstName} {row.data.lastName}
                </TableCell>
                <TableCell>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={banSwitches[row.id] || false}
                      onChange={() =>
                        handleSwitchChange(row.id, setBanSwitches)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </TableCell>
                <TableCell>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={liveAccessSwitches[row.id] || false}
                      onChange={() =>
                        handleSwitchChange(row.id, setLiveAccessSwitches)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </TableCell>
                <TableCell>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={verifiedSwitches[row.id] || false}
                      onChange={() =>
                        handleSwitchChange(row.id, setVerifiedSwitches)
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
      {/* </div> */}
    </div>
  );
}

export default Paginated;
