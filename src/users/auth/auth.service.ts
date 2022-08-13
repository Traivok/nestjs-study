import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository }                        from '@nestjs/typeorm';
import { User }               from '../user.entity';
import { Repository }         from 'typeorm';
import { UsersService }       from '../users.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private userSrv: UsersService,
                @InjectRepository(User) private repo: Repository<User>) {}

    async signIn(email: string, password: string): Promise<boolean> {

        return false;
    }

    async signUp(email: string, password: string): Promise<User> {
        // todo move this to the dabatase
        // see if email is in use
        const users = await this.userSrv.find(email);

        if (users.length > 0)
            throw new BadRequestException('email in use');

        // hash the user's password

        return null;
    }

}
