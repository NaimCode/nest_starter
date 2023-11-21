import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import countries from './countries';

const cities = pgTable('cities', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  slug: varchar('slug', { length: 100 }).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  countryId: integer('country_id')
    .references(() => countries.id)
    .notNull(),
});

export default cities;
