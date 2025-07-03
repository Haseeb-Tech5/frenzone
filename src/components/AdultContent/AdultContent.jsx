import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./sensitive.css";

const SensitiveContent = () => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [postPage, setPostPage] = useState(0);
  const [reelPage, setReelPage] = useState(0);
  const [postRowsPerPage, setPostRowsPerPage] = useState(10);
  const [reelRowsPerPage, setReelRowsPerPage] = useState(10);
  const [postTotalCount, setPostTotalCount] = useState(0);
  const [reelTotalCount, setReelTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const publicIp = "https://api.frenzone.live";

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Fetch posts
        const postsResponse = await fetch(
          `${publicIp}/post/getAllNudityPosts?page=${
            postPage + 1
          }&limit=${postRowsPerPage}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();
        if (!postsData.success)
          throw new Error("Posts API returned unsuccessful response");

        // Fetch reels
        const reelsResponse = await fetch(
          `${publicIp}/reels/getAllNudityReels?page=${
            reelPage + 1
          }&limit=${reelRowsPerPage}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!reelsResponse.ok) throw new Error("Failed to fetch reels");
        const reelsData = await reelsResponse.json();
        if (!reelsData.success)
          throw new Error("Reels API returned unsuccessful response");

        setPosts(postsData.posts || []);
        setReels(reelsData.reels || []);
        setPostTotalCount(postsData.count || 0);
        setReelTotalCount(reelsData.count || 0);
        setError(null);
      } catch (error) {
        setError("Failed to fetch content");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch sensitive content.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [postPage, postRowsPerPage, reelPage, reelRowsPerPage]);

  const acceptContent = async (id, type) => {
    try {
      const endpoint =
        type === "post"
          ? `${publicIp}/post/acceptPost`
          : `${publicIp}/reels/acceptReel`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [`${type}Id`]: id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${type}`);
      }

      if (type === "post") {
        setPosts(posts.filter((post) => post._id !== id));
        if (posts.length === 1 && postPage > 0) {
          setPostPage(postPage - 1); // Go to previous page if last post is removed
        }
      } else {
        setReels(reels.filter((reel) => reel._id !== id));
        if (reels.length === 1 && reelPage > 0) {
          setReelPage(reelPage - 1); // Go to previous page if last reel is removed
        }
      }

      Swal.fire({
        icon: "success",
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Accepted`,
        text: `The ${type} has been successfully accepted.`,
      });
    } catch (error) {
      setError(`Failed to update ${type}`);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to accept the ${type}.`,
      });
    }
  };

  const handleAccept = (id, type) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you really want to accept this ${type}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptContent(id, type);
      }
    });
  };

  const handlePostPageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(postTotalCount / postRowsPerPage)) {
      setPostPage(newPage);
    }
  };

  const handleReelPageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(reelTotalCount / reelRowsPerPage)) {
      setReelPage(newPage);
    }
  };

  const handlePostRowsPerPageChange = (event) => {
    setPostRowsPerPage(+event.target.value);
    setPostPage(0);
  };

  const handleReelRowsPerPageChange = (event) => {
    setReelRowsPerPage(+event.target.value);
    setReelPage(0);
  };

  const renderPagination = (type) => {
    const page = type === "post" ? postPage : reelPage;
    const rowsPerPage = type === "post" ? postRowsPerPage : reelRowsPerPage;
    const totalCount = type === "post" ? postTotalCount : reelTotalCount;
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    const handlePageChange =
      type === "post" ? handlePostPageChange : handleReelPageChange;
    const handleRowsPerPageChange =
      type === "post"
        ? handlePostRowsPerPageChange
        : handleReelRowsPerPageChange;

    return (
      <div className="sc-pagination-container">
        <div className="sc-sen-pagination">
          <button
            className={`sc-sen-pagination-btn ${
              page === 0 ? "sc-sen-pagination-btn-disabled" : ""
            }`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="sc-sen-pagination-text">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className={`sc-sen-pagination-btn ${
              page >= totalPages - 1 ? "sc-sen-pagination-btn-disabled" : ""
            }`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
          <select
            className="sc-sen-pagination-select"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="sc-dashboard-container">
      {loading && <Loader />}
      <div className="sc-dashboard-container-contained">
        <div className="sc-heading-contained">
          <h2>Sensitive Content</h2>
        </div>
        <div className="sc-sen-tab-container">
          <button
            className={`sc-sen-tab ${
              activeTab === "posts" ? "sc-sen-tab-active" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Sensitive Posts
          </button>
          <button
            className={`sc-sen-tab ${
              activeTab === "reels" ? "sc-sen-tab-active" : ""
            }`}
            onClick={() => setActiveTab("reels")}
          >
            Sensitive Reels
          </button>
        </div>
        <div className="sc-posts-container">
          {error && <div className="sc-sen-error">{error}</div>}
          {activeTab === "posts" ? (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="sc-post-container-oracle-main sc-sen-animate"
                  >
                    <div className="sc-media-container">
                      {(post.contentArray || []).map((content, index) => (
                        <div key={index} className="sc-media-item">
                          {content.contentType.startsWith("video") ? (
                            <video
                              controls
                              poster={content.thumbnail}
                              className="sc-sen-media"
                            >
                              <source
                                src={content.objectUrl}
                                type={content.contentType}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : content.contentType.startsWith("image") ? (
                            <img
                              src={content.objectUrl}
                              alt={`Content ${index}`}
                              className="sc-sen-media"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div className="sc-post-user-oracle-setting-com">
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">Username:</div>
                        <div className="sc-postuser-name-uername">
                          {post.username}
                        </div>
                      </div>
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">Description:</div>
                        <div className="sc-postuser-name-uername">
                          {post.description || "No Description"}
                        </div>
                      </div>
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">
                          Sightengine Results:
                        </div>
                        <ul className="sc-postuser-name-uername">
                          {(post.sightengineResults || []).map(
                            (result, index) => (
                              <li key={index}>{result}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="sc-accept-post-buttonn">
                      <button
                        className="sc-sen-btn-accept"
                        onClick={() => handleAccept(post._id, "post")}
                      >
                        Accept Post
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sc-sen-no-content">
                  No posts related to nudity available
                </div>
              )}
              {renderPagination("post")}
            </>
          ) : (
            <>
              {reels.length > 0 ? (
                reels.map((reel) => (
                  <div
                    key={reel._id}
                    className="sc-post-container-oracle-main sc-sen-animate"
                  >
                    <div className="sc-media-container">
                      <div className="sc-media-item">
                        {reel.videoUrl ? (
                          <video
                            controls
                            poster={reel.thumbnailUrl}
                            className="sc-sen-media"
                          >
                            <source src={reel.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : reel.thumbnailUrl ? (
                          <img
                            src={reel.thumbnailUrl}
                            alt="Thumbnail"
                            className="sc-sen-media"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="sc-post-user-oracle-setting-com">
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">Username:</div>
                        <div className="sc-postuser-name-uername">
                          {reel.username}
                        </div>
                      </div>
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">Description:</div>
                        <div className="sc-postuser-name-uername">
                          {reel.description || "No Description"}
                        </div>
                      </div>
                      <div className="sc-post-user-oracle-setting">
                        <div className="sc-post-usernam-text">
                          Sightengine Results:
                        </div>
                        <ul className="sc-postuser-name-uername">
                          {(reel.sightengineResults || []).map(
                            (result, index) => (
                              <li key={index}>{result}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="sc-accept-post-buttonn">
                      <button
                        className="sc-sen-btn-accept"
                        onClick={() => handleAccept(reel._id, "reel")}
                      >
                        Accept Reel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sc-sen-no-content">
                  No reels related to nudity available
                </div>
              )}
              {renderPagination("reel")}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensitiveContent;
