"use client";

import { useState } from "react";
import { registerUser } from "services/authService";
import { useAuth } from "context/authContext";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { red } from "@mui/material/colors";

export default function AuthPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (password === passwordAgain) {
        console.log(password);
        const userData = await registerUser(email, password);
        setUser(userData.user);
        localStorage.removeItem("lastVisitedUrl");
        router.push("/app/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Nastala neočekávaná chyba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 400, p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Rwgistrace
            </Typography>
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Heslo"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Heslo znovu"
              type="password"
              margin="normal"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              error={passwordAgain !== password} // Podmínka, kdy se má pole (a ikona) začervenat
              helperText={
                passwordAgain !== password ? "Hesla se neshodují" : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon
                      sx={{
                        color:
                          passwordAgain !== password ? red[500] : "inherit",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || password != passwordAgain}
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Registrace"
              )}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => router.push("/auth/login")}
            >
              Již máte účet? Přihlašte se
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
