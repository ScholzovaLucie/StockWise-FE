"use client";

import { useEffect, useState } from "react";
import { Typography, Container } from "@mui/material";

const Dashboard = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // ✅ Čekáme na hydrataci

  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Vítejte v aplikaci StockWise!</Typography>
    </Container>
  );
};

export default Dashboard;