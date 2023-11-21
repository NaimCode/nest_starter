import { pgTable, varchar } from 'drizzle-orm/pg-core';

const languages = pgTable('languages', {
  name: varchar('name', { length: 50 }).notNull().unique(),
  code: varchar('code', { length: 10 }).notNull().unique().primaryKey(),
});

export default languages;
