import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

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
  id: uuid('id').primaryKey().defaultRandom().unique(),
  href: varchar('href').notNull(),
  district_id: uuid('district_id')
    .references(() => DistrictTable.id)
    .notNull(),
  click_count: integer('click_count').default(0).notNull(),
});

export const LocalLinkTable = pgTable('local_link', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  href: varchar('href').notNull(),
  click_count: integer('click_count').default(0).notNull(),
  link_id: uuid('link_id')
    .references(() => LinkTable.id)
    .notNull(),
  local_id: uuid('local_id')
    .references(() => LocalTable.id)
    .notNull(),
  district_id: uuid('district_id')
    .references(() => DistrictTable.id)
    .notNull(),
});
