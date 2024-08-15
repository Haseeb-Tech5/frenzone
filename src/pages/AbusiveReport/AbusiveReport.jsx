import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./abuse.css";

const AbusiveReport = () => {
  const [reportData, setReportData] = useState(null);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (selectedUser?._id) {
      const apiUrl = `https://api.frenzone.live/report/getReportedUserById/${selectedUser._id}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.reports.length > 0) {
            setReportData(data.reports[0]);
          } else {
            setReportData(null);
          }
          setIsUserBlocked(selectedUser.isAdminBlocked);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedUser]);

  const handleRemove = () => {
    if (reportData) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove report!",
      }).then((result) => {
        if (result.isConfirmed) {
          const apiUrl = `https://api.frenzone.live/report/removeReportedUser/${reportData.reportedUserId}`;
          console.log("reportData.reportedUserId", reportData.reportedUserId);
          fetch(apiUrl, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                Swal.fire({
                  title: "Removed!",
                  text: "The report has been removed successfully.",
                  icon: "success",
                  confirmButtonText: "OK",
                });
                setReportData(null);
              } else {
                Swal.fire({
                  title: "Error!",
                  text: "Failed to remove the report.",
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            })
            .catch((error) => {
              console.error("Error removing report:", error);
              Swal.fire({
                title: "Error!",
                text: "Error removing report.",
                icon: "error",
                confirmButtonText: "OK",
              });
            });
        }
      });
    }
  };

  const handleToggleBlock = () => {
    Swal.fire({
      title: "Are you sure?",
      text: isUserBlocked
        ? "This will unblock the user!"
        : "This will block the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isUserBlocked
        ? "Yes, unblock user!"
        : "Yes, block user!",
    }).then((result) => {
      if (result.isConfirmed) {
        const apiUrl = `https://api.frenzone.live/admin/blockUserByAdmin`;
        fetch(apiUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminId: adminId,
            usertoBlockId: selectedUser._id,
          }),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                title: isUserBlocked ? "Unblocked!" : "Blocked!",
                text: `User has been ${
                  isUserBlocked ? "unblocked" : "blocked"
                } successfully.`,
                icon: "success",
                confirmButtonText: "OK",
              });
              setIsUserBlocked(!isUserBlocked);
            } else {
              Swal.fire({
                title: "Error!",
                text: `Failed to ${
                  isUserBlocked ? "unblock" : "block"
                } the user.`,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch((error) => {
            console.error(
              `Error ${isUserBlocked ? "unblocking" : "blocking"} user:`,
              error
            );
            Swal.fire({
              title: "Error!",
              text: `Error ${isUserBlocked ? "unblocking" : "blocking"} user.`,
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  const formattedDuration = reportData ? reportData.reportedDuration : "N/A";

  return (
    <div className="container3-sett">
      {isUserBlocked ? (
        <div className="container-set-max-flex">
          <div className="cards">
            <div className="card red">
              <div className="data-set-max-flex red-cololr-bloack">
                <h1>Blocked User</h1>
                <h1>User has been blocked.</h1>
              </div>
            </div>
          </div>
          <div className="remove-reported0users click-oral">
            <button onClick={handleToggleBlock}>Unblock</button>
          </div>
        </div>
      ) : (
        <div className="container-set-max-flex">
          <div className="cards">
            {reportData === null ? (
              <div className="card red">
                <div className="data-set-max-flex green-reportes-data">
                  <h1>No Reports</h1>
                  <h1>This user has not been reported.</h1>
                </div>
              </div>
            ) : (
              <>
                <div className="card red">
                  <div className="data-set-max-flex">
                    <h1>User</h1>
                    <h1>{reportData.reportedUser}</h1>
                  </div>
                </div>
                <div className="card blue">
                  <div className="data-set-max-flex">
                    <h1>Reported by</h1>
                    <h1>{reportData.reportedBy}</h1>
                  </div>
                </div>
                <div className="card green">
                  <div className="data-set-max-flex">
                    <h1>Reported Days</h1>
                    <h1>{formattedDuration}</h1>
                  </div>
                </div>
                <div className="card blue">
                  <div className="data-set-max-flex">
                    <h1>Reported</h1>
                    <h1>
                      {new Date(reportData.reportedAt).toLocaleDateString()}
                    </h1>
                  </div>
                </div>
                <div className="card green">
                  <div className="data-set-max-flex">
                    <h1>Message</h1>
                    <h1>{reportData.reason}</h1>
                  </div>
                </div>
              </>
            )}
          </div>
          {reportData && (
            <div className="remove-reported0users">
              <button onClick={handleRemove}>Remove</button>
              <button onClick={handleToggleBlock}>
                {isUserBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AbusiveReport;
