import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository }          from 'typeorm';
import { InjectRepository }                      from '@nestjs/typeorm';
import { CreateUserDto }                         from './dtos/create-user.dto';
import { User }                                  from './user.entity';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(createUserDto: CreateUserDto): Promise<User> {
        let user = this.repo.create(createUserDto);

        return this.repo.save(user);
    }

    async findOneOrNotFound(id: number): Promise<User> {
        const user = await this.findOne(id);

        if (user === null) {
            this.logger.debug('null user');
            throw new NotFoundException(`User with id=${ id } not found.`);
        }

        return user;
    }


    findOne(id: number): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    find(email?: string): Promise<User[]> {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>): Promise<User> {
        const user = await this.findOneOrNotFound(id);

        return this.repo.save({ ...user, ...attrs });
    }

    async remove(id: number): Promise<User> {
        const user = await this.findOne(id);

        return this.repo.remove(user);
    }
}
