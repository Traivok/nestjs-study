import { Body, Controller, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto }                                                                   from './dto/create-report.dto';
import { ReportsService }        from './reports.service';
import { AuthGuard }             from '../users/auth/auth.guard';
import { Report }                from './reports.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatchUniqueViolation }  from '../interceptors/unique-violation.interceptor';
import { CurrentUser }           from '../users/decorators/current-user.decorator';
import { User }                  from '../users/user.entity';
import { ReportDto }             from './dto/report.dto';
import { Serialize }             from '../interceptors/serialize.interceptor';
import { ApproveReportDto }      from './dto/approve-report.dto';
import { AdminGuard }            from '../users/auth/admin.guard';
import { GetEstimateDto }        from './dto/get-estimate.dto';

@ApiTags('report')
@CatchUniqueViolation()
@Controller('reports')
export class ReportsController {
    private logger = new Logger(ReportsController.name);

    constructor(private reportsSrv: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    @ApiOperation({ summary: 'Create Report' })
    async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User): Promise<Report> {
        return await this.reportsSrv.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Approve or refuse Report' })
    async approveReport(@Param('id', new ParseIntPipe()) id: number, @Body() body: ApproveReportDto): Promise<Report> {
        return this.reportsSrv.changeApproval(id, body.approved);
    }

    @Get()
    @UseGuards(AuthGuard)
    async getEstimate(@Query() query: GetEstimateDto): Promise<number> {
        return this.reportsSrv.createEstimate(query);

    }




}
