// Auth.tsx
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
    primary: { main: "#1976d2" },
    secondary: { main: "#2196f3" },
  },
});

function AuthLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          plainPassword: password, // <-- matches backend requirement
        }),
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const user = await response.json();
      console.log("Authpayload", user);

      if (user) {
        // Save user record to localStorage with correct field mappings
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("status", "loggedin");

        // Map backend fields correctly
        localStorage.setItem("uid", user.userId?.toString() || "0");
        localStorage.setItem("uidstring", user.userJid || "");
        localStorage.setItem("fullname", user.userFullName || "");
        localStorage.setItem("username", user.userUsername || "");
        localStorage.setItem("firstname", user.userFirstname || "");
        localStorage.setItem("lastname", user.userLastname || "");
        localStorage.setItem("role", user.userRole || "");
        localStorage.setItem("email", user.userEmail || "");
        localStorage.setItem("employeeId", user.employeeId || "");
        localStorage.setItem("token", user.token || "");

        setMessage(`Welcome, ${user.userFirstname} ${user.userLastname}!`);

        // Redirect after short delay
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error: any) {
      console.error("Error authenticating:", error);
      setMessage("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
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
            top: "300px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {!loading ? (
            <>
              <Typography variant="h5" color="primary" gutterBottom>
                547Bikes AuthSecure&copy;
              </Typography>
              <form onSubmit={handleAuth}>
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
                  Authenticate
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
                Authenticating...
              </Typography>
            </>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default AuthLogin;

