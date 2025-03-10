// components/form/CaregiverAssignment.tsx
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { useCaregivers, useAssignedCaregivers, useAssignCaregiver, useUnassignCaregiver } from "../../lib/api/caregivers";
import { Caregiver } from "@/lib/types/caregivers"; // Importación necesaria para tipado

interface CaregiverAssignmentProps {
  participantId?: number;
}

export function CaregiverAssignment({ participantId }: CaregiverAssignmentProps) {
  const [selectedCaregiver, setSelectedCaregiver] = useState<string | null>(null);
  const [showSection, setShowSection] = useState(false);

  const { data: caregivers = { data: [] } } = useCaregivers();
  const { data: assignedCaregivers = { data: [] } } = useAssignedCaregivers(participantId || 0);
  const assignMutation = useAssignCaregiver();
  const unassignMutation = useUnassignCaregiver();

  return (
    <div className="col-span-2">
      <Button
        type="button"
        onClick={() => setShowSection(!showSection)}
        className="rounded-none mb-4"
      >
        {showSection ? "Hide Caregivers" : "Assign Caregivers"}
      </Button>
      {showSection && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select onValueChange={setSelectedCaregiver} value={selectedCaregiver || ""}>
              <SelectTrigger className="rounded-none border-default-300 w-full">
                <SelectValue placeholder="Select Caregiver" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {caregivers.data.map((caregiver: Caregiver) => (
                  <SelectItem key={caregiver.id} value={caregiver.id.toString()} className="rounded-none">
                    {caregiver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() =>
                selectedCaregiver &&
                participantId &&
                assignMutation.mutate({ participantId, caregiverId: Number(selectedCaregiver) })
              }
              className="rounded-none"
              disabled={!selectedCaregiver || !participantId}
            >
              Assign
            </Button>
          </div>
          <Table className="rounded-none">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedCaregivers.data.map((caregiver: Caregiver) => (
                <TableRow key={caregiver.id}>
                  <TableCell>{caregiver.name}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() =>
                        participantId &&
                        unassignMutation.mutate({ participantId, caregiverId: caregiver.id })
                      }
                      className="text-red-500 rounded-none"
                      disabled={!participantId}
                    >
                      <Icon icon="heroicons:trash" className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}