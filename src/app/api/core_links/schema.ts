import { z } from 'zod';

export const LinkPayloadSchema = z.object({
  title: z.string(),
  url: z.string(),
});
export type LinkPayload = z.infer<typeof LinkPayloadSchema>;
