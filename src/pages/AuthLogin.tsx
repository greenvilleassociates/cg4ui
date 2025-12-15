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
          plainPassword: password,   // <-- matches backend requirement
        }),
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.statusText}`);
      }

      const user = await response.json();

      if (user) {
        // Save user record to localStorage (same as Login.tsx)
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("status", "loggedin");
        localStorage.setItem("uid", user.userid || 0);
        localStorage.setItem("uidstring", user.uidstring || "");
        localStorage.setItem("fullname", user.fullname || "");
        localStorage.setItem("username", user.username || "");
        localStorage.setItem("firstname", user.firstname || "");
        localStorage.setItem("lastname", user.lastname || "");
        localStorage.setItem("email", user.email || "");

        setMessage(`Welcome, ${user.firstname} ${user.lastname}!`);

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
                Authenticate
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
