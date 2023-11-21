import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import users from './users';

const sessions = pgTable('sessions', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  ip: varchar('ip', { length: 100 }),
  geo: jsonb('geo'),
  os: varchar('os', { length: 100 }),
  device: varchar('device', { length: 100 }),
  browser: varchar('browser', { length: 100 }),
  userAgent: varchar('user_agent', { length: 255 }),
  mac: varchar('mac', { length: 100 }),
  notificationToken: varchar('notification_token', { length: 255 }),
  expired: boolean('expired').notNull().default(false),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  expiresAt: timestamp('expires_at')
    .notNull()
    .default(sql`now() + interval '7 days'`),
  lastUsedAt: timestamp('last_used_at')
    .notNull()
    .default(sql`now()`),
});

export default sessions;
