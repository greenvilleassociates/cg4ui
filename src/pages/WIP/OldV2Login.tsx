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
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Material UI blue
    },
    secondary: {
      main: "#2196f3", // lighter blue
    },
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        setMessage(`Welcome, ${matchedUser.firstname} ${matchedUser.lastname}!`);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f0f4f8"
      >
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
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
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
