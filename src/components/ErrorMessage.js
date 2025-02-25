import React from 'react';
import { Paper, Typography } from '@mui/material';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: '#fdeded',
        color: '#5f2120',
        border: '1px solid #ef5350'
      }}
    >
      <Typography variant="body1">
        {message}
      </Typography>
    </Paper>
  );
}

export default ErrorMessage;
