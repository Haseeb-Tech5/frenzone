import React, { useState, useEffect } from "react";
import "./table.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { setSelectedUser } from "../Redux/userSlice";

function Paginated() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        setFilteredData(usersArray);
        setError(null);
        setLoading(false);
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

  const handleDetailsClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate("/detailed");
  };

  const handleBanSwitchChange = (id, newValue) => {
    const updatedData = filteredData.map((user) => {
      if (user._id === id) {
        return {
          ...user,
          banned: newValue,
        };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/ban`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
              return {
                ...user,
                banned: !newValue,
              };
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
        return {
          ...user,
          liveAccess: newValue,
        };
      }
      return user;
    });

    setFilteredData(updatedData);

    fetch(`https://api.frenzone.live/admin/liveAccess`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
              return {
                ...user,
                liveAccess: !newValue,
              };
            }
            return user;
          })
        );
        console.error("Error updating user:", error);
      });
  };

  const isLastRowOfPage = (index) => {
    const totalRowsOnPage = Math.min(
      rowsPerPage,
      filteredData.length - page * rowsPerPage
    );
    return index === totalRowsOnPage - 1;
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
          className="scroll-table scroll-continue-para"
        >
          <Table className="table-set">
            <TableHead>
              <TableRow className="table-cell">
                <TableCell className="table-cell" style={{ minWidth: "300px" }}>
                  Name
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "260px" }}>
                  Ban
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "260px" }}>
                  Live Access
                </TableCell>
                <TableCell className="table-cell" style={{ minWidth: "200px" }}>
                  Details
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-cell-set">
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
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
}

export default Paginated;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TablePagination,
// } from "@mui/material";

// function Paginated() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [page, rowsPerPage, searchTerm]);

//   const fetchData = () => {
//     setLoading(true);
//     let url = "https://api.frenzone.live/admin/getAllUsers";

//     if (searchTerm) {
//       url = `https://api.frenzone.live/admin/searchUsers/${rowsPerPage}/${
//         page + 1
//       }/${searchTerm}`;
//     }

//     fetch(url)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const usersArray = data.users || [];
//         setFilteredData(usersArray);
//         setError(null);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setError(error);
//         setLoading(false);
//       });
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setPage(0);
//   };

//   const handleBanSwitchChange = (id, newValue) => {
//     // Optimistic UI update
//     const updatedData = filteredData.map((user) => {
//       if (user._id === id) {
//         return {
//           ...user,
//           banned: newValue,
//         };
//       }
//       return user;
//     });

//     setFilteredData(updatedData);

//     // Make API call
//     fetch(`https://api.frenzone.live/admin/ban`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userid: id,
//         ban: newValue,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update user");
//         }
//         console.log(
//           `User with ID ${id} ${newValue ? "banned" : "unbanned"} successfully`
//         );
//       })
//       .catch((error) => {
//         // Revert local state if API call fails
//         setFilteredData(
//           filteredData.map((user) => {
//             if (user._id === id) {
//               return {
//                 ...user,
//                 banned: !newValue,
//               };
//             }
//             return user;
//           })
//         );
//         console.error("Error updating user:", error);
//       });
//   };

//   const handleVerifiedSwitchChange = (id, newValue) => {
//     // Optimistic UI update
//     const updatedData = filteredData.map((user) => {
//       if (user._id === id) {
//         return {
//           ...user,
//           isVerified: newValue,
//         };
//       }
//       return user;
//     });

//     setFilteredData(updatedData);

//     // Make API call
//     fetch(`https://api.frenzone.live/admin/setVerified`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userid: id,
//         setVerified: newValue,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update user");
//         }
//         console.log(
//           `User with ID ${id} ${
//             newValue ? "verified" : "unverified"
//           } successfully`
//         );
//       })
//       .catch((error) => {
//         // Revert local state if API call fails
//         setFilteredData(
//           filteredData.map((user) => {
//             if (user._id === id) {
//               return {
//                 ...user,
//                 isVerified: !newValue,
//               };
//             }
//             return user;
//           })
//         );
//         console.error("Error updating user:", error);
//       });
//   };
//   const handleLiveAccessSwitchChange = (id, newValue) => {
//     // Optimistic UI update
//     const updatedData = filteredData.map((user) => {
//       if (user._id === id) {
//         return {
//           ...user,
//           liveAccess: newValue,
//         };
//       }
//       return user;
//     });

//     setFilteredData(updatedData);

//     // Make API call
//     fetch(`https://api.frenzone.live/admin/liveAccess`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userid: id,
//         liveAccess: newValue,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update user");
//         }
//         console.log(
//           `User with ID ${id} ${
//             newValue ? "granted live access" : "revoked live access"
//           } successfully`
//         );
//       })
//       .catch((error) => {
//         // Revert local state if API call fails
//         setFilteredData(
//           filteredData.map((user) => {
//             if (user._id === id) {
//               return {
//                 ...user,
//                 liveAccess: !newValue,
//               };
//             }
//             return user;
//           })
//         );
//         console.error("Error updating user:", error);
//       });
//   };

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div>
//       <div className="input-set-contained">
//         <input
//           placeholder="Search"
//           type="text"
//           className="input"
//           required=""
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>
//       {loading ? (
//         <div class="spinner-set">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <TableContainer component={Paper} className="scroll-table">
//           <Table>
//             <TableHead className="table-heading-set">
//               <TableRow className="table-cell">
//                 <TableCell className="table-cell">Name</TableCell>
//                 <TableCell className="table-cell">Ban</TableCell>
//                 <TableCell className="table-cell">Live Access</TableCell>
//                 <TableCell className="table-cell">Verified</TableCell>
//                 <TableCell className="table-cell1">Details</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody className="table-cell-set">
//               {filteredData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((user) => (
//                   <TableRow key={user._id} className="table-cell-set">
//                     <TableCell className="table-cell-set">
//                       {user.firstname} {user.lastname}
//                     </TableCell>
//                     <TableCell>
//                       <label className="switch">
//                         <input
//                           type="checkbox"
//                           checked={user.banned || false}
//                           onChange={(e) =>
//                             handleBanSwitchChange(user._id, e.target.checked)
//                           }
//                         />
//                         <span className="slider"></span>
//                       </label>
//                     </TableCell>
//                     <TableCell>
//                       <label className="switch">
//                         <input
//                           type="checkbox"
//                           checked={user.liveAccess || false}
//                           onChange={(e) =>
//                             handleLiveAccessSwitchChange(
//                               user._id,
//                               e.target.checked
//                             )
//                           }
//                         />
//                         <span className="slider"></span>
//                       </label>
//                     </TableCell>
//                     <TableCell>
//                       <label className="switch">
//                         <input
//                           type="checkbox"
//                           checked={user.isVerified || false}
//                           onChange={(e) =>
//                             handleVerifiedSwitchChange(
//                               user._id,
//                               e.target.checked
//                             )
//                           }
//                         />
//                         <span className="slider"></span>
//                       </label>
//                     </TableCell>
//                     <TableCell>
//                       <Link to="/detailed" style={{ textDecoration: "none" }}>
//                         <div className="btn-controller">
//                           <button>Details</button>
//                         </div>
//                       </Link>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// }

// export default Paginated;
