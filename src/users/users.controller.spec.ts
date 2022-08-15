import { Test, TestingModule }    from '@nestjs/testing';
import { UsersController }        from './users.controller';
import { Serialize }              from '../interceptors/serialize.interceptor';
import { UsersService }           from './users.service';
import { User }                   from './user.entity';
import { AuthService }            from './auth/auth.service';
import { CreateUserDto }          from './dtos/create-user.dto';
import { AuthUserDto }            from './dtos/auth-user.dto';
import { APP_INTERCEPTOR }        from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { DECORATORS }             from '@nestjs/swagger/dist/constants';

describe('UsersController', () => {
  let controller: UsersController;
  const fakeUserService: Partial<UsersService> = {
    async find(email?: string): Promise<User[]> { return [] },
    async findOne(id: number): Promise<User | null> { return null },
    async remove(id: number): Promise<User> { return null },
    async update(id: number, attrs: Partial<User>): Promise<User> { return null; },
  }

  const fakeAuthService: Partial<AuthService> = {
    async signIn({ email, password }: AuthUserDto): Promise<User> { return null; },
    async signUp({ password, ...userDto }: CreateUserDto): Promise<User> { return null; },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
          UsersController,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService
        },
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CurrentUserInterceptor,
        },
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
