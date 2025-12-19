import React from "react";
import { useNavigate } from "react-router-dom";

const AuthLogout = () => {
  const navigate = useNavigate();

  const clearUserSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // ✅ Updated logout API base URL
    const logoutApiUrl = `https://parksapi.547bikes.info/api/Usersession/${token}`;

    try {
      const response = await fetch(logoutApiUrl, {
        method: "POST",
      });

      if (response.ok) {
        alert("Session Closed.");
      } else {
        console.error("Error closing session:", await response.text());
      }
    } catch (error) {
      console.error("Error closing session:", error);
    }
  };

  const logoutUser = async (event) => {
    event.preventDefault();
    console.log("Logging out user...");

    // Reset localStorage
    localStorage.clear();
    localStorage.setItem("uid", "901");
    localStorage.setItem("fullname", "Guest");
    localStorage.setItem("role", "guest");

    console.log("Local storage after logout:", localStorage);

    await clearUserSession();

    // ✅ Redirect to /auth
    navigate("/auth");
  };

  return (
    <button onClick={logoutUser}>
      Logout
    </button>
  );
};

export default AuthLogout;

