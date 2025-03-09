"use client";

import { useState } from "react";
import { loginUser, registerUser } from "/services/authService";
import { useAuth } from "/context/authContext";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";

export default function AuthPage() {
  const { setUser, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await loginUser(email, password);
      console.log(userData)
      setUser(userData.user);
      console.log(user)
      router.push("/app/dashboard");
    } catch (err) {
      setError(err?.message || "Nastala neočekávaná chyba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card sx={{ width: "100%", maxWidth: 400, p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Přihlášení
            </Typography>
            {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
              <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth label="Heslo" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading} onClick={handleSubmit}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Přihlásit se" }
              </Button>
              <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1 }} onClick={() => router.push("/auth/registr")}>
                Nemáte účet? Registrace
              </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}