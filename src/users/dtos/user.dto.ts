import { Expose }      from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @Expose()
    @ApiProperty({ example: 1, description: 'User id'})
    id: number;

    @Expose()
    @ApiProperty({ example: 'john@mail.com', description: 'User email'})
    email: string;
}