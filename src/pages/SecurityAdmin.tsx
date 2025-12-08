import React, { useEffect } from "react";

const SecurityAdmin: React.FC = () => {
  // helper function to post to /api/Superuser
  const postSuperuserLog = async () => {
    try {
      const someuserid = localStorage.getItem("uidstring") || "unknown";
      const someuid = parseInt(localStorage.getItem("uid") || "0");

      await fetch("https://parksapi.547bikes.info/api/Superuserlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: someuserid, // from localStorage or context
          date: new Date().toISOString(),
          managerescid: someuid, // fill with actual manager escalation id if available
          description: "Security admin accessed",
          threatlevel: "low", // could be "low", "medium", "high"
        }),
      });
    } catch (err) {
      console.error("Error posting superuser log:", err);
    }
  };

  // Example: post log when component mounts
  useEffect(() => {
    postSuperuserLog();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="https://home.547bikes.info/reactsecurityhome.html"
        title="Security Admin"
        style={{ border: "none", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default SecurityAdmin;
