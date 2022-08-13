import { Module }          from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService }    from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from './auth/auth.service';
import { User }          from "./user.entity";

@Module({
  imports:     [ TypeOrmModule.forFeature([ User ]) ],
  controllers: [ UsersController ],
  providers:   [ UsersService, AuthService ]
})
export class UsersModule {
}