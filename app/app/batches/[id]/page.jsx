"use client";

import EntityDetail from "components/entityDetail";
import batchService from "services/batchService";
import productService from "services/productService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const BatchDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectFields, setSelectFields] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fields = [
    { name: "batch_number", label: "Name" },
    { name: "expiration_date", label: "Expiration", date: true },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await batchService.getById(id);
        let products = await productService.getAll();
        if (products.results) products = products.results;
        const productOptions = products.map((product) => ({
          id: product.id,
          name: product.name,
        }));
        setOptions(productOptions);

        const productData = productOptions.find(
          (option) => option.id === data.product_id
        );
        setProduct(productData || null); // Nastavíme produkt, pokud je nalezen
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (options.length > 0 && product !== null) {
      setSelectFields([
        {
          name: "product_id",
          label: "Product",
          options: options,
          value: product.id, // Pouze id jako hodnota
          update: (newValue) => {
            const updatedProduct = options.find(
              (option) => option.id === newValue
            );
            setProduct(updatedProduct || null);
          },
        },
      ]);
    }
  }, [options, product]);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <EntityDetail
      title="Detail šarže"
      service={atchService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/batches"
    />
  );
};

export default BatchDetail;
