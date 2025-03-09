"use client";

import { useParticipants, useDeleteParticipant, useParticipantsByStatus } from "@/lib/api/participants";
import { useParticipantFilterStore } from "@/store/participantFilterStore";
import { DataTable } from "../app/[lang]/(dashboard)/participants/data-table";
import { columns } from "../app/[lang]/(dashboard)/participants/columns";
import ParticipantsOverview from "../app/[lang]/(dashboard)/participants/ParticipantsOverview";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participant } from "@/lib/types/participants";
import React from "react";
import { Icon } from "@iconify/react"; // Añadido para los íconos
import { Badge } from "@/components/ui/badge"; // Añadido para el componente Badge
import { formatDateShort } from "@/lib/utils"; // Importamos el helper

export default function ParticipantList() {
  const { filters, page, pageSize, sortBy, sortOrder } = useParticipantFilterStore();
  const { data, isLoading, error } = useParticipants({
    filters,
    page,
    pageSize,
    sortBy,
    sortOrder,
  });
  // Obtenemos activos e inactivos por separado
  const { data: activeData, isLoading: isActiveLoading, error: activeError } = useParticipantsByStatus(1);
  const { data: inactiveData, isLoading: isInactiveLoading, error: inactiveError } = useParticipantsByStatus(0);
  const { mutate: deleteParticipant, isPending: isDeleting } = useDeleteParticipant();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Combinamos los datos de activos e inactivos
  const combinedData = activeData && inactiveData ? [...activeData, ...inactiveData] : [];

  React.useEffect(() => {
    console.log("Fetch parameters:", { filters, page, pageSize, sortBy, sortOrder });
  }, [filters, page, pageSize, sortBy, sortOrder]);

  const handleView = (participant: Participant) => {
    console.log("handleView called with participant:", participant);
    setSelectedParticipant(participant);
    setViewModalOpen(true);
  };

  const handleDelete = (participant: Participant) => {
    console.log("handleDelete called with participant:", participant);
    setSelectedParticipant(participant);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("confirmDelete called, selectedParticipant:", selectedParticipant);
    if (selectedParticipant) {
      deleteParticipant(selectedParticipant.id, {
        onSuccess: () => {
          console.log("Participant deleted successfully");
          setDeleteModalOpen(false);
          setSelectedParticipant(null);
        },
        onError: (error) => {
          console.error("Error deleting participant:", error);
        },
      });
    }
  };

  React.useEffect(() => {
    console.log("viewModalOpen:", viewModalOpen);
    console.log("deleteModalOpen:", deleteModalOpen);
    console.log("selectedParticipant:", selectedParticipant);
  }, [viewModalOpen, deleteModalOpen, selectedParticipant]);

  React.useEffect(() => {
    console.log("onView function:", handleView);
    console.log("onDelete function:", handleDelete);
  }, []);

  if (isLoading || isActiveLoading || isInactiveLoading) return <div>Cargando participantes...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (activeError) return <div>Error al cargar participantes activos: {activeError.message}</div>;
  if (inactiveError) return <div>Error al cargar participantes inactivos: {inactiveError.message}</div>;
  if (!data || !activeData || !inactiveData) return <div>No hay datos disponibles</div>;

  return (
    <>
      <ParticipantsOverview data={combinedData} /> {/* Pasamos los datos combinados */}
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        totalPages={data.totalPages}
        hasNext={data.hasNext}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Dialog
        open={viewModalOpen}
        onOpenChange={(open) => {
          console.log("View modal open changed to:", open);
          setViewModalOpen(open);
          if (!open) setSelectedParticipant(null);
        }}
      >
        <DialogContent size="4xl" className="[&>button]:top-8 [&>button]:right-8 max-h-[90vh] overflow-y-auto bg-white shadow border border-gray-200">
          <DialogHeader className="bg-blue-600 p-6 text-white">
            <DialogTitle className="flex items-center text-2xl font-bold">
              <Icon icon="heroicons:user" className="w-8 h-8 mr-3" />
              Participant Details
            </DialogTitle>
          </DialogHeader>
          {selectedParticipant ? (
            <div className="p-6 space-y-6">
              {/* Sección: Información Personal */}
              <div className="bg-white p-4 shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:identification" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">ID:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.id}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:user" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:shield-check" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Medicaid ID:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.medicaidId}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:users" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Gender:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.gender}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.dob)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <Badge
                      variant="soft"
                      color={selectedParticipant.isActive ? "success" : "warning"}
                      className="text-sm px-2 py-0.5 rounded"
                    >
                      {selectedParticipant.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sección: Información de Contacto */}
              <div className="bg-white p-4 shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2 mb-4">Información de Contacto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:map-pin" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:building-office" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Community:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.community}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:home" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Address:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:phone" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Primary Phone:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.primaryPhone}</span>
                  </div>
                  {selectedParticipant.secondaryPhone && (
                    <div className="flex items-center space-x-3">
                      <Icon icon="heroicons:phone" className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Secondary Phone:</span>
                      <span className="text-base text-gray-900">{selectedParticipant.secondaryPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección: Fechas */}
              <div className="bg-white p-4 shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2 mb-4">Fechas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">LOC Start Date:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.locStartDate)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">LOC End Date:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.locEndDate)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">POC Start Date:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.pocStartDate)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">POC End Date:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.pocEndDate)}</span>
                  </div>
                </div>
              </div>

              {/* Sección: Detalles del Programa */}
              <div className="bg-white p-4 shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2 mb-4">Detalles del Programa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedParticipant.units && (
                    <div className="flex items-center space-x-3">
                      <Icon icon="heroicons:clock" className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Units:</span>
                      <span className="text-base text-gray-900">{selectedParticipant.units}</span>
                    </div>
                  )}
                  {selectedParticipant.hours && (
                    <div className="flex items-center space-x-3">
                      <Icon icon="heroicons:clock" className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Hours:</span>
                      <span className="text-base text-gray-900">{selectedParticipant.hours}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">HDM:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.hdm ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">ADHC:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.adhc ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              {/* Sección: Metadatos */}
              <div className="bg-white p-4 shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2 mb-4">Metadatos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:user-circle" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Case Manager:</span>
                    <span className="text-base text-gray-900">{selectedParticipant.caseManager.name} (ID: {selectedParticipant.caseManager.id})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Created At:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon icon="heroicons:calendar" className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Updated At:</span>
                    <span className="text-base text-gray-900">{formatDateShort(selectedParticipant.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No participant selected
            </div>
          )}
          <DialogFooter className="p-6 bg-gray-50 border-t-2 border-blue-200">
            <Button
              onClick={() => setViewModalOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-none font-medium transition-colors"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onOpenChange={(open) => {
          console.log("Delete modal open changed to:", open);
          setDeleteModalOpen(open);
          if (!open) setSelectedParticipant(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this participant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              color="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}