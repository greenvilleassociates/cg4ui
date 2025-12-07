import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  TextField,
  Button,
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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/User");
      const users = await response.json();

      const matchedUser = users.find(
        (user) =>
          user.username === username && user.plainpassword === password
      );

      if (matchedUser) {
        // Save user object to localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        localStorage.setItem("status", "loggedin");
        localStorage.setItem("uid", parseInt(matchedUser.userid) || 0);
        localStorage.setItem("uidstring", matchedUser.uidstring || null);
        localStorage.setItem("fullname", matchedUser.email || null);
        localStorage.setItem("username", matchedUser.username || null);
        localStorage.setItem("firstname", matchedUser.firstname || null);
        localStorage.setItem("lastname", matchedUser.lastname || null);
      

        setMessage(`Welcome, ${matchedUser.firstname} ${matchedUser.lastname}!`);
        setLoading(true);

        // Wait 2 seconds, then redirect
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Login failed. Please try again.");
    }
  };

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
            top: "300px", // 👈 distance from top
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {!loading ? (
            <>
              <Typography variant="h5" color="primary" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </form>
              {message && (
                <Typography variant="body1" color="secondary" sx={{ mt: 2 }}>
                  {message}
                </Typography>
              )}
            </>
          ) : (
            <>
              <CircularProgress color="primary" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading...
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
