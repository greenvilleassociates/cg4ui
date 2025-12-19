import React, { useEffect } from "react";

const Viz: React.FC = () => {
  // helper function to post to /user/Action
  const postUserAction = async () => {
    try {
      const someuserid = parseInt(localStorage.getItem("uid") || "0");
      const someuid = parseInt(localStorage.getItem("uid")) || 0;
      const somedescription = `Reservations accessed by: ${someuid}`;
      
      await fetch("https://parksapi.547bikes.info/api/Useraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: someuserid, // from localStorage
          description: somedescription,
          actiondate: new Date().toISOString(), // ISO string timestamp
        }),
      });
    } catch (err) {
      console.error("Error posting user action:", err);
    }
  };

  // Post log when component mounts
  useEffect(() => {
    postUserAction();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="./reactvisualizations.html"
        title="Visualizations"
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default Viz;
