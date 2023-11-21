import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import notFoundParams from 'src/utils/functions/notFoundParams';
import { LoginEmailPasswordDto, RegisterEmailPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';

import { eq } from 'drizzle-orm';

import { Headers } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from 'src/db/db.module';
import users from 'src/db/schema/users';
dotenv.config();
@Controller('auth')
export class AuthController {
  private lng = process.env.DEFAULT_LANGUAGE;
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(DB) private db: NodePgDatabase,
  ) {}

  @Post('login')
  async loginWithEmailPassword(
    @Body() userDto: LoginEmailPasswordDto,
    @Headers('ip') ip?: string,
    @Headers('mac') mac?: string,
    @Headers('browser') browser?: string,
    @Headers('device') device?: string,
    @Headers('os') os?: any,
    @Headers('user-agent') userAgent?: string,
    @Headers('notification-token') notificationToken?: string,
    @Headers('geo')
    geo?: {
      lat: number;
      lng: number;
    },
    // @Res() res,
  ) {
    const headers = {
      ip,
      mac,
      device,
      os,
      browser,
      userAgent,
      notificationToken,
      geo,
    };
    notFoundParams(userDto);
    const user = await this.authService.loginWithEmailRole({
      role: userDto.role,
      email: userDto.email,
    });

    const samePwd = await bcrypt.compare(userDto.password, user.password);
    if (!samePwd || !user) {
      throw new HttpException('Wrong email or password', 400);
    }

    // switch (user.status) {
    //   case 'pending':
    //     throw new HttpException('User is pending', HttpStatus.BAD_GATEWAY);
    //   case 'inactive':
    //     throw new HttpException('User is inactive', HttpStatus.BAD_GATEWAY);
    //   case 'blocked':
    //     throw new HttpException('User is blocked', HttpStatus.BAD_GATEWAY);
    //   case 'deleted':
    //     throw new HttpException('User is deleted', HttpStatus.BAD_GATEWAY);
    //   case 'suspended':
    //     throw new HttpException('User is suspended', HttpStatus.BAD_GATEWAY);
    //   default:
    //     break;
    // }

    const session = await this.authService.newSession({
      ...headers,
      userId: user.id,
    });

    const token = this.jwtService.sign({
      sessionId: session.id,
      userId: user.id,
      role: user.role,
    });
    return {
      token,
    };
  }

  @Post('register')
  async registerWithEmailPassword(
    @Body()
    user: RegisterEmailPasswordDto,
  ) {
    console.log('user.password', user.password);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(user.password)) {
      throw new HttpException(
        'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number',
        400,
      );
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(user.email)) {
      throw new HttpException('Invalid email', 400);
    }
    const [exist] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (exist) {
      throw new HttpException('Email already exist', 400);
    }

    const newUser = await this.authService.registerWithEmailPassord(user);
    return newUser;
  }
}
