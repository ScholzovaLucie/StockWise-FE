"use client";

import { Stack, Typography, Button } from "@mui/material";

export default function IndexPage() {
  return (
    <Stack direction="column" alignItems="center" justifyContent="center" spacing={4}>
      <Typography variant="h3" fontWeight="bold" color="primary" sx={{ letterSpacing: 2 }}>
        StockWise
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button href="/auth" variant="contained" color="primary" size="large">
          Přihlášení
        </Button>
      </Stack>
    </Stack>
  );
}