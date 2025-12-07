/*import React, { useState, useEffect } from "react";
import "./details2.css";

const OldDetails2 = () => {
  const query = new URLSearchParams(window.location.search);
  const parkGuid = query.get("parkid"); // GUID from URL

  const userId = localStorage.getItem("uid") || 10000;
  const fullName = localStorage.getItem("fullname") || "CapGemeni User";
  const displayName = localStorage.getItem("displayname") || "capgemeniui";

  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(0);
  const [parkName, setParkName] = useState("");
  const [parkIndex, setParkIndex] = useState("");

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const res = await fetch("https://parksapi.547bikes.info/api/Parks");
        if (res.ok) {
          const data = await res.json();
          console.log("datareturned", data);
          console.log("parkId", parkGuid);
          localStorage.setItem("parkId", parkGuid);
          // Compare GUIDs
          const match = data.find((p) => String(p.id) === String(parkGuid));
          if (match) {
            alert("Match!!!");
            setParkName(match.name);
            setParkIndex(match.parkId); // integer sequence
            localStorage.setItem("SomeParkIndex", match.parkId || null);
            localStorage.setItem("SomeParkName", match.name || null);
          } 
          else 
          {
            alert("MatchFailed!!!");
            setParkName("Some Park");
          }
        } 
       else 
       {
          setParkName("Some Park");
       }
      } 
      catch 
      {
        setParkName("Some Park");
      }
    };
    if (parkGuid) fetchParks();
  }, [parkGuid]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const review = {
    parkId: parseInt(parkIndex, 10), // integer
    userId: parseInt(userId, 10),
    description,
    stars: parseInt(stars, 10),
    datePosted: new Date().toISOString(),
    dateApproved: null,
    dateDenied: null,
    reasonDescription: null,
    reviewManagerId: null,
    parkName: parkName
  };

  console.log("ReviewPost Form", review);

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
    // reset form state if you want
    setDescription("");
    setStars(0);
  } else {
    alert("Failed to submit review.");
  }
};

  return (
    <div className="d2-card-container">
      <div className="d2-card">
        <div className="d2-card-header">
          <h2>{parkName ? `Review for ${parkName}` : "Submit Park Review"}</h2>
        </div>
        <div className="d2-card-body">
          <form onSubmit={handleSubmit}>
            <div className="d2-form-group">
              <label>Stars:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="d2-form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="d2-form-control"
                rows="4"
              />
            </div>
            <button type="submit" className="d2btn d2btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Details2;
*/