"use client";
import { useParticipants } from "@/lib/api/participants";
import { useParticipantFilterStore } from "@/store/participantFilterStore";
import { DataTable } from "../app/[lang]/(dashboard)/participants/data-table"; // Ruta ajustada
import { columns } from "../app/[lang]/(dashboard)/participants/columns"; // Ruta ajustada
import ParticipantsOverview from "../app/[lang]/(dashboard)/participants/ParticipantsOverview"; // Nuevo import
import React from "react";

export default function ParticipantList() {
  const { filters, page, pageSize, sortBy, sortOrder } = useParticipantFilterStore();
  const { data, isLoading, error } = useParticipants({
    filters,
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  React.useEffect(() => {
    console.log("Fetch parameters:", { filters, page, pageSize, sortBy, sortOrder }); // Log para verificar
  }, [filters, page, pageSize, sortBy, sortOrder]);

  if (isLoading) return <div>Cargando participantes...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>;

  return (
    <>
      <ParticipantsOverview data={data.data} /> {/* Añadimos el overview */}
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        totalPages={data.totalPages}
        hasNext={data.hasNext}
      />
    </>
  );
}