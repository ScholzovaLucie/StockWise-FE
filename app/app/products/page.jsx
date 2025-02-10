"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "/services/productService";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box, Typography, CircularProgress, Container, IconButton, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility"; // 👀 Importujeme ikonu
import AddIcon from "@mui/icons-material/Add";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data.results);
      } catch (error) {
        console.error("Chyba při načítání produktů:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Skladové položky
      </Typography>
      <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/app/products/new")}
        >
          Nový produkt
        </Button>
      <TextField
        label="Hledat produkt"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
  <CircularProgress />
) : products.length > 0 ? (
  <Box sx={{ height: 500, width: "100%" }}>
    <DataGrid
      rows={products}
      columns={[
        { field: "sku", headerName: "SKU", width: 120 },
        { field: "name", headerName: "Název", flex: 1 },
        { field: "description", headerName: "Popis", flex: 1 },
        { field: "amount", headerName: "Množství", flex: 1 },
        {
          field: "actions",
          headerName: "Akce",
          width: 100,
          renderCell: (params) => (
            <IconButton onClick={() => router.push(`/app/products/${params.row.id}`)} color="primary">
              <VisibilityIcon />
            </IconButton>
          ),
        },
      ]}
    />
  </Box>
) : (
  <Typography variant="body1" sx={{ mt: 2 }}>
    Žádné produkty nebyly nalezeny.
  </Typography>
)}
    </Container>
  );
};

export default Products;