import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as dotenv from 'dotenv';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { and, eq, sql } from 'drizzle-orm';
import { DB } from 'src/db/db.module';
import sessions from 'src/db/schema/sessions';
dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(DB) private db: NodePgDatabase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Replace with your actual secret key
    });
  }

  async validate(payload: { userId: number; sessionId: number; role: number }) {
    console.log('payload', payload);
    const [session] = await this.db
      .select({
        expiresAt: sessions.expiresAt,
        expired: sessions.expired,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.id, payload.sessionId),
          eq(sessions.userId, payload.userId),
        ),
      );

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }
    if (session.expiresAt < new Date() || session.expired) {
      throw new UnauthorizedException('Session expired');
    }
    this.db.update(sessions).set({ lastUsedAt: sql`now()` });
    Logger.debug({
      userId: payload.userId,
      sessionId: payload.sessionId,
      role: payload.role,
    });
    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
      role: payload.role,
    };
  }
}
