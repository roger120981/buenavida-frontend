// components/form/CaseManagerForm.tsx
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useCaseManagers, useAgencies, useCreateCaseManager } from "@/lib/api/caseManagers";
import { CaseManager, Agency, CreateCaseManagerResponse } from "@/lib/types/caseManagers";

interface CaseManagerFormProps {
  control: any;
}

export function CaseManagerForm({ control: propControl }: CaseManagerFormProps) {
  const { control, getValues, setValue, watch } = useFormContext() || { control: propControl };
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: caseManagers = { data: [] }, isLoading: cmLoading, error: cmError, refetch: refetchCaseManagers } = useCaseManagers();
  const { data: agencies = { data: [] }, isLoading: agencyLoading, error: agencyError } = useAgencies();
  const createCaseManagerMutation = useCreateCaseManager();

  console.log('Case Managers:', caseManagers, 'Loading:', cmLoading, 'Error:', cmError);
  console.log('Agencies:', agencies, 'Loading:', agencyLoading, 'Error:', agencyError);

  if (cmLoading || agencyLoading) return <div>Loading options...</div>;
  if (cmError) return <div>Error loading case managers: {cmError.message}</div>;
  if (agencyError) return <div>Error loading agencies: {agencyError.message}</div>;

  const handleCreateCaseManager = () => {
    const formValues = getValues();
    const createData = {
      name: formValues.caseManager.create?.name,
      email: formValues.caseManager.create?.email || "default@example.com",
      phone: formValues.caseManager.create?.phone || "000-000-0000",
      agencyId: formValues.caseManager.create?.agencyId,
    };

    console.log("Selected agencyId before validation:", formValues.caseManager.create?.agencyId);

    if (!createData.name || createData.agencyId == null || createData.agencyId < 1) {
      alert("Please provide a name and select a valid agency for the case manager.");
      return;
    }

    console.log("Sending data to create case manager:", createData);

    createCaseManagerMutation.mutate(createData as { name: string; email: string; phone: string; agencyId: number }, {
      onSuccess: (newCaseManager: CreateCaseManagerResponse) => {
        console.log("New case manager response (onSuccess):", newCaseManager);
        setShowCreateForm(false);
        if (newCaseManager.data && typeof newCaseManager.data.id === 'number') {
          console.log("Setting caseManager.connect.id to:", newCaseManager.data.id);
          // Actualizamos el Select para seleccionar automáticamente el nuevo caseManager
          setValue("caseManager.connect.id", newCaseManager.data.id);
          setValue("caseManager.create", undefined);
          // Refrescamos la lista de caseManagers para incluir el nuevo
          refetchCaseManagers();
          const updatedValue = watch("caseManager");
          console.log("Updated caseManager value after setValue:", updatedValue);
          alert("Case manager created successfully with ID: " + newCaseManager.data.id);
        } else {
          console.error("Invalid or missing ID in response:", newCaseManager);
          alert("Failed to retrieve a valid case manager ID. Response: " + JSON.stringify(newCaseManager));
        }
      },
      onError: (error: any) => {
        console.log("New case manager response (onError):", error.response?.data || error.message);
        console.error("Error creating case manager:", error);
        alert("Failed to create case manager: " + (error.response?.data?.message || error.message || "Unknown error"));
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Controller
          name="caseManager.connect.id"
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <Select
              onValueChange={(val) => {
                console.log("Selected value:", val);
                onChange(val ? parseInt(val, 10) : null);
              }}
              value={value?.toString() || ""}
            >
              <SelectTrigger className="rounded-none border-default-300 w-full">
                <SelectValue placeholder="Select Case Manager" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="" className="rounded-none">
                  None
                </SelectItem>
                {caseManagers.data.map((cm: CaseManager) => (
                  <SelectItem key={cm.id} value={cm.id.toString()} className="rounded-none">
                    {cm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-none"
        >
          {showCreateForm ? "Cancel" : "Create New"}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mt-4 space-y-4">
          <Controller
            name="caseManager.create.name"
            control={control}
            defaultValue=""
            rules={{ required: "Case Manager Name is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="caseManager.create.name">Case Manager Name</Label>
                <div className="relative">
                  <Input
                    id="caseManager.create.name"
                    value={value || ""}
                    onChange={onChange}
                    className="rounded-none border-default-300 w-full"
                  />
                  <Icon icon="mdi:user" className="w-5 h-5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-400" />
                </div>
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="caseManager.create.email"
            control={control}
            defaultValue=""
            rules={{ pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" } }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="caseManager.create.email">Case Manager Email</Label>
                <div className="relative">
                  <Input
                    id="caseManager.create.email"
                    type="email"
                    value={value || ""}
                    onChange={onChange}
                    className="rounded-none border-default-300 w-full"
                  />
                  <Icon icon="ic:outline-email" className="w-5 h-5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-400" />
                </div>
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="caseManager.create.phone"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="caseManager.create.phone">Case Manager Phone</Label>
                <div className="relative">
                  <Input
                    id="caseManager.create.phone"
                    type="tel"
                    value={value || ""}
                    onChange={onChange}
                    className="rounded-none border-default-300 w-full"
                  />
                  <Icon icon="mdi:phone" className="w-5 h-5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-400" />
                </div>
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="caseManager.create.agencyId"
            control={control}
            defaultValue=""
            rules={{ required: "Agency is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="caseManager.create.agencyId">Agency</Label>
                <Select onValueChange={(val) => {
                  console.log("Selected agencyId:", val);
                  onChange(val ? parseInt(val, 10) : null);
                }} value={value?.toString() || ""}>
                  <SelectTrigger className="rounded-none border-default-300 w-full">
                    <SelectValue placeholder="Select Agency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="" className="rounded-none">
                      None
                    </SelectItem>
                    {agencies.data.map((agency: Agency) => (
                      <SelectItem key={agency.id} value={agency.id.toString()} className="rounded-none">
                        {agency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />

          <Button
            type="button"
            onClick={handleCreateCaseManager}
            className="rounded-none bg-blue-600 text-white mt-4"
          >
            Save New Case Manager
          </Button>
        </div>
      )}
    </div>
  );
}