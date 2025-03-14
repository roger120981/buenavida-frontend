// components/form/FormInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  icon: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function FormInput({ label, name, register, errors, icon, type = "text", placeholder, className }: FormInputProps) {
  const isRequired = label.includes("*");
  const cleanLabel = label.replace(" *", "");

  return (
    <div className={`flex flex-col gap-1 ${className || ""}`}>
      <Label htmlFor={name} className="text-sm font-semibold text-gray-600 mb-1 hover:text-blue-500 transition-colors flex items-center">
        {cleanLabel}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder || `Type ${cleanLabel.toLowerCase()}`}
          {...register(name, {
            setValueAs: (value: string) => {
              if (type === "number") {
                return value ? parseInt(value, 10) : 0;
              }
              return value;
            },
          })}
          className="rounded-lg border-gray-300 w-full pl-12 pr-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm transition-all placeholder:text-gray-400 placeholder:text-sm"
        />
        <Icon
          icon={icon}
          className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-gray-600"
        />
      </div>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
}