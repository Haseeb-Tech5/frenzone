import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./adult.css";
import { Link } from "react-router-dom";

const AdultContent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://api.frenzone.live/post/getTotalPosts"
        );
        const data = await response.json();

        const filteredPosts = data.posts.filter(
          (post) =>
            post.sigthengineResults &&
            post.sigthengineResults.some((result) =>
              result.toLowerCase().includes("nudity")
            )
        );

        setPosts(filteredPosts);
      } catch (error) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const acceptPost = async (postId) => {
    try {
      const response = await fetch(
        "https://api.frenzone.live/post/acceptPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);

      Swal.fire({
        icon: "success",
        title: "Post Accepted",
        text: "The post has been successfully accepted.",
      });
    } catch (error) {
      setError("Failed to update post");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to accept the post.",
      });
    }
  };

  const handleAcceptPost = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to accept this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptPost(postId);
      }
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-container-contained">
        <div className="heading-contained">
          <h2>Adult Content</h2>
        </div>
        <div className="heading-container-headinffff">
          <div className="heading-sections-ommm">Sensitive Posts</div>
          <Link to="/sensitivereels" style={{ textDecoration: "none" }}>
            <div className="heading-sections-ommm">Go to Reels Section</div>
          </Link>
        </div>
        <div className="posts-container">
          {loading ? (
            <div className="spinner-set">
              <div className="spinner"></div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="post-container-oracle-main">
                <div className="media-container">
                  {(post.contentArray || []).map((content, index) => (
                    <div key={index} className="media-item">
                      {content.contentType.startsWith("video") ? (
                        <video controls autoPlay poster={content.thumbnail}>
                          <source
                            src={content.objectUrl}
                            type={content.contentType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : content.contentType.startsWith("image") ? (
                        <img src={content.objectUrl} alt={`Content ${index}`} />
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="post-user-oracle-setting-com">
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">Username:</div>
                    <div className="postuser-name-uername">{post.username}</div>
                  </div>
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">Description:</div>
                    <div className="postuser-name-uername">
                      {post.description ? post.description : "No Description"}
                    </div>
                  </div>
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">
                      Sigthengine Results:
                    </div>
                    <ul className="postuser-name-uername">
                      {(post.sigthengineResults || []).map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="accept-post-buttonn">
                  <button onClick={() => handleAcceptPost(post._id)}>
                    Accept Post
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No posts related to nudity available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdultContent;
