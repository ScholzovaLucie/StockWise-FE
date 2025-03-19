"use client";

import EntityDetail from "/components/entityDetail";
import boxService from "/services/boxService";
import positionService from "/services/positionService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const BoxDetail = () => {
  const { id } = useParams();
  const [position, setPosition] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectFields, setSelectFields] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fields = [
    { name: "ean", label: "EAN", type: "text" },
    {
      name: "width",
      label: "Width",
      type: "number",
      defaultValue: 0,
      step: 1,
      min: 0,
    },
    {
      name: "height",
      label: "Height",
      type: "number",
      defaultValue: 0,
      step: 1,
      min: 0,
    },
    {
      name: "depth",
      label: "Depth",
      type: "number",
      defaultValue: 0,
      step: 1,
      min: 0,
    },
    {
      name: "weight",
      label: "Weight",
      type: "number",
      defaultValue: 0,
      step: 1,
      min: 0,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await boxService.getById(id);
        const positions = await positionService.getAll();

        const positionOptions = positions.map((position) => ({
          id: position.id,
          name: position.code,
        }));
        setOptions(positionOptions);

        const positionData = positionOptions.find(
          (option) => option.id === data.position_id
        );
        setPosition(positionData || null); // Nastavíme produkt, pokud je nalezen
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
          name: "position_id",
          label: "Position",
          options: options,
          value: position?.id || "",
          update: (newValue) => {
            const updatePosition = options.find(
              (option) => option.id === newValue
            );
            setPosition(updatePosition || null);
          },
        },
      ]);
    }
  }, [options, position]);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <EntityDetail
      title="Detail krabice"
      service={boxService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/boxes"
    />
  );
};

export default BoxDetail;
