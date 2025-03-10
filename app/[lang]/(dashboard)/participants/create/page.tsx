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

export default function CreateParticipantPage({ params: { lng } }: { params: { lng: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      medicaidId: "",
      dob: "",
      gender: undefined,
      isActive: true,
      hdm: false,
      adhc: false,
      caseManager: {
        connect: { id: undefined },
        create: { name: "", email: "", phone: "", agencyId: undefined },
      },
    },
  });

  const { handleSubmit, control, formState: { errors } } = form;
  const createParticipantMutation = useCreateParticipant();

  const onSubmit = async (data: ParticipantFormData) => {
    setIsLoading(true);
    try {
      const transformedData: CreateParticipantDto = {
        ...data,
        caseManager: {
          ...data.caseManager,
          create: data.caseManager?.create
            ? {
                name: data.caseManager.create.name,
                email: data.caseManager.create.email || "",
                phone: data.caseManager.create.phone || "",
                agencyId: data.caseManager.create.agencyId
                  ? Number(data.caseManager.create.agencyId)
                  : 0,
              }
            : undefined,
        },
      };

      await createParticipantMutation.mutateAsync(transformedData);
      router.push(`/${lng}/(dashboard)/participants`);
      router.refresh();
    } catch (error) {
      console.error("Error creating participant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
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