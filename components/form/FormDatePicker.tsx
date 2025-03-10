// components/form/FormDatePicker.tsx
import React from "react";
import { Controller, useFormContext, FieldErrors } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { ParticipantFormData } from "@/lib/schemas/participantSchema";

interface FormDatePickerProps {
  label: string;
  name: keyof ParticipantFormData;
  errors: FieldErrors<ParticipantFormData>;
  control?: any; // Añadido para usar con Controller
}

export function FormDatePicker({ label, name, errors, control }: FormDatePickerProps) {
  const { control: formControl } = useFormContext() || { control }; // Usa el control pasado o el del contexto

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control || formControl}
        render={({ field: { onChange, value, ref } }) => (
          <div className="relative">
            <Flatpickr
              className="w-full border border-default-300 bg-background text-default-500 focus:outline-none h-10 rounded-none px-2 placeholder:text-default-500"
              placeholder={label}
              value={value ? new Date(value) : undefined}
              onChange={([date]) => onChange(date.toISOString().split("T")[0])}
              ref={ref}
            />
            <Icon
              icon="heroicons:calendar-days"
              className="w-5 h-5 absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-default-400"
            />
          </div>
        )}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}