import { Test, TestingModule } from '@nestjs/testing';
import { AuthService }         from './auth.service';
import { UsersService }        from '../users.service';
import { CreateUserDto }       from '../dtos/create-user.dto';
import { User }                from '../user.entity';
import { AuthUserDto }                                             from '../dtos/auth-user.dto';
import { HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let users: User[] = [];

    const fakeUserService = {
        find: (email?: string) => Promise.resolve(users.filter(u => u.email === email)),
        create:                   ({ email, password }: CreateUserDto) => {
            const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
            users.push(user);
            return user;
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide:  UsersService,
                    useValue: fakeUserService,
                },
                AuthService,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Creates a new user with a salted and hashed password', async () => {
        const johnDoeCreateDto = ( { email: 'john.doe@mail.com', password: '12345678' } as AuthUserDto );
        const user             = await service.signUp(johnDoeCreateDto);
        expect(user.password).not.toEqual(johnDoeCreateDto.password);
        const [ salt, hash ] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });


    it('Should return a user when sign in', async () => {
        const martinDupontCreateDto = ( { email: 'martin.dupont@mail.com', password: '12345678' } as AuthUserDto );
        await service.signUp(martinDupontCreateDto);
        const user = await service.signIn(martinDupontCreateDto);
        expect(user).toBeDefined();
        expect(user.email).toEqual(martinDupontCreateDto.email);
    });

    it('Should not sign in user with incorrect credentials', async () => {
        const zeSilva = ( { email: 'ze.silva@mail.com', password: '12345678' } as AuthUserDto );
        await service.signUp(zeSilva);
        await expect(service.signIn({ ...zeSilva, password: 'hacked' } as AuthUserDto))
            .rejects
            .toThrowError(UnauthorizedException);

        await expect(service.signIn({ ...zeSilva, email: 'hacked@mail.com' } as AuthUserDto))
            .rejects
            .toThrowError(UnauthorizedException);
    });

});
