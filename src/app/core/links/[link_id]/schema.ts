import { z } from 'zod';

const RankSchema = z.object({
  locale_name: z.string(),
  locale_code: z.string(),
  click_count: z.number(),
});

export type Rank = z.infer<typeof RankSchema>;
