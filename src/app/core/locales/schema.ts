import { InferSelectModel } from 'drizzle-orm';

import { LocaleTable } from '@/drizzle/schema';

export type Locale = InferSelectModel<typeof LocaleTable>;
