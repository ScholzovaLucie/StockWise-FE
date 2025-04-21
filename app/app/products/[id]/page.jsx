"use client";

import EntityDetail from "/components/entityDetail";
import productService from "/services/productService";
import clientService from "/services/clientService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetail = () => {
  const { id } = useParams();
  const [clientId, setClientId] = useState(null);
  const [selectFields, setSelectFields] = useState(null); // Výchozí hodnota null
  const [isLoading, setIsLoading] = useState(true);

  const fields = [
    { name: "sku", label: "SKU" },
    { name: "name", label: "Název" },
    { name: "description", label: "Popis", multiline: true, minRows: 3 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await productService.getById(id);
        let clients = await clientService.getAll();
        if (clients.results) clients = clients.results;
        const options = clients.map((client) => ({
          id: client.id,
          name: client.name, // Zde použij správné pole pro zobrazení názvu produktu
        }));

        setClientId(data.client_id);
        setSelectFields([
          {
            name: "client",
            label: "Client",
            fetchData: clientService.getAll,
            options: options,
            value: data.client_id,
            update: setClientId,
            key: "client_id",
          },
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <EntityDetail
      title="Detail produktu"
      service={productService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/products"
    />
  );
};

export default ProductDetail;
