import { Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DB = 'DB';

@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: async () => {
        dotenv.config();
        const pool = new Pool({
          connectionString: process.env.DB_URL,
          ssl: true,
        });

        return drizzle(pool, { logger: true });
      },
    },
  ],
  exports: [DB],
})
export class DBModule {}
