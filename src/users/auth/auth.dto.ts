import { ApiProperty } from '@nestjs/swagger';

export class LoginEmailPasswordDto {
  @ApiProperty({ required: true })
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: number;
}

export class RegisterEmailPasswordDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ required: false })
  firstName?: string;
  @ApiProperty({ required: false })
  lastName?: string;
  @ApiProperty()
  role: number;
}
