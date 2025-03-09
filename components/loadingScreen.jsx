import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      >
        <CircularProgress size={80} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      >
        <Typography variant="h6" color="textSecondary" mt={2}>
          Načítám, vydržte prosím...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;