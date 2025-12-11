import React, { useState, useEffect } from "react";
import "./details2.css";

const Details2 = () => {
  const query = new URLSearchParams(window.location.search);
  const parkGuid = query.get("parkid");

  const userId = localStorage.getItem("uid") || 10000;
  const fullName = localStorage.getItem("fullname") || "CapGemeni User";
  const displayName = localStorage.getItem("displayname") || "capgemeniui";

  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [parkName, setParkName] = useState("");
  const [parkIndex, setParkIndex] = useState("");
  const [parkDetails, setParkDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const res = await fetch("https://parksapi.547bikes.info/api/Parks");
        if (res.ok) {
          const data = await res.json();
          const match = data.find((p) => String(p.id) === String(parkGuid));
          if (match) {
            setParkName(match.name);
            setParkIndex(match.parkId);
            setParkDetails(match);

            localStorage.setItem("SomeParkIndex", match.parkId || null);
            localStorage.setItem("SomeParkName", match.name || null);

            // Fetch reviews immediately on page load
            fetchReviews(match.parkId);
          } else {
            setParkName("Some Park");
          }
        } else {
          setParkName("Some Park");
        }
      } catch {
        setParkName("Some Park");
      }
    };
    if (parkGuid) fetchParks();
  }, [parkGuid]);

  const fetchReviews = async (parkId) => {
    try {
      const revRes = await fetch(
        `https://parksapi.547bikes.info/api/ParkReview/parkid/${parkId}`
      );
    
      const somepark = revRes.name;
      localStorage.setItem("temppark",somepark);
      if (revRes.ok) {
        const revData = await revRes.json();
        setReviews(revData);
      }
    } catch {
      setReviews([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const review = {
      parkId: parseInt(parkIndex, 10),
      userId: parseInt(userId, 10),
      description,
      stars: parseInt(stars, 10),
      datePosted: new Date().toISOString(),
      dateApproved: null,
      dateDenied: null,
      reasonDescription: null,
      reviewManagerId: null,
      parkName: parkName || "Generic Park",
      displayname: localStorage.getItem("fullname") || "Some Displayname",
      fullname: localStorage.getItem("fullname") || "Some Name",
    };
      //POSOURCE: "CAPGEMENI_UI"
    const response = await fetch("https://parksapi.547bikes.info/api/ParkReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(review),
    });

    if (response.ok) {
      alert("Review submitted!");
      setDescription("");
      setStars(0);
      setShowForm(false);

      // Refresh reviews
      fetchReviews(parkIndex);
    } else {
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="d2-card-container">
      <div className="d2-card">
        <div className="d2-card-header">
          {parkDetails?.pic1url && (
            <img
              src={parkDetails.pic1url}
              alt={parkDetails.name}
              className="d2-park-image"
            />
          )}
          <h4>{parkName ? `Reviews for ${parkName}` : "Submit Park Review"}</h4>
        </div>

        {/* --- PARK SUMMARY --- */}
        {parkDetails && (
          <div className="d2-park-summary">
            <h4>Park Summary</h4>
            <p>
              <strong>Name:</strong> {parkDetails.name}
            </p>
            <p>
              <strong>Address:</strong> {parkDetails.address}{" "}
              <strong>Phone:</strong> {parkDetails.phone}
            </p>
            <p>
              <strong>Region:</strong> {parkDetails.region}{" "}
              <strong>Average Rating:</strong> {parkDetails.averageRating}
            </p>
            <p>
              <strong>Trail Length:</strong> {parkDetails.trailLengthMiles} miles{" "}
              <strong>Difficulty:</strong> {parkDetails.difficulty}
            </p>
            <p>
              <strong>Description:</strong> {parkDetails.description}
            </p>
            <p>
              <strong>Day Pass Price:</strong> ${parkDetails.dayPassPriceUsd}
            </p>

            {/* --- FEATURES CHECKBOXES IN SUMMARY --- */}
            <div className="d2-form-group">
                <div className="d2-features-row">
                {["skiing", "camping", "rafting", "canoeing", "motocross"].map(
                  (feat) => (
                    <label key={feat} className="d2-feature-item">
                      <input
                        type="checkbox"
                        checked={parkDetails[feat] === 1}
                        readOnly
                      />{" "}
                      {feat.charAt(0).toUpperCase() + feat.slice(1)}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- PLACE REVIEW BUTTON --- */}
        <div className="d2-card-body">
          {!showForm && (
            <button
              className="d2btn d2btn-primary"
              onClick={() => setShowForm(true)}
            >
              Place a Review
            </button>
          )}

          {/* --- REVIEW FORM --- */}
          {showForm && (
  <form onSubmit={handleSubmit} className="d2-review-form">
    <div className="d2-form-inline">
      <label>
        Stars:
        <input
          type="number"
          min="1"
          max="5"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          className="d2-input-stars"
        />
      </label>

      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          className="d2-input-description"
        />
      </label>
    </div>

    <button type="submit" className="d2btn d2btn-primary">
      Submit Review
    </button>
  </form>
)}
        </div>

        {/* --- EXISTING REVIEWS --- */}
        <div className="d2-reviews">
          <h5>Existing Reviews</h5>
          {reviews.length > 0 ? (
            <div className="d2-review-grid">
              {reviews.map((rev) => (
                <div key={rev.id} className="d2-review-card">
                  <p>
                    <strong>User:</strong> {rev.userId}
                  </p>
                  <p>
                    <strong>Stars:</strong> {rev.stars}
                  </p>
                  <p>
                    <strong>Description:</strong> {rev.description}
                  </p>
                  <p>
                    <em>
                      Posted on {new Date(rev.datePosted).toLocaleDateString()}
                    </em>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details2;
