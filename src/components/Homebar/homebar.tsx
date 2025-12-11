import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import './Navbar.css';
import './homebar.css';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

type HomebarProps = {
  numItems: number;
};

export default function Homebar({ numItems }: HomebarProps) {
  const location = useLocation();
  const [darkTheme, setDarkTheme] = useState(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'black', color: 'white' }}>
      <Toolbar>
        {/* Left side: logo/title */}
        <Typography
          noWrap
          component={Link}
          to="/"
          sx={{
            mr: 2,
            fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            fontWeight: 700,
            color: "inherit",
            textDecoration: 'none',
            fontSize: '1.7rem',
            cursor: 'pointer',
          }}
        >
          [CG.UI.V9.03.G]
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Main buttons (always visible) */}
        <Button component={Link} to="/" sx={{ color: 'inherit' }}>
          <HomeIcon />
        </Button>
        <IconButton component={Link} to="/login" color="inherit" aria-label="Login">
 			<LoginIcon />
		</IconButton>
  		<IconButton component={Link} to="/logout" color="inherit" aria-label="Logout">
  			<LogoutIcon />
		</IconButton>

        <Button component={Link} to="/home" sx={{ color: 'inherit' }}>
          RideFinder
        </Button>
        <Button component={Link} to="/allreviews" sx={{ color: 'inherit' }}>
          AllReviews
        </Button>
        <Button component={Link} to="/home2" sx={{ color: 'inherit' }}>
          AllParks
        </Button>

        {/* Menu button (hamburger) */}
        <IconButton
          color="inherit"
          aria-controls={open ? 'nav-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/Welcome" onClick={handleMenuClose}>
            WelcomePage
          </MenuItem>
          <MenuItem component={Link} to="/details/fc099512-96d4-497a-a42f-d7b3967abc03" onClick={handleMenuClose}>
            T2CB
          </MenuItem>
          <MenuItem component={Link} to="/details/92ed4740-12d9-4573-a8f1-c883ca216a00" onClick={handleMenuClose}>
            T3MM
          </MenuItem>
          <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
            Signup
          </MenuItem>
          <MenuItem onClick={() => { toggleTheme(); handleMenuClose(); }}>
            {darkTheme ? (
              <svg className="icon moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg className="icon sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
            &nbsp; Toggle Theme
          </MenuItem>
        </Menu>

        {/* Cart with badge */}
        <IconButton component={Link} to="/cart" color="inherit">
          <ShoppingCartIcon />
          {numItems > 0 && <span className="cartNumber">{numItems}</span>}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
