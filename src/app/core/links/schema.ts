import { InferSelectModel } from 'drizzle-orm';

import { LinkTable } from '@/drizzle/schema';

export type Link = InferSelectModel<typeof LinkTable>;
export type ClickHistory = {
  created_at: string;
  local_name: string;
};
