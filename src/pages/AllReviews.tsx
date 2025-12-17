import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";   // <-- add useNavigate
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";
import "./allreviews.css";
import "./parkcard.css";


export default function AllReviews() {
  const location = useLocation();
  const navigate = useNavigate();   // <-- hook for routing
  const queryParams = new URLSearchParams(location.search);
  const parkId = queryParams.get("parkid");

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/ParkReview", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <Typography variant="h4" gutterBottom>
        Park Reviews
      </Typography>
      {parkId && <Typography variant="subtitle1">Park ID (from URL): {parkId}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={fetchReviews}
        style={{ marginTop: "1rem" }}
      >
        Reload Reviews
      </Button>

      {loading && (
        <div style={{ marginTop: "1rem" }}>
          <CircularProgress />
          <Typography>Loading reviews...</Typography>
        </div>
      )}
      {error && (
        <Typography color="error" style={{ marginTop: "1rem" }}>
          Error: {error}
        </Typography>
      )}

      <div className="review-container">
        {reviews.map((review) => {
          const reviewerName =
            review.displayname && review.displayname.trim() !== ""
              ? review.displayname
              : review.fullname;

          return (
            <Card key={review.id} className="review-card">
              <CardHeader
                avatar={
                  <Avatar>
                    <RateReviewIcon />
                  </Avatar>
                }
                title={
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <StarIcon style={{ color: "#fbc02d", marginRight: 4 }} />
                    {review.stars} / 5
                  </span>
                }
                subheader={`By: ${reviewerName}`}
              />
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {review.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Park Name: {review.parkName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Park ID: {review.parkId}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Posted: {review.datePosted}
                </Typography>

                {/* NEW BUTTON TO ROUTE TO DETAILS */}
               <Button
  				component={Link}
  				to={`/details2?parkid=${review.parkGuid}`}
  				variant="outlined"
  				color="secondary"
  				style={{ marginTop: "0.5rem" }}
				>
  				ParkDetails
				</Button>
              
              
              
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


