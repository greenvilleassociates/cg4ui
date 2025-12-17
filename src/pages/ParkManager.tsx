import React, { useEffect, useState } from "react";

const ParkManager: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);

  // helper function to post to /api/Adminlogs
  const postAdminLog = async () => {
    try {
      const someuserid = localStorage.getItem("uidstring") || "unknown";
      const someuid = parseInt(localStorage.getItem("uid") || "0", 10);

      await fetch("https://parksapi.547bikes.info/api/Adminlogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: someuserid,
          date: new Date().toISOString(),
          description: "Manager accessed",
          managerescid: someuid,
          threatlevel: "low",
        }),
      });
    } catch (err) {
      console.error("Error posting admin log:", err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role") || "";

    if (role.toLowerCase() === "manager" || role.toLowerCase() === "superuser") {
      setHasPermission(true);
      postAdminLog();
    } else {
      alert("You do not have Manager permissions.");
      setHasPermission(false);
    }
  }, []);

  if (!hasPermission) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You do not have Manager permissions.</p>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="reactparkmaint.html"
        title="Manager"
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ParkManager;
