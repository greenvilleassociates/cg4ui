import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function AllReviews() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const parkId = queryParams.get("parkid");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/ParkReview", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Park Reviews</h1>
      <p>Park ID (from URL): {parkId}</p>

      <button onClick={fetchReviews}>Load All Reviews</button>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "300px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>
              ? {review.stars} / 5
            </h3>
            <p style={{ margin: "0 0 0.5rem 0" }}>{review.description}</p>
            <p style={{ fontSize: "0.9rem", color: "#555", margin: "0 0 0.25rem 0" }}>
              <strong>By:</strong> {review.displayname || "Anonymous"} ({review.fullname})
            </p>
            <p style={{ fontSize: "0.8rem", color: "#777", margin: 0 }}>
              Park ID: {review.parkId} <br />
              Posted: {review.datePosted}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


