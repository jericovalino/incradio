import { relations } from 'drizzle-orm';
import {
  cidr,
  uuid,
  json,
  index,
  varchar,
  boolean,
  pgTable,
  timestamp,
} from 'drizzle-orm/pg-core';

export const DistrictTable = pgTable('district', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  name: varchar('name').notNull(),
  code: varchar('code').notNull().unique(),
});

export const UserTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  district_id: uuid('district_id')
    .references(() => DistrictTable.id)
    .notNull(),
});

export const LocaleTable = pgTable('locale', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  name: varchar('name').notNull(),
  code: varchar('code').notNull(),
  district_id: uuid('district_id')
    .references(() => DistrictTable.id)
    .notNull(),
});

export const LinkTable = pgTable('link', {
  id: uuid('id').defaultRandom().unique(),
  title: varchar('title').notNull(),
  code: varchar('code').unique().primaryKey(),
  created_at: timestamp('created_at').defaultNow(),
  url: varchar('url').notNull(),
  district_id: uuid('district_id')
    .references(() => DistrictTable.id)
    .notNull(),
  status: varchar('status', {
    enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
  })
    .default('ACTIVE')
    .notNull(),
});

export const ClickTable = pgTable(
  'click',
  {
    id: uuid('id').primaryKey().defaultRandom().unique(),
    created_at: timestamp('created_at').defaultNow(),
    district_code: varchar('district_code')
      .references(() => DistrictTable.code)
      .notNull(),
    locale_code: varchar('locale_code')
      // .references(() => LocaleTable.code)
      .notNull(),
    link_code: varchar('link_code')
      .references(() => LinkTable.code)
      .notNull(),
    ip: cidr('ip').default('0.0.0.0'),
    is_bot: boolean('is_bot').default(false),
    user_agent_stringify: varchar('user_agent_stringify'),
    user_agent_hash: varchar('user_agent_hash'),
  },
  (table) => ({
    user_agent_hash_index: index('user_agent_hash_index').on(
      table.user_agent_hash
    ),
  })
);

// RELATIONS

export const DistrictTableRelations = relations(DistrictTable, ({ many }) => ({
  user: many(UserTable),
  locale: many(LocaleTable),
  link: many(LinkTable),
  click: many(ClickTable),
}));

export const UserTableRelations = relations(UserTable, ({ one }) => ({
  district: one(DistrictTable, {
    fields: [UserTable.district_id],
    references: [DistrictTable.id],
  }),
}));

export const LocaleTableRelations = relations(LocaleTable, ({ one }) => ({
  district: one(DistrictTable, {
    fields: [LocaleTable.district_id],
    references: [DistrictTable.id],
  }),
}));

export const LinkTableRelations = relations(LinkTable, ({ one, many }) => ({
  district: one(DistrictTable, {
    fields: [LinkTable.district_id],
    references: [DistrictTable.id],
  }),
  click: many(ClickTable),
}));

export const ClickTableRelations = relations(ClickTable, ({ one }) => ({
  link: one(LinkTable, {
    fields: [ClickTable.link_code],
    references: [LinkTable.code],
  }),
  locale: one(LocaleTable, {
    fields: [ClickTable.locale_code],
    references: [LocaleTable.code],
  }),
  district: one(DistrictTable, {
    fields: [ClickTable.district_code],
    references: [DistrictTable.code],
  }),
}));
