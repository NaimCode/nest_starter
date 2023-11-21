import { Inject, Injectable } from '@nestjs/common';
import { eq, getTableColumns } from 'drizzle-orm';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from 'src/db/db.module';
import users from 'src/db/schema/users';
@Injectable()
export class UsersService {
  constructor(@Inject(DB) private db: NodePgDatabase) {}

  async me(userId: number) {
    const [user] = await this.db
      .select({
        ...getTableColumns(users),
      })
      .from(users)
      .where(eq(users.id, userId));
    //.groupBy(() => [users.id]);

    return user;
  }
}
