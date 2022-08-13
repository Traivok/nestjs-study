import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
}                                             from '@nestjs/common';
import { CreateUserDto }                      from './dtos/create-user.dto';
import { UsersService }                       from './users.service';
import { UpdateUserDto }                      from './dtos/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitQuery }                   from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import { Serialize }                          from 'src/interceptors/serialize.interceptor';
import { UserDto }                                          from './dtos/user.dto';
import { CatchUniqueViolation, UniqueViolationInterceptor } from '../interceptors/unique-violation.interceptor';

// @ts-ignore
@ApiTags('user')
@Serialize(UserDto)
@CatchUniqueViolation()
@Controller('auth')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private userSrv: UsersService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'Create user' })
    createUser(@Body() body: CreateUserDto): Promise<UserDto> {
        return this.userSrv.create(body);
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
