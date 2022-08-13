import { IsEmail, IsString } from "class-validator";
import { ApiProperty }       from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'abc@def.com', description: 'User email'})
  email: string;

  @IsString()
  @ApiProperty({ example: '123pass', description: 'User password'})
  password: string;
}