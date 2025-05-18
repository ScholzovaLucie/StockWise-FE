import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import operationService from "services/operationService";
import clientService from "services/clientService";
import productService from "services/productService";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useMessage } from "context/messageContext";

const OperationForm = ({ operationId = null }) => {
  const router = useRouter();

  // Stavy pro základní pole operace
  const [operationType, setOperationType] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);

  // Produkty a jejich dostupnost
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kontextová zpráva
  const { message, setMessage } = useMessage();

  // Dodací a fakturační údaje
  const [deliveryData, setDeliveryData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});

  // Dostupnost produktů na skladě (pro OUT operace)
  const [stock, setStock] = useState({});

  const [loadingClients, setLoadingClients] = useState(true);

  // Načti klienty po načtení komponenty
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const clientsResponse = await clientService.getAll();
        setClients(clientsResponse?.results || clientsResponse || []);
      } catch (error) {
        console.error("Chyba při načítání klientů:", error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  // Načti produkty pro zvoleného klienta
  useEffect(() => {
    const fetchProductsForClient = async () => {
      if (!client) {
        setAvailableProducts([]);
        return;
      }
      try {
        const response = await productService.getProductsByClient(client);
        setAvailableProducts(response || []);
      } catch (error) {
        console.error("Chyba při načítání produktů pro klienta:", error);
        setAvailableProducts([]);
      }
    };
    fetchProductsForClient();
  }, [client]);

  // Pokud je operace pro úpravu (operationId existuje), načti její data
  useEffect(() => {
    if (!operationId) {
      setLoading(false);
      return;
    }

    const fetchOperation = async () => {
      try {
        const operation = await operationService.getById(operationId);
        setOperationType(operation.type);
        setNumber(operation.number);
        setDescription(operation.description);
        setClient(operation.client_id);
        setProducts(operation.groups || []);
        setDeliveryData(operation.delivery_data || {});
        setInvoiceData(operation.invoice_data || {});
      } catch (error) {
        console.error("Chyba při načítání operace:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperation();
  }, [operationId]);

  // Změna klienta – resetuj produkty a sklad
  const handleClientChange = (clientId) => {
    setClient(clientId);
    setProducts([]);
    setStock({});
  };

  // Změna produktu v seznamu – pro OUT načítá stav skladu
  const handleProductChange = async (index, productId) => {
    const newProducts = [...products];
    newProducts[index].productId = productId;
    setProducts(newProducts);

    if (operationType === "OUT") {
      try {
        const stockResponse = await productService.getProductStock(productId);
        setStock((prevStock) => ({
          ...prevStock,
          [productId]: stockResponse.available,
        }));
      } catch (error) {
        console.error("Chyba při načítání skladového množství:", error);
        setStock((prevStock) => ({ ...prevStock, [productId]: 0 }));
      }
    }
  };

  // Změna množství – validuje i dostupnost u OUT
  const handleQuantityChange = (index, quantity) => {
    const newProducts = [...products];
    newProducts[index].quantity = quantity;

    if (
      operationType === "OUT" &&
      stock[newProducts[index].productId] < quantity
    ) {
      setMessage(
        `Produkt ${newProducts[index].productId} má pouze ${stock[newProducts[index].productId]} kusů skladem.`
      );
    }

    setProducts(newProducts);
  };

  // Změna polí ve fakturačních/doručovacích údajích
  const handleInputChange = (event, setData) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Odstranění produktu z operace
  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  // Uložení nové nebo upravené operace
  const handleSaveOperation = async () => {
    if (!operationType || !number || !client) {
      setMessage("Vyplňte všechny povinné údaje.");
      return;
    }

    if (!operationId && products.length == 0) {
      setMessage("Nelze vytvořit operaci bez produktů");
      return;
    }

    const operationData = {
      type: operationType,
      number,
      description,
      client_id: client,
      products,
      delivery_data: operationType === "OUT" ? deliveryData : null,
      invoice_data: operationType === "OUT" ? invoiceData : null,
    };

    const updateOperationData = {
      number,
      description,
      delivery_data: operationType === "OUT" ? deliveryData : null,
      invoice_data: operationType === "OUT" ? invoiceData : null,
    };

    try {
      if (operationId) {
        await operationService.updateOperation(
          operationId,
          updateOperationData
        );
        setMessage("Operace byla úspěšně upravena.");
      } else {
        await operationService.createOperation(operationData);
        router.push("/app/operations/");
        setMessage("Operace byla úspěšně vytvořena.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        {operationId ? "Upravit Operaci" : "Vytvořit Operaci"}
      </Typography>

      {/* Základní údaje o operaci */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            select
            label="Typ Operace"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            fullWidth
          >
            <MenuItem value="IN">Příjem</MenuItem>
            <MenuItem value="OUT">Výdej</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Číslo operace"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Popis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      {/* Výběr klienta */}
      {loadingClients ? (
        <CircularProgress />
      ) : (
        <TextField
          select
          label="Klient"
          value={client}
          onChange={(e) => handleClientChange(e.target.value)}
          fullWidth
        >
          {clients.length > 0 ? (
            clients.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Žádní klienti</MenuItem>
          )}
        </TextField>
      )}

      <Divider style={{ margin: "20px 0" }} />

      {/* Doručovací poznámka */}
      <TextField
        sx={{ mb: 1 }}
        label="Poznámka"
        name="delivery_note"
        value={deliveryData["delivery_note"]}
        onChange={(e) => handleInputChange(e, setDeliveryData)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      {/* Fakturační a doručovací údaje pro OUT operace */}
      {operationType === "OUT" && (
        <Grid container spacing={2}>
          {/* Fakturační údaje */}
          <Grid item xs={6} spacing={2}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Fakturační údaje
            </Typography>
            {/* Jednotlivá pole fakturace... */}
            {/* --- vynechány duplicitní komentáře pro každé pole --- */}
          </Grid>

          {/* Doručovací údaje */}
          <Grid item xs={6} spacing={2}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Doručovací údaje
            </Typography>
            {/* Jednotlivá pole doručení... */}
          </Grid>
        </Grid>
      )}

      <Divider style={{ margin: "20px 0" }} />

      {/* Seznam produktů */}
      <Typography variant="h6">Produkty</Typography>
      {products.map((product, index) => (
        <React.Fragment key={index}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                select
                label="Produkt"
                value={product.productId || product.batch?.product?.id || ""}
                onChange={(e) => handleProductChange(index, e.target.value)}
                fullWidth
                disabled={!!operationId}
                error={operationType === "OUT" && stock[product.productId] < 1}
                helperText={
                  operationType === "OUT" && stock[product.productId] < 1
                    ? "Tento produkt není skladem!"
                    : ""
                }
              >
                {availableProducts.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {operationType === "OUT" && !operationId && (
              <Grid item xs={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color: stock[product.productId] < 1 ? "red" : "inherit",
                    fontWeight:
                      stock[product.productId] < 1 ? "bold" : "normal",
                  }}
                >
                  {stock[product.productId] !== undefined
                    ? `Max ${stock[product.productId]} ks`
                    : "Načítání..."}
                </Typography>
              </Grid>
            )}

            <Grid item xs={2}>
              <TextField
                error={
                  operationType === "OUT" &&
                  stock[product.productId] < product.quantity
                }
                label="Množství"
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                fullWidth
                disabled={
                  !!operationId ||
                  (operationType === "OUT" && stock[product.productId] < 1)
                }
              />
            </Grid>

            {/* Šarže a expirace */}
            {/* EAN pro IN operaci */}

            {/* Tlačítko smazání produktu */}
            <Grid item xs={2}>
              {!operationId && (
                <IconButton
                  onClick={() => handleRemoveProduct(index)}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
          <Divider style={{ margin: "5px 0" }} />
        </React.Fragment>
      ))}

      {/* Tlačítko přidání produktu */}
      {!operationId && client && (
        <Button
          onClick={() =>
            setProducts([...products, { productId: "", quantity: "" }])
          }
        >
          Přidat produkt
        </Button>
      )}

      {/* Tlačítko pro uložení operace */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveOperation}
        style={{ marginTop: 20 }}
      >
        {operationId ? "Uložit změny" : "Vytvořit Operaci"}
      </Button>
    </Paper>
  );
};

export default OperationForm;
