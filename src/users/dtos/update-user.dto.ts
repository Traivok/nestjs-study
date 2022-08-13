import { IsEmail, IsOptional, IsString }    from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional({ example: 'abc@def.com', description: 'User email'})
    email: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: '123pass', description: 'User password'})
    password: string;
}