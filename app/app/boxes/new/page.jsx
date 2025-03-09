"use client";

import { useEffect, useState } from "react";
import positionService from "/services/positionService";
import boxService from "/services/boxService";
import NewEntityForm from "/components/newEntityForm";

const NewBox = () => {
  const [selectFields, setSelectFields] = useState([]);

  const fields = [
    { name: "ean", label: "EAN", type: "text" },
    { name: "width", label: "Width", type: "number", defaultValue: 0, step: 1, min: 0 },
    { name: "height", label: "Height", type: "number", defaultValue: 0, step: 1, min: 0 },
    { name: "depth", label: "Depth", type: "number", defaultValue: 0, step: 1, min: 0},
    { name: "weight", label: "Weight", type: "number", defaultValue: 0, step: 1, min: 0 },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const positions = await positionService.getAll();
        const options = positions.map((position) => ({
          id: position.id,
          name: position.code, // Zde použij správné pole pro zobrazení názvu produktu
        }));

        setSelectFields([
          {
            name: "position_id",
            label: "Position",
            options: options,
          },
        ]);
      } catch (error) {
        console.error("Error loading Positions:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <NewEntityForm
      title="Nová krabice"
      fields={fields}
      selectFields={selectFields}
      service={boxService}
      redirectPath="/app/boxes"
    />
  );
};

export default NewBox;