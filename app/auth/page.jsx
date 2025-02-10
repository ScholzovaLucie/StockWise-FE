"use client";

import { useState } from "react";
import { loginUser, registerUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";

export default function AuthPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("login")

    try {
      const userData = isLogin
        ? await loginUser(email, password)
        : await registerUser({ email, password });
      setUser(userData);
      router.replace("/app/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Nastala neočekávaná chyba.");
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
              {isLogin ? "Přihlášení" : "Registrace"}
            </Typography>
            {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField fullWidth label="Heslo" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Box sx={{ position: "relative", mt: 2 }}>
                <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : isLogin ? "Přihlásit se" : "Registrovat"}
                </Button>
              </Box>
              <Button fullWidth color="secondary" sx={{ mt: 1 }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Nemáte účet? Registrace" : "Máte účet? Přihlášení"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}