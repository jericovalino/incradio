import { z } from 'zod';

const LocalSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  district_id: z.string(),
});

export type Local = z.infer<typeof LocalSchema>;
