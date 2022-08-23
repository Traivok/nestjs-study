import { IsInt, IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty }                                                  from '@nestjs/swagger';
import { Transform }                                                    from 'class-transformer';

export class GetEstimateDto {
    @IsString()
    @ApiProperty({ example: 'toyota', description: 'Make'})
    make: string;

    @IsString()
    @ApiProperty({ example: 'corolla', description: 'Model'})
    model: string;

    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1930)
    @Max(2050)
    @ApiProperty({ example: 2009, description: 'Year'})
    year: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1_000_000_000)
    @ApiProperty({ example: 242_211, description: 'Mileage'})
    mileage: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    @ApiProperty({ example: 12.4, description: 'Longitude'})
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    @ApiProperty({ example: 21.2, description: 'Latitude'})
    lat: number;
}