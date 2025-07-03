import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import "./review.css";

const ReviewContent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.frenzone.live/review/getAllReviews",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews || []);
          setError(null);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (error) {
        setError("Failed to fetch reviews");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch reviews.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const maxStars = 5;
    return Array.from({ length: maxStars }, (_, index) => (
      <span key={index} className="rc-star">
        {index < rating ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="rc-dashboard-container">
      {loading && <Loader />}
      <div className="rc-dashboard-container-contained">
        <div className="rc-heading-contained">
          <h2>User Reviews</h2>
        </div>
        <div className="rc-reviews-container">
          {error && <div className="rc-error">{error}</div>}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="rc-review-container-oracle-main rc-animate"
              >
                <div className="rc-media-container">
                  {review.userid.profilePicture && (
                    <div className="rc-media-item">
                      <img
                        src={review.userid.profilePicture}
                        alt={`${review.userid.username}'s profile`}
                        className="rc-profile-picture"
                      />
                    </div>
                  )}
                </div>
                <div className="rc-review-user-oracle-setting-com">
                  <div className="rc-review-user-oracle-setting">
                    <div className="rc-review-username-text">Username:</div>
                    <div className="rc-reviewuser-name-username">
                      {review.userid.username}
                    </div>
                  </div>
                  <div className="rc-review-user-oracle-setting">
                    <div className="rc-review-username-text">Review:</div>
                    <div className="rc-reviewuser-name-username">
                      {review.review || "No Review"}
                    </div>
                  </div>
                  <div className="rc-review-user-oracle-setting">
                    <div className="rc-review-username-text">Rating:</div>
                    <div className="rc-reviewuser-name-username">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="rc-review-user-oracle-setting">
                    <div className="rc-review-username-text">Created At:</div>
                    <div className="rc-reviewuser-name-username">
                      {new Date(review.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rc-no-content">No reviews available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewContent;
