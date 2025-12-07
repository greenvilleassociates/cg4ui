import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Material UI blue
    },
    secondary: {
      main: "#2196f3",
    },
  },
});

function Logout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage keys
    localStorage.clear();

    // Set required values
    localStorage.setItem("uid", "901");
    localStorage.setItem("status", "loggedout")
    localStorage.setItem("firstname", "Ridefinder")
    localStorage.setItem("lastname", "Guest")
    // Simulate a short delay for UX
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000);
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box position="relative" minHeight="100vh" bgcolor="#f0f4f8">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: 400,
            position: "absolute",
            top: "300px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {loading ? (
            <>
              <CircularProgress color="primary" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Logging out...
              </Typography>
            </>
          ) : (
            <Typography variant="h6" color="primary">
              Redirecting to login...
            </Typography>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Logout;
