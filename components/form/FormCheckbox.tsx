// components/form/FormCheckbox.tsx
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldErrors, Control } from "react-hook-form";

interface FormCheckboxProps {
  label: string;
  name: string;
  errors: FieldErrors;
  control: Control<any>;
}

export function FormCheckbox({ label, name, errors, control }: FormCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={value}
            onCheckedChange={onChange}
            className="rounded focus:ring-2 focus:ring-blue-300 border-gray-300"
          />
        )}
      />
      <Label className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
        {label}
      </Label>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
}