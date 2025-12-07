import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import { Button, IconButton } from '@mui/material';
import { useState } from 'react';
import './Navbar.css';
import './homebar.css';

type HomebarProps = {
  numItems: number;
};

export default function oldHomebar({ numItems }: HomebarProps) {
  const title = 'RideFinder';
  const location = useLocation();
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  return (
    <AppBar position="sticky" enableColorOnDark>
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
            textDecoration: 'none',
            fontSize: '1.7rem',
            cursor: 'pointer',
            backgroundColor: 'black'
          }}
        >
          [CG.UI.V3.1]
        </Typography>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* MUI buttons menu */}
        <Button
          component={Link}
          to="/"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/' ? 'MuiButton-root active' : ''}
        >
          <HomeIcon />
        </Button>
        <Button
          component={Link}
          to="/login"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/login' ? 'MuiButton-root active' : ''}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/signup' ? 'MuiButton-root active' : ''}
        >
          Signup
        </Button>
        <Button
          component={Link}
          to="/home"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/home' ? 'MuiButton-root active' : ''}
        >
          Featured
        </Button>
        <Button
          component={Link}
          to="/details/fc099512-96d4-497a-a42f-d7b3967abc03"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/details/fc099512-96d4-497a-a42f-d7b3967abc03' ? 'MuiButton-root active' : ''}
        >
          T2CB
        </Button>
         <Button
          component={Link}
          to="/details/92ed4740-12d9-4573-a8f1-c883ca216a00"
          sx={{ color: 'inherit', fontWeight: 500 }}
          className={location.pathname === '/details/92ed4740-12d9-4573-a8f1-c883ca216a00' ? 'MuiButton-root active' : ''}
        >
          T3MM
        </Button>
        <Button
          component={Link}
          to="/allreviews"
          sx={{ color: 'cyan', fontWeight: 500 }}
          className={location.pathname === '/allreviews' ? 'MuiButton-root active' : ''}
        >
          Reviews
        </Button>  
        <Button
          component={Link}
          to="/home2"
          sx={{ color: 'cyan', fontWeight: 500 }}
          className={location.pathname === '/home2' ? 'MuiButton-root active' : ''}
        >
         Parks
        </Button>
        <Button
          component={Link}
          to="/Welcome"
          sx={{ color: 'cyan', fontWeight: 500 }}
          className={location.pathname === '/cart' ? 'MuiButton-root active' : ''}
        >
          WelcomePage
        </Button>

        {/* Theme toggle */}
        <IconButton onClick={toggleTheme} color="inherit" aria-label="Toggle theme">
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
        </IconButton>

        {/* Cart with badge */}
        <IconButton component={Link} to="/cart" color="inherit">
          <ShoppingCartIcon />
          {numItems > 0 && <span className="cartNumber">{numItems}</span>}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
