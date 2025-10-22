import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AdultReels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await fetch(
          "https://api.frenzone.live/reels/getTotalReels"
        );
        const data = await response.json();

        const filteredReels = data.reels.filter(
          (reel) =>
            reel.sightengineResults &&
            reel.sightengineResults.some((result) =>
              result.toLowerCase().includes("nudity")
            )
        );

        setReels(filteredReels);
      } catch (error) {
        setError("Failed to fetch reels");
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const acceptReel = async (reelId) => {
    try {
      const response = await fetch(
        "https://api.frenzone.live/reels/acceptReel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reelId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update reel");
      }

      const updatedReels = reels.filter((reel) => reel._id !== reelId);
      setReels(updatedReels);

      Swal.fire({
        icon: "success",
        title: "Reel Accepted",
        text: "The reel has been successfully accepted.",
      });
    } catch (error) {
      setError("Failed to update reel");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to accept the reel.",
      });
    }
  };

  const handleAcceptReel = (reelId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to accept this reel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, accept it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        acceptReel(reelId);
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
          <div className="heading-sections-ommm">Sensitive Reels</div>
          <Link to="/frenzone/adultcontent" style={{ textDecoration: "none" }}>
            <div className="heading-sections-ommm">Go to Post Section</div>
          </Link>
        </div>
        <div className="posts-container">
          {loading ? (
            <div className="spinner-set">
              <div className="spinner"></div>
            </div>
          ) : reels.length > 0 ? (
            reels.map((reel) => (
              <div key={reel._id} className="post-container-oracle-main">
                <div className="media-container">
                  <div className="media-item">
                    {reel.videoUrl ? (
                      <video controls autoPlay poster={reel.thumbnailUrl}>
                        <source src={reel.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                    {reel.thumbnailUrl && !reel.videoUrl ? (
                      <img src={reel.thumbnailUrl} alt="Thumbnail" />
                    ) : null}
                  </div>
                </div>
                <div className="post-user-oracle-setting-com">
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">Username:</div>
                    <div className="postuser-name-uername">{reel.username}</div>
                  </div>
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">Description:</div>
                    <div className="postuser-name-uername">
                      {reel.description ? reel.description : "No Description"}
                    </div>
                  </div>
                  <div className="post-user-oracle-setting">
                    <div className="post-usernam-text">
                      Sightengine Results:
                    </div>
                    <ul className="postuser-name-uername">
                      {(reel.sightengineResults || []).map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="accept-post-buttonn">
                  <button onClick={() => handleAcceptReel(reel._id)}>
                    Accept Reel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reel-related">
              No reels related to nudity available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdultReels;
