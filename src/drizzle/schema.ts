import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, cidr } from 'drizzle-orm/pg-core';

export const DistrictTable = pgTable('district', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  name: varchar('name').notNull(),
});

export const UserTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom().unique(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    district_id: uuid('district_id')
      .references(() => DistrictTable.id)
      .notNull(),
  },
  (table) => ({
    test: table,
  })
);

export const LocalTable = pgTable('local', {
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
});

export const ClickTable = pgTable('click', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  created_at: timestamp('created_at').defaultNow(),
  local_code: varchar('local_code')
    .references(() => LocalTable.code)
    .notNull(),
  link_code: varchar('link_code')
    .references(() => LinkTable.code)
    .notNull(),
  ip: cidr('ip').default('0.0.0.0'),
});

// RELATIONS

export const DistrictTableRelations = relations(DistrictTable, ({ many }) => ({
  user: many(UserTable),
  local: many(LocalTable),
  link: many(LinkTable),
}));

export const UserTableRelations = relations(UserTable, ({ one }) => ({
  district: one(DistrictTable, {
    fields: [UserTable.district_id],
    references: [DistrictTable.id],
  }),
}));

export const LocalTableRelations = relations(LocalTable, ({ one }) => ({
  district: one(DistrictTable, {
    fields: [LocalTable.district_id],
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
  local: one(LocalTable, {
    fields: [ClickTable.local_code],
    references: [LocalTable.code],
  }),
}));
