import { InferInsertModel, InferSelectModel, sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import cities from './cities';
import countries from './countries';
import languages from './languages';
import roles from './roles';
import userStatus from './user_status';
const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  role: integer('role').references(() => roles.id),

  email: varchar('email', { length: 255 }).unique(),
  username: varchar('username', { length: 255 }).unique(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),

  avatar: varchar('avatar', { length: 255 }),
  cover: varchar('cover', { length: 255 }),

  phoneNumber: varchar('phone_number', { length: 255 }),
  birthday: varchar('birthday', { length: 20 }),

  gender: smallint('gender'),
  status: integer('status').references(() => userStatus.id),
  language: varchar('language', { length: 10 }).references(
    () => languages.code,
  ),
  isEmailVerified: boolean('is_email_verified'),
  isPhoneNumberVerified: boolean('is_phone_number_verified'),
  password: varchar('password', { length: 256 }),

  cityId: integer('city_id').references(() => cities.id),
  countryId: integer('country_id').references(() => countries.id),

  registeredAt: timestamp('registered_at')
    .notNull()
    .default(sql`now()`),
  lastLoginAt: timestamp('last_login_at').default(sql`now()`),
});

export default users;

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
