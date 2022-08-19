import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto }                   from './dto/create-report.dto';
import { ReportsService }                    from './reports.service';
import { AuthGuard }                         from '../users/auth/auth.guard';
import { Report }                            from './reports.entity';
import { ApiOperation, ApiTags }             from '@nestjs/swagger';
import { CatchUniqueViolation }              from '../interceptors/unique-violation.interceptor';
import { CurrentUser }                       from '../users/decorators/current-user.decorator';
import { User }                              from '../users/user.entity';
import { ReportDto }                         from './dto/report.dto';
import { Serialize }                         from '../interceptors/serialize.interceptor';

@ApiTags('report')
@CatchUniqueViolation()
@Controller('reports')
export class ReportsController {

    constructor(private reportsSrv: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    @ApiOperation({ summary: 'Create Report' })
    async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<Report> {
        return await this.reportsSrv.create(body, user);
    }

}
