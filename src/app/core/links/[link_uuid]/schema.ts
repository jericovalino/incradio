import { z } from 'zod';

const RankSchema = z.object({
  local_name: z.string(),
  local_code: z.string(),
  click_count: z.number(),
});

export type Rank = z.infer<typeof RankSchema>;
