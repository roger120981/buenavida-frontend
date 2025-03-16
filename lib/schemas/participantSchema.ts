// lib/schemas/participantSchema.ts
import { z } from "zod";
import { CaregiverAssignment } from "@/lib/types/caregivers";

// Definición del esquema para la creación de un Case Manager
const createCaseManagerSchema = z.object({
  name: z.string().min(1, "Case Manager Name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  agencyId: z.number().min(1, "Agency is required"),
});

// Definición del esquema para conectar o crear un Case Manager
const caseManagerSchema = z.object({
  connect: z.object({
    id: z.number().nullable(), // Permitir null para id
  }).optional(),
  create: createCaseManagerSchema.optional(),
});

// Definición del esquema para los Caregiver Assignments
const caregiverAssignmentSchema = z.array(
  z.object({
    caregiverId: z.number(),
    caregiverName: z.string(),
  })
);

// Definición del esquema principal para UpdateParticipantFormData
export const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  medicaidId: z.string().min(1, "Medicaid ID is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["M", "F", "O"]).optional(),
  isActive: z.boolean(),
  hdm: z.boolean(),
  adhc: z.boolean(),
  location: z.string().min(1, "Location is required"),
  community: z.string().min(1, "Community is required"),
  address: z.string().min(1, "Address is required"),
  primaryPhone: z.string().min(1, "Primary Phone is required"),
  secondaryPhone: z.string().optional(),
  locStartDate: z.string().min(1, "Location Start Date is required"),
  locEndDate: z.string().min(1, "Location End Date is required"),
  pocStartDate: z.string().min(1, "POC Start Date is required"),
  pocEndDate: z.string().min(1, "POC End Date is required"),
  units: z.number(),
  hours: z.number(),
  caseManager: caseManagerSchema,
  caregiverAssignments: caregiverAssignmentSchema,
});

export type UpdateParticipantFormData = z.infer<typeof participantSchema>;