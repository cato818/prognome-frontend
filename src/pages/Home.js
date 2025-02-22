import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Prognome
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Cryptocurrency Price Prediction Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Get accurate cryptocurrency price predictions powered by advanced machine learning algorithms.
          Our platform analyzes historical data and market trends to provide you with reliable forecasts.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/predictions"
            sx={{ mr: 2 }}
          >
            Start Predicting
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            href={`https://ko-fi.com/${process.env.REACT_APP_KOFI_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Us
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Home;
