import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Prognome
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/predictions">
            Predictions
          </Button>
          <Button
            color="inherit"
            href={`https://ko-fi.com/${process.env.REACT_APP_KOFI_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Support on Ko-fi
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
