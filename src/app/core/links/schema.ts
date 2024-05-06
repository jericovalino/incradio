import { InferSelectModel } from 'drizzle-orm';

import { LinkTable } from '@/drizzle/schema';

export type Link = InferSelectModel<typeof LinkTable>;
export type ClickHistory = {
  created_at: string;
  locale_name: string;
  ip: string;
};
