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
import operationService from "/services/operationService";
import clientService from "/services/clientService";
import productService from "/services/productService";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useMessage } from "/context/messageContext";

const OperationForm = ({ operationId = null }) => {
  const router = useRouter();
  const [operationType, setOperationType] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, setMessage } = useMessage();
  const [deliveryData, setDeliveryData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [stock, setStock] = useState({});
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const clientsResponse = await clientService.getAll();
        setClients(clientsResponse || []);
      } catch (error) {
        console.error("Chyba při načítání klientů:", error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

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

  const handleClientChange = (clientId) => {
    setClient(clientId);
    setProducts([]);
    setStock({});
  };

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

  const handleInputChange = (event, setData) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Funkce pro odstranění produktu z operace
  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

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

      {/* Klient */}
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

      {/* Fakturační a doručovací údaje vedle sebe */}
      <TextField
        sx={{ mb: 1 }}
        label="Poznámka"
        name="delivery_note"
        value={deliveryData["delivery_note"]}
        onChange={(e) => handleInputChange(e, setDeliveryData)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      {operationType === "OUT" && (
        <Grid container spacing={2}>
          {/* Fakturační údaje */}
          <Grid item xs={6} spacing={2}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Fakturační údaje
            </Typography>
            <TextField
              sx={{ mb: 1 }}
              label="Název firmy"
              name="invoice_name"
              value={invoiceData["invoice_name"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Ulice"
              name="invoice_street"
              value={invoiceData["invoice_street"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Město"
              name="invoice_city"
              value={invoiceData["invoice_city"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="PSČ"
              name="invoice_psc"
              value={invoiceData["invoice_psc"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Telefon"
              name="invoice_phone"
              value={invoiceData["invoice_phone"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="IČO"
              name="invoice_ico"
              value={invoiceData["invoice_ico"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="DIČ"
              name="invoice_vat"
              value={invoiceData["invoice_vat"]}
              onChange={(e) => handleInputChange(e, setInvoiceData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          {/* Doručovací údaje */}
          <Grid item xs={6} spacing={2}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Doručovací údaje
            </Typography>
            <TextField
              sx={{ mb: 1 }}
              type="date"
              label="Datum doručení"
              name="delivery_date"
              value={deliveryData["delivery_date"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Jméno příjemce"
              name="delivery_name"
              value={deliveryData["delivery_name"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Ulice"
              name="delivery_street"
              value={deliveryData["delivery_street"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Město"
              name="delivery_city"
              value={deliveryData["delivery_city"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="PSČ"
              name="delivery_psc"
              value={deliveryData["delivery_psc"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              sx={{ mb: 1 }}
              label="Telefon"
              name="delivery_phone"
              value={deliveryData["delivery_phone"]}
              onChange={(e) => handleInputChange(e, setDeliveryData)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
        </Grid>
      )}

      <Divider style={{ margin: "20px 0" }} />

      <Typography variant="h6">Produkty</Typography>
      {products.map((product, index) => (
        <>
          <Grid container spacing={2} key={index}>
            <Grid item xs={4}>
              <TextField
                select
                label="Produkt"
                value={product.productId || product.batch.product.id}
                onChange={(e) => handleProductChange(index, e.target.value)}
                fullWidth
                disabled={!!operationId} // Pokud existuje operationId, pole je read-only
                error={operationType === "OUT" && stock[product.productId] < 1} // Pokud je max 0 ks, TextField se zčervená
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
            <Grid item xs={2}>
              <TextField
                label="Šarže"
                value={product.batchNumber || product.batch.batch_number}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].batchNumber = e.target.value;
                  setProducts(newProducts);
                }}
                fullWidth
                disabled={!!operationId}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Expirace"
                type="date"
                value={product.expirationDate || product.batch.expiration_date}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].expirationDate = e.target.value;
                  setProducts(newProducts);
                }}
                fullWidth
                disabled={!!operationId}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {operationType == "IN" && (
              <Grid item xs={2}>
                <TextField
                  label="EAN krabice"
                  value={product.ean}
                  onChange={(e) => {
                    const newProducts = [...products];
                    newProducts[index].ean = e.target.value;
                    setProducts(newProducts);
                  }}
                  fullWidth
                  disabled={!!operationId}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            <Grid item xs={2}>
              {!operationId && ( // Skryj tlačítko smazání u existující operace
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
        </>
      ))}

      {!operationId && client && (
        <Button
          onClick={() =>
            setProducts([...products, { productId: "", quantity: "" }])
          }
        >
          Přidat produkt
        </Button>
      )}

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
