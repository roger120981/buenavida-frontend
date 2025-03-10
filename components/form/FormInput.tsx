// components/form/FormInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ParticipantFormData } from "@/lib/schemas/participantSchema";
import { Icon } from "@iconify/react";

interface FormInputProps {
  label: string;
  name: keyof ParticipantFormData;
  register: UseFormRegister<ParticipantFormData>;
  errors: FieldErrors<ParticipantFormData>;
  icon: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormInput({ label, name, register, errors, icon, type = "text", placeholder, disabled }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          type={type}
          id={name}
          placeholder={placeholder}
          {...register(name, { valueAsNumber: type === "number" })}
          disabled={disabled}
          className="rounded-none border-default-300"
        />
        <Icon icon={icon} className="w-5 h-5 absolute top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-default-400" />
      </div>
      {errors[name as keyof ParticipantFormData] && (
        <p className="text-sm text-red-500">{errors[name as keyof ParticipantFormData]?.message}</p>
      )}
    </div>
  );
}