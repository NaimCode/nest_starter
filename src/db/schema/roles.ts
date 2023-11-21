import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

const roles = pgTable('roles', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
});

export default roles;
