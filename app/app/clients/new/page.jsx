"use client";

import clientService from "/services/clientService";
import NewEntityForm from "/components/newEntityForm";

const NewClient = () => {
  const fields = [
    { name: "name", label: "Název" },
    { name: "email", label: "Email" },
  ];

  return (
    <NewEntityForm
      title="Nový klient"
      fields={fields}
      service={clientService}
      redirectPath="/app/clients"
    />
  );
};

export default NewClient;