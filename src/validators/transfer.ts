import { z } from "zod";

export const transferSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountNumber: z.string().regex(/^\d{10}$/),
  amount: z.coerce.number().finite().positive().max(10000000),
  description: z.string().trim().max(200).optional()
});
