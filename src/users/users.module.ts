import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],

  imports: [AuthModule, DBModule],
})
export class UsersModule {}
