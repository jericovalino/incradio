import { z } from 'zod';

const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
  district: z.object({ id: z.string(), name: z.string(), code: z.string() }),
});

export type Profile = z.infer<typeof ProfileSchema>;
