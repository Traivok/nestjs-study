import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto }                       from './dto/create-report.dto';
import { InjectRepository }                      from '@nestjs/typeorm';
import { Report }                                from './reports.entity';
import { Repository }                            from 'typeorm';
import { User }                                  from '../users/user.entity';
import { GetEstimateDto }                        from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
    private logger = new Logger(ReportsService.name);

    constructor(@InjectRepository(Report) private repo: Repository<Report>) {
    }

    public async create(body: CreateReportDto, user: User): Promise<Report> {
        const report = this.repo.create(body);
        report.user = user;
        return await this.repo.save(report);
    }

    public async changeApproval(id: number, approved: boolean): Promise<Report> {
        const report = await this.repo.findOne({ where: { id } });
        if (!report)
            throw new NotFoundException('Report with id ' + id + ' not found.');

        report.approved = approved;
        return  await this.repo.save(report);
    }

    public async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto): Promise<number> {
        return await this.repo.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -5 AND 5', { year })
            .andWhere('approved is TRUE', { year })
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne();
    }
}
