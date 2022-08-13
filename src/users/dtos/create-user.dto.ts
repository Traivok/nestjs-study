import { IsEmail, IsString } from "class-validator";
import { ApiProperty }       from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john@mail.com', description: 'User email'})
  email: string;

  @IsString()
  @ApiProperty({ example: 'password', description: 'User password'})
  password: string;
}
