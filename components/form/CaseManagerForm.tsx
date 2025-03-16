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
import { toast } from "@/components/ui/use-toast";

interface CaseManagerFormProps {
  control?: any;
}

export function CaseManagerForm({ control: propControl }: CaseManagerFormProps) {
  const { control, getValues, setValue, watch } = useFormContext() || { control: propControl };
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: caseManagers = { data: [] }, isLoading: cmLoading, error: cmError, refetch: refetchCaseManagers } = useCaseManagers();
  const { data: agencies = { data: [] }, isLoading: agencyLoading, error: agencyError } = useAgencies();
  const createCaseManagerMutation = useCreateCaseManager();

  console.log("Case Managers:", caseManagers, "Loading:", cmLoading, "Error:", cmError);
  console.log("Agencies:", agencies, "Loading:", agencyLoading, "Error:", agencyError);

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
      toast({
        title: "Error",
        description: "Please provide a name and select a valid agency for the case manager.",
        color: "destructive",
      });
      return;
    }

    console.log("Sending data to create case manager:", createData);

    createCaseManagerMutation.mutate(createData as { name: string; email: string; phone: string; agencyId: number }, {
      onSuccess: (newCaseManager: CreateCaseManagerResponse) => {
        console.log("New case manager response (onSuccess):", newCaseManager);
        setShowCreateForm(false);
        if (newCaseManager.data && typeof newCaseManager.data.id === "number") {
          console.log("Setting caseManager.connect.id to:", newCaseManager.data.id);
          setValue("caseManager.connect.id", newCaseManager.data.id, { shouldValidate: true });
          setValue("caseManager.create", undefined);
          refetchCaseManagers();
          const updatedValue = watch("caseManager");
          console.log("Updated caseManager value after setValue:", updatedValue);
          toast({
            title: "Success",
            description: `Case manager created successfully with ID: ${newCaseManager.data.id}`,
            color: "success",
          });
        } else {
          console.error("Invalid or missing ID in response:", newCaseManager);
          toast({
            title: "Error",
            description: "Failed to retrieve a valid case manager ID. Response: " + JSON.stringify(newCaseManager),
            color: "destructive",
          });
        }
      },
      onError: (error: any) => {
        console.log("New case manager response (onError):", error.response?.data || error.message);
        console.error("Error creating case manager:", error);
        toast({
          title: "Error",
          description: "Failed to create case manager: " + (error.response?.data?.message || error.message || "Unknown error"),
          color: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="caseManager-connect-id" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
          Select or Create Case Manager
          <span className="text-xs text-gray-500 block">(Choose an existing one or create a new one below)</span>
        </Label>
        <div className="flex items-center gap-2">
          <Controller
            name="caseManager.connect.id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="w-4/5">
                <Select
                  onValueChange={(val) => {
                    console.log("CaseManagerForm: Selected value:", val);
                    onChange(val ? parseInt(val, 10) : null);
                  }}
                  value={value?.toString() || ""}
                >
                  <SelectTrigger
                    id="caseManager-connect-id"
                    className="rounded-lg border-gray-300 w-full text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 py-2 h-10 flex items-center"
                  >
                    <SelectValue placeholder="Select a case manager" className="ml-2" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
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
              </div>
            )}
          />
          <Button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 min-w-[100px] shadow-md transition-all h-10 flex items-center justify-center"
          >
            {showCreateForm ? "Cancel" : "Create New"}
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mt-2 space-y-2 border border-gray-300 p-4 rounded-lg shadow-sm">
          <Label className="text-sm font-semibold text-gray-600 mb-1 hover:text-blue-500 transition-colors">
            Create New Case Manager
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="caseManager.create.name"
              control={control}
              defaultValue=""
              rules={{ required: "Case Manager Name is required" }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="caseManager-create-name" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
                    Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="caseManager-create-name"
                      value={value || ""}
                      onChange={onChange}
                      placeholder="Type case manager name"
                      className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                    />
                    <Icon
                      icon="mdi:user"
                      className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600"
                    />
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
                <div className="flex flex-col gap-1">
                  <Label htmlFor="caseManager-create-email" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="caseManager-create-email"
                      type="email"
                      value={value || ""}
                      onChange={onChange}
                      placeholder="Type email"
                      className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                    />
                    <Icon
                      icon="ic:outline-email"
                      className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600"
                    />
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
                <div className="flex flex-col gap-1">
                  <Label htmlFor="caseManager-create-phone" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
                    Phone
                  </Label>
                  <div className="relative">
                    <Input
                      id="caseManager-create-phone"
                      type="tel"
                      value={value || ""}
                      onChange={onChange}
                      placeholder="Type phone number"
                      className="rounded-lg border-gray-300 w-full pl-10 pr-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                    />
                    <Icon
                      icon="mdi:phone"
                      className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600"
                    />
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
                <div className="flex flex-col gap-1">
                  <Label htmlFor="caseManager-create-agencyId" className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
                    Agency
                  </Label>
                  <Select
                    onValueChange={(val) => {
                      console.log("Selected agencyId:", val);
                      onChange(val ? parseInt(val, 10) : null);
                    }}
                    value={value?.toString() || ""}
                  >
                    <SelectTrigger
                      id="caseManager-create-agencyId"
                      className="rounded-lg border-gray-300 w-full py-2 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400"
                    >
                      <SelectValue placeholder="Select agency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
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
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={handleCreateCaseManager}
              className="rounded-lg bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 shadow-md transition-all"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}