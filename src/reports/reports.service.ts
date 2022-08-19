import { Injectable }       from '@nestjs/common';
import { CreateReportDto }  from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report }           from './reports.entity';
import { Repository }       from 'typeorm';
import { User }             from '../users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {
    }

    public async create(body: CreateReportDto, user: User): Promise<Report> {
        const report = this.repo.create(body);
        report.user = user;
        return await this.repo.save(report);
    }
}
