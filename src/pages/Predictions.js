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
import ErrorSnackbar from '../components/ErrorSnackbar';

function Predictions() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState({ show: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setPrediction(null);
    setError({ show: false, message: '' });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, {
        symbol: symbol.toUpperCase()
      });
      setPrediction(response.data);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError({
        show: true,
        message: err.response?.data?.detail || 'An error occurred while making the prediction'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError({ show: false, message: '' });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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

        <ErrorSnackbar 
          open={error.show}
          message={error.message}
          onClose={handleCloseError}
        />

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
