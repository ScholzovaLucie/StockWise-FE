"use client";

import { Box, useColorScheme, useTheme } from "@mui/material";
import React from "react";

const LayoutWrapper = ({ children }) => {
  const { colorScheme } = useColorScheme();
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        height: "100%",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default LayoutWrapper;
