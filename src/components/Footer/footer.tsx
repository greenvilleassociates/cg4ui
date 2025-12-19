import React, { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SecurityIcon from "@mui/icons-material/Security";
import ForestIcon from "@mui/icons-material/Forest";
import DataExplorationIcon from '@mui/icons-material/DataExploration';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate, useLocation } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (location.pathname.startsWith("/reservations")) setValue(0);
    else if (location.pathname.startsWith("/securityadmin")) setValue(1);
  	else if (location.pathname.startsWith("/parkmanager")) setValue(2);
    else if (location.pathname.startsWith("/manager")) setValue(3);
  }, [location.pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/reservations");
        break;
      case 1:
        navigate("/securityadmin");
        break;
      case 2:
        navigate("/parkmanager");
        break;
      case 3:
        navigate("/manager");
        break;
      case 4:
        navigate("/viz");
        break;
    }
  };

  return (
    <div className="footer" title="@CockyConsulting & CapGemeni Consulting">
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: "#BF5700", // burnt orange
          color: "white",
          "& .MuiBottomNavigationAction-root": { color: "white" },
          "& .Mui-selected": { color: "#FFD700" }, // gold highlight
        }}
      >
        <BottomNavigationAction label="Reservations" icon={<EventNoteIcon />} />
        <BottomNavigationAction label="Security Admin" icon={<SecurityIcon />} />
        <BottomNavigationAction label="ParkManager" icon={<ForestIcon />} />
        <BottomNavigationAction label="Manager" icon={<ManageAccountsIcon />} />
        <BottomNavigationAction label="Viz" icon={<DataExplorationIcon />} />
      </BottomNavigation>
      <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>
        &copy; {currentYear} 547Bikes.Info,CapGemeni,Greenville Associates,All Rights Reserved.
      </div>
    </div>
  );
}
