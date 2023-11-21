import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InferInsertModel, and, eq, sql } from 'drizzle-orm';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from 'src/db/db.module';
import sessions from 'src/db/schema/sessions';
import users from 'src/db/schema/users';

@Injectable()
export class AuthService {
  expirationDays = 7;
  constructor(@Inject(DB) private db: NodePgDatabase) {}

  async loginWithEmailRole(login: { role: number; email: string }) {
    Logger.debug({
      message: 'loginWithEmailRole',
      data: login,
    });
    return this.db
      .select()
      .from(users)
      .where(and(eq(users.email, login.email), eq(users.role, login.role)))
      .then((users) => users[0]);
  }
  async loginAdmin(login: { email: string; password: string }) {
    Logger.debug({
      message: 'loginAdmin',
      data: login.email,
    });
    return this.db
      .select()
      .from(users)
      .where(eq(users.email, login.email))
      .then((users) => users[0]);
  }
  async registerWithEmailPassord(user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    password: string;
    role?: number;
  }) {
    const hast = await bcrypt.hash(user.password, 10);
    return this.db
      .insert(users)
      .values({
        ...user,
        password: hast,
      })
      .returning()
      .then((users) => users[0]);
  }

  async newSession(data: InferInsertModel<typeof sessions>) {
    const [session] = await this.db
      .insert(sessions)
      .values({
        ...data,
        expired: false,
        expiresAt: sql`now() + interval '7 days'`,
      })
      .returning();
    await this.db.update(users).set({ lastLoginAt: sql`now()` });
    return session;
  }
}
