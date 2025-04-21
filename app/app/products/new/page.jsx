"use client";

import productService from "services/productService";
import clientService from "services/clientService";
import NewEntityForm from "components/newEntityForm";
import { useEffect, useState } from "react";
import { useClient } from "context/clientContext";
import CircularProgress from "@mui/material/CircularProgress";

const NewProduct = () => {
  const [selectFields, setSelectFields] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedClient } = useClient();
  const fields = [
    { name: "sku", label: "SKU", type: "text" },
    { name: "name", label: "Název", type: "text" },
    {
      name: "description",
      label: "Popis",
      multiline: true,
      minRows: 3,
      type: "text",
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        let clients = await clientService.getAll(selectedClient);
        if (clients.results) clients = clients.results;
        const options = clients.map((client) => ({
          id: client.id,
          name: client.name, // Zde použij správné pole pro zobrazení názvu produktu
        }));

        setSelectFields([
          {
            name: "client_id",
            label: "Client",
            options: options,
          },
        ]);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <NewEntityForm
      title="Nový produkt"
      fields={fields}
      service={productService}
      selectFields={selectFields}
      redirectPath="/app/products"
    />
  );
};

export default NewProduct;
