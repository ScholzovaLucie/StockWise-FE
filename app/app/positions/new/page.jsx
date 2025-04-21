"use client";

import { useEffect, useState } from "react";
import positionService from "/services/positionService";
import warehouseService from "/services/warehouseService";
import NewEntityForm from "/components/newEntityForm";

const NewPosition = () => {
  const [selectFields, setSelectFields] = useState([]);

  const fields = [{ name: "code", label: "Code", type: "text" }];

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        let warehosues = await warehouseService.getAll();
        if (warehosues.results) warehosues = warehosues.results;
        const options = warehosues.map((warehouse) => ({
          id: warehouse.id,
          name: warehouse.name, // Zde použij správné pole pro zobrazení názvu produktu
        }));

        setSelectFields([
          {
            name: "warehouse_id",
            label: "Sklad",
            options: options,
          },
        ]);
      } catch (error) {
        console.error("Error loading warehouses:", error);
      }
    };

    loadWarehouses();
  }, []);

  return (
    <NewEntityForm
      title="Nová pozice"
      fields={fields}
      selectFields={selectFields}
      service={positionService}
      redirectPath="/app/positions"
    />
  );
};

export default NewPosition;
