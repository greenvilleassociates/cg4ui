import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParkService from "../services/parkService";
import IPark from "../models/park";
import "./parkcard.css"; // new CSS file for card styling
import { Button } from "@mui/material"; // Material UI button

const parkService = new ParkService();

export default function Home2() {
  const [parks, setParks] = useState<IPark[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.log("Home2 mounted, fetching parks...");
      const res = await parkService.getAllParks();
      console.log("Fetched parks:", res);
      setParks(res);
    })();
  }, []);

  const handleBookNow = (parkId: number) => {
    navigate(`/details/${parkId}`);
  };

  return (
    <div>
      <h1>Welcome to RideFinder All Parks(Unfiltered)</h1>
      <div className="card-grid">
        {parks.length === 0 ? (
          <p>No parks available</p>
        ) : (
          parks.map((park) => (
            <div className="park-card" key={park.id}>
              <img
                src={park.imageUrl}
                alt={park.parkName}
                className="park-image"
              />
              <div className="park-content">
                <h2>{park.parkName}</h2>
                <p className="location">{park.location}</p>
                <p className="description">{park.description}</p>
                <p className="price">
                  Adult: ${park.adultPrice} | Child: ${park.childPrice}
                </p>
                {/* Book Now button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBookNow(park.id)}
                  sx={{ mt: 2 }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
