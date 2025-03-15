// CreateParticipantPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { CaseManagerForm } from "@/components/form/CaseManagerForm";
import { CaregiverAssignment } from "@/components/form/CaregiverAssignment";
import { useCreateParticipant } from "@/lib/api/participants";
import { useAssignCaregiver } from "@/lib/api/caregivers";
import { ParticipantFormData, participantSchema } from "@/lib/schemas/participantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateParticipantDto } from "@/lib/types/participants";
import { CaregiverAssignment as CaregiverAssignmentType } from "@/lib/types/caregivers";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

// Definimos un tipo para la respuesta de error del backend
interface ErrorResponse {
  message?: string;
}

export default function CreateParticipantPage({ params }: { params: { lng: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      medicaidId: "",
      dob: "2023-01-01",
      gender: undefined,
      isActive: true,
      hdm: false,
      adhc: false,
      location: "",
      community: "",
      address: "",
      primaryPhone: "",
      secondaryPhone: "",
      locStartDate: "2023-01-01",
      locEndDate: "2023-01-01",
      pocStartDate: "2023-01-01",
      pocEndDate: "2023-01-01",
      units: 0,
      hours: 0,
      caseManager: {
        connect: { id: undefined },
        create: undefined,
      },
      caregiverAssignments: [], // Mantenerlo para el frontend, pero no enviarlo al backend
    },
    shouldFocusError: false,
  });

  const { handleSubmit, control, formState: { errors }, watch, trigger, getValues } = form;
  const createParticipantMutation = useCreateParticipant();
  const assignCaregiverMutation = useAssignCaregiver();

  const caseManagerValue = watch("caseManager");
  console.log("Current caseManager value:", caseManagerValue);

  const onSubmit = async (data: ParticipantFormData) => {
    console.log("Submitting participant data:", data);
    setIsLoading(true);
    try {
      await trigger("caseManager.connect.id");
      const transformedData: CreateParticipantDto = {
        name: data.name,
        medicaidId: data.medicaidId,
        dob: data.dob,
        gender: data.gender,
        isActive: data.isActive,
        hdm: data.hdm,
        adhc: data.adhc,
        location: data.location,
        community: data.community,
        address: data.address,
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone,
        locStartDate: data.locStartDate,
        locEndDate: data.locEndDate,
        pocStartDate: data.pocStartDate,
        pocEndDate: data.pocEndDate,
        units: data.units ?? 0,
        hours: data.hours ?? 0,
        caseManager: {
          create: undefined,
          connect: data.caseManager?.connect?.id
            ? { id: Number(data.caseManager.connect.id) }
            : undefined,
        },
      }; // MODIFICACIÓN: Excluimos caregiverAssignments del transformedData para evitar que se envíe al backend

      console.log("Transformed data for participant:", transformedData);

      // Crear el participante
      const createdParticipant = await createParticipantMutation.mutateAsync(transformedData);

      // Procesar las asignaciones de caregivers después de crear el participante
      const caregiverAssignments: CaregiverAssignmentType[] = getValues("caregiverAssignments") || [];
      for (const assignment of caregiverAssignments) {
        await assignCaregiverMutation.mutateAsync({
          participantId: createdParticipant.id,
          caregiverId: assignment.caregiverId,
        });
      }

      toast({
        title: "Success",
        description: "Participant created successfully!",
        color: "success",
      });
      router.push(`/participants`);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error creating participant:", axiosError.response?.data || axiosError.message);
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || axiosError.message || "Failed to create participant. Please ensure the name is unique.",
        color: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
      const caseManagerError = errors.caseManager;
      let errorMessage = "Please fix the errors in the form before submitting.";
      if (caseManagerError) {
        if (caseManagerError.connect && caseManagerError.connect.id) {
          errorMessage = `Invalid case manager ID: ${caseManagerError.connect.id.message}`;
        } else if (caseManagerError.connect) {
          errorMessage = "Please select a valid case manager.";
        } else if (caseManagerError.create) {
          errorMessage = `Case manager creation error: ${
            caseManagerError.create.name?.message || caseManagerError.create.agencyId?.message || "Invalid details"
          }`;
        }
      }
      toast({
        title: "Form Errors",
        description: errorMessage,
        color: "destructive",
      });
    }
  }, [errors]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md border-l-2 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Participant</h1>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Datos Personales */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Name *"
                  name="name"
                  register={form.register}
                  errors={errors}
                  icon="mdi:user"
                  placeholder="Type name"
                />
                <FormInput
                  label="Medicaid ID *"
                  name="medicaidId"
                  register={form.register}
                  errors={errors}
                  icon="mdi:card-account-details-outline"
                  placeholder="Type Medicaid ID"
                />
                <FormDatePicker
                  label="Date of Birth *"
                  name="dob"
                  errors={errors}
                  control={control}
                />
                <FormSelect
                  label="Gender *"
                  name="gender"
                  errors={errors}
                  options={[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                    { value: "O", label: "Other" },
                  ]}
                  control={control}
                />
                <div className="col-span-2 flex gap-6">
                  <FormCheckbox label="Is Active" name="isActive" errors={errors} control={control} />
                  <FormCheckbox label="HDM" name="hdm" errors={errors} control={control} />
                  <FormCheckbox label="ADHC" name="adhc" errors={errors} control={control} />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Location *"
                  name="location"
                  register={form.register}
                  errors={errors}
                  icon="mdi:map-marker"
                  placeholder="Type location"
                />
                <FormInput
                  label="Community *"
                  name="community"
                  register={form.register}
                  errors={errors}
                  icon="mdi:account-group"
                  placeholder="Type community"
                />
                <FormInput
                  label="Address *"
                  name="address"
                  register={form.register}
                  errors={errors}
                  icon="mdi:home"
                  placeholder="Type address"
                  className="col-span-2"
                />
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Contact</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Primary Phone *"
                  name="primaryPhone"
                  register={form.register}
                  errors={errors}
                  icon="mdi:phone"
                  placeholder="Type primary phone"
                />
                <FormInput
                  label="Secondary Phone"
                  name="secondaryPhone"
                  register={form.register}
                  errors={errors}
                  icon="mdi:phone-plus"
                  placeholder="Type secondary phone"
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormDatePicker
                  label="Location Start Date *"
                  name="locStartDate"
                  errors={errors}
                  control={control}
                />
                <FormDatePicker
                  label="Location End Date *"
                  name="locEndDate"
                  errors={errors}
                  control={control}
                />
                <FormDatePicker
                  label="POC Start Date *"
                  name="pocStartDate"
                  errors={errors}
                  control={control}
                />
                <FormDatePicker
                  label="POC End Date *"
                  name="pocEndDate"
                  errors={errors}
                  control={control}
                />
              </div>
            </div>

            {/* Unidades y Horas */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Units & Hours</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Units"
                  name="units"
                  register={form.register}
                  errors={errors}
                  icon="mdi:numeric"
                  type="number"
                  placeholder="Type units"
                />
                <FormInput
                  label="Hours"
                  name="hours"
                  register={form.register}
                  errors={errors}
                  icon="mdi:clock"
                  type="number"
                  placeholder="Type hours"
                />
              </div>
            </div>

            {/* MODIFICACIÓN: Añadida sección para Caregiver Assignment */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Caregiver Assignment</h2>
              <div className="col-span-2 flex items-center justify-between gap-2">
                <CaregiverAssignment />
              </div>
            </div>

            {/* Case Manager */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-600 mb-2 border-b border-gray-300 pb-1">Case Manager</h2>
              <div className="col-span-2 flex items-center justify-between gap-2">
                <CaseManagerForm control={control} />
                <Button
                  type="submit"
                  className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 py-2 px-4 min-w-[120px] shadow-lg transition-all h-10 flex items-center justify-center font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving" : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}