import React, { useEffect } from "react";

const Manager: React.FC = () => {
  // helper function to post to /api/Adminlogs
  const postAdminLog = async () => {
    try {
      const someuserid = localStorage.getItem("uidstring") || "unknown";
      const someuid = parseInt(localStorage.getItem("uid")) || 0;

      await fetch("https://parksapi.547bikes.info/api/Adminlogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: someuserid, // from localStorage or context
          date: new Date().toISOString(),
          description: "Manager accessed",
          managerescid: someuid, // fill with actual manager escalation id if available
          threatlevel: "low", // could be "low", "medium", "high"
        }),
      });
    } catch (err) {
      console.error("Error posting admin log:", err);
    }
  };

  // Example: post log when component mounts
  useEffect(() => {
    postAdminLog();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="https://home.547bikes.info/reactmanager.html"
        title="Manager"
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default Manager;
