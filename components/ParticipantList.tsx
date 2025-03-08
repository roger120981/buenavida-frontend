"use client";

import { useParticipants, useDeleteParticipant } from "@/lib/api/participants";
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

export default function ParticipantList() {
  const { filters, page, pageSize, sortBy, sortOrder } = useParticipantFilterStore();
  const { data, isLoading, error } = useParticipants({
    filters,
    page,
    pageSize,
    sortBy,
    sortOrder,
  });
  const { mutate: deleteParticipant, isPending: isDeleting } = useDeleteParticipant();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

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

  // Log para verificar que las funciones se pasan a DataTable
  React.useEffect(() => {
    console.log("onView function:", handleView);
    console.log("onDelete function:", handleDelete);
  }, []);

  if (isLoading) return <div>Cargando participantes...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>;

  return (
    <>
      <ParticipantsOverview data={data.data} />
      <DataTable
        columns={columns}
        data={data.data}
        total={data.total}
        totalPages={data.totalPages}
        hasNext={data.hasNext}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Modal para View */}
      <Dialog
        open={viewModalOpen}
        onOpenChange={(open) => {
          console.log("View modal open changed to:", open);
          setViewModalOpen(open);
          if (!open) setSelectedParticipant(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participant Details</DialogTitle>
          </DialogHeader>
          {selectedParticipant ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedParticipant.id}</p>
              <p><strong>Name:</strong> {selectedParticipant.name}</p>
              <p><strong>Medicaid ID:</strong> {selectedParticipant.medicaidId}</p>
              <p><strong>Gender:</strong> {selectedParticipant.gender}</p>
              <p><strong>Date of Birth:</strong> {selectedParticipant.dob}</p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedParticipant.isActive ? "Active" : "Inactive"}
              </p>
              <p><strong>Location:</strong> {selectedParticipant.location}</p>
              <p><strong>Community:</strong> {selectedParticipant.community}</p>
              <p><strong>Address:</strong> {selectedParticipant.address}</p>
              <p><strong>Primary Phone:</strong> {selectedParticipant.primaryPhone}</p>
              {selectedParticipant.secondaryPhone && (
                <p>
                  <strong>Secondary Phone:</strong>{" "}
                  {selectedParticipant.secondaryPhone}
                </p>
              )}
              <p><strong>LOC Start Date:</strong> {selectedParticipant.locStartDate}</p>
              <p><strong>LOC End Date:</strong> {selectedParticipant.locEndDate}</p>
              <p><strong>POC Start Date:</strong> {selectedParticipant.pocStartDate}</p>
              <p><strong>POC End Date:</strong> {selectedParticipant.pocEndDate}</p>
              {selectedParticipant.units && (
                <p><strong>Units:</strong> {selectedParticipant.units}</p>
              )}
              {selectedParticipant.hours && (
                <p><strong>Hours:</strong> {selectedParticipant.hours}</p>
              )}
              <p><strong>HDM:</strong> {selectedParticipant.hdm ? "Yes" : "No"}</p>
              <p><strong>ADHC:</strong> {selectedParticipant.adhc ? "Yes" : "No"}</p>
              <p>
                <strong>Case Manager:</strong> {selectedParticipant.caseManager.name} (ID:{" "}
                {selectedParticipant.caseManager.id})
              </p>
              <p><strong>Created At:</strong> {selectedParticipant.createdAt}</p>
              <p><strong>Updated At:</strong> {selectedParticipant.updatedAt}</p>
            </div>
          ) : (
            <p>No participant selected</p>
          )}
          <DialogFooter>
            <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Delete */}
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
              Are you sure you want to delete this participant? This action cannot be
              undone.
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