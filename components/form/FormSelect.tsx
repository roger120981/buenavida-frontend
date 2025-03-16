// components/form/FormSelect.tsx
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  control: any;
  errors: any;
}

export function FormSelect({ label, name, options, control, errors }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name} className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div>
            <Select onValueChange={onChange} value={value || ""}>
              <SelectTrigger
                id={name}
                className="rounded-lg border-gray-300 w-full text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 py-2 h-10 flex items-center"
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="rounded-none">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  );
}