// lib/schemas/participantSchema.ts
import { z } from "zod";
import { CaregiverAssignment } from "@/lib/types/caregivers"; // MODIFICACIÓN: Añadida importación del tipo CaregiverAssignment

export const caseManagerSchema = z.object({
  connect: z.object({ id: z.number() }).optional(),
  create: z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email").optional(),
      phone: z.string().optional(),
      agencyId: z.number().min(1, "Agency is required"),
    })
    .optional(),
});

export const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
  gender: z.enum(["M", "F", "O"], { message: "Gender must be M, F, or O" }),
  medicaidId: z.string().min(1, "Medicaid ID is required"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  location: z.string().min(1, "Location is required"),
  community: z.string().min(1, "Community is required"),
  address: z.string().min(1, "Address is required"),
  primaryPhone: z.string().min(1, "Primary Phone is required"),
  secondaryPhone: z.string().optional(),
  locStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  locEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  pocStartDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  pocEndDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  units: z.number().optional(),
  hours: z.number().optional(),
  hdm: z.boolean().optional(),
  adhc: z.boolean().optional(),
  caseManager: caseManagerSchema,
  caregiverAssignments: z.array(z.object({ caregiverId: z.number(), caregiverName: z.string() })).optional(), // MODIFICACIÓN: Añadido el campo caregiverAssignments al esquema
});

export const updateParticipantSchema = participantSchema.partial().extend({
  id: z.number().optional(),
});

export type ParticipantFormData = z.infer<typeof participantSchema>;
export type UpdateParticipantFormData = z.infer<typeof updateParticipantSchema>;