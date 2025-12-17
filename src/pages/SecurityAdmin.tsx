import React, { useEffect, useState } from "react";

const SecurityAdmin: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(false);

  // helper function to post to /api/Superuserlog
  const postSuperuserLog = async () => {
    try {
      const someuserid = localStorage.getItem("uidstring") || "unknown";
      const someuid = parseInt(localStorage.getItem("uid") || "0", 10);

      await fetch("https://parksapi.547bikes.info/api/Superuserlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: someuserid,
          date: new Date().toISOString(),
          managerescid: someuid,
          description: "Security admin accessed",
          threatlevel: "low",
        }),
      });
    } catch (err) {
      console.error("Error posting superuser log:", err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role") || "";

    // Only allow superuser (and optionally manager if desired)
    if (role.toLowerCase() === "superuser" || role.toLowerCase() === "manager") {
      setHasPermission(true);
      postSuperuserLog();
    } else {
      alert("You do not have Security Manager permissions.");
      setHasPermission(false);
    }
  }, []);

  if (!hasPermission) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You do not have Security Manager permissions.</p>
      </div>
    );
  }

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
