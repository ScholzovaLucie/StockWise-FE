"use client";

import { Stack, Typography, Button, Container, Paper } from "@mui/material";

export default function IndexPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fef5eb",
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography variant="h2" fontWeight="bold" sx={{ letterSpacing: 2 }}>
            StockWise
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "80%" }}
          >
            Inteligentní správa skladu poháněná chatbotem. Komunikujte
            přirozeně, spravujte zásoby hlasem nebo textem a optimalizujte
            skladové procesy snadno a efektivně.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              href="/auth/login"
              variant="contained"
              color="primary"
              size="large"
            >
              Přihlášení
            </Button>
            <Button href="/auth/register" variant="outlined" size="large">
              Registrace
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
