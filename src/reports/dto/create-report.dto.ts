import { IsInt, IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty }                                                  from '@nestjs/swagger';

export class CreateReportDto {
    @IsString()
    @ApiProperty({ example: 'toyota', description: 'Make'})
    make: string;

    @IsString()
    @ApiProperty({ example: 'corolla', description: 'Model'})
    model: string;

    @IsInt()
    @Min(1930)
    @Max(2050)
    @ApiProperty({ example: 2009, description: 'Year'})
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1_000_000_000)
    @ApiProperty({ example: 242_211, description: 'Mileage'})
    mileage: number;

    @IsLongitude()
    @ApiProperty({ example: 12.4, description: 'Longitude'})
    lng: number;

    @IsLatitude()
    @ApiProperty({ example: 21.2, description: 'Latitude'})
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(100_000_000)
    @ApiProperty({ example: 22_123, description: 'Price'})
    price: number;
}