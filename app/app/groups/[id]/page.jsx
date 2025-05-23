"use client";

import EntityDetail from "components/entityDetail";
import groupService from "services/groupService";
import boxService from "services/boxService";
import batchService from "services/batchService";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const GroupDetail = () => {
  const { id } = useParams();
  const [box, setBox] = useState(null);
  const [batch, setBatch] = useState(null);
  const [product, setProduct] = useState(null);
  const [boxOptions, setBoxOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [selectFields, setSelectFields] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fields = [{ name: "quantity", label: "Quantity", type: "number" }];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await groupService.getById(id);
        let boxes = await boxService.getAll();
        if (boxes.results) boxes = boxes.results;
        const boxesOptions = boxes.map((box) => ({
          id: box.id,
          name: box.ean,
        }));
        setBoxOptions(boxesOptions);

        const boxData = boxesOptions.find(
          (option) => option.id === data.box_id
        );
        setProduct(boxData || null);

        let batches = await batchService.getAll();
        if (batches.results) batches = batches.results;
        const batchesOptions = batches.map((batch) => ({
          id: batch.id,
          name: batch.batch_number,
        }));
        setBatchOptions(batchesOptions);

        const batchData = batchesOptions.find(
          (option) => option.id === data.box_id
        );
        setProduct(batchData || null);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    setSelectFields([
      {
        name: "box_id",
        label: "Box",
        options: boxOptions,
        value: box?.id || null, // Pouze id jako hodnota
        update: (newValue) => {
          const updateBox = boxOptions.find((option) => option.id === newValue);
          setProduct(updateBox || null);
        },
      },
      {
        name: "batch_id",
        label: "Batch",
        options: batchOptions,
        value: batch?.id || null, // Pouze id jako hodnota
        update: (newValue) => {
          const updateBatch = batchOptions.find(
            (option) => option.id === newValue
          );
          setProduct(updateBatch || null);
        },
      },
    ]);
  }, [boxOptions, batchOptions, product]);

  if (isLoading || !selectFields) {
    return <CircularProgress />;
  }

  return (
    <EntityDetail
      title="Detail skupiny"
      service={groupService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/groups"
    />
  );
};

export default GroupDetail;
