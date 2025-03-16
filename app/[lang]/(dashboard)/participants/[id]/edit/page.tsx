// app/[lang]/participants/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/FormInput";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormSelect } from "@/components/form/FormSelect";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { CaseManagerForm } from "@/components/form/CaseManagerForm";
import { CaregiverAssignment } from "@/components/form/CaregiverAssignment";
import { useUpdateParticipant, useParticipantById } from "@/lib/api/participants";
import { useAssignCaregiver, useUnassignCaregiver } from "@/lib/api/caregivers";
import { UpdateParticipantFormData, participantSchema } from "@/lib/schemas/participantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { CaregiverAssignment as CaregiverAssignmentType } from "@/lib/types/caregivers";
import { UpdateParticipantDto } from "@/lib/types/participants";

interface ErrorResponse {
  message?: string;
}

export default function EditParticipantPage({ params: { lang, id } }: { params: { lang: string; id: string } }) {
  const router = useRouter();
  const participantId = parseInt(id, 10);
  const [isLoading, setIsLoading] = useState(false);
  const formStateRef = useRef<UpdateParticipantFormData | null>(null); // Estado persistente

  const { data: participant, isLoading: isParticipantLoading } = useParticipantById(participantId);
  const updateParticipantMutation = useUpdateParticipant();
  const assignCaregiverMutation = useAssignCaregiver();
  const unassignCaregiverMutation = useUnassignCaregiver();

  const form = useForm<UpdateParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      medicaidId: "",
      dob: "",
      gender: undefined,
      isActive: true,
      hdm: false,
      adhc: false,
      location: "",
      community: "",
      address: "",
      primaryPhone: "",
      secondaryPhone: "",
      locStartDate: "",
      locEndDate: "",
      pocStartDate: "",
      pocEndDate: "",
      units: 0,
      hours: 0,
      caseManager: {
        connect: { id: undefined },
        create: undefined,
      },
      caregiverAssignments: [],
    },
    mode: "onSubmit", // Validación solo al enviar
  });

  const { handleSubmit, control, formState: { errors }, trigger, reset, setValue, getValues } = form;

  // Cargar y restaurar datos del participante
  useEffect(() => {
    if (participant && !isParticipantLoading) {
      console.log("Participant data on load:", participant);
      console.log("Participant gender on load:", participant?.gender);
      console.log("Participant cmID on load:", (participant as any)?.cmID || participant?.caseManager?.id);

      // Restaurar estado previo si existe, o usar datos del backend
      const initialValues: UpdateParticipantFormData = {
        name: participant?.name || formStateRef.current?.name || "",
        medicaidId: participant?.medicaidId || formStateRef.current?.medicaidId || "",
        dob: participant?.dob ? participant.dob.split("T")[0] : formStateRef.current?.dob || "",
        gender: ["M", "F", "O"].includes(participant?.gender ?? "")
          ? (participant?.gender as "M" | "F" | "O")
          : formStateRef.current?.gender || undefined,
        isActive: participant?.isActive ?? formStateRef.current?.isActive ?? true,
        hdm: participant?.hdm ?? formStateRef.current?.hdm ?? false,
        adhc: participant?.adhc ?? formStateRef.current?.adhc ?? false,
        location: participant?.location || formStateRef.current?.location || "",
        community: participant?.community || formStateRef.current?.community || "",
        address: participant?.address || formStateRef.current?.address || "",
        primaryPhone: participant?.primaryPhone || formStateRef.current?.primaryPhone || "",
        secondaryPhone: participant?.secondaryPhone || formStateRef.current?.secondaryPhone || "",
        locStartDate: participant?.locStartDate ? participant.locStartDate.split("T")[0] : formStateRef.current?.locStartDate || "",
        locEndDate: participant?.locEndDate ? participant.locEndDate.split("T")[0] : formStateRef.current?.locEndDate || "",
        pocStartDate: participant?.pocStartDate ? participant.pocStartDate.split("T")[0] : formStateRef.current?.pocStartDate || "",
        pocEndDate: participant?.pocEndDate ? participant.pocEndDate.split("T")[0] : formStateRef.current?.pocEndDate || "",
        units: participant?.units ?? formStateRef.current?.units ?? 0,
        hours: participant?.hours ?? formStateRef.current?.hours ?? 0,
        caseManager: {
          connect: { id: (participant as any)?.cmID || participant?.caseManager?.id || formStateRef.current?.caseManager?.connect?.id || null },
          create: undefined,
        },
        caregiverAssignments: participant?.caregivers?.map((assignment) => ({
          caregiverId: assignment.caregiverId,
          caregiverName: assignment.caregiver.name,
        })) || formStateRef.current?.caregiverAssignments || [],
      };

      reset(initialValues);

      // Forzar la selección de gender
      if (["M", "F", "O"].includes(participant?.gender ?? "")) {
        setValue("gender", participant?.gender as "M" | "F" | "O", { shouldValidate: false });
      } else if (!participant?.gender) {
        console.log("Gender not present in backend response, setting default to 'F'");
        setValue("gender", "F", { shouldValidate: false });
      }

      // Depuración y sincronización de caregivers
      console.log("Caregiver assignments on load:", getValues("caregiverAssignments"));
      if (participant?.caregivers && getValues("caregiverAssignments")?.length === 0) {
        setValue(
          "caregiverAssignments",
          participant.caregivers.map((assignment) => ({
            caregiverId: assignment.caregiverId,
            caregiverName: assignment.caregiver.name,
          })),
          { shouldValidate: false }
        );
      }

      // Forzar la selección de caseManager
      const caseManagerId = (participant as any)?.cmID || participant?.caseManager?.id;
      if (caseManagerId !== undefined && caseManagerId !== null) {
        setValue("caseManager.connect.id", caseManagerId, { shouldValidate: false });
      } else {
        console.log("cmID not present in backend response, setting default to null");
        setValue("caseManager.connect.id", null, { shouldValidate: false });
      }

      // Mostrar notificación si el gender no es válido
      if (participant?.gender && !["M", "F", "O"].includes(participant.gender)) {
        toast({
          title: "Invalid Gender Value",
          description: `The gender value is invalid (received '${participant.gender}'). Please select M, F, or O.`,
          color: "destructive",
        });
      }

      // Guardar el estado inicial en el ref
      formStateRef.current = initialValues;
    }
  }, [participant, isParticipantLoading, reset, setValue, getValues]);

  // Restaurar notificaciones de errores al cargar
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0 && !isParticipantLoading) {
      const errorMessages = Object.values(errors)
        .map((error) => error?.message)
        .filter((msg) => msg)
        .join(", ");
      toast({
        title: "Validation Error on Load",
        description: errorMessages || "Some fields failed validation on load.",
        color: "destructive",
      });
    }
  }, [errors, isParticipantLoading]);

  // Depuración adicional para confirmar los valores aplicados
  useEffect(() => {
    if (!isParticipantLoading) {
      console.log("Current form values after load:");
      console.log("Gender:", getValues("gender"));
      console.log("Case Manager ID:", getValues("caseManager.connect.id"));
      console.log("Caregiver Assignments:", getValues("caregiverAssignments"));
    }
  }, [isParticipantLoading, getValues]);

  const onSubmit = async (data: UpdateParticipantFormData) => {
    console.log("Submitting updated participant data:", data);
    setIsLoading(true);
    try {
      // Validar el formulario antes de enviar
      const isFormValid = await trigger();
      if (!isFormValid) {
        const errorMessages = Object.values(errors)
          .map((error) => error?.message)
          .filter((msg) => msg)
          .join(", ");
        toast({
          title: "Validation Error",
          description: errorMessages || "Please correct the errors in the form.",
          color: "destructive",
        });
        return;
      }

      const transformedData: UpdateParticipantDto = {
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
        units: data.units,
        hours: data.hours,
        caseManager: {
          connect: data.caseManager?.connect?.id
            ? { id: Number(data.caseManager.connect.id) }
            : undefined,
          create: data.caseManager?.create
            ? {
                name: data.caseManager.create.name || "",
                email: data.caseManager.create.email ?? "",
                phone: data.caseManager.create.phone ?? "",
                agencyId: data.caseManager.create.agencyId ?? 0,
              }
            : undefined,
        },
      }; // Excluimos caregiverAssignments del transformedData

      console.log("Transformed data for participant update:", transformedData);

      // Actualizar el participante
      await updateParticipantMutation.mutateAsync({ id: participantId, data: transformedData });

      // Obtener las asignaciones actuales y las nuevas
      const currentAssignments = participant?.caregivers?.map((a) => a.caregiverId) || [];
      const newAssignments = getValues("caregiverAssignments")?.map((a: CaregiverAssignmentType) => a.caregiverId) || [];

      // Asignar nuevos caregivers
      const caregiversToAssign = newAssignments.filter((id: number) => !currentAssignments.includes(id));
      for (const caregiverId of caregiversToAssign) {
        await assignCaregiverMutation.mutateAsync({
          participantId,
          caregiverId,
        });
      }

      // Desvincular caregivers eliminados
      const caregiversToUnassign = currentAssignments.filter((id: number) => !newAssignments.includes(id));
      for (const caregiverId of caregiversToUnassign) {
        await unassignCaregiverMutation.mutateAsync({
          participantId,
          caregiverId,
        });
      }

      toast({
        title: "Success",
        description: "Participant updated successfully!",
        color: "success",
      });
      router.push(`/${lang}/participants`);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error updating participant:", axiosError.response?.data || axiosError.message);
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || axiosError.message || "Failed to update participant.",
        color: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isParticipantLoading) return <div>Loading participant...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md border-l-2 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Participant</h1>
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

            {/* Caregiver Assignment */}
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