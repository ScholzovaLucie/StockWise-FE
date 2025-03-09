"use client";

import React from "react";
import OperationForm from "/components/createOperation";
import { useParams } from "next/navigation";


const DetailOperationPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Správa Operací</h1>
      <OperationForm operationId={id} />
    </div>
  );
};

export default DetailOperationPage;