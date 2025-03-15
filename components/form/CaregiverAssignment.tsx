// components/form/CaregiverAssignment.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { useCaregivers, useCreateCaregiver } from "@/lib/api/caregivers";
import { Caregiver, CreateCaregiverDto, type CaregiverAssignment } from "@/lib/types/caregivers"; // Usamos import type para CaregiverAssignment
import { toast } from "@/components/ui/use-toast";

// No necesitamos control como prop
interface CaregiverAssignmentProps {}

export function CaregiverAssignment({}: CaregiverAssignmentProps) {
  const { getValues, setValue } = useFormContext() || { getValues: () => ({}), setValue: () => {} }; // Desestructuramos solo lo necesario
  const { data: caregivers = { data: [] }, isLoading, error, refetch: refetchCaregivers } = useCaregivers();
  const createCaregiverMutation = useCreateCaregiver();
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCaregiver, setNewCaregiver] = useState<CreateCaregiverDto>({
    name: "",
    email: "",
    phone: "",
    isActive: true,
  });

  if (isLoading) return <div>Loading caregivers...</div>;
  if (error) return <div>Error loading caregivers: {error.message}</div>;

  const assignedCaregivers: CaregiverAssignment[] = getValues("caregiverAssignments") || [];

  const handleAddCaregiver = () => {
    if (!selectedCaregiverId) return;

    const caregiver = caregivers.data.find((c: Caregiver) => c.id === selectedCaregiverId);
    if (!caregiver) return;

    if (assignedCaregivers.some((c: CaregiverAssignment) => c.caregiverId === selectedCaregiverId)) {
      toast({
        title: "Error",
        description: "This caregiver is already assigned.",
        color: "destructive",
      });
      return;
    }

    const newAssignment: CaregiverAssignment = {
      caregiverId: selectedCaregiverId,
      caregiverName: caregiver.name,
    };

    setValue("caregiverAssignments", [...assignedCaregivers, newAssignment], { shouldValidate: true });
    setSelectedCaregiverId(null);
  };

  const handleRemoveCaregiver = (caregiverId: number) => {
    setValue(
      "caregiverAssignments",
      assignedCaregivers.filter((c: CaregiverAssignment) => c.caregiverId !== caregiverId),
      { shouldValidate: true }
    );
  };

  const handleCreateCaregiver = () => {
    if (!newCaregiver.name) {
      toast({
        title: "Error",
        description: "Name is required to create a caregiver.",
        color: "destructive",
      });
      return;
    }

    if (newCaregiver.email && !/^\S+@\S+\.\S+$/.test(newCaregiver.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        color: "destructive",
      });
      return;
    }

    createCaregiverMutation.mutate(newCaregiver, {
      onSuccess: (createdCaregiver: Caregiver) => {
        setShowCreateForm(false);
        setNewCaregiver({ name: "", email: "", phone: "", isActive: true });
        const newAssignment: CaregiverAssignment = {
          caregiverId: createdCaregiver.id,
          caregiverName: createdCaregiver.name,
        };
        setValue("caregiverAssignments", [...assignedCaregivers, newAssignment], { shouldValidate: true });
        refetchCaregivers();
        toast({
          title: "Success",
          description: `Caregiver ${createdCaregiver.name} created and assigned.`,
          color: "success",
        });
      },
      onError: (error: any) => {
        console.error("Error creating caregiver:", error);
        toast({
          title: "Error",
          description: "Failed to create caregiver: " + (error.response?.data?.message || error.message),
          color: "destructive",
        });
      },
    });
  };

  const handleInputChange = (field: keyof CreateCaregiverDto, value: string | boolean) => {
    setNewCaregiver((prev: CreateCaregiverDto) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
          Assign Caregivers
          <span className="text-xs text-gray-500 block">(Select or create a caregiver below)</span>
        </Label>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(val) => setSelectedCaregiverId(val ? parseInt(val, 10) : null)}
            value={selectedCaregiverId?.toString() || ""}
          >
            <SelectTrigger
              className="rounded-lg border-gray-300 w-full text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 py-2 h-10 flex items-center"
            >
              <SelectValue placeholder="Select a caregiver" className="ml-2" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="" className="rounded-none">
                None
              </SelectItem>
              {caregivers.data.map((caregiver: Caregiver) => (
                <SelectItem key={caregiver.id} value={caregiver.id.toString()} className="rounded-none">
                  {caregiver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAddCaregiver}
            className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 min-w-[100px] shadow-md transition-all h-10 flex items-center justify-center"
            disabled={!selectedCaregiverId}
          >
            Add
          </Button>
          <Button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 min-w-[100px] shadow-md transition-all h-10 flex items-center justify-center"
          >
            Create New
          </Button>
        </div>
      </div>

      {/* Formulario para Crear Nuevo Caregiver */}
      {showCreateForm && (
        <div className="mt-2 space-y-2 border border-gray-300 p-4 rounded-lg shadow-sm">
          <Label className="text-sm font-semibold text-gray-600 mb-1 hover:text-blue-500 transition-colors">
            Create New Caregiver
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-caregiver-name" className="text-sm font-semibold text-gray-600">
                Name
              </Label>
              <div className="relative">
                <Input
                  id="new-caregiver-name"
                  value={newCaregiver.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Type caregiver name"
                  className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                />
                <Icon
                  icon="mdi:user"
                  className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 z-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-caregiver-email" className="text-sm font-semibold text-gray-600">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="new-caregiver-email"
                  type="email"
                  value={newCaregiver.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Type email"
                  className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                />
                <Icon
                  icon="ic:outline-email"
                  className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 z-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-caregiver-phone" className="text-sm font-semibold text-gray-600">
                Phone
              </Label>
              <div className="relative">
                <Input
                  id="new-caregiver-phone"
                  type="tel"
                  value={newCaregiver.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Type phone number"
                  className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                />
                <Icon
                  icon="mdi:phone"
                  className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600 z-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-caregiver-isActive" className="text-sm font-semibold text-gray-600">
                Active
              </Label>
              <div className="relative">
                <select
                  id="new-caregiver-isActive"
                  value={newCaregiver.isActive ? "true" : "false"}
                  onChange={(e) => handleInputChange("isActive", e.target.value === "true")}
                  className="rounded-lg border-gray-300 w-full py-2 pl-3 pr-10 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <Icon
                  icon="mdi:check-circle"
                  className="w-5 h-5 absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 z-10"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg bg-gray-500 text-white hover:bg-gray-600 py-2 px-4 shadow-md transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCaregiver}
              className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 shadow-md transition-all"
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Caregivers Asignados */}
      {assignedCaregivers.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-semibold text-gray-600 mb-2 block">Assigned Caregivers</Label>
          <ul className="space-y-2">
            {assignedCaregivers.map((assignment: CaregiverAssignment) => (
              <li
                key={assignment.caregiverId}
                className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
              >
                <span>{assignment.caregiverName}</span>
                <Button
                  type="button"
                  onClick={() => handleRemoveCaregiver(assignment.caregiverId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}