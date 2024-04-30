import { InferSelectModel } from 'drizzle-orm';

import { LocalTable } from '@/drizzle/schema';

export type Local = InferSelectModel<typeof LocalTable>;
