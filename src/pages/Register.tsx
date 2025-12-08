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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    plainpassword: "",
    activepictureurl: "./images/bluecircle.png", // default required field
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a random userid (6-digit number)
    const randomUserid = Math.floor(100000 + Math.random() * 900000);

    // Build full payload with defaults
    const userPayload = {
      id: 0,
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username,
      email: formData.email,
      employee: 0,
      employeeid: null,
      microsoftid: null,
      ncrid: null,
      oracleid: null,
      azureid: null,
      plainpassword: formData.plainpassword,
      hashedpassword: null,
      passwordtype: 0,
      jid: 0,
      role: "registered",
      fullname: `${formData.firstname} ${formData.lastname}`,
      companyid: 0,
      resettoken: null,
      userid: randomUserid, // ✅ random number assigned here
      btn: null,
      iscertified: 0,
      groupid1: null,
      groupid2: null,
      groupid3: null,
      groupid4: null,
      groupid5: null,
      accountstatus: "Active",
      accountactiondate: null,
      accountactiondescription: null,
      usertwofactorenabled: 0,
      usertwofactortype: null,
      usertwofactorkeysmsdestination: null,
      twofactorkeyemaildestination: null,
      twofactorprovider: null,
      twofactorprovidertoken: null,
      twofactorproviderauthstring: null,
      uidstring: "1",
      activepictureurl: formData.activepictureurl,
      resettokenexpiration: null,
      displayname: `${formData.firstname} ${formData.lastname}`,
      dateOfBirth: null,
      cartMasterIndex: 0,
      userProfileIndex: 0,
    };

    try {
      const response = await fetch("https://parksapi.547bikes.info/api/User", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        const text = await response.text();
        let result = null;
        if (text) {
          try {
            result = JSON.parse(text);
          } catch {
            console.warn("Response was not valid JSON:", text);
          }
        }

        localStorage.setItem("userid", result?.userid || result?.id || randomUserid.toString());
        localStorage.setItem("role", userPayload.role);
        localStorage.setItem("status", "loggedin");

        setMessage("Registration successful!");
        setLoading(true);

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error occurred during registration.");
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
            top: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          {!loading ? (
            <>
              <Typography variant="h5" color="primary" gutterBottom>
                Register
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="First Name"
                  name="firstname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastname"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Username"
                  name="username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Password"
                  name="plainpassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.plainpassword}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Register
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
