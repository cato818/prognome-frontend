import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

function Predictions() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('Making API request to:', `${process.env.REACT_APP_API_URL}/predict`);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, {
        symbol: symbol.toUpperCase()
      });
      
      console.log('API Response:', response.data);
      setPrediction(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'An error occurred while making the prediction'
      );
    } finally {
      setLoading(false);
    }
  };

  // Debug: Mostrar las variables de entorno (sin mostrar valores sensibles)
  console.log('API URL configured:', process.env.REACT_APP_API_URL ? 'Yes' : 'No');

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Price Predictions
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Cryptocurrency Symbol (e.g., BTC)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !symbol}
              sx={{ minWidth: 150 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {prediction && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Typography variant="body1">
              Predicted price for {symbol.toUpperCase()}: ${prediction.predicted_price}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Confidence: {(prediction.confidence * 100).toFixed(2)}%
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Predictions;
