// components/form/FormSelect.tsx
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FieldErrors, Control } from "react-hook-form";

interface FormSelectProps {
  label: string;
  name: string;
  errors: FieldErrors;
  options: { value: string; label: string }[];
  control: Control<any>;
  className?: string; // Añadimos el prop className
}

export function FormSelect({ label, name, errors, options, control, className }: FormSelectProps) {
  const isRequired = label.includes("*");
  const cleanLabel = label.replace(" *", "");

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-600 mb-1 hover:text-blue-500 transition-colors flex items-center">
        {cleanLabel}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger
              id={name}
              className="rounded-lg border-gray-300 w-full py-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 placeholder:text-sm"
            >
              <SelectValue placeholder={cleanLabel} />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-none">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
}