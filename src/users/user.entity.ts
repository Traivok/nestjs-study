import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, Unique } from 'typeorm';
import { Logger }                                                                                from '@nestjs/common';
import { ApiProperty }                                                                   from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @Exclude()
    private readonly logger = new Logger(User.name);

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

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
