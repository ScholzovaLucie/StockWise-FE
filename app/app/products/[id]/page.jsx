"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/services/productService";
import { getClientById, getClients } from "@/services/clientService";
import { Product, Client } from "@/models/types"; // ✅ Importujeme modely
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/navigation";
import { Label } from "@mui/icons-material";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(/** @type {Product | null} */ (null));
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(/** @type {Partial<Product>} */ ({
    sku: "",
    name: "",
    description: "",
    client_id: "",
  }));
  const [clients, setClients] = useState(/** @type {Client[]} */ ([]));
  const [client, setClient] = useState(/** @type {Client | null} */ (null));
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const loadProductAndClient = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setEditedProduct({
          sku: data.sku,
          name: data.name,
          description: data.description,
          client_id: data.client_id,
        });
        if (data.client_id) {
          const clientData = await getClientById(data.client_id);
          setClient(clientData);
        }
      } catch (error) {
        console.error("Chyba při načítání produktu a klienta:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data.results);
      } catch (error) {
        console.error("Chyba při načítání seznamu klientů:", error);
      }
    };

    loadProductAndClient();
    loadClients();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await updateProduct(id, editedProduct);
      setProduct({ ...product, ...editedProduct });

      if (editedProduct.client_id) {
        const updatedClient = await getClientById(editedProduct.client_id);
        setClient(updatedClient);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Chyba při ukládání změn:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => router.back()} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>Zpět</Typography>
      </Box>

      {product ? (
        <Box>
          <TextField
            fullWidth
            label="SKU"
            variant="outlined"
            value={editedProduct.sku}
            onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Název"
            variant="outlined"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Počet kusů"
            variant="outlined"
            value={product.amount}
            InputProps={{ readOnly: true }} // 🔹 Nemůže být editováno
            sx={{ mb: 2 }}
            />

          <TextField
            fullWidth
            label="Popis"
            variant="outlined"
            multiline
            minRows={3}
            value={editedProduct.description}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />

          {/* ✅ Výběr klienta */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="client-label">Klient</InputLabel>
            <Select
              labelId="client-label"
              value={editedProduct.client_id}
              onChange={(e) => setEditedProduct({ ...editedProduct, client_id: e.target.value })}
              disabled={!isEditing}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ✅ Datum vytvoření (jen pro čtení) */}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Vytvořeno: {product.created_at ? new Date(product.created_at).toLocaleString("cs-CZ", { timeZone: "UTC" }) : ""}
            </Typography>

          <Box display="flex" justifyContent="space-between">
            <IconButton onClick={isEditing ? handleSave : handleEditToggle} color="primary">
              {isEditing ? <Button onClick={handleSave} variant="contained" color="primary">
                Uložit změny
              </Button> : <EditIcon />}
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          Produkt nebyl nalezen.
        </Typography>
      )}
    </Container>
  );
};

export default ProductDetail;