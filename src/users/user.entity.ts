import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterInsert,
    AfterUpdate,
    AfterRemove,
    OneToMany,
}                      from 'typeorm';
import { Logger }      from '@nestjs/common';
import { Exclude }     from 'class-transformer';
import { Report }      from '../reports/reports.entity';

@Entity('users')
export class User {
    @Exclude()
    private readonly logger = new Logger(User.name);

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    admin: boolean;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report: Report): User => report.user)
    reports: Report[]

    private log(action: string): void {
        this.logger.debug(`${ action }ed User with id ${ this.id }`);
    }

    @AfterInsert()
    logInsert() { this.log('Insert'); }

    @AfterUpdate()
    logUpdate() { this.log('Update'); }

    @AfterRemove()
    logRemove() { this.log('Remove'); }
}
