import {
    Body,
    Controller,
    Delete,
    Get,
    Logger, NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Session, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto }                      from './dtos/create-user.dto';
import { UsersService }                       from './users.service';
import { UpdateUserDto }                      from './dtos/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery }                   from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { UserDto }                            from './dtos/user.dto';
import { CatchUniqueViolation }               from '../interceptors/unique-violation.interceptor';
import { AuthService }                        from './auth/auth.service';
import { AuthUserDto }                        from './dtos/auth-user.dto';
import { CurrentUser }                        from './decorators/current-user.decorator';
import { User }                               from './user.entity';
import { AuthGuard }                          from './auth/auth.guard';
import { Serialize }                          from '../interceptors/serialize.interceptor';

@ApiTags('user')
@Serialize(UserDto)
@CatchUniqueViolation()
@Controller('auth')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(
        private userSrv: UsersService,
        private authSrv: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'Create user' })
    async createUser(@Body() body: CreateUserDto, @Session() session: any): Promise<UserDto> {
        const user     = await this.authSrv.signUp(body);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    @ApiOperation({ summary: 'Sign in' })
    async signIn(@Body() body: AuthUserDto, @Session() session: any): Promise<UserDto> {
        const user     = await this.authSrv.signIn(body);
        session.userId = user.id;
        return user;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmi(@CurrentUser() user: User): UserDto {
        if (user === null)
            throw new NotFoundException();

        return user;
    }

    @Post('/signout')
    @ApiOperation({ summary: 'Sign out' })
    signOut(@Session() session: any) {
        session.userId = null;
    }


    @Get('/:id')
    @ApiOperation({ summary: 'Get an user' })
    @ApiResponse({ status: 200, description: 'User found', type: UserDto })
    findUser(@Param('id', new ParseIntPipe()) id: number): Promise<UserDto> {
        return this.userSrv.findOneOrNotFound(id);
    }

    @Get()
    @ApiOperation({ summary: 'Get users optionally by mail' })
    @ApiResponse({ status: 200, description: 'Users found', type: Array<UserDto> })
    @ApiImplicitQuery({
        name:     'email',
        required: false,
    })
    findAllUsers(@Query('email') email?: string): Promise<UserDto[]> {
        return this.userSrv.find(email);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete an user' })
    deleteUser(@Param('id', new ParseIntPipe()) id: number): void {
        this.userSrv.remove(id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Update an user' })
    updateUser(@Param('id', new ParseIntPipe()) id: number, @Body() body: UpdateUserDto): Promise<UserDto> {
        return this.userSrv.update(id, body);
    }
}
