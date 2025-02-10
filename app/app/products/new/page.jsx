"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "/services/productService";
import { getClients } from "/services/clientService";
import { Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";

const NewProduct = () => {
  const router = useRouter();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data.results);
      } catch (error) {
        console.error("Chyba při načítání klientů:", error);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({ sku: sku, name: name, description: description, client_id: clientId });
      router.push("/products");
    } catch (error) {
      console.error("Chyba při vytváření produktu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Nový produkt
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="SKU"
          variant="outlined"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Název"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Popis"
          variant="outlined"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* ✅ Výběr klienta */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="client-label">Klient</InputLabel>
          <Select
            labelId="client-label"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" justifyContent="space-between">
          <Button onClick={() => router.push("/app/products")} variant="outlined" color="secondary">
            Zpět
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Vytvořit"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewProduct;