import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule }                              from '@nestjs/typeorm';
import { UsersModule }                                from './users/users.module';
import { ReportsModule }                              from './reports/reports.module';
import { User }                                       from './users/user.entity';
import { Report }                                     from './reports/reports.entity';
import { APP_INTERCEPTOR, APP_PIPE }                  from '@nestjs/core';
import { ConfigModule, ConfigService }                from '@nestjs/config';
import { promisify }                                  from 'util';
import { CurrentUserInterceptor }                     from './users/interceptors/current-user.interceptor';

const cookieSession = require('cookie-session');

@Module({
    imports:     [
        ConfigModule.forRoot({
            isGlobal:    true,
            envFilePath: `.env.${ process.env.NODE_ENV ?? 'dev' }`,
        }),
        TypeOrmModule.forRootAsync({
            inject:     [ ConfigService ],
            useFactory: (conf: ConfigService) => ( {
                type:        'sqlite',
                database:    conf.get<string>('DB_NAME'),
                entities:    [ User, Report ],
                synchronize: true,
            } ),
        }),
        UsersModule,
        ReportsModule,
    ],
    controllers: [],
    providers:   [
        {
            provide:  APP_PIPE,
            useValue: new ValidationPipe({ whitelist: true }),
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieSession({
            keys: [ 'authCookie' ],
        })).forRoutes('*');
    }
}

