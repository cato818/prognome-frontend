import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';

function Predictions() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setPrediction(null);
    setErrorMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, {
        symbol: symbol.toUpperCase()
      });
      setPrediction(response.data);
    } catch (err) {
      console.error('Error making prediction:', err);
      setErrorMessage(err.response?.data?.detail || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Price Predictions
        </Typography>
        
        <ErrorMessage message={errorMessage} />
        
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
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !symbol}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
            </Button>
          </Box>
        </form>

        {prediction && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="body1" gutterBottom>
                Predicted price for {symbol.toUpperCase()}: ${prediction.predicted_price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence: {(prediction.confidence * 100).toFixed(2)}%
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Predictions;
