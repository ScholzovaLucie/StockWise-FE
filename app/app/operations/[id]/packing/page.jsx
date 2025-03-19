"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import operationService from "/services/operationService";
import boxService from "/services/boxService";
import DeleteIcon from "@mui/icons-material/Delete";
import groupService from "/services/groupService";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useMessage } from "/context/messageContext";
import CircularProgress from "@mui/material/CircularProgress";

const PackingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [operation, setOperation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBox, setSelectedBox] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const { message, setMessage } = useMessage();
  const [productsInBox, setProductsInBox] = useState([]); // 📦 Seznam produktů v krabici
  const [productSummary, setProductSummary] = useState([]);
  const [availableBoxes, setAvailableBoxes] = useState([]); // 📦 Seznam všech dostupných krabic

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const data = await operationService.getById(id);
        setOperation(data);
      } catch (error) {
        console.error("Chyba při načítání operace:", error);
      } finally {
        setLoading(false);
      }
    };

    const start = async () => {
      try {
        await operationService.startPackaging(id);
      } catch (error) {
        setMessage(error?.message || "Nepodařilo se zahájit ablení.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProductSummary = async () => {
      try {
        const summary = await operationService.getOperationProductSummary(id);
        setProductSummary(summary);
      } catch (error) {
        setMessage(`Chyba při načítání souhrnu produktů: ${error}`);
      }
    };

    const fetchBoxes = async () => {
      try {
        const boxes = await boxService.getAll();
        setAvailableBoxes(boxes);
      } catch (error) {
        setMessage(`Chyba při načítání seznamu krabic: ${error}`);
      }
    };

    start();
    fetchOperation();
    fetchProductSummary();
    fetchBoxes();
  }, [id]);

  // 📦 Načtení produktů v krabici při změně výběru
  useEffect(() => {
    const fetchProductsInBox = async () => {
      if (!selectedBox) return;
      try {
        const products = await boxService.getProductsInBox(selectedBox);
        setProductsInBox(products);
      } catch (error) {
        setMessage(`Chyba při načítání produktů v krabici: ${error}`);
      }
    };

    fetchProductsInBox();
  }, [selectedBox]);

  useEffect(() => {
    if (!productSummary) return;
    const products = productSummary.filter((product) =>
      product.name.toLowerCase().includes(searchCode.toLowerCase())
    );
    if (products.length == 1) {
      setQuantityToAdd(products[0].total_quantity - products[0].rescanned);
      setSelectedProduct(products[0]);
    }
  }, [searchCode]);

  const handleRemoveFromBox = async (groupId) => {
    try {
      await removeFromBox(groupId);
      setMessage("Produkt odebrán z krabice!");

      // Aktualizace seznamu produktů v krabici
      const updatedProducts = await boxService.getProductsInBox(selectedBox);
      setProductsInBox(updatedProducts);

      // Aktualizace souhrnu produktů
      const updatedProductSummary =
        await operationService.getOperationProductSummary(id);
      setProductSummary(updatedProductSummary);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // 📦 Přidání produktu do krabice
  const handleAddToBox = async () => {
    if (!selectedBox) {
      setMessage("Vyberte krabici!");
      return;
    }
    const productId = selectedProduct.id;
    const totalAvailable = productSummary.find(
      (p) => p.id === productId
    )?.total_quantity;

    if (quantityToAdd > totalAvailable) {
      setMessage(
        `Nelze přidat ${quantityToAdd} ks, k dispozici je pouze ${totalAvailable} ks.`
      );
      return;
    }

    try {
      await operationService.addToBox(
        id,
        selectedBox,
        productId,
        quantityToAdd
      );
      setMessage("Produkt přidán do krabice!");

      // Aktualizace seznamu produktů v krabici
      const updatedProducts = await boxService.getProductsInBox(selectedBox);
      setProductsInBox(updatedProducts);
      const updatedProductSummary =
        await operationService.getOperationProductSummary(id);
      setProductSummary(updatedProductSummary);

      setSearchCode("");
      setSelectedProduct();
      setQuantityToAdd(0);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ✅ Dokončení operace
  const handleCompleteOperation = async () => {
    try {
      await operationService.completeOperation(id);
      setMessage("Operace úspěšně dokončena!");
      router.push("/app/operations/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (!operation) return <Typography>Operace nenalezena.</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Balení operace {operation.number}
      </Typography>

      {/* 📋 Seznam všech produktů */}
      <Typography variant="h5">Seznam produktů</Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produkt</TableCell>
              <TableCell>Celkové množství</TableCell>
              <TableCell>Zabaleno</TableCell>
              <TableCell>Zbývá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productSummary.map((product) => {
              const completionPercentage =
                (product.rescanned / product.total_quantity) * 100;

              return (
                <TableRow
                  key={product.id}
                  sx={{
                    background: `linear-gradient(90deg, rgba(76, 175, 80, 0.5) ${completionPercentage}%, transparent ${completionPercentage}%)`,
                    transition: "background 0.5s ease-in-out",
                  }}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.total_quantity}</TableCell>
                  <TableCell>{product.rescanned}</TableCell>
                  <TableCell>
                    {product.total_quantity - product.rescanned}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📋 Výběr krabice */}
      <Select
        fullWidth
        value={selectedBox}
        onChange={(e) => setSelectedBox(e.target.value)}
      >
        <MenuItem value="">-- Vyberte krabici --</MenuItem>
        {availableBoxes.map((box) => (
          <MenuItem key={box.id} value={box.id}>
            {box.ean} ({box.width}x{box.height}x{box.depth})
          </MenuItem>
        ))}
      </Select>

      {/* 📋 Seznam produktů v krabici */}
      {selectedBox && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5">Produkty v krabici</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produkt</TableCell>
                  <TableCell>Množství</TableCell>
                  <TableCell>Akce</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsInBox.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <IconButton
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveFromBox(product.group_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* 🔍 Vyhledání produktu */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, mt: 5 }}>
        <TextField
          label="Zadejte SKU, EAN nebo název produktu"
          fullWidth
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
        <TextField
          label="Množství"
          type="number"
          value={quantityToAdd}
          onChange={(e) => setQuantityToAdd(e.target.value)}
          sx={{ maxWidth: 120 }}
        />
        <Button variant="contained" onClick={handleAddToBox}>
          Přidat
        </Button>
      </Box>

      {/* ✅ Dokončení operace */}
      {productSummary.every(
        (product) => product.total_quantity === product.rescanned
      ) && (
        <Button
          variant="contained"
          color="success"
          sx={{ marginTop: 2 }}
          onClick={handleCompleteOperation}
        >
          Dokončit operaci
        </Button>
      )}
    </Box>
  );
};

export default PackingPage;
