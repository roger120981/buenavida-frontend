// components/form/FormDatePicker.tsx
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { FieldErrors, Control } from "react-hook-form";

interface FormDatePickerProps {
  label: string;
  name: string;
  errors: FieldErrors;
  control: Control<any>;
  className?: string; // Añadimos el prop className
}

export function FormDatePicker({ label, name, errors, control, className }: FormDatePickerProps) {
  const isRequired = label.includes("*");
  const cleanLabel = label.replace(" *", "");

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-600 mb-1 hover:text-blue-500 transition-colors flex items-center">
        {cleanLabel}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Input
              type="date"
              value={value || ""}
              onChange={onChange}
              placeholder={cleanLabel}
              className="rounded-lg border-gray-300 w-full pl-12 pr-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 placeholder:text-sm"
            />
          )}
        />
        <Icon
          icon="mdi:calendar"
          className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600"
        />
      </div>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
}