import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import axios from 'axios';

function Predictions() {
  const [formData, setFormData] = useState({
    symbol: '',
    loading: false,
    prediction: null
  });
  const [error, setError] = useState(null);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      symbol: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.symbol) return;

    setFormData(prev => ({ ...prev, loading: true, prediction: null }));
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, {
        symbol: formData.symbol.toUpperCase()
      });
      setFormData(prev => ({
        ...prev,
        loading: false,
        prediction: response.data
      }));
    } catch (err) {
      console.error('Error making prediction:', err);
      setError(err.response?.data?.detail || 'An error occurred while making the prediction');
      setFormData(prev => ({ ...prev, loading: false }));
    }
  }, [formData.symbol]);

  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

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
            value={formData.symbol}
            onChange={handleChange}
            margin="normal"
            required
            disabled={formData.loading}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formData.loading || !formData.symbol}
              sx={{ minWidth: 120 }}
            >
              {formData.loading ? <CircularProgress size={24} /> : 'Get Prediction'}
            </Button>
          </Box>
        </form>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            elevation={6} 
            variant="filled" 
            severity="error" 
            onClose={handleCloseError}
          >
            {error}
          </Alert>
        </Snackbar>

        {formData.prediction && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="body1" gutterBottom>
                Predicted price for {formData.symbol.toUpperCase()}: ${formData.prediction.predicted_price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence: {(formData.prediction.confidence * 100).toFixed(2)}%
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Predictions;