import { z } from 'zod';

export const LocalePayloadSchema = z.object({
  name: z.string(),
  code: z.string(),
});
export type LocalePayload = z.infer<typeof LocalePayloadSchema>;
