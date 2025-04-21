"use client";

import { useEffect, useState } from "react";
import warehouseService from "services/warehouseService";
import NewEntityForm from "components/newEntityForm";

const NewPosition = () => {
  const [selectFields, setSelectFields] = useState([]);

  const fields = [
    { name: "name", label: "Jméno", ftype: "text" },
    { name: "description", label: "Popis", type: "text" },
    { name: "city", label: "Měst", type: "text" },
    { name: "state", label: "Stát", type: "text" },
    { name: "address", label: "Adresa", type: "text" },
    { name: "psc", label: "PSČ", type: "text" },
  ];

  return (
    <NewEntityForm
      title="Nový skald"
      fields={fields}
      selectFields={selectFields}
      service={warehouseService}
      redirectPath="/app/warehouse"
    />
  );
};

export default NewPosition;
