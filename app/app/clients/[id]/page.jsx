"use client";

import clientService from "services/clientService";
import EntityDetail from "components/entityDetail";

const ClientDetail = () => {
  const fields = [
    { name: "name", label: "Název" },
    { name: "email", label: "Email" },
  ];

  return (
    <EntityDetail
      title="Detail klienta"
      service={clientService}
      fields={fields}
      selectFields={[]}
      redirectPath="/app/clients"
    />
  );
};

export default ClientDetail;
