import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "./UpdateVerifiedUsers.css";
import Loader from "../../components/Loader/Loader";

const UpdateVerifiedUsers = () => {
  const token = localStorage.getItem("token");

  // ONLY ONE BASE URL — YOUR ORIGINAL
  const BASE_URL = "https://api.frenzone.live";

  // State for API data
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selection - Now multiple users can be selected (up to 5)
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // State for ADD MODE (new feature)
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [addSearchResults, setAddSearchResults] = useState([]);
  const [addSearchLoading, setAddSearchLoading] = useState(false);

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedReplacementUsers, setSelectedReplacementUsers] = useState([]);

  // State for updating
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchVerifiedUsers();
  }, []);

  // Calculate how many users can be added
  const maxUsersAllowed = 5;
  const currentUserCount = verifiedUsers.length;
  const canAddUsers = currentUserCount < 4;
  const maxUsersToAdd = maxUsersAllowed - currentUserCount;

  // Fetch verified users
  const fetchVerifiedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/getRandomVerified`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch verified users");

      const data = await response.json();

      if (data.users) {
        setVerifiedUsers(data.users);
        setSelectedUserIds([]); // Reset selection when data refreshes
        setError(null);
      } else {
        throw new Error("No users returned");
      }
    } catch (err) {
      setError("Failed to fetch verified users");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to load verified users.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        // Remove if already selected
        return prev.filter((id) => id !== userId);
      } else {
        // Add if not selected and limit to 5
        if (prev.length >= 5) {
          Swal.fire({
            icon: "warning",
            title: "Maximum Limit",
            text: "You can select up to 5 users only.",
            timer: 2000,
          });
          return prev;
        }
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === verifiedUsers.length) {
      setSelectedUserIds([]);
    } else {
      // Select all users (up to 5)
      const allIds = verifiedUsers.map((user) => user._id);
      const limitedIds = allIds.slice(0, 5); // Limit to first 5
      setSelectedUserIds(limitedIds);
      
      if (allIds.length > 5) {
        Swal.fire({
          icon: "info",
          title: "Selection Limited",
          text: "Only the first 5 users have been selected due to the maximum limit.",
          timer: 2500,
        });
      }
    }
  };

  const openSearchModal = () => {
    if (selectedUserIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Users Selected",
        text: "Please select 1-5 users to replace.",
      });
      return;
    }

    setSearchModalOpen(true);
    setSelectedReplacementUsers([]);
    setSearchResults([]);
    setSearchQuery("");
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedReplacementUsers([]);
  };

  // ============= ADD MODE FUNCTIONS (NEW FEATURE) =============

  const openAddModal = () => {
    setAddModalOpen(true);
    setSelectedUsersToAdd([]);
    setAddSearchResults([]);
    setAddSearchQuery("");
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddSearchQuery("");
    setAddSearchResults([]);
    setSelectedUsersToAdd([]);
  };

  // Search for users to add
  const debouncedAddSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setAddSearchResults([]);
        return;
      }

      setAddSearchLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/user/searchUsersNew`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ search: query.trim() }),
        });

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        
        // Get current user IDs to exclude
        const currentUserIds = verifiedUsers.map(user => user._id);
        
        // Filter to show only verified users (excluding current users)
        const verifiedUsersOnly = data.users && Array.isArray(data.users) 
          ? data.users.filter(user => 
              user.isVerified === true && 
              !currentUserIds.includes(user._id) // Don't show users already in list
            )
          : [];
          
        setAddSearchResults(verifiedUsersOnly);
      } catch (err) {
        console.error("Search error:", err);
        setAddSearchResults([]);
        Swal.fire("Error", "Search failed. Please try again.", "error");
      } finally {
        setAddSearchLoading(false);
      }
    }, 600),
    [token, verifiedUsers]
  );

  const handleAddSearchChange = (e) => {
    const query = e.target.value;
    setAddSearchQuery(query);
    if (query.length >= 2) {
      debouncedAddSearch(query);
    } else {
      setAddSearchResults([]);
    }
  };

  const handleAddUserSelect = (user) => {
    setSelectedUsersToAdd((prev) => {
      if (prev.some((u) => u._id === user._id)) {
        // Remove if already selected
        return prev.filter((u) => u._id !== user._id);
      } else {
        // Add if not selected and limit to available slots
        if (prev.length >= maxUsersToAdd) {
          Swal.fire({
            icon: "warning",
            title: "Maximum Limit",
            text: `You can add only ${maxUsersToAdd} more user(s).`,
            timer: 2000,
          });
          return prev;
        }
        return [...prev, user];
      }
    });
  };

  // Confirm adding new users
  const confirmAddUsers = async () => {
    if (selectedUsersToAdd.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Users Selected",
        text: "Please select at least one user to add.",
      });
      return;
    }

    const newUserNames = selectedUsersToAdd.map(u => `@${u.username}`).join(", ");

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Addition',
      html: `Add <b>${newUserNames}</b> to verified users list?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add users',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      width: '600px'
    });

    if (result.isConfirmed) {
      // Get current user IDs
      const currentUserIds = verifiedUsers.map(user => user._id);
      
      // Add new user IDs
      const newUserIds = selectedUsersToAdd.map(user => user._id);
      const updatedUserIds = [...currentUserIds, ...newUserIds];
      
      // Call update API
      const success = await addNewVerifiedUsers(updatedUserIds);
      
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Users Added!",
          html: `Successfully added ${selectedUsersToAdd.length} user(s).<br>
                 <small>The list will refresh automatically.</small>`,
          timer: 2500,
        });
        
        // Refresh the user list
        fetchVerifiedUsers();
        closeAddModal();
      }
    }
  };

  // API call to add new users
  const addNewVerifiedUsers = async (userIds) => {
    setUpdating(true);
    try {
      console.log("Sending add request to:", `${BASE_URL}/user/updateVerifiedUsers`);
      console.log("Payload userids:", userIds);

      const response = await fetch(`${BASE_URL}/user/updateVerifiedUsers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userids: userIds }),
      });

      // Try to parse the response
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error(`Invalid response from server: ${response.status}`);
      }

      console.log("Add response status:", response.status);
      console.log("Add response data:", data);

      if (!response.ok) {
        let errorMessage = data.message || `HTTP ${response.status}`;
        
        if (response.status === 401) {
          errorMessage = "Unauthorized. Please check your authentication token.";
        } else if (response.status === 403) {
          errorMessage = "Forbidden. You don't have permission to update verified users.";
        } else if (response.status === 404) {
          errorMessage = "API endpoint not found. Please check the URL.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        throw new Error(errorMessage);
      }

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || "Add failed");
      }
    } catch (err) {
      console.error("Add failed:", err);
      
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        Swal.fire(
          "Network Error",
          "Cannot connect to server. Please check your internet connection.",
          "error"
        );
      } else if (err.message.includes("Invalid response from server")) {
        Swal.fire(
          "Server Error",
          "Server returned an invalid response. Please try again later.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          err.message || "Failed to add users. Please try again.",
          "error"
        );
      }
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // ============= END ADD MODE FUNCTIONS =============

  // Search API - only shows verified users
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/user/searchUsersNew`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ search: query.trim() }),
        });

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        
        // Filter to show only verified users (excluding the currently selected users)
        const verifiedUsersOnly = data.users && Array.isArray(data.users) 
          ? data.users.filter(user => 
              user.isVerified === true && 
              !selectedUserIds.includes(user._id) // Don't show users being replaced
            )
          : [];
          
        setSearchResults(verifiedUsersOnly);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
        Swal.fire("Error", "Search failed. Please try again.", "error");
      } finally {
        setSearchLoading(false);
      }
    }, 600),
    [token, selectedUserIds]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchUserSelect = (user) => {
    setSelectedReplacementUsers((prev) => {
      if (prev.some((u) => u._id === user._id)) {
        // Remove if already selected
        return prev.filter((u) => u._id !== user._id);
      } else {
        // Add if not selected and limit to same count as selected users
        if (prev.length >= selectedUserIds.length) {
          Swal.fire({
            icon: "warning",
            title: "Maximum Limit",
            text: `You can select only ${selectedUserIds.length} replacement user(s).`,
            timer: 2000,
          });
          return prev;
        }
        return [...prev, user];
      }
    });
  };

  // Update API call
  const updateVerifiedUsers = async (newUserIds) => {
    setUpdating(true);
    try {
      // Get current user IDs from the table
      const currentUserIds = verifiedUsers.map(user => user._id);
      
      // Create a mapping of old to new user IDs
      const userIdMap = {};
      selectedUserIds.forEach((oldId, index) => {
        userIdMap[oldId] = newUserIds[index] || oldId; // If no replacement, keep old ID
      });
      
      // Replace the selected user IDs with the new user IDs
      const updatedUserIds = currentUserIds.map(id => 
        userIdMap[id] || id
      );

      console.log("Sending update to:", `${BASE_URL}/user/updateVerifiedUsers`);
      console.log("Selected users to replace:", selectedUserIds);
      console.log("Replacement users:", newUserIds);
      console.log("Payload userids:", updatedUserIds);

      const response = await fetch(`${BASE_URL}/user/updateVerifiedUsers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userids: updatedUserIds }),
      });

      // Try to parse the response
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error(`Invalid response from server: ${response.status}`);
      }

      console.log("Update response status:", response.status);
      console.log("Update response data:", data);

      if (!response.ok) {
        let errorMessage = data.message || `HTTP ${response.status}`;
        
        if (response.status === 401) {
          errorMessage = "Unauthorized. Please check your authentication token.";
        } else if (response.status === 403) {
          errorMessage = "Forbidden. You don't have permission to update verified users.";
        } else if (response.status === 404) {
          errorMessage = "API endpoint not found. Please check the URL.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        throw new Error(errorMessage);
      }

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
      
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        Swal.fire(
          "Network Error",
          "Cannot connect to server. Please check your internet connection.",
          "error"
        );
      } else if (err.message.includes("Invalid response from server")) {
        Swal.fire(
          "Server Error",
          "Server returned an invalid response. Please try again later.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          err.message || "Failed to save changes. Please try again.",
          "error"
        );
      }
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Confirm replacement - automatically calls update API
  const confirmReplaceUsers = async () => {
    if (selectedReplacementUsers.length !== selectedUserIds.length) {
      Swal.fire({
        icon: "warning",
        title: "Selection Mismatch",
        text: `Please select exactly ${selectedUserIds.length} replacement user(s).`,
      });
      return;
    }

    // Create arrays for display
    const selectedUsers = verifiedUsers.filter(user => 
      selectedUserIds.includes(user._id)
    );
    
    const oldUserNames = selectedUsers.map(u => `@${u.username}`).join(", ");
    const newUserNames = selectedReplacementUsers.map(u => `@${u.username}`).join(", ");

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Replacement',
      html: `Replace <b>${oldUserNames}</b><br>
             with <b>${newUserNames}</b>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, replace users',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      width: '600px'
    });

    if (result.isConfirmed) {
      // Get new user IDs in the same order as selected users
      const newUserIds = selectedReplacementUsers.map(user => user._id);
      
      // Call update API
      const success = await updateVerifiedUsers(newUserIds);
      
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Users Replaced!",
          html: `Successfully replaced ${selectedUserIds.length} user(s).<br>
                 <small>The list will refresh automatically.</small>`,
          timer: 2500,
        });
        
        // Refresh the user list
        fetchVerifiedUsers();
        closeSearchModal();
      }
    }
  };

  const getProfilePicture = (user) => {
    if (user.url?.startsWith("http")) return user.url;
    if (user.profilePicture?.startsWith("http")) return user.profilePicture;
    if (user.profilePicture) {
      return `https://frenzone.s3.us-east-1.amazonaws.com/${user.profilePicture}`;
    }
    return "/default-avatar.png";
  };

  const getSelectedUsers = () => {
    return verifiedUsers.filter(user => selectedUserIds.includes(user._id));
  };

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  return (
    <div className="update-verified-container">
      {loading && <Loader />}

      <div className="update-verified-container-inner">
        <div className="update-verified-heading">
          <h2>Update Verified Users</h2>
          <p className="update-verified-subtitle">
            Select 1-5 users to replace, then search for new verified users
          </p>
        </div>

        {error && <div className="update-verified-error">{error}</div>}

        {/* ADD NEW USERS SECTION - Shows when users < 4 */}
        {canAddUsers && !loading && (
          <div className="update-verified-add-section">
            <div className="update-verified-add-card">
              <div className="update-verified-add-icon">
                <span>⚠️</span>
              </div>
              <div className="update-verified-add-content">
                <h3>Add More Verified Users</h3>
                <p>
                  You currently have only <strong>{currentUserCount}</strong> verified user(s). 
                  You can add up to <strong>{maxUsersToAdd}</strong> more user(s) to reach the maximum of {maxUsersAllowed}.
                </p>
                <button
                  className="update-verified-add-btn"
                  onClick={openAddModal}
                  disabled={updating}
                >
                  <span className="update-verified-add-btn-icon">+</span>
                  Add New Users ({maxUsersToAdd} slot{maxUsersToAdd > 1 ? 's' : ''} available)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected users info */}
        {selectedUserIds.length > 0 && (
          <div className="update-verified-selected-info">
            <div className="update-verified-selected-users-card">
              <div className="update-verified-selected-header">
                <h4>Selected Users ({selectedUserIds.length}/5)</h4>
                <button
                  className="update-verified-action-btn update-verified-replace"
                  onClick={openSearchModal}
                  disabled={updating}
                >
                  {updating ? "Processing..." : `Replace ${selectedUserIds.length} User(s)`}
                </button>
              </div>
              <div className="update-verified-selected-list">
                {getSelectedUsers().map((user) => (
                  <div key={user._id} className="update-verified-selected-item">
                    <img
                      src={getProfilePicture(user)}
                      alt={user.username}
                      className="update-verified-selected-avatar"
                    />
                    <div className="update-verified-selected-details">
                      <strong>@{user.username}</strong>
                      <small>{user.email}</small>
                    </div>
                    <button 
                      className="update-verified-remove-selected"
                      onClick={() => handleUserSelect(user._id)}
                      disabled={updating}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {verifiedUsers.length > 0 ? (
          <div className="update-verified-table-wrapper">
            <div className="update-verified-table-header">
              <button
                className="update-verified-action-btn update-verified-select-all"
                onClick={handleSelectAll}
              >
                {selectedUserIds.length === Math.min(verifiedUsers.length, 5)
                  ? "Deselect All"
                  : "Select All (Max 5)"}
              </button>
              <span className="update-verified-selection-count">
                {selectedUserIds.length} of 5 selected
              </span>
            </div>
            
            <table className="update-verified-table">
              <thead>
                <tr>
                  <th width="50px">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.length === Math.min(verifiedUsers.length, 5)}
                      onChange={handleSelectAll}
                      className="update-verified-checkbox"
                    />
                  </th>
                  <th>User</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Followers</th>
                  <th>Following</th>
                  <th>Posts</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verifiedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`update-verified-row update-verified-animate ${
                      selectedUserIds.includes(user._id)
                        ? "update-verified-selected"
                        : ""
                    }`}
                    onClick={() => !updating && handleUserSelect(user._id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleUserSelect(user._id)}
                        className="update-verified-checkbox"
                        disabled={updating || (!selectedUserIds.includes(user._id) && selectedUserIds.length >= 5)}
                      />
                    </td>
                    <td className="update-verified-user">
                      <img
                        src={getProfilePicture(user)}
                        alt={user.username}
                        className="update-verified-profile-pic"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                      <div className="update-verified-user-info">
                        <span className="update-verified-username">
                          {user.firstname} {user.lastname}
                        </span>
                        <small className="update-verified-user-id">
                          ID: {user._id.substring(0, 8)}...
                        </small>
                      </div>
                    </td>
                    <td>@{user.username}</td>
                    <td className="update-verified-email">{user.email}</td>
                    <td className="update-verified-count">
                      {user.followers?.length || 0}
                    </td>
                    <td className="update-verified-count">
                      {user.following?.length || 0}
                    </td>
                    <td className="update-verified-count">
                      {user.posts?.length || 0}
                    </td>
                    <td>
                      <span
                        className={`update-verified-status-badge ${
                          user.banned
                            ? "update-verified-banned"
                            : "update-verified-active"
                        }`}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="update-verified-meta">
              <p>
                Showing {verifiedUsers.length} verified users.{" "}
                {selectedUserIds.length} selected (Max: 5)
              </p>
              <p className="update-verified-note">
                <strong>Workflow:</strong> Select 1-5 users → Click "Replace User(s)" → Search for new users → Confirm replacement
              </p>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="update-verified-no-data">
              <p>No verified users available</p>
              {currentUserCount === 0 && (
                <button
                  className="update-verified-add-btn"
                  onClick={openAddModal}
                  disabled={updating}
                >
                  <span className="update-verified-add-btn-icon">+</span>
                  Add New Verified Users
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Search Modal for REPLACING users */}
      {searchModalOpen && (
        <div className="update-verified-modal-overlay">
          <div className="update-verified-modal">
            <div className="update-verified-modal-header">
              <h3>Replace Users ({selectedUserIds.length} selected)</h3>
              <button
                className="update-verified-modal-close"
                onClick={closeSearchModal}
                disabled={updating}
              >
                ×
              </button>
            </div>

            <div className="update-verified-modal-content">
              <div className="update-verified-replace-section">
                <h4>Replacing Users ({selectedUserIds.length})</h4>
                <div className="update-verified-replace-list">
                  {getSelectedUsers().map((user) => (
                    <div key={user._id} className="update-verified-replace-item">
                      <img
                        src={getProfilePicture(user)}
                        alt={user.username}
                        className="update-verified-replace-avatar"
                      />
                      <div className="update-verified-replace-info">
                        <strong>@{user.username}</strong>
                        <small>{user.email}</small>
                        <div className="update-verified-replace-stats">
                          <span>Followers: {user.followers?.length || 0}</span>
                          <span>Posts: {user.posts?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="update-verified-search-section">
                <h4>Search for Replacements (Verified Users Only)</h4>
                <p className="update-verified-search-note">
                  <small>Select exactly {selectedUserIds.length} replacement user(s). Type at least 2 characters to search.</small>
                </p>
                <div className="update-verified-search-input-group">
                  <div className="update-verified-search-input-wrapper">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search by username, email, or name..."
                      className="update-verified-search-input"
                      disabled={updating}
                    />
                    {searchLoading && (
                      <div className="update-verified-search-loader">
                        Searching...
                      </div>
                    )}
                  </div>
                </div>

                {searchResults.length > 0 ? (
                  <div className="update-verified-search-results">
                    <h5>Verified Users Found ({searchResults.length})</h5>
                    <div className="update-verified-results-list">
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className={`update-verified-result-item ${
                            selectedReplacementUsers.some(u => u._id === user._id)
                              ? "update-verified-result-selected"
                              : ""
                          }`}
                          onClick={() => handleSearchUserSelect(user)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedReplacementUsers.some(u => u._id === user._id)}
                            readOnly
                            disabled={!selectedReplacementUsers.some(u => u._id === user._id) && 
                                     selectedReplacementUsers.length >= selectedUserIds.length}
                          />
                          <img
                            src={getProfilePicture(user)}
                            alt={user.username}
                            className="update-verified-result-avatar"
                          />
                          <div className="update-verified-result-info">
                            <strong>{user.username}</strong>
                            <small>{user.email}</small>
                            <div className="update-verified-result-stats">
                              <span>Followers: {user.followers?.length || 0}</span>
                              <span>Posts: {user.posts?.length || 0}</span>
                              <span className="update-verified-result-verified">
                                ✓ Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery.length >= 2 && !searchLoading ? (
                  <div className="update-verified-no-results">
                    No verified users found for "{searchQuery}"
                  </div>
                ) : null}

                {selectedReplacementUsers.length > 0 && (
                  <div className="update-verified-selected-section">
                    <h5>Selected Replacements ({selectedReplacementUsers.length}/{selectedUserIds.length})</h5>
                    <div className="update-verified-selected-list">
                      {selectedReplacementUsers.map((user) => (
                        <div key={user._id} className="update-verified-selected-replacement">
                          <img
                            src={getProfilePicture(user)}
                            alt={user.username}
                            className="update-verified-selected-avatar"
                          />
                          <div className="update-verified-selected-details goome_turoe">
                            <strong>@{user.username}</strong>
                            <small>{user.email}</small>
                          </div>
                          <button 
                            className="update-verified-clear-selection"
                            onClick={() => handleSearchUserSelect(user)}
                            disabled={updating}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="update-verified-modal-footer">
              <button
                className="update-verified-modal-button update-verified-cancel-btn"
                onClick={closeSearchModal}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="update-verified-modal-button update-verified-confirm-btn"
                onClick={confirmReplaceUsers}
                disabled={selectedReplacementUsers.length !== selectedUserIds.length || updating}
              >
                {updating ? "Updating..." : `Replace ${selectedUserIds.length} User(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW USERS MODAL */}
      {addModalOpen && (
        <div className="update-verified-modal-overlay">
          <div className="update-verified-modal">
            <div className="update-verified-modal-header update-verified-modal-header-add">
              <h3>Add New Verified Users</h3>
              <button
                className="update-verified-modal-close"
                onClick={closeAddModal}
                disabled={updating}
              >
                ×
              </button>
            </div>

            <div className="update-verified-modal-content">
              <div className="update-verified-add-info-section">
                <div className="update-verified-add-info-card">
                  <h4>Current Status</h4>
                  <div className="update-verified-add-stats">
                    <div className="update-verified-add-stat">
                      <span className="update-verified-add-stat-number">{currentUserCount}</span>
                      <span className="update-verified-add-stat-label">Current Users</span>
                    </div>
                    <div className="update-verified-add-stat">
                      <span className="update-verified-add-stat-number update-verified-add-stat-available">{maxUsersToAdd}</span>
                      <span className="update-verified-add-stat-label">Slots Available</span>
                    </div>
                    <div className="update-verified-add-stat">
                      <span className="update-verified-add-stat-number">{maxUsersAllowed}</span>
                      <span className="update-verified-add-stat-label">Maximum</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="update-verified-search-section">
                <h4>Search for Users to Add (Verified Users Only)</h4>
                <p className="update-verified-search-note">
                  <small>You can add up to {maxUsersToAdd} user(s). Type at least 2 characters to search.</small>
                </p>
                <div className="update-verified-search-input-group">
                  <div className="update-verified-search-input-wrapper">
                    <input
                      type="text"
                      value={addSearchQuery}
                      onChange={handleAddSearchChange}
                      placeholder="Search by username, email, or name..."
                      className="update-verified-search-input"
                      disabled={updating}
                    />
                    {addSearchLoading && (
                      <div className="update-verified-search-loader">
                        Searching...
                      </div>
                    )}
                  </div>
                </div>

                {addSearchResults.length > 0 ? (
                  <div className="update-verified-search-results">
                    <h5>Verified Users Found ({addSearchResults.length})</h5>
                    <div className="update-verified-results-list">
                      {addSearchResults.map((user) => (
                        <div
                          key={user._id}
                          className={`update-verified-result-item ${
                            selectedUsersToAdd.some(u => u._id === user._id)
                              ? "update-verified-result-selected"
                              : ""
                          }`}
                          onClick={() => handleAddUserSelect(user)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsersToAdd.some(u => u._id === user._id)}
                            readOnly
                            disabled={!selectedUsersToAdd.some(u => u._id === user._id) && 
                                     selectedUsersToAdd.length >= maxUsersToAdd}
                          />
                          <img
                            src={getProfilePicture(user)}
                            alt={user.username}
                            className="update-verified-result-avatar"
                          />
                          <div className="update-verified-result-info">
                            <strong>{user.username}</strong>
                            <small>{user.email}</small>
                            <div className="update-verified-result-stats">
                              <span>Followers: {user.followers?.length || 0}</span>
                              <span>Posts: {user.posts?.length || 0}</span>
                              <span className="update-verified-result-verified">
                                ✓ Verified
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : addSearchQuery.length >= 2 && !addSearchLoading ? (
                  <div className="update-verified-no-results">
                    No verified users found for "{addSearchQuery}"
                  </div>
                ) : null}

                {selectedUsersToAdd.length > 0 && (
                  <div className="update-verified-selected-section">
                    <h5>Selected Users to Add ({selectedUsersToAdd.length}/{maxUsersToAdd})</h5>
                    <div className="update-verified-selected-list">
                      {selectedUsersToAdd.map((user) => (
                        <div key={user._id} className="update-verified-selected-replacement update-verified-selected-add">
                          <img
                            src={getProfilePicture(user)}
                            alt={user.username}
                            className="update-verified-selected-avatar"
                          />
                          <div className="update-verified-selected-details goome_turoe">
                            <strong>@{user.username}</strong>
                            <small>{user.email}</small>
                          </div>
                          <button 
                            className="update-verified-clear-selection"
                            onClick={() => handleAddUserSelect(user)}
                            disabled={updating}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="update-verified-modal-footer">
              <button
                className="update-verified-modal-button update-verified-cancel-btn"
                onClick={closeAddModal}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="update-verified-modal-button update-verified-confirm-btn update-verified-add-confirm-btn"
                onClick={confirmAddUsers}
                disabled={selectedUsersToAdd.length === 0 || updating}
              >
                {updating ? "Adding..." : `Add ${selectedUsersToAdd.length} User(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateVerifiedUsers;