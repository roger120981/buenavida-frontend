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
import { ParticipantFormData, participantSchema } from "@/lib/schemas/participantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateParticipantDto } from "@/lib/types/participants";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

// Definimos un tipo para la respuesta de error del backend
interface ErrorResponse {
  message?: string;
}

export default function CreateParticipantPage({ params: { lng } }: { params: { lng: string } }) {
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
    },
    shouldFocusError: false,
  });

  const { handleSubmit, control, formState: { errors }, watch, trigger } = form;
  const createParticipantMutation = useCreateParticipant();

  const caseManagerValue = watch("caseManager");
  console.log("Current caseManager value:", caseManagerValue);

  const onSubmit = async (data: ParticipantFormData) => {
    console.log("Submitting participant data:", data);
    setIsLoading(true);
    try {
      await trigger("caseManager.connect.id");
      const transformedData: CreateParticipantDto = {
        ...data,
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
      };

      console.log("Transformed data for participant:", transformedData);

      if (!transformedData.caseManager.connect) {
        throw new Error("A case manager must be selected.");
      }

      await createParticipantMutation.mutateAsync(transformedData);
      toast({
        title: "Success",
        description: "Participant created successfully!",
        color: "success",
      });
      router.push(`/${lng}/(dashboard)/participants`);
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error creating participant:", axiosError.response?.data || axiosError.message);
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || axiosError.message || "Failed to create participant.",
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
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-6 text-gray-700">Create Participant</h1>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormInput
                label="Name"
                name="name"
                register={form.register}
                errors={errors}
                icon="mdi:user"
              />
              <FormInput
                label="Medicaid ID"
                name="medicaidId"
                register={form.register}
                errors={errors}
                icon="ic:outline-id"
              />
              <FormDatePicker
                label="Date of Birth"
                name="dob"
                errors={errors}
                control={control}
              />
              <FormSelect
                label="Gender"
                name="gender"
                errors={errors}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                  { value: "O", label: "Other" },
                ]}
                control={control}
              />
              <FormCheckbox
                label="Is Active"
                name="isActive"
                errors={errors}
                control={control}
              />
              <FormCheckbox
                label="HDM"
                name="hdm"
                errors={errors}
                control={control}
              />
              <FormCheckbox
                label="ADHC"
                name="adhc"
                errors={errors}
                control={control}
              />
              <FormInput
                label="Location"
                name="location"
                register={form.register}
                errors={errors}
                icon="mdi:map-marker"
              />
              <FormInput
                label="Community"
                name="community"
                register={form.register}
                errors={errors}
                icon="mdi:account-group"
              />
              <FormInput
                label="Address"
                name="address"
                register={form.register}
                errors={errors}
                icon="mdi:home"
              />
              <FormInput
                label="Primary Phone"
                name="primaryPhone"
                register={form.register}
                errors={errors}
                icon="mdi:phone"
              />
              <FormInput
                label="Secondary Phone"
                name="secondaryPhone"
                register={form.register}
                errors={errors}
                icon="mdi:phone-plus"
              />
              <FormDatePicker
                label="Location Start Date"
                name="locStartDate"
                errors={errors}
                control={control}
              />
              <FormDatePicker
                label="Location End Date"
                name="locEndDate"
                errors={errors}
                control={control}
              />
              <FormDatePicker
                label="POC Start Date"
                name="pocStartDate"
                errors={errors}
                control={control}
              />
              <FormDatePicker
                label="POC End Date"
                name="pocEndDate"
                errors={errors}
                control={control}
              />
              <FormInput
                label="Units"
                name="units"
                register={form.register}
                errors={errors}
                icon="mdi:numeric"
                type="number"
              />
              <FormInput
                label="Hours"
                name="hours"
                register={form.register}
                errors={errors}
                icon="mdi:clock"
                type="number"
              />
              <CaseManagerForm control={control} />
              <CaregiverAssignment participantId={undefined} />
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="w-32 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving" : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}