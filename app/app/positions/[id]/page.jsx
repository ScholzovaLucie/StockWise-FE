"use client";

import EntityDetail from "/components/entityDetail";
import positionService from "/services/positionService";
import warehouseService from "/services/warehouseService";
import { useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const PositionDetail = () => {
  const { id } = useParams();
  const [selectFields, setSelectFields] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fields = [{ name: "code", label: "Code" }];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await positionService.getById(id);
        const warehosues = await warehouseService.getAll();

        const warehouseOptions = warehosues.map((warehouse) => ({
          id: warehouse.id,
          name: warehouse.name,
        }));
        setOptions(warehouseOptions);

        const warehouseData = warehouseOptions.find(
          (option) => option.id === data.warehouse_id
        );
        setPosition(warehouseData || null); // Nastavíme produkt, pokud je nalezen
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (options.length > 0) {
      setSelectFields([
        {
          name: "warehouse_id",
          label: "Skald",
          options: options,
          value: warehouse?.id || "",
          update: (newValue) => {
            const updateWarehouse = options.find(
              (option) => option.id === newValue
            );
            setPosition(updateWarehouse || null);
          },
        },
      ]);
    }
  }, [options, warehouse]);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <EntityDetail
      title="Detail pozice"
      service={positionService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/position"
    />
  );
};

export default PositionDetail;
