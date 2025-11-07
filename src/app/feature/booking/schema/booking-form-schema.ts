
import { z } from "zod"

export const bookingFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  personName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  organizations: z.string().min(1, { message: "Please select an organization." }),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,}$/, { message: "Please enter a valid phone number." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  donate: z.number().min(0, { message: "Donation amount cannot be negative." }),
  attending: z.enum(["yes", "no", "high-chance", "online"], {
    message: "Please select an attendance option.",
  }),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

