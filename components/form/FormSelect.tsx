// components/form/FormSelect.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import { ParticipantFormData } from "@/lib/schemas/participantSchema";

interface FormSelectProps {
  label: string;
  name: keyof ParticipantFormData;
  errors: FieldErrors<ParticipantFormData>;
  options: { value: string; label: string }[];
  control?: any; // Añadido para usar con Controller
}

export function FormSelect({ label, name, errors, options, control }: FormSelectProps) {
  const { control: formControl } = useFormContext() || { control }; // Usa el control pasado o el del contexto

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control || formControl}
        render={({ field: { onChange, value, ref } }) => (
          <Select onValueChange={onChange} value={value?.toString()}>
            <SelectTrigger className="rounded-none border-default-300">
              <SelectValue placeholder={`Select ${label}`} ref={ref} />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-none">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
}