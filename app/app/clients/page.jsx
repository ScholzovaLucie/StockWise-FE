"use client";

import clientService from "services/clientService";
import EntityList from "components/entityList";

const Clients = () => {
  const columns = [
    { field: "name", headerName: "Název", width: 200 },
    { field: "email", headerName: "E-mail", flex: 1 },
  ];

  return (
    <EntityList
      title="Klienti"
      service={clientService}
      columns={columns}
      addPath="/app/clients/new"
      viewPath="/app/clients"
      entityName="klient"
    />
  );
};

export default Clients;
