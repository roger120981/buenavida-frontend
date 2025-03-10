// components/form/FormCheckbox.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import { ParticipantFormData } from "@/lib/schemas/participantSchema";

interface FormCheckboxProps {
  label: string;
  name: keyof ParticipantFormData;
  errors: FieldErrors<ParticipantFormData>;
  control?: any; // Añadido para usar con Controller
}

export function FormCheckbox({ label, name, errors, control }: FormCheckboxProps) {
  const { control: formControl } = useFormContext() || { control }; // Usa el control pasado o el del contexto

  return (
    <div className="flex items-center gap-1.5">
      <Controller
        name={name}
        control={control || formControl}
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            id={name}
            checked={value}
            onCheckedChange={onChange}
            className="border-default-300 rounded-none"
          />
        )}
      />
      <Label htmlFor={name} className="text-base text-muted-foreground font-normal">
        {label}
      </Label>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  );
}