import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User }                                      from '../user.entity';
import { UsersService }                              from '../users.service';
import { promisify }                                 from 'util';
import { randomBytes, scrypt as _scrypt }            from 'crypto';
import { CreateUserDto }                             from '../dtos/create-user.dto';
import { AuthUserDto }                               from '../dtos/auth-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private userSrv: UsersService) {}

    private static async passwordMatches(user, password) {
        const [ salt, storedHash ] = user.password.split('.');
        const hash                 = ( await scrypt(password, salt, 32) ) as Buffer;

        return storedHash === hash.toString('hex');
    }

    async signIn({ email, password }: AuthUserDto): Promise<User> {
        const [ user = null ] = await this.userSrv.find(email);

        // test if user is not found OR if password does not match
        if (user === null || !(await AuthService.passwordMatches(user, password))) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        return user;
    }

    async signUp({ password, ...userDto }: CreateUserDto): Promise<User> {
        // generate a salt
        const salt = randomBytes(8).toString('hex');

        // hash the salt and the password together
        const hash = ( await scrypt(password, salt, 32) ) as Buffer;

        // join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // create a new user and save it
        // return new user
        return await this.userSrv.create({ ...userDto, password: result });
    }
}
