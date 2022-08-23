import { ApiProperty }       from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ReportDto {
    @Expose() @ApiProperty() id: number;
    @Expose() @ApiProperty() approved: boolean;
    @Expose() @ApiProperty() price: number;
    @Expose() @ApiProperty() year: number;
    @Expose() @ApiProperty() lng: number;
    @Expose() @ApiProperty() lat: number;
    @Expose() @ApiProperty() make: string;
    @Expose() @ApiProperty() model: string;
    @Expose() @ApiProperty() mileage: number;

    @Transform(({ obj }): number => obj.user.id)
    @Expose()
    @ApiProperty()
    userId: number;
}