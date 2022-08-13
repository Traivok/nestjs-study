import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository }                               from 'typeorm';
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

    async checkIfFound(user: User | null, message = 'User not found.'): Promise<User> {
        if (user === null) {
            throw new NotFoundException(message);
        }

        return user;
    }

    checkFieldNullity(field: any, fieldName = 'field') {
        if (field === null || field === undefined)
            throw new BadRequestException(`Undefined or null ${fieldName}.`);
    }

    async findOneOrNotFound(id: number): Promise<User> {
        return this.checkIfFound(await this.findOne(id), `User with id=${ id } not found.`);
    }


    findOne(id: number): Promise<User | null> {
        this.checkFieldNullity(id, 'id')
        return this.repo.findOne({ where: { id } });
    }

    find(email?: string): Promise<User[]> {
        return this.repo.find({ where: { email } });
    }

    async findOneByEmailOrNotFound(email: string): Promise<User> {
        this.checkFieldNullity(email);
        const [ maybeUser = null ] = await this.find(email);
        return this.checkIfFound(maybeUser);
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
