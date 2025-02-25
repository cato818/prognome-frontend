import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function ErrorSnackbar({ open, message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        elevation={6} 
        variant="filled" 
        severity="error" 
        onClose={onClose}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;
