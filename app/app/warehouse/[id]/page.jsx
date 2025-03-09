"use client";

import EntityDetail from "/components/entityDetail";
import positionService from "/services/positionService";
import { useState } from "react";
import { useParams } from "next/navigation";

const PositionDetail = () => {
  const { id } = useParams();
  const [selectFields, setSelectFields] = useState([]);

  const fields = [
    { name: "name", label: "Jméno", ftype: "text" },
    { name: "description", label: "Popis", type: "text" },
    { name: "city", label: "Měst", type: "text"},
    { name: "state", label: "Stát", type: "text" },
    { name: "address", label: "Adresa", type: "text" },
    { name: "psc", label: "PSČ", type: "text" },
  ];

  return (
    <EntityDetail
      title="Detail skladu"
      service={positionService}
      selectFields={selectFields}
      fields={fields}
      redirectPath="/app/warehouse"
    />
  );
};

export default PositionDetail;