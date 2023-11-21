import { sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

const userStatus = pgTable('user_status', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').default(sql`now()`),
});

export default userStatus;
