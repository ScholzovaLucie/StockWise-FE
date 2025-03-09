"use client";

import { useEffect, useState } from "react";
import groupService from "/services/groupService";
import boxService from "/services/boxService";
import batchService from "/services/batchService";
import NewEntityForm from "/components/newEntityForm";

const NewGroup = () => {
  const [selectFields, setSelectFields] = useState([]);

  const fields = [{ name: "quantity", label: "Quantity", type: "number" }];

  useEffect(() => {
    const loadBoxes = async () => {
      try {
        const boxes = await boxService.getAll();
        const boxOptions = boxes.map((box) => ({
          id: box.id,
          name: box.ean,
        }));

        const batches = await batchService.getAll();
        const batchesOptions = batches.map((batch) => ({
          id: batch.id,
          name: batch.batch_number,
        }));

        setSelectFields([
          {
            name: "box_id",
            label: "Boxes",
            options: boxOptions,
            multiple: false, // Více hodnot
          },
          {
            name: "batch_id",
            label: "Batches",
            options: batchesOptions,
            multiple: false, // Více hodnot
          },
        ]);
      } catch (error) {
        console.error("Error loading boxes and batches:", error);
      }
    };

    loadBoxes();
  }, []);

  return (
    <NewEntityForm
      title="Nová skupina"
      fields={fields}
      selectFields={selectFields}
      service={groupService}
      redirectPath="/app/groups"
    />
  );
};

export default NewGroup;