"use client";

import warehouseService from "/services/warehouseService";
import EntityList from "/components/entityList";
import { Button, Tooltip } from "@mui/material";
import { useRouter , useSearchParams} from "next/navigation";

const Positions = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Použití hooku pro získání query parametrů
  const search = searchParams.get("search");

  const columns = [
    { field: "name", headerName: "Jméno", flex: 1 },
    { field: "city", headerName: "Měst", flex: 1 },
    { field: "state", headerName: "Stát", flex: 1 },
    { field: "address", headerName: "Adresa", flex: 1 },
    { field: "psc", headerName: "PSČ", flex: 1 },
    {
      field: "positions",
      headerName: "pozice",
      width: 150,
      renderCell: (params) => {
        return(
        <Button
          onClick={() => router.push(`/app/positions?search=${params.row.positions.search}`)}
          color="primary"
        >
          {params.row.positions.count}
        </Button>
      )},
    },
  ];

  return (
    <EntityList
      title="Sklad"
      service={warehouseService}
      columns={columns}
      addPath="/app/warehouse/new"
      viewPath="/app/warehouse"
      entityName="warehouse"
    />
  );
};

export default Positions;