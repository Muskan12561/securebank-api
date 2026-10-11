import { z } from "zod";

export const moneySchema = z.object({
  amount: z.coerce.number().finite().positive().max(10000000),
  description: z.string().trim().max(200).optional()
});
