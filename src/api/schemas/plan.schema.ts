import { z } from "zod";

// Base schema - Plan entity
export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  price: z.number(), // in cents
  interval: z.enum(["month", "year"]),
  currency: z.string(),
});

// Response schema - List of plans
export const PlansResponseSchema = z.object({
  plans: z.array(PlanSchema),
});

// Type exports
export type Plan = z.infer<typeof PlanSchema>;
export type PlansResponse = z.infer<typeof PlansResponseSchema>;
