import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [formState, setFormState] = useState({
    symbol: '',
    loading: false,
    prediction: null,
    error: null
  });
  
  const abortControllerRef = useRef(null);
  const mounted = useRef(true);

  // Cleanup function
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const updateFormState = useCallback((updates) => {
    if (mounted.current) {
      setFormState(prev => ({
        ...prev,
        ...updates
      }));
    }
  }, []);

  const handleSymbolChange = useCallback((e) => {
    updateFormState({ symbol: e.target.value });
  }, [updateFormState]);

  const handleCloseError = useCallback(() => {
    updateFormState({ error: null });
  }, [updateFormState]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formState.symbol || !mounted.current) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    updateFormState({
      loading: true,
      prediction: null,
      error: null
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/predict`,
        { symbol: formState.symbol.toUpperCase() },
        { signal: abortControllerRef.current.signal }
      );
      
      if (mounted.current) {
        updateFormState({
          loading: false,
          prediction: response.data
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }

      console.error('Error making prediction:', err);
      if (mounted.current) {
        updateFormState({
          loading: false,
          error: err.response?.data?.detail || 'An error occurred while making the prediction'
        });
      }
    }
  }, [formState.symbol, updateFormState]);

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
            value={formState.symbol}
            onChange={handleSymbolChange}
            margin="normal"
            required
            disabled={formState.loading}
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formState.loading || !formState.symbol}
              sx={{ minWidth: 120 }}
            >
              {formState.loading ? <CircularProgress size={24} /> : 'Get Prediction'}
            </Button>
          </Box>
        </form>

        {formState.error && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Alert severity="error" onClose={handleCloseError}>
              {formState.error}
            </Alert>
          </Box>
        )}

        {formState.prediction && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prediction Results
            </Typography>
            <Paper elevation={2} sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="body1" gutterBottom>
                Predicted price for {formState.symbol.toUpperCase()}: ${formState.prediction.predicted_price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence: {(formState.prediction.confidence * 100).toFixed(2)}%
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Predictions;
