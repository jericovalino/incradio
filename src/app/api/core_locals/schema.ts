import { z } from 'zod';

export const LocalPayloadSchema = z.object({
  name: z.string(),
  code: z.string(),
});
export type LocalPayload = z.infer<typeof LocalPayloadSchema>;
