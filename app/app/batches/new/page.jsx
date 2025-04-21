"use client";

import { useEffect, useState } from "react";
import productService from "services/productService";
import batchService from "services/batchService";
import NewEntityForm from "components/newEntityForm";

const NewBatch = () => {
  const [selectFields, setSelectFields] = useState([]);

  const fields = [
    { name: "batch_number", label: "Name", type: "text" },
    { name: "expiration_date", label: "Expiration", type: "date" },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let products = await productService.getAll();
        if (products.results) products = products.results;
        const options = products.map((product) => ({
          id: product.id,
          name: product.name, // Zde použij správné pole pro zobrazení názvu produktu
        }));

        setSelectFields([
          {
            name: "product_id",
            label: "Product",
            options: options,
          },
        ]);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <NewEntityForm
      title="Nová šarže"
      fields={fields}
      selectFields={selectFields}
      service={batchService}
      redirectPath="/app/batches"
    />
  );
};

export default NewBatch;
